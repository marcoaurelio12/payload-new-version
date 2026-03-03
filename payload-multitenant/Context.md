# Context.md — Estado do Projeto para Project Manager

> Este documento serve como contexto completo para um agente Project Manager gerir o desenvolvimento da plataforma Payload CMS da Alinhadamente.
> Última atualização: 2026-02-18

---

## 1. Visão Geral do Projeto

### O que é
Plataforma de CMS headless multi-tenant para a Alinhadamente e seus clientes. Permite gerir sites, blog, portal de propostas interativas e futuras funcionalidades.

### Stack Tecnológica
| Componente | Tecnologia |
|------------|------------|
| CMS | Payload CMS 3.x |
| Framework | Next.js 15 (App Router) |
| Linguagem | TypeScript (strict mode) |
| Base de dados | PostgreSQL 17 |
| ORM | Drizzle (via @payloadcms/db-postgres) |
| Editor | Lexical Rich Text |
| Multi-tenancy | @payloadcms/plugin-multi-tenant |
| Storage | S3 (Wasabi) — configurar |
| Deploy | Dokploy (Hetzner) + Cloudflare Pages (frontends) |

### Arquitetura
```
Backend (Payload CMS) → API REST → Frontends separados (Cloudflare Pages)
     ↑
  PostgreSQL
```

---

## 2. Estado de Implementação

### FASE 1 — Fundação ✅ CONCLUÍDA

| Tarefa | Status | Notas |
|--------|--------|-------|
| Setup Payload 3.x + Next.js 15 | ✅ | Projeto funcional |
| PostgreSQL local (Docker Compose) | ✅ | `docker-compose.yml` na raiz |
| Collections core: Tenants | ✅ | Com slug, domain, logo, active |
| Collections core: Users | ✅ | Roles: superAdmin, tenantAdmin, tenantEditor, tenantViewer |
| Collections core: Media | ✅ | Upload básico funcional |
| Plugin multi-tenant | ✅ | Configurado com isolamento por tenant |
| S3 Storage (Wasabi) | ⚠️ | **FALTA CONFIGURAR** - só upload local |
| Primeiro tenant "alinhadamente" | ✅ | Criado via seed/migration |
| User superAdmin | ✅ | Criado |

### FASE 2 — Portal de Propostas ✅ BACKEND COMPLETO

| Tarefa | Status | Notas |
|--------|--------|-------|
| Collection Proposals | ✅ | Muito completa (ver detalhes abaixo) |
| Collection ProposalTemplates | ✅ | Templates reutilizáveis |
| Collection Motores | ✅ | Serviços/componentes reutilizáveis |
| Collection Addons | ✅ | Serviços adicionais com ROI |
| Collection Testimonials | ✅ | Testemunhos com nicho |
| Collection Team | ✅ | Membros da equipa |
| Collection FAQs | ✅ | FAQs categorizadas |
| Endpoint público `/public/:slug/verify` | ✅ | Verificação de acesso |
| Endpoint público `/accept` | ✅ | Cliente aceita proposta |
| Endpoint público `/reject` | ✅ | Cliente rejeita proposta |
| Endpoint `/public/:slug/exists` | ✅ | Verificar existência |
| Tracking views/respostas | ✅ | Hooks afterChange |
| **Frontend: integração API** | ❌ | **POR FAZER** - noutro repo |
| **Testar fluxo completo** | ❌ | **POR FAZER** |
| **Validar componentes frontend** | ❌ | **POR FAZER** |

### FASE 3 — Gestão de Conteúdo ✅ CONCLUÍDA

| Tarefa | Status | Notas |
|--------|--------|-------|
| Collection Posts | ✅ | Com status, categorias, SEO |
| Collection Pages | ✅ | Páginas estáticas com SEO |
| Collection Categories | ✅ | Categorias de conteúdo |
| Collection Tags | ❌ | **FALTA IMPLEMENTAR** |
| SEO fields + Open Graph | ✅ | Configurado em Posts/Pages |
| Auto-geração de slugs | ✅ | Hooks beforeChange |

### FASE 4 — Primeiro Deploy ❌ POR FAZER

| Tarefa | Status | Notas |
|--------|--------|-------|
| Dockerfile produção | ⚠️ | Existe mas precisa revisão |
| Configurar Dokploy | ❌ | **PENDENTE** |
| Variáveis ambiente Dokploy | ❌ | **PENDENTE** |
| PostgreSQL no Dokploy | ❌ | **PENDENTE** |
| Testar deploy + migrações | ❌ | **PENDENTE** |
| Domínio + SSL | ❌ | **PENDENTE** |

### FASE 5 — Onboarding de Clientes ❌ POR FAZER

| Tarefa | Status | Notas |
|--------|--------|-------|
| Workflow novo tenant | ❌ | **PENDENTE** |
| Documentar ativação módulos | ❌ | **PENDENTE** |
| Dashboard por tenant | ❌ | **PENDENTE** |
| Templates de proposta padrão | ✅ | Collection existe |

---

## 3. Collections Implementadas

### Core (Sistema)
| Collection | Propósito | Tenant-scoped |
|------------|-----------|---------------|
| `tenants` | Entidades (Alinhadamente + clientes) | Não |
| `users` | Utilizadores com auth | Sim |
| `media` | Uploads centralizados | Sim |

### Conteúdo
| Collection | Propósito | Tenant-scoped |
|------------|-----------|---------------|
| `posts` | Artigos/blog | Sim |
| `pages` | Páginas estáticas | Sim |
| `categories` | Categorias de conteúdo | Sim |
| `site-config` | Configurações globais | Sim (global) |

### Portal de Propostas
| Collection | Propósito | Tenant-scoped |
|------------|-----------|---------------|
| `proposals` | Propostas interativas | Sim |
| `proposal-templates` | Templates reutilizáveis | Sim |
| `motores` | Serviços base reutilizáveis | Não (shared) |
| `addons` | Serviços adicionais | Não (shared) |
| `testimonials` | Testemunhos de clientes | Não (shared) |
| `team` | Membros da equipa | Não (shared) |
| `faqs` | Perguntas frequentes | Não (shared) |

### Estrutura Detalhada de Proposals
A collection mais complexa do sistema. Inclui:

- **Status**: draft → sent → viewed → accepted/rejected/expired
- **Cliente**: nome, email, empresa, telefone
- **Hero**: título, subtítulo, vídeo Loom
- **Diagnóstico**: problema, solução
- **Pricing**: múltiplos tiers com features, preços setup/mensal
- **Roadmap**: fases com tarefas (agência + cliente)
- **Social Proof**: testemunhos, equipa, FAQs
- **Custos Variáveis**: tracking de despesas
- **Tracking**: sentAt, viewedAt, respondedAt

---

## 4. Access Control

| Ficheiro | Propósito |
|----------|-----------|
| `isSuperAdmin.ts` | Acesso total ao sistema |
| `isAlinhadamenteTenant.ts` | Apenas tenant Alinhadamente |
| `isSuperAdminOrAlinhadamente.ts` | Combinação |
| `canManageProposals.ts` | tenantAdmin + tenantEditor |
| `canViewProposals.ts` | Todos os users autenticados |
| `readOnlyForTenants.ts` | Leitura para tenant members |

---

## 5. Hooks

| Hook | Propósito |
|------|-----------|
| `revalidateCloudflare.ts` | Trigger rebuild Cloudflare Pages após mudanças de conteúdo |

---

## 6. Globals

| Global | Propósito |
|--------|-----------|
| `SiteConfig` | Configurações por tenant: nome site, logo, social, contacto, SEO, navegação, analytics |

---

## 7. API Endpoints Custom

| Endpoint | Método | Propósito |
|----------|--------|-----------|
| `/api/health` | GET | Health check |
| `/api/track-welcome` | POST | Tracking onboarding |
| `/api/proposals/public/:slug/verify` | POST | Verificar acesso a proposta |
| `/api/proposals/public/:slug/accept` | POST | Cliente aceita |
| `/api/proposals/public/:slug/reject` | POST | Cliente rejeita |
| `/api/proposals/public/:slug/exists` | GET | Verificar existência |

---

## 8. Migrações

### Estado Atual
Existem migrações na pasta `src/migrations/`:
- `20260216_155029.ts` — Schema principal
- `20260218_160449.ts` — Alterações recentes (status fields)

### Fluxo de Migrações
```bash
# Após alterar collections:
pnpm payload migrate:create
pnpm payload migrate  # aplicar localmente
pnpm build            # verificar compilação
git add . && git commit -m "feat: descrição"
```

⚠️ **NUNCA** editar migrações já aplicadas em produção.

---

## 9. Repositórios Relacionados

| Repo | Propósito | Deploy |
|------|-----------|--------|
| `payload-multitenant` | Este backend (CMS) | Dokploy |
| `site-alinhadamente` | Frontend site principal | Cloudflare Pages |
| `portal-propostas-alinhadamente` | Frontend portal propostas | Cloudflare Pages |
| `site-cliente-X` | Frontend clientes | Cloudflare Pages |

---

## 10. Próximas Prioridades (Ordenadas)

### PRIORIDADE ALTA — Deploy Produção
1. **Configurar S3 Storage (Wasabi)**
   - Instalar/configurar `@payloadcms/storage-s3`
   - Configurar credenciais no `.env`
   - Testar uploads

2. **Rever Dockerfile**
   - Garantir multi-stage build
   - User não-root
   - Migrações no startup

3. **Configurar Dokploy**
   - Criar serviço PostgreSQL
   - Criar serviço Payload
   - Configurar variáveis de ambiente
   - Configurar auto-deploy GitHub

4. **Domínio + SSL**
   - `cms.alinhadamente.pt`
   - SSL automático via Dokploy/Traefik

### PRIORIDADE MÉDIA — Funcionalidades
5. **Implementar Tags Collection**
   - Collection simples: name, slug
   - Relacionar com Posts

6. **Testar fluxo completo de propostas**
   - Criar proposta via Admin UI
   - Aceder via endpoint público
   - Aceitar/rejeitar
   - Verificar tracking

7. **Integração com frontend do portal**
   - Coordenar com repo `portal-propostas-alinhadamente`
   - Validar transformação de dados

### PRIORIDADE BAIXA — Melhorias
8. **Workflow onboarding clientes**
   - Processo documentado
   - Script/automatização

9. **Dashboard por tenant**
   - Estatísticas básicas
   - Propostas por estado

10. **Documentação API**
    - OpenAPI/Swagger
    - Exemplos de uso

---

## 11. Issues Conhecidas

| Issue | Descrição | Solução |
|-------|-----------|---------|
| S3 não configurado | Uploads vão para filesystem local | Configurar @payloadcms/storage-s3 |
| Tags não implementado | Collection planeada mas não criada | Criar collection |
| Frontend desalinhado | Portal de propostas espera formato diferente | Ver `DYNAMIC_FIELDS_ANALYSIS.md` |

---

## 12. Variáveis de Ambiente Necessárias

```env
# Base de dados
DATABASE_URI=postgresql://user:password@host:5432/db

# Payload
PAYLOAD_SECRET=chave-secreta-32-chars-min
NEXT_PUBLIC_SITE_URL=https://cms.alinhadamente.pt

# S3 (Wasabi) — CONFIGURAR
S3_BUCKET=alinhadamente-uploads
S3_REGION=eu-central-2
S3_ENDPOINT=https://s3.eu-central-2.wasabisys.com
S3_ACCESS_KEY=xxx
S3_SECRET_KEY=xxx

# Cloudflare (hooks de rebuild)
CLOUDFLARE_API_TOKEN=xxx
CLOUDFLARE_ZONE_ID=xxx
CLOUDFLARE_DEPLOY_HOOK_ALINHADAMENTE=https://api.cloudflare.com/client/v4/pages/webhooks/xxx
```

---

## 13. Comandos Úteis

```bash
# Desenvolvimento
docker compose up -d          # Iniciar PostgreSQL
pnpm dev                      # Iniciar Payload
pnpm payload migrate:create   # Criar migração
pnpm payload migrate          # Aplicar migrações
pnpm build                    # Build produção

# Debugging
pnpm payload migrate:status   # Ver estado migrações
pnpm payload generate:types   # Regenerar tipos TypeScript
```

---

## 14. Contactos e Referências

- **Cliente**: Alinhadamente (ITaaS para PMEs portuguesas)
- **Stack Decision**: Payload CMS escolhido pela flexibilidade e multi-tenancy nativo
- **Deploy Target**: Hetzner Dedicated + Dokploy
- **CDN/Frontend**: Cloudflare Pages

---

## 15. Notas para o Project Manager

1. **O backend está muito avançado** — a maior parte do trabalho foi em Proposals, que é extremamente completo.

2. **O bloqueio atual é deploy** — não é possível testar em produção sem configurar Dokploy.

3. **Frontends são separados** — cada frontend tem o seu repo e deploy independente.

4. **Comunicação backend-frontend** — via API REST. CORS deve incluir todos os domínios dos frontends.

5. **Multi-tenancy funciona** — cada tenant vê apenas os seus dados (exceto superAdmin).

6. **Lições aprendidas** documentadas em `CLAUDE.md` — inclui debugging de incompatibilidades backend/frontend.

---

*Fim do documento de contexto.*
