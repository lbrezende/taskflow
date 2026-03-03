# BOILERPLATE MANUAL — MVP Generator

> **Objetivo:** Qualquer pessoa pode usar este boilerplate para criar um MVP SaaS completo.
> Basta substituir a seção `[MEU PRODUTO]` no final e rodar o prompt no Claude Code.

---

## PRÉ-REQUISITOS

Antes de começar, instale estas ferramentas na sua máquina:

| Ferramenta | Versão mínima | Como instalar |
|---|---|---|
| **Node.js** | v18+ | [nodejs.org](https://nodejs.org) ou `brew install node` |
| **npm** | v9+ | Vem com o Node.js |
| **Git** | v2+ | [git-scm.com](https://git-scm.com) ou `brew install git` |
| **GitHub CLI** | v2+ | `brew install gh` ou [cli.github.com](https://cli.github.com) |
| **Vercel CLI** | latest | `npm install -g vercel` |

Para verificar se está tudo instalado:
```bash
node --version    # deve mostrar v18+
npm --version     # deve mostrar v9+
git --version     # deve mostrar v2+
gh --version      # deve mostrar v2+
vercel --version  # deve mostrar um número de versão
```

Contas necessárias (crie antes de começar):
- [GitHub](https://github.com) — repositório de código
- [Vercel](https://vercel.com) — hosting (login com GitHub)
- [Neon](https://neon.tech) — banco PostgreSQL
- [Google Cloud Console](https://console.cloud.google.com) — OAuth
- [Resend](https://resend.com) — envio de emails
- [Stripe](https://dashboard.stripe.com) — pagamentos

---

## ETAPAS DE BUILD (ordem obrigatória)

### ETAPA 0 — INFRAESTRUTURA (FAÇA PRIMEIRO!)
1. **Criar repositório no GitHub** (público ou privado)
2. **Conectar Vercel ao repo** para deploy automático
3. **Criar banco PostgreSQL no Neon** (free tier)
4. **Subir hello world** — confirmar que o site está no ar
5. **Configurar domínio** (opcional, Vercel dá um `.vercel.app` grátis)

> **Resultado esperado:** Ao terminar esta etapa, você deve ter:
> - Um repo no GitHub com o código
> - Um site funcionando em `https://seu-projeto.vercel.app`
> - Deploy automático: cada push no GitHub atualiza o site

### ETAPA 1 — SCHEMA DO BANCO (Prisma)
Crie o `prisma/schema.prisma` com as entidades obrigatórias:
- **User**: id, name, email, image, emailVerified, stripeCustomerId, stripePriceId, stripeSubscriptionId, stripeCurrentPeriodEnd, trialEndsAt, plan (enum: FREE/TRIAL/PRO)
- **Account, Session, VerificationToken**: padrão Auth.js
- **Entidades do produto**: definidas na seção [MEU PRODUTO]

### ETAPA 2 — AUTENTICAÇÃO (Auth.js v5)
- Google OAuth + Email Magic Link (via Resend)
- Primeiro login → `plan=TRIAL`, `trialEndsAt=now+14dias`
- Middleware protegendo rotas `/dashboard/*`, `/app/*`, `/settings/*`
- Página customizada `/login`

### ETAPA 3 — TRIAL E ASSINATURA
Funções em `lib/subscription.ts`:
- `isTrialActive(user)` — trialEndsAt > now E plan === TRIAL
- `isSubscribed(user)` — plan === PRO E stripeCurrentPeriodEnd > now
- `hasAccess(user)` — isTrialActive OR isSubscribed
- `daysLeftInTrial(user)` — dias restantes

Fluxo:
1. Primeiro login → TRIAL 14 dias
2. Trial ativo → acesso total + banner "X dias restantes"
3. Trial expirado → BLOQUEADO → redirect pricing
4. Pagou → PRO → acesso total
5. Cancelou → acesso até fim do período

### ETAPA 4 — PAYWALL E LIMITES
- Constante `PLAN_LIMITS` com limites por plano
- Função `checkUsageLimit(user, resource)`
- Componente `<PaywallGate>` que bloqueia com card bonito + CTA upgrade

### ETAPA 5 — STRIPE (PAGAMENTOS)
- Checkout Session (subscription + trial)
- Customer Portal
- Webhook: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted/updated`
- Página `/settings/billing`

### ETAPA 6 — FEATURES DO PRODUTO
Implementar as features descritas em [MEU PRODUTO] com:
- TanStack Query para CRUD
- Zod para validação
- API routes com auth
- PaywallGate nos limites

### ETAPA 7 — LANDING PAGE
Seções: Hero → Features → Screenshots → Pricing → Footer

### ETAPA 8 — SCREENSHOTS
Tirar screenshots reais do app e colocar na landing page.

### ETAPA 9 — CONFIGURAÇÃO FINAL
- `.env.example` completo
- `.gitignore`
- `README.md` com setup passo a passo

---

## STACK OBRIGATÓRIA

| Tecnologia | Função |
|---|---|
| Next.js 14+ (App Router) | Framework full-stack |
| TypeScript strict | Tipagem |
| Tailwind CSS 4 | Estilização |
| TanStack Query | Data fetching client |
| Prisma | ORM + migrations (PostgreSQL) |
| Zod | Validação |
| Auth.js v5 (NextAuth) | Autenticação |
| Stripe | Pagamentos |
| shadcn/ui | Componentes UI |
| Resend | Emails transacionais |

## HOSPEDAGEM

| Serviço | Função | Tier |
|---|---|---|
| Vercel | App hosting | Free |
| Neon | PostgreSQL | Free |
| Resend | Emails | Free (3k/mês) |
| Stripe | Pagamentos | Test mode |

## ESTRUTURA DE PASTAS

```
my-mvp/
├── app/
│   ├── (public)/          # Rotas públicas (landing, pricing, login)
│   ├── (auth)/            # Rotas protegidas (dashboard, settings)
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   └── stripe/webhook/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                # shadcn/ui
│   ├── forms/
│   ├── layout/
│   └── paywall/
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   ├── stripe.ts
│   ├── email.ts
│   ├── validations.ts
│   └── subscription.ts
├── hooks/
├── types/
├── prisma/
│   └── schema.prisma
├── public/
│   └── screenshots/
├── .env.example
├── middleware.ts
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## VARIÁVEIS DE AMBIENTE

```env
# Database (Neon - https://neon.tech)
DATABASE_URL=

# Auth.js v5
AUTH_SECRET=              # openssl rand -base64 32
AUTH_GOOGLE_ID=           # Google Cloud Console
AUTH_GOOGLE_SECRET=
AUTH_RESEND_KEY=          # Resend API Key (para magic links)

# Stripe (https://dashboard.stripe.com)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID_PRO=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Resend (emails transacionais)
RESEND_API_KEY=
```

---

## DECISÕES E AJUSTES

> Esta seção registra todas as decisões tomadas durante o build que alteram o manual original.

1. **ETAPA 0 adicionada** — Criar GitHub + Vercel + Neon ANTES de codar features. O usuário deve ver algo no ar imediatamente.
2. **Toast → Sonner** — O componente `toast` do shadcn/ui foi depreciado. Usamos `sonner` no lugar.
3. **React Compiler: No** — Não ativamos o React Compiler experimental.
4. **Pré-requisitos adicionados** — Seção com todas as ferramentas e contas necessárias antes de começar. Não assuma que o usuário tem Node/npm/git instalados.
5. **Prisma 6 (não 7)** — Prisma 7 mudou completamente a config do datasource. Usamos Prisma ^6 que é estável e compatível com o padrão Auth.js.
6. **Vercel CLI** — Necessário instalar globalmente (`npm install -g vercel`) para deploy via terminal. Vercel conecta ao GitHub automaticamente.
7. **`.claude/` directory adicionado** — Inspirado pelo boilerplate Memberstack. Docs de contexto para AI.
8. **CLAUDE.md na raiz** — Inspirado pelo LastSaaS. Convenções do projeto para agentes AI.
9. **Script de setup interativo** — `npm run setup` para configurar .env automaticamente.
10. **Análise competitiva:** supastarter ($299 pago), Memberstack (grátis, auth-only), LastSaaS (grátis, Go+MongoDB). Nosso: **grátis, Next.js, Prisma+PostgreSQL, cobertura essencial SaaS.**
11. **Stripe SDK v20 breaking changes** — `current_period_end` removido de Subscription. Usamos `invoice.period_end` via latest_invoice. `invoice.subscription` virou `invoice.parent.subscription_details.subscription`. API version: `2026-02-25.clover`.
12. **Stripe client lazy init** — Proxy pattern para evitar crash no build quando STRIPE_SECRET_KEY não está configurada. O client só é criado no primeiro uso em runtime.
13. **Auth.js v5 env vars** — Usa `AUTH_SECRET` em vez de `NEXTAUTH_SECRET`, e `AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET` em vez de `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`. O prefixo `AUTH_` é o padrão do Auth.js v5.

---

## [MEU PRODUTO] — SUBSTITUA ABAIXO

```
Nome do produto: TaskFlow
Headline: "Organize suas tarefas sem complicação."
Subtítulo: "Crie listas, adicione tarefas, e mantenha o foco no que importa."

Features:
1. Criar listas de tarefas com nome customizado
2. Adicionar tarefas dentro de cada lista (título + checkbox)
3. Remover tarefas individualmente
4. Marcar tarefas como concluídas (toggle)
5. Deletar listas inteiras

Entidades extras:
- TodoList (id, name, userId, createdAt, updatedAt)
- TodoItem (id, title, completed, todoListId, createdAt, updatedAt)

Limites:
- FREE: máximo 3 listas. Tarefas ilimitadas por lista.
- TRIAL (14 dias): tudo ilimitado.
- PRO: tudo ilimitado.

Preço:
- PRO: R$ 19,90/mês

Cores:
- Primária: #2563EB (azul)
- Fundo: branco + cinza sutil
- Acento: verde para tarefas concluídas
```
