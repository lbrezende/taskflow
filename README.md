# MVP Boilerplate — SaaS Starter Kit

Boilerplate completo para criar um MVP de SaaS em minutos. Clone, configure os servicos, e tenha um produto funcional com autenticacao, pagamentos, trial de 14 dias, e sistema de planos.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript (strict) |
| Estilo | Tailwind CSS 4 + shadcn/ui |
| Banco de dados | PostgreSQL (Neon) |
| ORM | Prisma 6 |
| Autenticacao | Auth.js v5 (Google OAuth + Magic Link) |
| Pagamentos | Stripe (subscriptions) |
| Validacao | Zod |
| Data fetching | TanStack Query |
| E-mail | Resend |
| Deploy | Vercel |
| Design | Figma MCP (opcional) |

## Funcionalidades incluidas

- Login com Google OAuth e Magic Link (Resend)
- Sistema de planos: FREE, TRIAL (14 dias), PRO
- Upgrade imediato durante trial (sem esperar o trial expirar)
- Paywall com limites por plano (`<PaywallGate>`)
- Checkout e portal do cliente via Stripe
- Webhooks Stripe para lifecycle completo de assinatura
- CRUD completo de exemplo (Kanban board com drag-and-drop)
- Landing page com Hero, Features, Pricing, Footer
- Dashboard protegido com middleware
- Banner de trial com contagem regressiva
- Middleware leve (< 1MB para Vercel Edge)

---

## Pre-requisitos — Contas necessarias

Antes de comecar, crie conta em **todos** os servicos abaixo. Voce vai precisar de chaves/credenciais de cada um.

| # | Servico | Para que serve | Link de cadastro |
|---|---------|---------------|-----------------|
| 1 | **GitHub** | Repositorio de codigo | [github.com](https://github.com) |
| 2 | **Vercel** | Hosting e deploy automatico | [vercel.com](https://vercel.com) (login com GitHub) |
| 3 | **Neon** | Banco PostgreSQL serverless | [neon.tech](https://neon.tech) |
| 4 | **Google Cloud** | OAuth (login com Google) | [console.cloud.google.com](https://console.cloud.google.com) |
| 5 | **Resend** | Envio de emails (magic links + transacionais) | [resend.com](https://resend.com) |
| 6 | **Stripe** | Pagamentos e assinaturas | [dashboard.stripe.com](https://dashboard.stripe.com) |
| 7 | **Figma** *(opcional)* | Design-to-code com Figma MCP | [figma.com](https://figma.com) |

### Ferramentas locais necessarias

| Ferramenta | Versao minima | Como instalar |
|---|---|---|
| **Node.js** | v18+ | [nodejs.org](https://nodejs.org) ou `brew install node` |
| **npm** | v9+ | Vem com o Node.js |
| **Git** | v2+ | [git-scm.com](https://git-scm.com) ou `brew install git` |

Verifique se esta tudo instalado:
```bash
node --version    # deve mostrar v18+
npm --version     # deve mostrar v9+
git --version     # deve mostrar v2+
```

---

## Setup passo-a-passo

### Passo 1 — Clone e instale dependencias

```bash
git clone https://github.com/SEU-USUARIO/SEU-REPO.git
cd SEU-REPO
npm install
cp .env.example .env
```

A partir daqui, preencha cada variavel no arquivo `.env` conforme os passos abaixo.

---

### Passo 2 — Banco de dados (Neon)

1. Acesse [neon.tech](https://neon.tech) e crie um novo projeto
2. Na dashboard do Neon, copie a **Connection String** (formato: `postgresql://user:pass@host/db?sslmode=require`)
3. Cole no `.env`:
   ```
   DATABASE_URL="postgresql://user:pass@host:5432/database?sslmode=require"
   ```
4. Aplique o schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

---

### Passo 3 — Google OAuth (Login com Google)

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto (ou selecione um existente)
3. Va em **APIs & Services > OAuth consent screen** e configure (External, preencha nome e email)
4. Va em **APIs & Services > Credentials**
5. Clique **Create Credentials > OAuth 2.0 Client ID**
6. Tipo: **Web application**
7. Em **Authorized redirect URIs**, adicione:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
8. Copie o **Client ID** e **Client Secret** para o `.env`:
   ```
   AUTH_GOOGLE_ID="seu-client-id.apps.googleusercontent.com"
   AUTH_GOOGLE_SECRET="seu-client-secret"
   ```

> **Para producao:** adicione tambem a URI do seu dominio Vercel:
> `https://seu-projeto.vercel.app/api/auth/callback/google`

---

### Passo 4 — Resend (Emails)

1. Acesse [resend.com](https://resend.com) e crie uma conta
2. Va em **API Keys** e crie uma nova chave
3. Cole no `.env` (mesma chave nos dois campos):
   ```
   AUTH_RESEND_KEY="re_xxxxxxxxx"
   RESEND_API_KEY="re_xxxxxxxxx"
   ```

> `AUTH_RESEND_KEY` e usado pelo Auth.js para magic links de login.
> `RESEND_API_KEY` e usado para emails transacionais do app.

---

### Passo 5 — Stripe (Pagamentos)

#### 5a. Chave secreta
1. Acesse [dashboard.stripe.com](https://dashboard.stripe.com)
2. Certifique-se de estar no **modo Test** (toggle no canto superior direito)
3. Va em **Developers > API Keys**
4. Copie a **Secret key** (comeca com `sk_test_`):
   ```
   STRIPE_SECRET_KEY="sk_test_xxxxxxxxx"
   ```

#### 5b. Criar produto e preco
1. Va em **Products > Add product**
2. Defina o nome (ex: "Pro"), preco mensal (ex: R$ 19,90), recorrencia **mensal**
3. Apos criar, clique no produto e copie o **Price ID** (comeca com `price_`):
   ```
   STRIPE_PRICE_ID_PRO="price_xxxxxxxxx"
   ```

#### 5c. Webhook para desenvolvimento local
1. Instale a [Stripe CLI](https://docs.stripe.com/stripe-cli):
   ```bash
   brew install stripe/stripe-cli/stripe
   stripe login
   ```
2. Rode o listener apontando para sua app local:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
3. A CLI vai mostrar um **webhook signing secret** (comeca com `whsec_`). Cole no `.env`:
   ```
   STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxx"
   ```

#### 5d. Webhook para producao (depois do deploy na Vercel)
1. Va em **Developers > Webhooks > Add endpoint**
2. URL: `https://seu-projeto.vercel.app/api/stripe/webhook`
3. Selecione os eventos:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
4. Copie o signing secret e adicione como `STRIPE_WEBHOOK_SECRET` nas env vars da Vercel

---

### Passo 6 — AUTH_SECRET

Gere uma chave aleatoria:
```bash
openssl rand -base64 32
```

Cole no `.env`:
```
AUTH_SECRET="sua-chave-gerada-aqui"
```

---

### Passo 7 — URL da aplicacao

Ja vem configurado no `.env.example`:
```
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> Para producao na Vercel, mude para `https://seu-projeto.vercel.app`

---

### Passo 8 — Rode o servidor

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000). Voce deve ver a landing page.

**Para testar o fluxo completo:**
1. Clique em **Login** e entre com Google
2. Voce recebera 14 dias de trial automaticamente
3. Acesse o **Dashboard** para ver o Kanban board
4. Va em **Settings > Billing** para testar o upgrade
5. Use o cartao de teste do Stripe: `4242 4242 4242 4242` (qualquer data futura, qualquer CVC)

---

### Passo 9 (opcional) — Figma MCP

Para usar design-to-code com o Claude Code:

1. Abra as configuracoes do Claude Code (MCP Servers)
2. Adicione o servidor Figma MCP:
   ```json
   {
     "mcpServers": {
       "figma": {
         "command": "npx",
         "args": ["-y", "@anthropic-ai/figma-mcp-server@latest"]
       }
     }
   }
   ```
3. Ao iniciar o Claude Code, ele pedira para autenticar com sua conta Figma
4. Passe URLs de nodes do Figma para o Claude Code extrair codigo pixel-perfect

---

## Deploy na Vercel

1. Push o codigo para o GitHub
2. Acesse [vercel.com](https://vercel.com) e importe o repositorio
3. Adicione **todas** as variaveis de ambiente do `.env` nas configuracoes do projeto
4. Atualize para producao:
   - `NEXT_PUBLIC_APP_URL` → `https://seu-projeto.vercel.app`
   - Google Cloud: adicione redirect URI de producao
   - Stripe: crie webhook de producao e atualize `STRIPE_WEBHOOK_SECRET`
5. Deploy!

---

## Estrutura de pastas

```
app/
  (public)/        # Rotas publicas (login, pricing, landing)
  (auth)/          # Rotas protegidas (dashboard, settings)
  api/             # API routes (auth, stripe, todo-lists, todo-items)
  page.tsx         # Landing page
components/
  kanban/          # Kanban board, column, card
  layout/          # Sidebar, TopHeader, TrialBanner
  paywall/         # PaywallGate
  ui/              # shadcn/ui components
hooks/             # TanStack Query hooks
lib/               # Auth, DB, Stripe, Subscription, Validations, Email
prisma/            # Schema
types/             # TypeScript types
.claude/           # Contexto para Claude Code
```

---

## Sistema de planos

| Plano | Duracao | Acesso |
|-------|---------|--------|
| **FREE** | Permanente | Funcionalidades limitadas (definido em `PLAN_LIMITS`) |
| **TRIAL** | 14 dias (ativado no primeiro login) | Acesso total |
| **PRO** | Assinatura mensal via Stripe | Acesso total |

**Upgrade durante trial:** O usuario pode fazer upgrade a qualquer momento durante o trial. Ao clicar em "Upgrade", e redirecionado para o Stripe Checkout, insere o cartao, e vira PRO imediatamente. Nao precisa esperar o trial expirar.

**Fluxo de upgrade:**
1. Usuario em TRIAL clica "Upgrade" (billing page ou trial banner)
2. Redirecionado para Stripe Checkout
3. Insere cartao e confirma pagamento
4. Webhook `checkout.session.completed` atualiza `plan = PRO` no banco
5. Acesso PRO imediato

---

## Como personalizar para seu produto

1. Substitua os componentes em `components/kanban/` pela sua feature principal
2. Edite `lib/subscription.ts` para definir os limites do seu plano (`PLAN_LIMITS`)
3. Edite `prisma/schema.prisma` para suas entidades
4. Edite a landing page em `app/page.tsx`
5. Edite os textos — o app usa PT-BR por padrao
6. Consulte o `BOILERPLATE_MANUAL.md` para decisoes detalhadas e guia completo

---

## Licenca

MIT
