# Prompt para AI Agent do Frontend

## Contexto

O frontend (Vite/React a correr em `localhost:3005`) precisa de conectar ao backend Payload CMS (a correr em `localhost:3000`) para obter dados das propostas e outros conteúdos.

## Configuração Base

### 1. Variável de ambiente

Adiciona ao `.env` ou `.env.local` do frontend:

```env
VITE_API_URL=http://localhost:3000
```

### 2. Configuração de CORS

O backend já está configurado para aceitar requests de `localhost:3005`. Se mudares a porta, precisas atualizar o CORS no `payload.config.ts` do backend.

## API Endpoints Disponíveis

### Propostas Públicas (sem autenticação)

```
GET /api/proposals/public/:slug
```

Obtém uma proposta pelo slug. Atualiza automaticamente o status de "sent" para "viewed" na primeira visualização.

**Exemplo:**
```typescript
const response = await fetch('http://localhost:3000/api/proposals/public/marquesevieira')
const proposal = await response.json()
```

**Response:**
```json
{
  "id": 1,
  "tenant": {
    "id": 1,
    "name": "Alinhadamente - Propostas",
    "slug": "propostas"
  },
  "title": "Marques e Vieira - Sociedade de Advogados",
  "slug": "marquesevieira",
  "status": "viewed",
  "client": {
    "name": "Cliente Exemplo",
    "email": "cliente@email.com"
  },
  "content": { /* Lexical rich text */ },
  "pricing": {
    "items": [...],
    "discount": 0
  },
  "createdAt": "2026-02-15T...",
  "updatedAt": "2026-02-15T..."
}
```

### Proposta por Token (sem autenticação)

```
GET /api/proposals/public/token/:token
```

Obtém uma proposta por token único (útil para links de partilha).

## Estrutura de Dados

### Proposal

```typescript
interface Proposal {
  id: number
  tenant: {
    id: number
    name: string
    slug: string
  }
  title: string
  slug: string
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired'
  client: {
    name: string
    email: string
    company?: string
    phone?: string
  }
  validUntil?: string // ISO date
  content?: any // Lexical rich text structure
  pricing?: {
    items: Array<{
      id: string
      name: string
      description?: string
      price: number
      frequency: 'once' | 'monthly' | 'yearly'
      optional: boolean
      selected: boolean
    }>
    discount?: number
    notes?: any
  }
  sentAt?: string
  viewedAt?: string
  respondedAt?: string
  createdAt: string
  updatedAt: string
}
```

### Tenant

```typescript
interface Tenant {
  id: number
  name: string
  slug: string
  domain?: string
  plan?: 'starter' | 'professional' | 'enterprise'
  active: boolean
  settings?: {
    logo?: Media
    primaryColor?: string
    companyEmail?: string
    companyPhone?: string
  }
}
```

## Implementação Recomendada

### 1. Criar serviço de API

```typescript
// src/services/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function fetchProposalBySlug(slug: string) {
  const response = await fetch(`${API_URL}/api/proposals/public/${slug}`)

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Proposta não encontrada')
    }
    throw new Error('Erro ao carregar proposta')
  }

  return response.json()
}

export async function fetchProposalByToken(token: string) {
  const response = await fetch(`${API_URL}/api/proposals/public/token/${token}`)

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Proposta não encontrada')
    }
    throw new Error('Erro ao carregar proposta')
  }

  return response.json()
}
```

### 2. Hook React Query (opcional mas recomendado)

```typescript
// src/hooks/useProposal.ts
import { useQuery } from '@tanstack/react-query'
import { fetchProposalBySlug } from '../services/api'

export function useProposal(slug: string) {
  return useQuery({
    queryKey: ['proposal', slug],
    queryFn: () => fetchProposalBySlug(slug),
    enabled: !!slug,
  })
}
```

### 3. Página de proposta

```typescript
// src/pages/ProposalPage.tsx
import { useParams } from 'react-router-dom'
import { useProposal } from '../hooks/useProposal'

export function ProposalPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: proposal, isLoading, error } = useProposal(slug!)

  if (isLoading) return <div>A carregar...</div>
  if (error) return <div>Erro: {error.message}</div>
  if (!proposal) return <div>Proposta não encontrada</div>

  return (
    <div>
      <h1>{proposal.title}</h1>
      <p>Cliente: {proposal.client.name}</p>
      <p>Status: {proposal.status}</p>

      {/* Renderizar conteúdo e pricing */}
    </div>
  )
}
```

## Roteamento

Se usares React Router, a rota seria:

```typescript
<Route path="/:slug" element={<ProposalPage />} />
// ou
<Route path="/o/:slug" element={<ProposalPage />} />  // /o_select, etc.
```

## Notas Importantes

1. **Sem autenticação necessária** para os endpoints públicos `/api/proposals/public/*`
2. **Status automático**: quando uma proposta é visualizada, o status muda de "sent" para "viewed" automaticamente
3. **CORS já configurado** no backend para `localhost:3005`
4. **Em produção**: a URL da API será `https://cms.alinhadamente.pt`

## Próximos Passos

1. Implementar UI para visualizar a proposta
2. Renderizar o conteúdo Lexical rich text (podes usar `@payloadcms/richtext-lexical` ou um renderer customizado)
3. Implementar calculadora de preços interativa baseada em `pricing.tiers`
4. Adicionar funcionalidade de aceitar/rejeitar proposta
5. Tracking de analytics (tempo na página, scrolls, etc.)

---

## Endpoints para Aceitar/Rejeitar Propostas

### Aceitar Proposta

```
POST /api/proposals/public/:slug/accept
```

**Response:**
```json
{
  "success": true,
  "proposal": { /* proposta atualizada */ }
}
```

**Erros possíveis:**
- `400` - Proposta não pode ser aceita (status atual não permite)
- `404` - Proposta não encontrada
- `500` - Erro interno

### Rejeitar Proposta

```
POST /api/proposals/public/:slug/reject
```

**Response:**
```json
{
  "success": true,
  "proposal": { /* proposta atualizada */ }
}
```

**Erros possíveis:**
- `400` - Proposta não pode ser rejeitada (status atual não permite)
- `404` - Proposta não encontrada
- `500` - Erro interno

**Nota:** Apenas propostas com status `sent` ou `viewed` podem ser aceitas ou rejeitadas.
