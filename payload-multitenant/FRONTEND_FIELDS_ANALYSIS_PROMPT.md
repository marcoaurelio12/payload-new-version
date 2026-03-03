# Prompt para AI Agent do Frontend — Análise de Campos Dinâmicos

---

## 🎯 Objetivo

Analisa a codebase do frontend do **Portal de Propostas** e identifica todos os campos que precisam de ser dinâmicos (vindos do Payload CMS) em vez de hardcoded.

---

## 📋 Tarefa

### 1. Analisa os componentes do frontend

Percorre os componentes/pages do portal de propostas e identifica:

- Textos fixos que deveriam ser dinâmicos
- Valores hardcoded (preços, nomes, descrições)
- Listas estáticas que deveriam vir da API
- Imagens/URLs que deveriam ser configuráveis

### 2. Para cada campo identificado, preenche:

| Campo no Frontend | Ficheiro/Componente | Valor Atual (hardcoded) | Campo no Payload |
|-------------------|---------------------|-------------------------|------------------|
| (ex: Título Hero) | (ex: Hero.tsx:12)   | (ex: "A Nova Era Digital") | (ex: proposal.hero.title) |

### 3. Estrutura do Payload disponível

A proposal no Payload tem esta estrutura (resumo):

```typescript
interface Proposal {
  id: number
  title: string                    // Título interno
  slug: string                     // URL slug
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired'

  client: {
    name: string                   // Nome do cliente
    email: string
    company?: string
    phone?: string
  }

  hero: {
    title: string                  // Título principal da proposta
    description?: string           // Subtítulo
    loomUrl?: string               // URL do vídeo Loom
  }

  diagnostic?: {
    problem?: string               // Descrição do problema
    solution?: string              // Solução proposta
  }

  motoresIncluidos?: Motore[]      // Motores incluídos
  addonsDisponiveis?: Addon[]      // Addons disponíveis

  pricing: {
    setupPrice: number             // Preço de setup
    monthlyBase: number            // Preço mensal base
    setupLabel?: string
    tiers?: {                      // Planos alternativos
      name: string
      setupPrice: number
      monthlyPrice: number
      features?: { feature: string }[]
      recommended?: boolean
    }[]
  }

  roadmapPhases?: {                // Fases do projeto
    phase: number
    title: string
    duration: string
    agencyTasks?: { task: string }[]
    clientTasks?: { task: string }[]
  }[]

  testimonials?: Testimonial[]     // Depoimentos
  team?: Team[]                    // Equipa
  faqs?: Faq[]                     // FAQs

  publicToken?: string             // Token de acesso público
}
```

### 4. Estruturas relacionadas

```typescript
interface Motore {
  title: string
  slug: string
  description: string
  icon: 'Document' | 'Microphone' | 'UserGroup' | 'Scale' | 'Briefcase' | 'Chart' | 'Cog' | 'Globe'
  features: { featureText: string }[]
}

interface Addon {
  name: string
  slug: string
  description: string
  setupPrice: number
  monthlyPrice: number
  hoursSaved?: number
  retentionBoost?: number
  category?: 'automation' | 'seo' | 'content' | 'integration' | 'support' | 'other'
  popular?: boolean
}

interface Testimonial {
  clientName: string
  role: string
  company: string
  quote: string
  logo?: Media
  photo?: Media
  niche?: 'advocacia' | 'retalho' | 'tecnologia' | 'saude' | 'geral'
  featured?: boolean
}

interface Team {
  name: string
  role: string
  bio: string
  photo: Media
  email?: string
  linkedin?: string
}

interface Faq {
  question: string
  answer: RichText
  category: 'direitos' | 'deveres' | 'suporte' | 'tecnico' | 'financeiro' | 'general'
}
```

---

## 📤 Output Esperado

Devolve uma tabela com todos os campos identificados:

```markdown
## Campos do Hero
| Campo Frontend | Localização | Valor Hardcoded | Campo Payload |
|----------------|-------------|-----------------|---------------|
| Título principal | Hero.tsx:15 | "A Nova Era Digital" | proposal.hero.title |
| Subtítulo | Hero.tsx:18 | "Transformação digital..." | proposal.hero.description |
| Video URL | Hero.tsx:25 | "https://loom.com/..." | proposal.hero.loomUrl |

## Dados do Cliente
| Campo Frontend | Localização | Valor Hardcoded | Campo Payload |
|----------------|-------------|-----------------|---------------|
| Nome | Header.tsx:10 | "Cliente" | proposal.client.name |
| Empresa | Header.tsx:12 | "Empresa" | proposal.client.company |

## Pricing
| Campo Frontend | Localização | Valor Hardcoded | Campo Payload |
|----------------|-------------|-----------------|---------------|
| Setup Price | Pricing.tsx:20 | "€500" | proposal.pricing.setupPrice |
| Monthly Base | Pricing.tsx:22 | "€100/mês" | proposal.pricing.monthlyBase |

## Motores
| Campo Frontend | Localização | Valor Hardcoded | Campo Payload |
|----------------|-------------|-----------------|---------------|
| Lista de motores | Motores.tsx | Array hardcoded | proposal.motoresIncluidos |
| (cada motor) | Motores.tsx:45 | "Motor de Artigos" | motor.title |
| (features) | Motores.tsx:50 | Lista fixa | motor.features[] |

## Addons
| Campo Frontend | Localização | Valor Hardcoded | Campo Payload |
|----------------|-------------|-----------------|---------------|
| Lista de addons | Addons.tsx | Array hardcoded | proposal.addonsDisponiveis |

## Testimonials
| Campo Frontend | Localização | Valor Hardcoded | Campo Payload |
|----------------|-------------|-----------------|---------------|
| Depoimentos | Testimonials.tsx | 3 hardcoded | proposal.testimonials |

## Team
| Campo Frontend | Localização | Valor Hardcoded | Campo Payload |
|----------------|-------------|-----------------|---------------|
| Equipa | Team.tsx | Array hardcoded | proposal.team |

## FAQs
| Campo Frontend | Localização | Valor Hardcoded | Campo Payload |
|----------------|-------------|-----------------|---------------|
| Perguntas | FAQ.tsx | Lista fixa | proposal.faqs |
```

---

## ❓ Campos em Falta no Payload

Se encontrares campos no frontend que **não existem** no Payload, lista-os separadamente:

```markdown
## Campos que precisam de ser criados no Payload

| Campo | Onde é usado | Descrição | Tipo sugerido |
|-------|--------------|-----------|---------------|
| corPrimaria | Header.tsx, Button.tsx | Cor principal do portal | color |
| logoUrl | Header.tsx | Logo da proposta | upload |
| textoCTA | CTA.tsx | Texto do botão de aceitar | text |
```

---

## 🔗 Ficheiros de Referência

- Tipos completos: `src/payload-types.ts` (no backend)
- Guia da API: `FRONTEND_API_GUIDE.md` (no backend)

---

## ✅ Quando terminares

Envia a análise completa para que possamos:

1. Confirmar que todos os campos existem no Payload
2. Identificar campos em falta que precisam de ser criados
3. Criar o mapeamento final para implementação
