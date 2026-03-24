# Security Fixes Design — Portfolio

**Data:** 2026-03-24
**Status:** Aprovado
**Scope:** Correção das 6 vulnerabilidades identificadas na auditoria (`docs/security-audit.md`)

---

## Contexto

Portfolio estático (React 19 + Vite + TypeScript) hospedado na Vercel. Sem backend próprio. Formulário de contato usa EmailJS diretamente do browser, expondo credenciais no bundle JS.

---

## Arquitetura

### Estrutura de arquivos

```
portfolio/
├── api/
│   └── contact.ts                ← NOVO — Vercel Serverless Function
├── src/
│   ├── services/
│   │   └── email-service.ts      ← MODIFICADO — chama /api/contact
│   ├── components/sections/
│   │   └── contact-section.tsx   ← MODIFICADO — adiciona Turnstile widget
│   └── data/
│       └── portfolio-data.ts     ← MODIFICADO — ofusca e-mail
├── vercel.json                   ← NOVO — security headers
└── .env                          ← MODIFICADO — troca vars EmailJS por Turnstile site key
```

### Variáveis de ambiente

| Variável | Onde | Visível no browser |
|----------|------|--------------------|
| `EMAILJS_SERVICE_ID` | Vercel dashboard | ❌ |
| `EMAILJS_TEMPLATE_ID` | Vercel dashboard | ❌ |
| `EMAILJS_PRIVATE_KEY` | Vercel dashboard | ❌ |
| `TURNSTILE_SECRET_KEY` | Vercel dashboard | ❌ |
| `VITE_TURNSTILE_SITE_KEY` | `.env` | ✅ (seguro — é pública) |

---

## VULN-01 — Credenciais EmailJS (Crítica)

**Solução:** Serverless Function em `/api/contact.ts`

**Fluxo:**
```
Frontend → POST /api/contact (campos + turnstileToken)
              → valida método HTTP
              → valida token Turnstile via API Cloudflare
              → valida body com Zod
              → sanitiza campos (strip HTML)
              → chama EmailJS via fetch server-side
              → retorna resposta ao frontend
```

**Respostas HTTP:**

| Situação | Status |
|----------|--------|
| Sucesso | 200 |
| Token Turnstile inválido | 400 |
| Dados inválidos | 422 |
| Erro EmailJS | 502 |
| Método inválido | 405 |

**Remoção:** O pacote `@emailjs/browser` será removido do `package.json` — a chamada ao EmailJS passa a ser um `fetch` server-side com a API REST deles.

---

## VULN-02 — Rate Limiting / CAPTCHA (Alta)

**Solução:** Cloudflare Turnstile (invisível, gratuito)

- `VITE_TURNSTILE_SITE_KEY` no frontend renderiza o widget
- Widget invisível gera token automaticamente ao carregar o formulário
- Botão de submit fica desabilitado até token estar disponível
- Token é enviado junto com os dados do formulário para `/api/contact`
- Backend valida o token na API da Cloudflare antes de qualquer outra ação
- Rate limiting adicional: confiança na cota do EmailJS e debounce existente no cliente

**Pacote:** `react-turnstile`

---

## VULN-03 — Security Headers (Alta)

**Solução:** `vercel.json` na raiz do projeto

Headers a configurar em todas as rotas (`/(.*)`):
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Content-Security-Policy` — permitir: self, inline styles (Tailwind), Turnstile scripts/frames/network (`script-src`, `frame-src` e `connect-src` para `challenges.cloudflare.com`), EmailJS via backend

---

## VULN-04 — Sanitização XSS (Média)

**Solução:** Strip de HTML no backend antes de enviar ao EmailJS

Feito na Serverless Function com função utilitária simples (sem dependência externa):
```typescript
const stripHtml = (s: string) => s.replace(/<[^>]*>/g, '').trim()
```

Aplicado em: `name`, `subject`, `message` (não em `email` — já validado pelo Zod como formato de e-mail).

---

## VULN-05 — E-mail exposto no bundle (Média)

**Solução:** Ofuscação por concatenação em runtime

```typescript
// portfolio-data.ts
const _u = 'guiggff'
const _d = 'gmail.com'
export const getEmail = () => `${_u}@${_d}`
```

Todos os lugares que usam o e-mail passam a chamar `getEmail()` em vez de acessar uma string literal.

---

## VULN-06 — Subresource Integrity (Baixa)

**Avaliação:** O projeto não carrega scripts de CDNs externos no `index.html` — todos os assets são gerados pelo Vite no build. Sem ação necessária.

---

## Dependências a adicionar

```
react-turnstile   ← widget Turnstile no frontend
```

## Dependências a remover

```
@emailjs/browser  ← substituído por fetch server-side
```

---

## Fora do escopo

- Rate limiting com Redis/Upstash (desnecessário para portfolio pessoal)
- Autenticação/autorização
- Logging centralizado
- Testes automatizados (sem infraestrutura de testes no projeto atual)
