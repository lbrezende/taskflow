# TaskFlow — Boilerplate SaaS MVP

Boilerplate completo para criar um MVP de SaaS em minutos. Clone, configure as variáveis de ambiente, e tenha um produto funcional com autenticação, pagamentos, e sistema de planos.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript (strict) |
| Estilo | Tailwind CSS 4 + shadcn/ui |
| Banco de dados | PostgreSQL (Neon) |
| ORM | Prisma 6 |
| Autenticação | Auth.js v5 (Google + Magic Link) |
| Pagamentos | Stripe (subscriptions) |
| Validação | Zod |
| Data fetching | TanStack Query |
| E-mail | Resend |
| Deploy | Vercel |

## Funcionalidades incluídas

- Login com Google OAuth e Magic Link (Resend)
- Sistema de planos: FREE, TRIAL (14 dias), PRO
- Paywall com limites por plano
- Checkout e portal do cliente via Stripe
- Webhooks Stripe para lifecycle de assinatura
- CRUD completo de exemplo (TodoLists + TodoItems)
- Landing page com Hero, Features, Pricing, Footer
- Dashboard protegido com middleware
- Banner de trial com contagem regressiva
- Componente PaywallGate reutilizável

## Quick Start

```bash
# 1. Clone o repositório
git clone https://github.com/lbrezende/taskflow.git
cd taskflow

# 2. Instale dependências
npm install

# 3. Configure variáveis de ambiente
cp .env.example .env
# Preencha os valores no .env

# 4. Configure o banco de dados
npx prisma generate
npx prisma db push

# 5. Rode o servidor
npm run dev
```

Acesse `http://localhost:3000`

## Configuração de serviços

### Neon (Banco de dados)
1. Crie uma conta em [neon.tech](https://neon.tech)
2. Crie um novo projeto
3. Copie a connection string para `DATABASE_URL`

### Google OAuth
1. Acesse [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Crie um OAuth 2.0 Client ID
3. Redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copie Client ID e Secret para `AUTH_GOOGLE_ID` e `AUTH_GOOGLE_SECRET`

### Resend (Magic Link + E-mails)
1. Crie uma conta em [resend.com](https://resend.com)
2. Copie a API Key para `AUTH_RESEND_KEY` e `RESEND_API_KEY`

### Stripe
1. Crie uma conta em [stripe.com](https://stripe.com)
2. Copie a Secret Key para `STRIPE_SECRET_KEY`
3. Crie um produto com preço recorrente
4. Copie o Price ID para `STRIPE_PRICE_ID_PRO`
5. Configure o webhook endpoint: `https://seu-dominio.com/api/stripe/webhook`
6. Eventos necessários: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`, `customer.subscription.updated`
7. Copie o Webhook Secret para `STRIPE_WEBHOOK_SECRET`

## Estrutura de pastas

```
app/
  (public)/        # Rotas públicas (login, pricing)
  (auth)/          # Rotas protegidas (dashboard, settings)
  api/             # API routes (auth, stripe, todo-lists, todo-items)
  page.tsx         # Landing page
components/
  layout/          # Navbar, Providers, TrialBanner
  paywall/         # PaywallGate
  ui/              # shadcn/ui components
hooks/             # TanStack Query hooks
lib/               # Auth, DB, Stripe, Subscription, Validations, Email
prisma/            # Schema
types/             # TypeScript types
.claude/           # Contexto para assistentes AI
```

## Como personalizar para seu produto

1. **Substitua o TodoList/TodoItem** pela sua feature principal
2. **Edite `lib/subscription.ts`** para definir os limites do seu plano
3. **Edite `prisma/schema.prisma`** para suas entidades
4. **Edite a landing page** em `app/page.tsx`
5. **Edite os textos** — o app usa PT-BR por padrão

Consulte o `BOILERPLATE_MANUAL.md` para decisões detalhadas e guia completo.

## Deploy na Vercel

1. Push para GitHub
2. Importe o projeto na [Vercel](https://vercel.com)
3. Adicione todas as variáveis de ambiente
4. Deploy!

## Licença

MIT
