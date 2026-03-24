# Security Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corrigir as 6 vulnerabilidades de segurança identificadas na auditoria, movendo credenciais EmailJS para o servidor, adicionando CAPTCHA Turnstile, configurando security headers e ofuscando o e-mail pessoal.

**Architecture:** Uma Vercel Serverless Function em `/api/contact.ts` recebe os dados do formulário, valida o token Turnstile com a API da Cloudflare, sanitiza os campos e chama o EmailJS via REST server-side. O frontend passa a fazer `fetch('/api/contact')` em vez de usar o SDK do EmailJS diretamente.

**Tech Stack:** React 19, Vite, TypeScript, TanStack Router, react-hook-form, Zod, Cloudflare Turnstile (`react-turnstile`), Vercel Serverless Functions, EmailJS REST API.

---

## Mapa de arquivos

| Arquivo | Ação | Responsabilidade |
|---------|------|-----------------|
| `api/contact.ts` | Criar | Serverless Function: valida Turnstile → valida Zod → sanitiza → chama EmailJS |
| `src/services/email-service.ts` | Modificar | Trocar chamada EmailJS SDK por `fetch('/api/contact')` |
| `src/components/sections/contact-section.tsx` | Modificar | Adicionar Turnstile widget e passar token ao submit |
| `src/data/portfolio-data.ts` | Modificar | Ofuscar e-mail por concatenação em runtime |
| `vercel.json` | Criar | Security headers para todas as rotas |
| `.env` | Modificar | Remover vars VITE_EMAILJS_*, adicionar VITE_TURNSTILE_SITE_KEY |
| `package.json` | Modificar | Adicionar `react-turnstile`, remover `@emailjs/browser` |

---

## Pré-requisitos (fazer antes de começar)

Você precisará de dois valores externos:

**1. Cloudflare Turnstile keys (gratuito):**
- Acesse: https://dash.cloudflare.com → Turnstile → Add Site
- Escolha "Invisible" como widget mode
- Gere as chaves e anote:
  - `Site Key` → vai em `VITE_TURNSTILE_SITE_KEY` no `.env`
  - `Secret Key` → vai em `TURNSTILE_SECRET_KEY` nas env vars da Vercel

**2. EmailJS Private Key:**
- Acesse: https://dashboard.emailjs.com → Account → API Keys
- Copie a **Private Key** (diferente da Public Key usada antes)
- Ela vai em `EMAILJS_PRIVATE_KEY` nas env vars da Vercel

**3. EmailJS Public Key:**
- No mesmo dashboard (Account → API Keys), copie também a **Public Key** (user ID)
- Ela vai em `EMAILJS_PUBLIC_KEY` nas env vars da Vercel

**4. Vercel Environment Variables:**
No dashboard da Vercel (Settings → Environment Variables), adicionar:
- `EMAILJS_SERVICE_ID` = valor de `service_oeku1k3`
- `EMAILJS_TEMPLATE_ID` = valor de `template_sxcna8r`
- `EMAILJS_PUBLIC_KEY` = public key (user ID) do EmailJS
- `EMAILJS_PRIVATE_KEY` = private key do passo 2
- `TURNSTILE_SECRET_KEY` = secret key do passo 1

---

## Task 1: Atualizar dependências

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Instalar react-turnstile**

```bash
pnpm add react-turnstile
```

- [ ] **Step 2: Remover @emailjs/browser**

```bash
pnpm remove @emailjs/browser
```

- [ ] **Step 3: Verificar package.json**

Confirmar que `@emailjs/browser` não está mais em `dependencies` e que `react-turnstile` foi adicionado.

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: swap @emailjs/browser for react-turnstile"
```

---

## Task 2: Criar Serverless Function

**Files:**
- Create: `api/contact.ts`

> **Nota:** A pasta `api/` fica na **raiz do projeto** (mesmo nível que `src/`), não dentro de `src/`. A Vercel detecta automaticamente.

- [ ] **Step 1: Criar o arquivo `api/contact.ts`**

```typescript
import { z } from 'zod'

const bodySchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(3).max(150),
  message: z.string().min(10).max(1000),
  turnstileToken: z.string().min(1),
})

const stripHtml = (s: string) => s.replace(/<[^>]*>/g, '').trim()

async function validateTurnstile(token: string): Promise<boolean> {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
    }),
  })
  const data = await res.json() as { success: boolean }
  return data.success
}

export default async function handler(
  req: { method: string; body: unknown },
  res: {
    status: (code: number) => {
      json: (body: unknown) => void
      end: () => void
    }
  }
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  // Validate Turnstile FIRST — before parsing the full body
  const rawBody = req.body as Record<string, unknown>
  const token = typeof rawBody?.turnstileToken === 'string' ? rawBody.turnstileToken : ''
  const turnstileValid = await validateTurnstile(token)
  if (!turnstileValid) {
    return res.status(400).json({ error: 'CAPTCHA validation failed' })
  }

  const parsed = bodySchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(422).json({ error: 'Invalid data', issues: parsed.error.issues })
  }

  const { name, email, subject, message } = parsed.data

  const emailRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,       // public key (account identifier)
      accessToken: process.env.EMAILJS_PRIVATE_KEY,  // private key (server-side auth)
      template_params: {
        name: stripHtml(name),
        title: stripHtml(subject),
        message: stripHtml(message),
        reply_to: email,
      },
    }),
  })

  if (!emailRes.ok) {
    return res.status(502).json({ error: 'Failed to send email' })
  }

  return res.status(200).json({ ok: true })
}
```

- [ ] **Step 2: Verificar que `api/` está incluído no tsconfig**

Abrir `tsconfig.app.json` (ou `tsconfig.json` na raiz). Verificar se a chave `include` cobre a pasta `api/`. Se houver `"include": ["src"]` sem `"api"`, adicionar:

```json
"include": ["src", "api"]
```

Se não houver chave `include`, o TypeScript inclui tudo por padrão — nenhuma mudança necessária.

- [ ] **Step 3: Verificar que o TypeScript compila**

```bash
pnpm tsc --noEmit
```

Esperado: sem erros relacionados a `api/contact.ts`. (Pode haver erros pré-existentes no projeto — ignore-os se não forem do arquivo novo.)

- [ ] **Step 4: Commit**

```bash
git add api/contact.ts tsconfig.app.json
git commit -m "feat: add /api/contact serverless function with Turnstile + EmailJS"
```

---

## Task 3: Atualizar variáveis de ambiente locais

**Files:**
- Modify: `.env`

- [ ] **Step 1: Editar `.env`**

Substituir o conteúdo atual por:

```env
# Turnstile (public - safe to expose in bundle)
VITE_TURNSTILE_SITE_KEY=your_turnstile_site_key_here

# As variáveis abaixo NÃO têm prefixo VITE_ — ficam só no servidor Vercel
# Mantenha-as apenas para referência local de desenvolvimento
# EMAILJS_SERVICE_ID=service_oeku1k3
# EMAILJS_TEMPLATE_ID=template_sxcna8r
# EMAILJS_PRIVATE_KEY=your_private_key_here
# TURNSTILE_SECRET_KEY=your_turnstile_secret_key_here
```

> As vars sem `VITE_` são comentadas pois o Vite não as carrega de qualquer forma. Elas existem apenas como documentação — os valores reais ficam no dashboard da Vercel.

- [ ] **Step 2: Substituir `your_turnstile_site_key_here` pelo valor real**

Pegar a Site Key gerada no dashboard da Cloudflare (pré-requisito).

- [ ] **Step 3: Verificar que `.env` está no `.gitignore`**

```bash
grep ".env" .gitignore
```

Esperado: linha `.env` presente.

> O `.env` não é commitado — as mudanças são apenas locais. As variáveis de servidor ficam no dashboard da Vercel.

---

## Task 4: Modificar email-service.ts

**Files:**
- Modify: `src/services/email-service.ts`

- [ ] **Step 1: Reescrever o arquivo**

```typescript
export interface ContactPayload {
  name: string
  email: string
  subject: string
  message: string
  turnstileToken: string
}

export async function sendContactEmail(data: ContactPayload): Promise<void> {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string }
    throw new Error(body.error ?? 'Failed to send message')
  }
}
```

- [ ] **Step 2: Verificar TypeScript**

```bash
pnpm tsc --noEmit
```

Esperado: erros em `contact-section.tsx` sobre `turnstileToken` — isso é esperado, será resolvido na próxima task.

- [ ] **Step 3: Commit**

```bash
git add src/services/email-service.ts
git commit -m "feat: email-service now calls /api/contact instead of EmailJS SDK directly"
```

---

## Task 5: Integrar Turnstile no formulário

**Files:**
- Modify: `src/components/sections/contact-section.tsx`

- [ ] **Step 1: Adicionar import do Turnstile no topo do arquivo**

Após as importações existentes, adicionar:

```typescript
import Turnstile from 'react-turnstile'
```

- [ ] **Step 2: Adicionar estado do token Turnstile no componente**

Dentro de `ContactSection`, após os `useState` existentes, adicionar:

```typescript
const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
```

- [ ] **Step 3: Atualizar a função `onSubmit` para incluir o token**

Substituir a chamada `sendContactEmail(formData)` por:

```typescript
const onSubmit = async (formData: ContactFormData) => {
  setSubmitError(null)
  if (!turnstileToken) {
    setSubmitError(t('contact.form.error'))
    return
  }
  try {
    await sendContactEmail({ ...formData, turnstileToken })
    setSubmitted(true)
    reset()
    setTurnstileToken(null)
    setTimeout(() => setSubmitted(false), 5000)
  } catch {
    setSubmitError(t('contact.form.error'))
  }
}
```

- [ ] **Step 4: Adicionar widget Turnstile e atualizar disabled no botão**

Dentro do `<form>`, antes do `<Button type="submit">`, adicionar:

```tsx
<Turnstile
  sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
  onVerify={(token) => setTurnstileToken(token)}
  onExpire={() => setTurnstileToken(null)}
  onError={() => setTurnstileToken(null)}
  refreshExpired="auto"
/>
```

> O modo invisível é definido pelo tipo de site key escolhido no dashboard da Cloudflare ("Invisible"), não por uma prop no componente. Não passe `size="invisible"` — não é um valor válido em `react-turnstile`.

No `<Button>`, atualizar o `disabled`:

```tsx
disabled={isSubmitting || !turnstileToken}
```

- [ ] **Step 5: Verificar TypeScript**

```bash
pnpm tsc --noEmit
```

Esperado: sem erros.

- [ ] **Step 6: Testar localmente**

```bash
pnpm dev
```

Abrir o formulário. O Turnstile não vai funcionar em `localhost` sem configuração especial — o botão ficará desabilitado. Para testar localmente, temporariamente adicione `?test=true` ao sitekey e use `1x00000000000000000000AA` como sitekey de teste da Cloudflare (que sempre aprova).

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/contact-section.tsx
git commit -m "feat: integrate Cloudflare Turnstile invisible CAPTCHA in contact form"
```

---

## Task 6: Criar vercel.json com security headers

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: Criar o arquivo na raiz do projeto**

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; font-src 'self' data:;"
        }
      ]
    }
  ]
}
```

- [ ] **Step 2: Verificar JSON válido**

```bash
node -e "require('./vercel.json'); console.log('valid')"
```

Esperado: `valid`

- [ ] **Step 3: Commit**

```bash
git add vercel.json
git commit -m "feat: add security headers via vercel.json (CSP, X-Frame-Options, etc.)"
```

---

## Task 7: Ofuscar e-mail em portfolio-data.ts

**Files:**
- Modify: `src/data/portfolio-data.ts`

- [ ] **Step 1: Ler as primeiras linhas do arquivo para entender a estrutura**

Confirmar que `email: "guiggff@gmail.com"` está na linha 10 dentro de um objeto `personalInfo`.

- [ ] **Step 2: Substituir o campo `email` por uma função separada**

O `personalInfo` tem uma tipagem explícita (`PersonalInfo`) que não aceita getter no site de atribuição. A abordagem correta é exportar uma função separada.

No topo do arquivo `portfolio-data.ts`, antes do objeto `personalInfo`, adicionar:

```typescript
export const getPersonalEmail = () => ['guiggff', 'gmail.com'].join('@')
```

Depois, alterar a linha do email no objeto:

```typescript
email: getPersonalEmail(),
```

- [ ] **Step 3: Atualizar os consumidores de `personalInfo.email`**

Buscar todos os usos de `personalInfo.email` no projeto:

```bash
grep -r "personalInfo.email" src/
```

Para cada ocorrência, substituir `personalInfo.email` por `getPersonalEmail()` e importar a função onde necessário.

- [ ] **Step 4: Verificar TypeScript**

```bash
pnpm tsc --noEmit
```

Esperado: sem erros.

- [ ] **Step 5: Verificar visualmente que o e-mail aparece corretamente no browser**

```bash
pnpm dev
```

Navegar até a seção de contato e confirmar que o e-mail `guiggff@gmail.com` é exibido corretamente.

- [ ] **Step 6: Verificar que não aparece no bundle**

```bash
pnpm build && grep -r "guiggff@gmail" dist/
```

Esperado: sem matches.

- [ ] **Step 7: Commit**

```bash
git add src/data/portfolio-data.ts src/components/sections/contact-section.tsx
git commit -m "fix: obfuscate personal email to prevent scraper bots"
```

---

## Task 8: Verificação final e deploy

- [ ] **Step 1: Build completo sem erros**

```bash
pnpm build
```

Esperado: build bem-sucedido, sem erros TypeScript.

- [ ] **Step 2: Confirmar variáveis na Vercel**

No dashboard da Vercel, Settings → Environment Variables, verificar que estão presentes:
- `EMAILJS_SERVICE_ID`
- `EMAILJS_TEMPLATE_ID`
- `EMAILJS_PUBLIC_KEY`
- `EMAILJS_PRIVATE_KEY`
- `TURNSTILE_SECRET_KEY`

- [ ] **Step 3: Deploy**

```bash
git push origin main
```

A Vercel faz o deploy automaticamente.

- [ ] **Step 4: Testar formulário em produção**

Preencher o formulário no site ao vivo e confirmar que o e-mail é recebido.

- [ ] **Step 5: Verificar security headers**

Acessar https://securityheaders.com e digitar a URL do site.
Esperado: score A ou superior.

- [ ] **Step 6: Confirmar credenciais não estão no bundle**

No browser, DevTools → Sources → buscar por `service_oeku1k3` e `template_sxcna8r`.
Esperado: nenhum resultado.

- [ ] **Step 7: Atualizar o security-audit.md**

No arquivo `docs/security-audit.md`, marcar as vulnerabilidades corrigidas:
- VULN-01 ✅ Credenciais movidas para servidor
- VULN-02 ✅ Turnstile integrado
- VULN-03 ✅ Security headers configurados
- VULN-04 ✅ stripHtml aplicado no backend
- VULN-05 ✅ E-mail ofuscado
- VULN-06 ✅ N/A (sem CDN externo)

```bash
git add docs/security-audit.md
git commit -m "docs: mark all security vulnerabilities as resolved"
```
