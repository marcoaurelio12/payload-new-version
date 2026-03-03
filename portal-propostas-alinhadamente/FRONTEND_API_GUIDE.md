# Frontend API Guide — Payload CMS

> Este guia é para o AI agent responsável pelo frontend conectar ao Payload CMS.

---

## 🔗 Conexão

| Ambiente | URL |
|----------|-----|
| **Dev Local** | `http://localhost:3000` |
| **Produção** | `https://cms.alinhadamente.pt` (a configurar) |

### Variáveis de Ambiente (Vite)

```env
VITE_PAYLOAD_URL=http://localhost:3000
```

---

## 📚 Collections Disponíveis

### Core (Conteúdo)

| Collection | Slug | Descrição |
|------------|------|-----------|
| Users | `users` | Utilizadores com autenticação |
| Tenants | `tenants` | Empresas/clientes (multi-tenant) |
| Media | `media` | Uploads (imagens, ficheiros) |
| Pages | `pages` | Páginas do site |
| Posts | `posts` | Artigos/blog |
| Categories | `categories` | Categorias para posts |
| SiteConfig | `site-config` | Configurações do site (por tenant) |

### Propostas

| Collection | Slug | Descrição |
|------------|------|-----------|
| Proposals | `proposals` | Propostas interativas |
| ProposalTemplates | `proposal-templates` | Templates reutilizáveis |
| Motores | `motores` | Motores/serviços disponíveis |
| Addons | `addons` | Serviços adicionais |
| Testimonials | `testimonials` | Depoimentos de clientes |
| Team | `team` | Membros da equipa |
| FAQs | `faqs` | Perguntas frequentes |

---

## 🔌 API Endpoints

### Formato Base

```
GET    /api/{collection}           — Listar
GET    /api/{collection}/{id}      — Obter por ID
POST   /api/{collection}           — Criar
PATCH  /api/{collection}/{id}      — Atualizar
DELETE /api/{collection}/{id}      — Apagar
```

### Query Parameters

| Parâmetro | Exemplo | Descrição |
|-----------|---------|-----------|
| `where` | `where[slug][equals]=home` | Filtrar resultados |
| `sort` | `sort=-createdAt` | Ordenar (− = descendente) |
| `limit` | `limit=10` | Limitar resultados |
| `page` | `page=1` | Paginação |
| `depth` | `depth=0` | Profundidade de relacionamentos |

---

## 📝 Exemplos de Fetch

### Buscar SiteConfig (configurações do site)

```typescript
const payloadUrl = import.meta.env.VITE_PAYLOAD_URL

async function getSiteConfig(tenantSlug: string) {
  const response = await fetch(
    `${payloadUrl}/api/site-config?where[tenant][slug][equals]=${tenantSlug}`
  )
  const data = await response.json()
  return data.docs[0]
}
```

### Buscar Posts (blog)

```typescript
async function getPosts(tenantId: number, limit = 10) {
  const response = await fetch(
    `${payloadUrl}/api/posts?where[tenant][equals]=${tenantId}&sort=-publishedAt&limit=${limit}`
  )
  return await response.json()
}
```

### Buscar Página por Slug

```typescript
async function getPageBySlug(slug: string, tenantId: number) {
  const response = await fetch(
    `${payloadUrl}/api/pages?where[slug][equals]=${slug}&where[tenant][equals]=${tenantId}`
  )
  const data = await response.json()
  return data.docs[0]
}
```

### Buscar Proposta por Slug (pública)

```typescript
async function getProposalBySlug(slug: string) {
  const response = await fetch(
    `${payloadUrl}/api/proposals?where[slug][equals]=${slug}&depth=2`
  )
  const data = await response.json()
  return data.docs[0]
}
```

### Buscar Motores Ativos

```typescript
async function getActiveMotores() {
  const response = await fetch(
    `${payloadUrl}/api/motores?where[active][equals]=true&sort=order`
  )
  return await response.json()
}
```

### Buscar Addons Populares

```typescript
async function getPopularAddons() {
  const response = await fetch(
    `${payloadUrl}/api/addons?where[active][equals]=true&where[popular][equals]=true&sort=order`
  )
  return await response.json()
}
```

---

## 📦 Estrutura de Dados (Principais Types)

### Tenant

```typescript
interface Tenant {
  id: number
  name: string          // "Alinhadamente"
  slug: string          // "alinhadamente"
  domain?: string       // "alinhadamente.pt"
  logo?: Media
  active?: boolean
}
```

### SiteConfig

```typescript
interface SiteConfig {
  id: number
  tenant?: Tenant
  siteName: string
  siteDescription?: string
  logo?: Media
  favicon?: Media
  social?: {
    twitter?: string
    facebook?: string
    instagram?: string
    linkedin?: string
  }
  contact?: {
    email?: string
    phone?: string
    address?: string
  }
  header?: {
    navigation?: { label: string; url: string; openInNewTab?: boolean }[]
  }
  footer?: {
    copyright?: string
    navigation?: { label: string; url: string }[]
  }
}
```

### Proposal

```typescript
interface Proposal {
  id: number
  tenant?: Tenant
  title: string
  slug: string
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired'
  versionType?: 'express' | 'complete' | 'both'
  client: {
    name: string
    email: string
    company?: string
    phone?: string
  }
  hero: {
    title: string
    description?: string
    loomUrl?: string
  }
  diagnostic?: {
    problem?: string
    solution?: string
  }
  motoresIncluidos?: Motore[]
  addonsDisponiveis?: Addon[]
  pricing: {
    setupPrice: number
    monthlyBase: number
    setupLabel?: string
    tiers?: {
      name: string
      setupPrice: number
      monthlyPrice: number
      features?: { feature: string }[]
      recommended?: boolean
    }[]
  }
  roadmapPhases?: {
    phase: number
    title: string
    duration: string
    agencyTasks?: { task: string }[]
    clientTasks?: { task: string }[]
  }[]
  testimonials?: Testimonial[]
  team?: Team[]
  faqs?: Faq[]
  publicToken?: string
}
```

### Motore (Motor/Service)

```typescript
interface Motore {
  id: number
  title: string
  slug: string
  description: string
  icon: 'Document' | 'Microphone' | 'UserGroup' | 'Scale' | 'Briefcase' | 'Chart' | 'Cog' | 'Globe'
  features: { featureText: string }[]
  active?: boolean
  order?: number
}
```

### Addon

```typescript
interface Addon {
  id: number
  name: string
  slug: string
  description: string
  setupPrice: number
  monthlyPrice: number
  hoursSaved?: number
  retentionBoost?: number
  category?: 'automation' | 'seo' | 'content' | 'integration' | 'support' | 'other'
  active?: boolean
  popular?: boolean
  order?: number
}
```

---

## 🔐 Autenticação (Futuro)

Para endpoints protegidos, usar API Key no header:

```typescript
fetch(`${payloadUrl}/api/posts`, {
  headers: {
    'Authorization': `users API-Key ${apiKey}`
  }
})
```

---

## 📁 Ficheiro de Tipos Completo

O ficheiro `src/payload-types.ts` contém todos os tipos TypeScript gerados automaticamente. Pode ser copiado para o frontend ou importado se partilharem o monorepo.

---

## ✅ Checklist para o Frontend

- [ ] Configurar `VITE_PAYLOAD_URL` nas variáveis de ambiente
- [ ] Testar conexão com `GET /api/tenants`
- [ ] Implementar fetch de `site-config` para configurações globais
- [ ] Implementar fetch de `pages` e `posts` para conteúdo
- [ ] Implementar visualização de `proposals` (portal de propostas)

---

## 🆘 Suporte

Se tiveres dúvidas sobre a estrutura de dados, consulta:
- `src/payload-types.ts` — Tipos TypeScript completos
- `src/collections/` — Definições das collections
- `CLAUDE.md` — Documentação geral do projeto
