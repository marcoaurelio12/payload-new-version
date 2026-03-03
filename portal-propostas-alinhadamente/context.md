# Contexto do Projeto - Portal de Propostas Alinhadamente

> **Última atualização:** 2026-02-18
> **Estado atual:** Em desenvolvimento ativo
> **Branch:** main

---

## 1. Visão Geral do Projeto

### O que é
Portal de Propostas Interativo da **Alinhadamente** - uma plataforma onde pequenas e médias empresas (PMEs) em Portugal podem visualizar propostas personalizadas para serviços digitais/IT.

### Propósito de Negócio
A Alinhadamente posiciona-se como um **departamento digital/IT externo** para PMEs, oferecendo:
- Desenvolvimento de websites
- Automações
- Suporte digital contínuo

Cada proposta é personalizada por cliente e apresenta:
- Escopo do trabalho e entregáveis
- Níveis de preço e opções extra (add-ons)
- Roadmap do projeto com responsabilidades mútuas
- Equipa e prova social

### Modos de Apresentação
O portal tem **dois modos de apresentação**:
1. **Complete** - Experiência completa multi-seção com diagnóstico, roadmap, equipa, FAQ, etc.
2. **Express** - Versão condensada de página única para decisão rápida

---

## 2. Stack Tecnológica

### Frontend (Este Projeto)
| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| React | 19.0.0 | Framework UI |
| TypeScript | 5.8.2 | Tipagem estática |
| Vite | 6.2.0 | Build tool / Dev server |
| Framer Motion | 12.34.2 | Animações |
| Heroicons | 2.2.0 | Ícones |
| Tailwind CSS | 4.1.18 | Styling |
| canvas-confetti | 1.9.4 | Efeito de confetti na confirmação |

### Backend (Projeto Externo)
- **Payload CMS** localizado em `../payload-multitenant/`
- Corre na porta 3000 por defeito
- API REST para propostas

### Deployment
- Configurado para **Cloudflare Pages/Workers**
- Ficheiro de configuração: `wrangler.jsonc`
- Problemas recentes resolvidos com Framer Motion para Cloudflare

---

## 3. Estrutura do Projeto

```
portal-propostas-alinhadamente/
├── App.tsx                    # Componente principal (versão completa)
├── AppTailwind.tsx            # Versão alternativa com Tailwind integrado
├── types.ts                   # Interfaces TypeScript
├── constants.tsx              # Constantes e configurações
├── main.tsx                   # Entry point
├── index.html                 # HTML base
├── vite.config.ts             # Configuração Vite
├── tsconfig.json              # Configuração TypeScript
├── package.json               # Dependências
├── metadata.json              # Metadados do projeto
│
├── components/                # Componentes React
│   ├── Header.tsx             # Navegação principal
│   ├── Hero.tsx               # Secção hero
│   ├── TrustBar.tsx           # Barra de confiança
│   ├── DiagnosticSection.tsx  # Diagnóstico problema/solução
│   ├── Roadmap.tsx            # Fases do projeto
│   ├── CmsMotors.tsx          # Motores CMS
│   ├── Calculator.tsx         # Calculadora de investimento
│   ├── PricingTiers.tsx       # Seleção de tiers
│   ├── VariableCostsAccordion.tsx  # Custos variáveis
│   ├── FAQSection.tsx         # FAQs
│   ├── TeamSection.tsx        # Equipa
│   ├── TestimonialsSection.tsx # Testemunhos
│   ├── ROISection.tsx         # ROI
│   ├── TrustSection.tsx       # Secção de confiança
│   ├── ChatWidget.tsx         # Widget de chat flutuante
│   ├── Token.tsx              # Conteúdo tokenizado
│   ├── ExitIntent.tsx         # Detecção de saída
│   ├── VersionSelectionModal.tsx  # Modal de seleção de versão
│   ├── ProposalExpress.tsx    # Wrapper versão Express
│   └── express/               # Componentes Express
│       ├── HeaderExpress.tsx
│       ├── HeroExpress.tsx
│       ├── TrustBarExpress.tsx
│       ├── DiagnosticSwiper.tsx
│       ├── IncludedAccordion.tsx
│       ├── PricingExpress.tsx
│       ├── CTAFinal.tsx
│       └── StickyBottomBar.tsx
│
├── hooks/
│   └── useProposal.ts         # Hook para buscar propostas
│
├── services/
│   └── api.ts                 # Cliente API e transformador de dados
│
└── .agents/                   # Skills de AI
    └── skills/
        ├── vercel-composition-patterns/
        └── vercel-react-best-practices/
```

---

## 4. Integração com Backend (Payload CMS)

### Endpoints da API

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/proposals/public/:slug` | GET | Buscar proposta por slug |
| `/api/proposals/public/token/:token` | GET | Buscar proposta por token |
| `/api/proposals/public/:slug/exists` | GET | Verificar se proposta existe |
| `/api/proposals/public/:slug/verify` | POST | Verificar código de acesso |
| `/api/proposals/public/:slug/accept` | POST | Aceitar proposta |
| `/api/proposals/public/:slug/reject` | POST | Rejeitar proposta |

### Camada de Transformação de Dados

**CRÍTICO**: O backend (Payload CMS) e o frontend usam estruturas de dados diferentes. O transformador em `services/api.ts` trata esta conversão.

#### Convenção de Nomes de Campos

| Backend (Payload) | Frontend |
|-------------------|----------|
| `setupPrice` | `setup_price` |
| `monthlyPrice` | `monthly_price` |
| `hoursSaved` | `hours_saved` |
| `retentionBoost` | `retention_boost` |

#### Estruturas de Arrays Aninhados

Payload CMS armazena items de array como objetos. O transformador faz flatten:

```typescript
// Backend envia:
features: [{ feature: "Text" }, { feature: "Text 2" }]

// Frontend espera:
features: ["Text", "Text 2"]
```

Isto aplica-se a:
- `pricing.tiers[].features` → `[{ feature: string }]` → `string[]`
- `roadmapPhases[].agencyTasks` → `[{ task: string }]` → `string[]`
- `roadmapPhases[].clientTasks` → `[{ task: string }]` → `string[]`
- `includedItems[].features` → `[{ featureText: string }]` → `string[]`

---

## 5. Estrutura de Dados (Types)

### Proposta Principal (`Proposal`)
```typescript
interface Proposal {
  id: string;
  slug: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';
  version_type: 'express' | 'complete' | 'both';
  public_token: string;

  client: ClientData;
  hero: ProposalHero;
  diagnostic?: ProposalDiagnostic;

  motores_incluidos?: CmsMotor[];
  addons_disponiveis?: AddOn[];

  pricing: ProposalPricing;
  roadmap_phases?: RoadmapPhase[];
  testimonials?: Testimonial[];
  team?: TeamMember[];
  faqs?: Faq[];

  included_items?: IncludedItem[];
  variable_costs?: VariableCost[];

  valid_until?: string;
}
```

### Pricing (`ProposalPricing`)
```typescript
interface ProposalPricing {
  setupPrice: number;     // Fallback/Base se não usar tiers
  monthlyBase: number;    // Fallback/Base se não usar tiers
  tiers?: PricingTier[];
}

interface PricingTier {
  id: string;
  name: string;
  setup_price: number;
  monthly_price: number;
  features: string[];
  recommended?: boolean;
}
```

### Add-ons (`AddOn`)
```typescript
interface AddOn {
  id: string;
  slug: string;
  name: string;
  setup_price: number;
  monthly_price: number;
  description?: string;
  hours_saved?: number;
  retention_boost?: number;
  detailed_solution?: string;
  roi_impact?: string;
  third_party_costs?: string;
}
```

---

## 6. URLs e Routing

### Estrutura de URL para Propostas
A app deteta slugs de padrões de URL:
- `/:slug` - Slug ao nível da raiz
- `/o/:slug` - Com prefixo /o/
- `/proposal/:slug` - Com prefixo /proposal/
- `/p/:slug` - Rota protegida (requer autenticação)

### Hook de Deteção de Slug
```typescript
// hooks/useProposal.ts
export const useProposalSlugFromUrl = (): string | null
export const useIsProtectedRoute = (): boolean
```

---

## 7. Estado da Aplicação

### Gestão de Estado
- **Sem biblioteca externa** - usa React useState/useEffect
- Tier selecionado e add-ons geridos no `App.tsx`, passados para Calculator/PricingTiers
- Tracking de viewer via localStorage (`viewer_id`, `proposal_view_preference`)

### Persistência Local
- Tema (light/dark) persistido em localStorage
- Preferência de versão de proposta em localStorage

---

## 8. Funcionalidades Implementadas

### Versão Complete
- [x] Hero com vídeo Loom
- [x] Trust bar com badges
- [x] Diagnóstico problema/solução
- [x] Roadmap com fases e responsabilidades
- [x] Motores CMS com expansão de features
- [x] Calculadora de investimento com tiers
- [x] Add-ons com ROI
- [x] Custos variáveis
- [x] FAQs em accordion
- [x] Adjudicação com confetti
- [x] Dark mode
- [x] Progress bar de scroll
- [x] Footer com equipa

### Versão Express
- [x] Hero condensado
- [x] Trust bar
- [x] Diagnostic swiper
- [x] Accordion de items incluídos
- [x] Pricing simplificado
- [x] CTA final
- [x] Sticky bottom bar

### Sistema de Autenticação
- [x] Verificação de proposta existe
- [x] Sistema de código de acesso (accessPass)
- [x] Rotas protegidas (/p/:slug)

---

## 9. Ambiente de Desenvolvimento

### Variáveis de Ambiente (.env.local)
```env
# API Configuration - Backend Payload CMS
VITE_API_URL=http://localhost:3000

# Default proposal slug to load (optional)
VITE_DEFAULT_SLUG=marquesevieira

# Use mock data instead of API (true/false)
VITE_USE_MOCK=false

# Other keys
GEMINI_API_KEY=your_api_key_here
```

### Comandos
```bash
# Instalar dependências
npm install

# Iniciar dev server (porta 3005)
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

### Running Both Projects
```bash
# Terminal 1: Backend (Payload CMS)
cd ../payload-multitenant
pnpm dev

# Terminal 2: Frontend (este projeto)
npm run dev
```

---

## 10. Histórico Git Recente

```
36edaf9 Update AppTailwind.tsx
f016a44 Update wrangler.jsonc
0e7239c Update wrangler.jsonc
1b7de38 Cloudflare deployment issues
eb8e7aa Create wrangler.jsonc
ce43aa0 Framer motion resolvido para cloudflare
4e7679c CDN para CLI
61ff880 Adjudicar para confirmar
3730eb4 API e Claude.md
0ae78b2 Algumas alterações
67094ad Agents
4d3a808 feat: Refactor data types and constants for proposal structure
cf0d0b1 feat: Initialize Alinhadamente proposal portal project
f046ddd Initial commit
```

---

## 11. Problemas Conhecidos & Soluções

### Página em Branco
Geralmente significa erro de JavaScript num componente. Verificar:
1. Console do browser para erros
2. Mismatches de estrutura de dados (especialmente `.map()` em non-arrays)
3. Null checks em falta em campos opcionais

### Dev vs Production Data
- Em modo dev (`import.meta.env.DEV`), falhas de API fazem fallback para mock data
- Em produção, falhas de API mostram mensagem de erro
- Usar `VITE_USE_MOCK=true` para forçar uso de mock data

### Cloudflare Deployment
- Problemas com Framer Motion resolvidos recentemente
- Ver `wrangler.jsonc` para configuração

---

## 12. Mock Data

O ficheiro `hooks/useProposal.ts` contém `MOCK_PROPOSAL` com dados de exemplo que são usados quando:
- Não há slug na URL
- `VITE_USE_MOCK=true`
- API falha em desenvolvimento

---

## 13. Próximos Passos / TODO

> **Nota para o Project Manager:** Esta secção deve ser atualizada pelo agente planeador com as próximas tarefas identificadas.

### Prioridades Pendentes (a definir)
- [ ] Onboarding flow completo
- [ ] Testes automatizados
- [ ] Analytics/tracking de secções (hook parcialmente implementado)
- [ ] Sistema de notificações
- [ ] PWA support
- [ ] Internacionalização (i18n)
- [ ] Melhorias de acessibilidade
- [ ] Performance optimization (lazy loading, code splitting)

### Bugs Conhecidos (a documentar)
- ...

### Melhorias Propostas
- ...

---

## 14. Contactos & Recursos

- **Website:** alinhadamente.com
- **Email:** ola@alinhadamente.com
- **Backend Repo:** `../payload-multitenant/`
- **Primary Color:** `#40CE2A` (verde Alinhadamente)

---

## 15. Notas para o Agente Planeador

Como Project Manager AI, deve:

1. **Ler este ficheiro primeiro** em cada sessão para contexto
2. **Atualizar a secção 13** com tarefas identificadas
3. **Consultar CLAUDE.md** para guidelines de desenvolvimento
4. **Verificar git status** antes de grandes mudanças
5. **Coordenar com o backend** quando mudanças afetam a API

### Fluxo de Trabalho Sugerido
1. Review do estado atual (git status, issues abertos)
2. Identificar prioridades com o utilizador
3. Criar plano de tarefas detalhado
4. Delegar implementação a agentes de desenvolvimento
5. Review e QA
6. Commit e deploy

---

*Este documento é vivo e deve ser atualizado à medida que o projeto evolui.*
