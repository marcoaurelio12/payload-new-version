# CLAUDE.md — Alinhadamente Payload CMS Platform

> Este ficheiro é a fonte de verdade para o Claude Code configurar, desenvolver e manter a plataforma Payload CMS da Alinhadamente.

---

## Contexto de Negócio

### Quem somos

A **Alinhadamente** é uma empresa portuguesa que oferece "Departamento de IT como Serviço" (ITaaS) a PMEs que não têm equipa interna de IT. Operamos com foco em soberania digital, transparência e automação inteligente.

### Modelo de negócio

Prestamos serviços recorrentes de IT a pequenas e médias empresas. Cada cliente paga uma mensalidade por um conjunto de serviços digitais que inclui presença web, gestão de conteúdo, ferramentas internas e suporte técnico. O objetivo imediato é atingir €1.200/mês de receita recorrente.

### O que este projeto resolve

Precisamos de uma **plataforma centralizada de CMS** que sirva simultaneamente:

1. **A Alinhadamente (nós próprios)** — para gerir o nosso site, blog, artigos e o portal de propostas interativas para clientes.
2. **Os nossos clientes** — cada cliente terá o seu próprio espaço (tenant) dentro do mesmo Payload, com collections e funcionalidades adaptadas às suas necessidades.

A plataforma deve ser modular: hoje começamos com o portal de propostas, amanhã adicionamos blog, gestão de equipa, ou qualquer outra funcionalidade — sem destruir o que já existe em produção.

---

## Arquitetura Geral

### Stack tecnológica

| Componente         | Tecnologia                        |
|--------------------|-----------------------------------|
| **Backend (CMS)**  |                                   |
| CMS                | Payload CMS 3.x (Headless, API-only) |
| Framework          | Next.js 15 (App Router)           |
| Linguagem          | TypeScript (strict mode)          |
| Base de dados      | PostgreSQL 17                     |
| ORM/DB Adapter     | @payloadcms/db-postgres (Drizzle) |
| Rich Text Editor   | @payloadcms/richtext-lexical      |
| Upload/Storage     | @payloadcms/storage-s3 (Wasabi)   |
| Multi-tenancy      | @payloadcms/plugin-multi-tenant   |
| Auth               | Payload built-in auth             |
| Deploy backend     | Dokploy (Docker via GitHub)       |
| Servidor           | Hetzner Dedicated (Ubuntu 24)     |
| Rede privada       | Tailscale VPN                     |
| Backups            | Restic → Wasabi S3                |
| **Frontend (Sites)** |                                 |
| Framework          | Next.js 15 / Astro (conforme site)|
| Deploy frontend    | Cloudflare Pages                  |
| CDN                | Cloudflare (automático)           |
| Domínios           | Geridos na Cloudflare             |

### Arquitetura de separação Backend/Frontend

```
┌─────────────────────────────────────────────────────────┐
│                    CLOUDFLARE PAGES                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │ Site         │  │ Site        │  │ Portal      │      │
│  │ Alinhadamente│  │ Cliente A   │  │ Propostas   │      │
│  │ (frontend)  │  │ (frontend)  │  │ (frontend)  │      │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘      │
│         │                │                │              │
└─────────┼────────────────┼────────────────┼──────────────┘
          │    REST API    │    REST API    │
          │   /api/...     │   /api/...     │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────┐
│              HETZNER (via Dokploy)                        │
│  ┌─────────────────────────────────────────────┐         │
│  │     Payload CMS (Headless API + Admin UI)    │         │
│  │     https://cms.alinhadamente.pt             │         │
│  └──────────────────────┬──────────────────────┘         │
│                         │                                │
│  ┌──────────────────────▼──────────────────────┐         │
│  │            PostgreSQL 17                      │         │
│  └───────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────┘
```

> **O Payload funciona como Headless CMS.** Apenas expõe a API REST (e opcionalmente GraphQL) e o painel de administração. Todos os sites e frontends são aplicações separadas deployadas na Cloudflare Pages, que consomem a API do Payload.

### Fluxo de deployment

```
BACKEND (Payload CMS):
  Dev local → Git push (GitHub repo backend) → Dokploy auto-deploy → Migrações → Produção

FRONTEND (Sites):
  Dev local → Git push (GitHub repo frontend) → Cloudflare Pages auto-deploy → CDN global
```

### Repositórios separados

Cada peça da arquitetura vive no seu próprio repositório Git:

- `payload-multitenant` — Backend Payload CMS (este projeto)
- `site-alinhadamente` — Frontend do site principal da Alinhadamente
- `portal-propostas-alinhadamente` — Frontend do portal de propostas interativo
- `site-cliente-x` — Frontend do site de cada cliente (um repo por cliente, ou mono-repo com pastas)

Esta separação garante que deploys do frontend não afetam o backend e vice-versa.

### Princípio fundamental

> **O Payload é uma plataforma modular.** Adicionamos funcionalidades incrementalmente através de novas collections e plugins. O sistema de migrações do Drizzle garante que alterações ao schema nunca destroem dados existentes.

---

## Estrutura do Projeto

```
payload-alinhadamente/
├── CLAUDE.md                          # Este ficheiro (fonte de verdade)
├── package.json
├── tsconfig.json
├── next.config.mjs
├── .env.local                         # Variáveis locais (NUNCA no git)
├── .env.example                       # Template de variáveis
├── .gitignore
├── Dockerfile
├── docker-compose.yml                 # Dev local com PostgreSQL
├── src/
│   ├── app/                           # Next.js App Router (apenas Admin UI)
│   │   └── (payload)/                 # Admin UI do Payload
│   │       └── admin/
│   │           └── [[...segments]]/
│   │               └── page.tsx
│   ├── payload.config.ts              # Configuração central do Payload
│   ├── collections/                   # Todas as collections
│   │   ├── core/                      # Collections do sistema
│   │   │   ├── Tenants.ts             # Definição de tenants
│   │   │   ├── Users.ts               # Utilizadores multi-tenant
│   │   │   └── Media.ts               # Uploads com isolamento por tenant
│   │   ├── proposals/                 # Módulo: Portal de Propostas
│   │   │   ├── Proposals.ts           # Propostas principais
│   │   │   ├── ProposalSections.ts    # Secções/blocos de cada proposta
│   │   │   ├── ProposalTemplates.ts   # Templates reutilizáveis
│   │   │   └── PricingItems.ts        # Items da calculadora de preços
│   │   ├── content/                   # Módulo: Gestão de Conteúdo
│   │   │   ├── Posts.ts               # Artigos/blog posts
│   │   │   ├── Categories.ts          # Categorias de conteúdo
│   │   │   └── Tags.ts                # Tags
│   │   └── index.ts                   # Re-export de todas as collections
│   ├── globals/                       # Globals do Payload
│   │   └── SiteSettings.ts            # Configurações globais por tenant
│   ├── access/                        # Políticas de acesso
│   │   ├── isSuperAdmin.ts            # Verificação de super admin
│   │   ├── isTenantAdmin.ts           # Admin do tenant
│   │   ├── tenantIsolation.ts         # Filtro automático por tenant
│   │   └── index.ts
│   ├── hooks/                         # Hooks reutilizáveis
│   │   ├── assignTenantOnCreate.ts    # Auto-assign tenant na criação
│   │   └── index.ts
│   ├── blocks/                        # Blocos do Lexical editor
│   │   ├── PricingCalculator.ts       # Bloco: calculadora de preços
│   │   ├── ServiceSelector.ts         # Bloco: seletor de serviços
│   │   ├── ComparisonTable.ts         # Bloco: tabela comparativa
│   │   └── index.ts
│   └── lib/                           # Utilitários
│       ├── constants.ts               # Constantes da aplicação
│       └── utils.ts
├── migrations/                        # Migrações da base de dados (auto-geradas)
│   └── .gitkeep
└── public/                            # Assets estáticos (apenas para Admin UI)
    └── favicon.ico
```

---

## Configuração Local (Ambiente de Desenvolvimento)

### Pré-requisitos

- Node.js 20+ (LTS)
- pnpm (gestor de pacotes preferido)
- Docker e Docker Compose (para PostgreSQL local)
- Git

### Setup inicial

1. **Criar o projeto:**
   ```bash
   pnpm create payload-app@latest payload-alinhadamente
   # Selecionar: Next.js, PostgreSQL, TypeScript
   ```

2. **Instalar dependências adicionais:**
   ```bash
   pnpm add @payloadcms/plugin-multi-tenant @payloadcms/storage-s3 @payloadcms/richtext-lexical
   ```

3. **Configurar PostgreSQL local com Docker Compose:**

   O ficheiro `docker-compose.yml` na raiz do projeto serve APENAS para desenvolvimento local:

   ```yaml
   services:
     postgres:
       image: postgres:17-alpine
       restart: unless-stopped
       ports:
         - "5432:5432"
       environment:
         POSTGRES_DB: payload_dev
         POSTGRES_USER: payload_dev
         POSTGRES_PASSWORD: dev_password_local_only
       volumes:
         - postgres_data:/var/lib/postgresql/data

   volumes:
     postgres_data:
   ```

4. **Criar `.env.local`:**
   ```env
   DATABASE_URI=postgresql://payload_dev:dev_password_local_only@localhost:5432/payload_dev
   PAYLOAD_SECRET=uma-chave-secreta-longa-minimo-32-caracteres-gerar-com-openssl
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   S3_BUCKET=alinhadamente-uploads
   S3_REGION=eu-central-2
   S3_ENDPOINT=https://s3.eu-central-2.wasabisys.com
   S3_ACCESS_KEY=dev_access_key
   S3_SECRET_KEY=dev_secret_key
   ```

5. **Criar `.env.example`** (este vai para o git):
   ```env
   DATABASE_URI=
   PAYLOAD_SECRET=
   NEXT_PUBLIC_SITE_URL=
   S3_BUCKET=
   S3_REGION=
   S3_ENDPOINT=
   S3_ACCESS_KEY=
   S3_SECRET_KEY=
   ```

### Comandos de desenvolvimento

```bash
docker compose up -d                 # Iniciar PostgreSQL local
pnpm dev                             # Iniciar Payload em dev mode
pnpm payload migrate:create          # Gerar migração após alterar schema
pnpm payload migrate                 # Aplicar migrações pendentes
pnpm build                           # Build de produção (testar antes de push)
```

---

## Configuração da API (Headless Mode)

### O Payload como API pura

O Payload expõe automaticamente endpoints REST para cada collection:

```
GET    /api/{collection}          — Listar (com query, sort, pagination)
GET    /api/{collection}/{id}     — Obter por ID
POST   /api/{collection}          — Criar
PATCH  /api/{collection}/{id}     — Atualizar
DELETE /api/{collection}/{id}     — Apagar

GET    /api/globals/{global}      — Obter global
POST   /api/globals/{global}      — Atualizar global
```

O Admin UI fica disponível em `https://cms.alinhadamente.pt/admin` para gestão de conteúdo. Todo o resto é consumido via API pelos frontends na Cloudflare Pages.

### CORS — Configuração crítica

Como os frontends estão em domínios diferentes (Cloudflare Pages), o CORS deve ser configurado no `payload.config.ts`:

```typescript
export default buildConfig({
  // ...
  cors: {
    origins: [
      'https://alinhadamente.pt',
      'https://www.alinhadamente.pt',
      'https://propostas.alinhadamente.pt',
      // Domínios de clientes
      'https://advogados-silva.pt',
      // Dev local
      ...(process.env.NODE_ENV === 'development'
        ? ['http://localhost:3001', 'http://localhost:4321']
        : []),
    ],
  },
  csrf: [
    'https://alinhadamente.pt',
    'https://www.alinhadamente.pt',
    'https://propostas.alinhadamente.pt',
    ...(process.env.NODE_ENV === 'development'
      ? ['http://localhost:3001', 'http://localhost:4321']
      : []),
  ],
  // ...
})
```

> **IMPORTANTE:** Quando adicionares um novo cliente/frontend, deves adicionar o domínio ao CORS e ao CSRF. Isto requer um redeploy do Payload. Para escalar, considera usar variáveis de ambiente para a lista de domínios:

```typescript
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || []
```

### Autenticação da API

Os frontends autenticam-se com a API do Payload de duas formas:

1. **API Keys** (para operações server-side nos frontends, como SSR/ISR):
   - Criar um user com role `tenantViewer` ou `tenantEditor` para cada frontend
   - Gerar API key para esse user no admin do Payload
   - Usar no header: `Authorization: users API-Key <key>`
   - A API key deve estar nas variáveis de ambiente do projeto Cloudflare Pages

2. **JWT Cookies** (para operações client-side autenticadas):
   - Login via `POST /api/users/login`
   - Token retornado como httpOnly cookie
   - Usado para áreas autenticadas (ex: cliente a responder a proposta)

### Endpoints públicos vs privados

Algumas collections precisam de endpoints públicos (sem auth) para os frontends:

```typescript
// Exemplo: Posts publicados são públicos para leitura
const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    read: ({ req: { user } }) => {
      // Se não autenticado, só ver publicados
      if (!user) {
        return { status: { equals: 'published' } }
      }
      // Se autenticado, filtrar por tenant
      return tenantIsolation({ req: { user } })
    },
    // create, update, delete requerem auth...
  },
}
```

### Cache e performance

Os frontends na Cloudflare Pages podem (e devem) fazer cache agressivo das respostas da API:

- Posts publicados: cache de 5 minutos com `stale-while-revalidate`
- Media/imagens: cache longo (servidas via Wasabi S3 ou Cloudflare R2)
- Propostas: sem cache (dados em tempo real)
- Usar webhooks do Payload para invalidar cache na Cloudflare quando conteúdo é atualizado (via Cloudflare API `purge_cache`)

---

## Configuração do Multi-Tenant

### Filosofia

Cada tenant representa uma entidade (a Alinhadamente ou um cliente) que tem o seu próprio espaço isolado dentro da plataforma. O primeiro tenant criado é sempre `alinhadamente` (nós).

### Como funciona

O plugin `@payloadcms/plugin-multi-tenant` adiciona automaticamente um campo `tenant` a todas as collections configuradas. As queries são filtradas por tenant com base no utilizador autenticado. Super admins veem todos os tenants. Admins de tenant veem apenas os seus dados.

### Configuração no `payload.config.ts`

```typescript
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { s3Storage } from '@payloadcms/storage-s3'
import { collections } from './collections'
import { SiteSettings } from './globals/SiteSettings'

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '— Alinhadamente',
    },
  },

  editor: lexicalEditor({}),

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI!,
    },
    migrationDir: './migrations',
  }),

  collections,

  globals: [SiteSettings],

  plugins: [
    multiTenantPlugin({
      tenantCollection: 'tenants',
      isolationStrategy: 'path',       // Cada tenant tem URL /tenant-slug/...
      sharedCollections: ['media'],     // Collections partilhadas se necessário
    }),
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
        },
      },
      bucket: process.env.S3_BUCKET!,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY!,
          secretAccessKey: process.env.S3_SECRET_KEY!,
        },
        region: process.env.S3_REGION,
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: true,            // Necessário para Wasabi
      },
    }),
  ],

  typescript: {
    outputFile: './src/payload-types.ts',
  },

  secret: process.env.PAYLOAD_SECRET!,
})
```

---

## Collections — Especificações Detalhadas

### Core: Tenants

```
Collection: tenants
Propósito: Representar cada entidade (Alinhadamente ou cliente) na plataforma.

Campos:
- name (text, required) — Nome do tenant (ex: "Alinhadamente", "Escritório Advogados Silva")
- slug (text, required, unique, indexed) — Identificador URL-safe (ex: "alinhadamente", "advogados-silva")
- domain (text, optional) — Domínio personalizado se aplicável
- plan (select: starter|professional|enterprise) — Plano contratado
- active (checkbox, default: true) — Tenant ativo/inativo
- features (json) — Lista de módulos/funcionalidades ativadas para este tenant
- settings (group) — Configurações específicas do tenant:
  - logo (upload → media)
  - primaryColor (text)
  - companyEmail (email)
  - companyPhone (text)

Acesso:
- create: apenas superAdmin
- read: superAdmin ou membro do tenant
- update: superAdmin ou admin do tenant
- delete: apenas superAdmin
```

### Core: Users

```
Collection: users
Propósito: Utilizadores da plataforma com auth built-in do Payload.

Campos:
- email (email, required, unique) — Login
- password (auto-gerido pelo Payload auth)
- firstName (text, required)
- lastName (text, required)
- role (select: superAdmin|tenantAdmin|tenantEditor|tenantViewer)
- tenants (array de relationship → tenants) — Tenants a que o user tem acesso
- activeTenant (relationship → tenants) — Tenant atualmente selecionado
- avatar (upload → media, optional)

Acesso:
- create: superAdmin ou tenantAdmin do respetivo tenant
- read: superAdmin ou utilizadores do mesmo tenant
- update: o próprio user (campos limitados) ou superAdmin
- delete: apenas superAdmin

Auth:
- useAPIKey: true (para integrações)
- tokenExpiration: 7200 (2 horas)
- maxLoginAttempts: 5
- lockTime: 600000 (10 minutos)
```

### Core: Media

```
Collection: media
Propósito: Gestão centralizada de uploads com isolamento por tenant.

Campos:
- alt (text, required) — Texto alternativo (acessibilidade)
- caption (text, optional) — Legenda
- tenant (auto-preenchido pelo plugin multi-tenant)

Upload config:
- storage: S3 (Wasabi)
- mimeTypes: ['image/*', 'application/pdf']
- maxSize: 10MB
- imageSizes:
  - thumbnail: 300x300, fit: cover
  - medium: 800x600, fit: inside
  - large: 1920x1080, fit: inside
  - og: 1200x630, fit: cover (para Open Graph)
```

### Módulo: Portal de Propostas

```
Collection: proposals
Propósito: Propostas interativas enviadas a potenciais clientes.

Campos:
- title (text, required) — Título da proposta
- slug (text, required, unique per tenant)
- status (select: draft|sent|viewed|accepted|rejected|expired)
- client (group):
  - name (text, required) — Nome do cliente/lead
  - email (email, required)
  - company (text, optional)
  - phone (text, optional)
- validUntil (date) — Data de expiração
- content (richText/lexical com blocks customizados):
  - Bloco: TextSection (texto rico livre)
  - Bloco: PricingCalculator (calculadora interativa)
  - Bloco: ServiceSelector (seletor de serviços com toggle on/off)
  - Bloco: ComparisonTable (tabela comparativa de planos)
  - Bloco: Testimonial (testemunho de cliente)
  - Bloco: CallToAction (CTA com botão de ação)
- pricing (group):
  - items (array):
    - name (text) — Nome do serviço/item
    - description (text) — Descrição
    - price (number) — Preço unitário
    - frequency (select: once|monthly|yearly)
    - optional (checkbox) — Se o cliente pode desselecionar
    - selected (checkbox, default: true) — Pré-selecionado
  - discount (number, optional) — Desconto percentual
  - notes (richText) — Notas sobre preços
- template (relationship → proposalTemplates, optional) — Template usado
- sentAt (date, auto) — Data de envio
- viewedAt (date, auto) — Primeira visualização
- respondedAt (date, auto) — Data de resposta

Acesso:
- create/update/delete: tenantAdmin ou tenantEditor do respetivo tenant
- read: tenantAdmin, tenantEditor ou via link público com token

Hooks:
- beforeChange: calcular total automático baseado nos items selecionados
- afterChange: enviar notificação quando status muda para 'viewed' ou 'accepted'
```

```
Collection: proposalTemplates
Propósito: Templates reutilizáveis para criar propostas rapidamente.

Campos:
- name (text, required)
- description (text)
- content (richText/lexical — mesma estrutura de blocks das proposals)
- defaultPricingItems (array — mesma estrutura de pricing.items)
- category (select: webDesign|itServices|consulting|custom)

Acesso: tenantAdmin e tenantEditor do respetivo tenant
```

### Módulo: Gestão de Conteúdo

```
Collection: posts
Propósito: Artigos de blog e conteúdo editorial.

Campos:
- title (text, required)
- slug (text, required, unique per tenant, auto-gerado do title)
- excerpt (textarea, max: 300) — Resumo para listagens e SEO
- content (richText/lexical)
- featuredImage (upload → media)
- author (relationship → users)
- categories (relationship → categories, hasMany)
- tags (relationship → tags, hasMany)
- status (select: draft|published|archived)
- publishedAt (date)
- seo (group):
  - metaTitle (text, max: 60)
  - metaDescription (textarea, max: 160)
  - ogImage (upload → media)

Acesso:
- create/update: tenantAdmin ou tenantEditor
- read: público quando status = published, senão apenas tenant members
- delete: tenantAdmin

Hooks:
- beforeChange: auto-gerar slug a partir do title se vazio
- beforeChange: definir publishedAt quando status muda para 'published'
```

```
Collection: categories
Campos: name (text, required), slug (text, unique per tenant), description (text)
Acesso: tenantAdmin e tenantEditor
```

```
Collection: tags
Campos: name (text, required), slug (text, unique per tenant)
Acesso: tenantAdmin e tenantEditor
```

---

## Segurança — Requisitos de Produção

### API rate limiting

- Implementar rate limiting no reverse proxy (Dokploy/Traefik ou Cloudflare):
  - `/api/*` endpoints: 100 requests/minuto por IP.
  - `/api/users/login`: 10 requests/minuto por IP.
  - Admin UI (`/admin`): sem limite mas restrito por IP se possível.
- Considerar Cloudflare como proxy para o domínio `cms.alinhadamente.pt` para proteção DDoS adicional.

### Autenticação e autorização

- Rate limiting no login: máximo 5 tentativas, lockout de 10 minutos.
- Tokens JWT com expiração de 2 horas.
- API keys para integrações (com scope limitado por tenant).
- CSRF protection ativo (default no Payload 3).
- Todas as passwords são hashed com argon2 (default do Payload).

### Isolamento de dados

- TODA a query a qualquer collection com tenant DEVE ser filtrada pelo tenant do user autenticado.
- Nunca confiar apenas no frontend para filtrar dados — o acesso é sempre validado server-side nas access functions.
- Super admin é a única role que pode ver dados cross-tenant.

### Variáveis de ambiente

- `PAYLOAD_SECRET` deve ter pelo menos 32 caracteres, gerado com `openssl rand -hex 32`.
- Nenhuma credencial no código-fonte. Todas no `.env.local` (local) ou nas variáveis do Dokploy (produção).
- `.env.local` está no `.gitignore`.

### Headers de segurança

Configurar no `next.config.mjs`:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Content-Security-Policy` adequada à aplicação

### Upload e storage

- Validação de MIME types no servidor (não confiar no Content-Type do browser).
- Limite de tamanho de ficheiro: 10MB.
- Uploads vão para S3 (Wasabi), nunca para o filesystem do container.
- URLs de media servidas via CDN ou presigned URLs com expiração.

### Base de dados

- Conexão via SSL em produção.
- User da aplicação com permissões mínimas (não usar superuser).
- Backups automatizados via Restic → Wasabi (já configurado no servidor).

---

## Docker — Configuração de Produção

### Dockerfile

```dockerfile
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 payload
USER payload

COPY --from=builder --chown=payload:nodejs /app/.next ./.next
COPY --from=builder --chown=payload:nodejs /app/public ./public
COPY --from=builder --chown=payload:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=payload:nodejs /app/package.json ./package.json
COPY --from=builder --chown=payload:nodejs /app/migrations ./migrations
COPY --from=builder --chown=payload:nodejs /app/src ./src
COPY --from=builder --chown=payload:nodejs /app/next.config.mjs ./next.config.mjs
COPY --from=builder --chown=payload:nodejs /app/tsconfig.json ./tsconfig.json

EXPOSE 3000

CMD ["sh", "-c", "pnpm payload migrate && pnpm start"]
```

### Notas importantes sobre o Dockerfile

- Multi-stage build para imagem final leve.
- Corre como user não-root (`payload`).
- As migrações correm ANTES do start — garante que o schema está atualizado.
- O `pnpm install --frozen-lockfile` garante builds reprodutíveis.

---

## Sistema de Migrações — Regras Críticas

### NUNCA fazer

- Nunca editar um ficheiro de migração já aplicado em produção.
- Nunca apagar ficheiros de migração do repositório.
- Nunca alterar o schema da base de dados manualmente (SQL direto).
- Nunca fazer `DROP TABLE` ou `DROP COLUMN` sem migração.

### SEMPRE fazer

- Correr `pnpm payload migrate:create` depois de alterar qualquer collection.
- Testar a migração localmente antes de fazer push.
- Verificar o ficheiro de migração gerado — confirmar que faz sentido.
- Fazer commit do ficheiro de migração junto com as alterações ao schema.
- Em produção, as migrações correm automaticamente no arranque do container.

### Fluxo seguro para adicionar funcionalidades

```
1. Criar/alterar collections localmente
2. pnpm payload migrate:create
3. Verificar ficheiro de migração gerado
4. pnpm payload migrate (aplicar localmente)
5. Testar a aplicação localmente
6. pnpm build (verificar que compila)
7. git add . && git commit -m "feat: adicionar módulo X"
8. git push origin main
9. Dokploy faz auto-deploy → migração corre → nova funcionalidade em produção
```

---

## Convenções de Código

### Geral

- TypeScript strict mode sempre.
- Nomes de collections em camelCase no código, PascalCase no nome da collection.
- Nomes de campos em camelCase.
- Ficheiros de collections: PascalCase (ex: `Proposals.ts`).
- Ficheiros de utilitários: camelCase (ex: `tenantIsolation.ts`).
- Comentários em inglês no código, documentação em português.

### Access functions

Toda a collection que participa no multi-tenant DEVE usar access functions que verificam o tenant. Exemplo padrão:

```typescript
import { Access } from 'payload'

export const tenantIsolation: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.role === 'superAdmin') return true

  return {
    tenant: {
      equals: user.activeTenant,
    },
  }
}
```

### Hooks

Usar hooks para lógica de negócio que deve correr server-side. Nunca depender do frontend para lógica crítica. Hooks devem ser funções puras sempre que possível, e devem estar em ficheiros separados na pasta `hooks/`.

---

## Ferramentas MCP Disponíveis

### Configuradas

- **sequential-thinking** — Para planeamento e raciocínio complexo antes de implementar funcionalidades.

### A configurar futuramente

_(Espaço reservado para ferramentas MCP adicionais que serão adicionadas ao longo do tempo.)_

---

## Lições Aprendidas & Debugging

### Incompatibilidade Backend/Frontend (Fev 2026)

**Problema:** Ao criar um tier de pricing no painel do Payload, a página de proposta ficava em branco.

**Causa raiz:** Incompatibilidade de formatos entre o backend (Payload CMS) e o frontend (portal-propostas):

| Campo | Backend (Payload) | Frontend esperava |
|-------|-------------------|-------------------|
| Preços | `setupPrice`, `monthlyPrice` (camelCase) | `setup_price`, `monthly_price` (snake_case) |
| Features | `Array<{ feature: string }>` (objetos) | `string[]` (strings simples) |
| IDs | Payload gera IDs internos | Frontend esperava campo `id` explícito |

**Solução:** Atualizar a função `transformApiProposal()` no `api.ts` do frontend para transformar corretamente:
- camelCase → snake_case
- `{ feature: "text" }` → `"text"`
- Garantir que IDs são propagados

**Lição:** Quando o Payload retorna arrays com objetos aninhados, o frontend DEVE transformar os dados. Nunca fazer cast direto (`as Type`). Ver [DYNAMIC_FIELDS_ANALYSIS.md](DYNAMIC_FIELDS_ANALYSIS.md) para mapeamento completo.

**Ficheiros afetados:**
- Backend: `src/collections/Proposals.ts` — define a estrutura dos tiers
- Frontend: `portal-propostas/services/api.ts` — transforma API response
- Frontend: `portal-propostas/components/PricingTiers.tsx` — consome os dados

### Debugging: Página em branco no React

Quando uma página React fica em branco sem mensagem de erro visível:
1. Abrir DevTools → Console — procurar erros de JavaScript
2. Verificar se `.map()` está a ser chamado em dados `undefined` ou com formato errado
3. Verificar se componentes estão a receber props com tipos diferentes dos esperados
4. O React "crasha silenciosamente" quando há erros não tratados no render

---

## Roadmap de Implementação

### Fase 1 — Fundação ✅ CONCLUÍDA
- [x] Setup do projeto com Payload 3.x + Next.js 15
- [x] Configurar PostgreSQL local com Docker Compose
- [x] Implementar collections core: Tenants, Users, Media
- [x] Configurar plugin multi-tenant
- [x] Configurar S3 storage (Wasabi)
- [x] Criar tenant "alinhadamente" como primeiro tenant
- [x] Criar user superAdmin
- [x] Collections adicionais: Motores, Addons, Testimonials, Team, FAQs

### Fase 2 — Portal de Propostas 🔄 EM PROGRESSO
- [x] Implementar collection Proposals com todos os campos
- [x] Implementar collection ProposalTemplates
- [x] Endpoints públicos: `/api/proposals/public/:slug`, `/api/proposals/public/token/:token`
- [x] Endpoints de resposta: `/accept` e `/reject`
- [x] Tracking de views e respostas (hooks afterChange)
- [x] Frontend: integração API e transformação de dados (api.ts)
- [ ] Testar fluxo completo de proposta (criar → enviar → cliente visualiza → aceita/rejeita)
- [ ] Validar todos os componentes do frontend com dados reais

### Fase 3 — Gestão de Conteúdo
- [ ] Implementar collections Posts, Categories, Tags
- [ ] Configurar SEO fields e Open Graph
- [ ] Implementar auto-geração de slugs
- [ ] Criar endpoints API para consumo pelo frontend do site

### Fase 4 — Primeiro Deploy
- [ ] Criar Dockerfile de produção otimizado
- [ ] Configurar serviço no Dokploy com auto-deploy do GitHub
- [ ] Configurar variáveis de ambiente no Dokploy
- [ ] Configurar PostgreSQL no Dokploy (serviço separado)
- [ ] Testar deploy completo com migrações
- [ ] Configurar domínio e SSL

### Fase 5 — Onboarding de Clientes
- [ ] Criar workflow para adicionar novo tenant
- [ ] Documentar processo de ativação de módulos por tenant
- [ ] Implementar dashboard por tenant
- [ ] Criar templates de proposta padrão

---

## Notas Importantes

1. **A base de dados de produção é gerida pelo Dokploy** como serviço separado com volume persistente. Nunca está dentro do container do Payload.

2. **Adicionar funcionalidades nunca destrói dados** — o sistema de migrações do Payload/Drizzle é aditivo. Novas collections criam novas tabelas. Novos campos criam novas colunas. Dados existentes permanecem intactos.

3. **O `docker-compose.yml` na raiz é APENAS para desenvolvimento local.** Em produção, o PostgreSQL corre como serviço independente no Dokploy.

4. **Sempre que uma nova funcionalidade for implementada**, seguir o fluxo de migrações documentado acima. Sem exceções.

5. **O primeiro user criado deve ser superAdmin** com acesso total. Todos os outros users são criados com roles específicas associadas a tenants específicos.