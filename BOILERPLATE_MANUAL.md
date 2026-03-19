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

Também crie o Design System (Single Source of Truth):

`design-system/tokens.ts` — Fonte única de design tokens:
* Definir objeto tipado `DesignTokens` com: colors, sidebar, radius, spacing, typography
* Todas as cores do tema, tokens de sidebar, escala tipográfica
* Exportar tokens e tipo `DesignTokens`

`design-system/utils.ts` — Helpers de conversão:
* `tokenKeyToCssVar(key)` — converte camelCase para CSS var (ex: `"cardForeground"` → `"--card-foreground"`)
* `sidebarKeyToCssVar(key)` — converte para sidebar CSS var (ex: `"primary"` → `"--sidebar-primary"`)

`design-system/generate-css.ts` — Gerador de CSS:
* Importa `tokens.ts` e gera bloco `:root {}` no `globals.css` entre marcadores de comentário
* Preserva todo conteúdo fora do `:root` (imports, @theme inline, @layer base)
* Flag `--check` para CI (verifica se `globals.css` está sincronizado)

`package.json` — Adicionar scripts:
* `"tokens": "tsx design-system/generate-css.ts"`
* `"tokens:check": "tsx design-system/generate-css.ts --check"`

**REGRA:** Nunca usar hex hardcoded nos componentes. Sempre usar tokens semânticos Tailwind (`bg-primary`, `text-foreground`, etc).

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

**Upgrade durante trial (imediato):**
- O `createCheckoutSession()` em `lib/stripe.ts` NÃO define `trial_period_days` no `subscription_data`
- Isso significa que o Stripe cria uma assinatura paga imediatamente, sem período de trial no Stripe
- O webhook `checkout.session.completed` atualiza `plan: "PRO"` no banco
- O usuário TRIAL pode clicar "Upgrade" a qualquer momento, passar o cartão e virar PRO na hora
- Pontos de upgrade: billing page (`/settings/billing`) e trial banner (link "Fazer upgrade")
- Webhook events que tratam o lifecycle:
  - `checkout.session.completed` → cria assinatura, seta plan=PRO
  - `invoice.payment_succeeded` → renova período
  - `customer.subscription.updated` → atualiza status
  - `customer.subscription.deleted` → volta para FREE
- Após upgrade, o Stripe Customer Portal permite gerenciar/cancelar via `createCustomerPortalSession()`

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

Após implementar as features, configure o Storybook (Design System wired):

1. Instalar Storybook: `npx storybook@latest init`
2. Configurar `.storybook/preview.ts` para importar `globals.css` e usar tokens de `design-system/tokens.ts` nos backgrounds
3. Criar stories para Design Tokens:
   * `stories/design-tokens/Colors.stories.tsx` — Grid visual de todas as cores importadas de `tokens.ts`
   * `stories/design-tokens/Typography.stories.tsx` — Escala tipográfica importada de `tokens.typography`
   * `stories/design-tokens/Spacing.stories.tsx` — Barras visuais importadas de `tokens.spacing`
4. Criar stories para cada componente UI (Button, Card, Input, Badge, Dialog, Select, Tabs)
5. Criar stories para componentes do produto (PaywallGate, TrialBanner)
6. Todas as stories DEVEM importar tokens de `design-system/tokens.ts` — isso garante que mudanças nos tokens propagam automaticamente

**REGRA WIRED:** Editar `tokens.ts` → rodar `npm run tokens` → mudanças refletem no produto E no Storybook.

### ETAPA 7 — LANDING PAGE
Seções: Hero → Features → Screenshots → Pricing → Footer

### ETAPA 8 — SCREENSHOTS
Tirar screenshots reais do app e colocar na landing page.

### ETAPA 9 — CONFIGURAÇÃO FINAL
- `.env.example` completo
- `.gitignore`
- `README.md` com setup passo a passo

Também verifique o Design System wired:
* Rodar `npm run tokens:check` para verificar sincronização
* Verificar zero hex hardcoded nos componentes (`grep -r "bg-\[#" components/ app/`)
* Adicionar `npm run tokens:check` no CI/CD pipeline

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
| Storybook 10 | Design System documentation & testing |
| design-system/tokens.ts | Design tokens single source of truth |

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
├── design-system/
│   ├── tokens.ts          # Source of truth for all design tokens
│   ├── utils.ts           # Token conversion helpers
│   └── generate-css.ts    # CSS generator script
├── stories/
│   ├── design-tokens/     # Colors, Typography, Spacing stories
│   ├── ui/                # UI component stories
│   └── components/        # Product component stories
├── .storybook/
│   ├── main.ts
│   └── preview.ts
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
14. **Middleware leve (Edge Function < 1MB)** — O middleware NÃO importa `auth` do Auth.js. Importar Auth.js puxa Prisma+Resend+providers (~1.01MB), estourando o limite de 1MB do Vercel free. Em vez disso, o middleware checa diretamente o cookie `authjs.session-token`. Regra: **nunca importar libs pesadas no middleware**.
15. **Variáveis de ambiente na Vercel** — Todas as env vars do `.env.example` devem ser configuradas na Vercel via `vercel env add`. Sem elas o deploy compila mas falha na etapa de deploy.
16. **Upgrade durante trial** — O checkout Stripe NÃO define `trial_period_days` em `subscription_data`, então o usuário pode passar o cartão e virar PRO imediatamente durante o trial. O webhook `checkout.session.completed` atualiza `plan: "PRO"`. Sem delay. Billing page e trial banner mostram botão de upgrade para TRIAL users.
17. **Figma MCP** — Para design-to-code, instale `@anthropic-ai/figma-mcp-server` como MCP server no Claude Code. Permite extrair código pixel-perfect de qualquer node do Figma usando `get_design_context`.
18. **Design System Wired** — O design system usa um arquivo TypeScript (`design-system/tokens.ts`) como fonte única de verdade. Um script (`npm run tokens`) gera as CSS custom properties no `globals.css` a partir desse arquivo. As stories do Storybook importam os mesmos tokens, garantindo que mudanças propagam para produto e documentação simultaneamente. Regra: zero hex hardcoded nos componentes — sempre usar tokens semânticos Tailwind.

---

## [MEU PRODUTO] — SUBSTITUA ABAIXO

```
Nome do produto: [NOME]
Headline: "[FRASE PRINCIPAL DO HERO]"
Subtítulo: "[SUBTÍTULO DO HERO]"

Features:
1. [Feature principal]
2. [Feature 2]
3. [Feature 3]
4. [Feature 4]
5. [Feature 5]

Entidades extras (além de User, Account, Session):
- [Entidade1] (campos...)
- [Entidade2] (campos...)

Limites por plano:
- FREE: [descreva limites]
- TRIAL (14 dias): tudo ilimitado
- PRO: tudo ilimitado

Preço:
- PRO: R$ [VALOR]/mês

Cores:
- Primária: [hex]
- Fundo: [hex]
- Acento: [hex]
```
