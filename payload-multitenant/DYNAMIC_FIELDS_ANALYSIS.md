# Análise de Campos Dinâmicos — Portal de Propostas

> **Objetivo:** Identificar todos os campos do frontend que devem ser dinâmicos (vindos do Payload CMS) vs. hardcoded, e mapeá-los às estruturas de dados existentes ou propostas.

**Data:** 2026-02-15 (Atualizado)
**Projeto:** Alinhadamente - Portal de Propostas

---

## Índice

1. [Campos do Hero](#campos-do-hero)
2. [Dados do Cliente](#dados-do-cliente)
3. [Diagnóstico](#diagnóstico)
4. [Pricing Tiers](#pricing-tiers)
5. [Motores CMS](#motores-cms)
6. [Addons](#addons)
7. [Roadmap](#roadmap)
8. [Testimonials](#testimonials)
9. [Team](#team)
10. [FAQs](#faqs)
11. [Included Items (Express)](#included-items-express)
12. [Variable Costs](#variable-costs)
13. [ROI Section](#roi-section)
14. [Trust Bar](#trust-bar)
15. [Header](#header)
16. [Chat Widget](#chat-widget)
17. [Adjudication](#adjudication)
18. [CTA Final (Express)](#cta-final-express)
19. [Sticky Bottom Bar (Express)](#sticky-bottom-bar-express)
20. [Secção Títulos](#secção-títulos)
21. [Footer](#footer)
22. [Outros Textos UI Hardcoded](#outros-textos-ui-hardcoded)
23. [Campos em Falta no Payload](#campos-em-falta-no-payload)
24. [Resumo e Recomendações](#resumo-e-recomendações)

---

## Campos do Hero

| Campo Frontend | Localização | Valor Hardcoded | Campo Payload | Status |
|----------------|-------------|-----------------|---------------|--------|
| Título principal | `Hero.tsx:19` | `proposal.hero.title` | `proposal.hero.title` | ✅ Existe |
| Subtítulo/Descrição | `Hero.tsx:22` | `proposal.hero.description` | `proposal.hero.description` | ✅ Existe |
| URL do vídeo Loom | `Hero.tsx:37` | `proposal.hero.loomUrl` | `proposal.hero.loomUrl` | ✅ Existe |
| Imagem de fundo do vídeo | `Hero.tsx:47` | `proposal.hero.thumbnailImage` (com fallback) | `proposal.hero.thumbnailImage` | ✅ Existe |
| Label "Ver Apresentação" | `Hero.tsx:64` | `"Ver Apresentação"` | — | ⚠️ Hardcoded (pode manter) |
| Botão "Explorar Solução" | `Hero.tsx:31` | `"Explorar Solução"` | — | ⚠️ Hardcoded (pode manter) |

### Versão Express (HeroExpress.tsx)

| Campo Frontend | Localização | Valor Hardcoded | Campo Payload | Status |
|----------------|-------------|-----------------|---------------|--------|
| Título | `HeroExpress.tsx:34` | `proposal.hero.title` | `proposal.hero.title` | ✅ Existe |
| Descrição | `HeroExpress.tsx:61` | `proposal.hero.description` | `proposal.hero.description` | ✅ Existe |
| URL do vídeo | `HeroExpress.tsx:37` | `proposal.hero.loomUrl` | `proposal.hero.loomUrl` | ✅ Existe |
| Thumbnail | `HeroExpress.tsx:40` | `proposal.hero.thumbnailImage` | `proposal.hero.thumbnailImage` | ✅ Existe |
| Label "Ver Vídeo" | `HeroExpress.tsx:55` | `"Ver Vídeo"` | — | ⚠️ Hardcoded |
| Botão "Ver Investimento" | `HeroExpress.tsx:71` | `"Ver Investimento"` | — | ⚠️ Hardcoded |

---

## Dados do Cliente

| Campo Frontend | Localização | Valor Hardcoded | Campo Payload | Status |
|----------------|-------------|-----------------|---------------|--------|
| Nome do cliente | `App.tsx:152` | `proposal.client.name` | `proposal.client.name` | ✅ Existe |
| Email do cliente | `hooks/useProposal.ts:15` | `proposal.client.email` | `proposal.client.email` | ✅ Existe |
| Empresa | `hooks/useProposal.ts:16` | `proposal.client.company` | `proposal.client.company` | ✅ Existe |

---

## Diagnóstico

### Versão Complete (DiagnosticSection.tsx)

| Campo Frontend | Localização | Valor Hardcoded | Campo Payload | Status |
|----------------|-------------|-----------------|---------------|--------|
| Problema | `DiagnosticSection.tsx:23` | `diagnostic.problem` | `proposal.diagnostic.problem` | ✅ Existe |
| Solução | `DiagnosticSection.tsx:38` | `diagnostic.solution` | `proposal.diagnostic.solution` | ✅ Existe |
| Label Problema | `DiagnosticSection.tsx:20` | `diagnostic.problemLabel` (fallback: "Desafios & Riscos") | `proposal.diagnostic.problemLabel` | ✅ Existe |
| Label Solução | `DiagnosticSection.tsx:35` | `diagnostic.solutionLabel` (fallback: "Soberania & Performance") | `proposal.diagnostic.solutionLabel` | ✅ Existe |
| Badge "Cenário Atual" | `DiagnosticSection.tsx:16` | `"Cenário Atual"` | — | ⚠️ Hardcoded (pode manter) |
| Badge "Cenário Alinhadamente" | `DiagnosticSection.tsx:31` | `"Cenário Alinhadamente"` | — | ⚠️ Hardcoded (pode manter) |

### Versão Express (DiagnosticSwiper.tsx)

| Campo Frontend | Localização | Valor Hardcoded | Campo Payload | Status |
|----------------|-------------|-----------------|---------------|--------|
| Problema | `DiagnosticSwiper.tsx:44` | `problemSlug` prop | Passado via props | ✅ Dinâmico |
| Solução | `DiagnosticSwiper.tsx:57` | `solutionSlug` prop | Passado via props | ✅ Dinâmico |
| Título secção | `DiagnosticSwiper.tsx:25` | `"Diagnóstico"` | — | ⚠️ Hardcoded |
| Label "Cenário Atual" | `DiagnosticSwiper.tsx:41` | `"Cenário Atual"` | — | ⚠️ Hardcoded |
| Label "Cenário Alinhadamente" | `DiagnosticSwiper.tsx:54` | `"Cenário Alinhadamente"` | — | ⚠️ Hardcoded |

---

## Pricing Tiers

| Campo Frontend | Localização | Valor Hardcoded | Campo Payload | Status |
|----------------|-------------|-----------------|---------------|--------|
| Lista de tiers | `Calculator.tsx:27` | `proposal.pricing.tiers` | `proposal.pricing.tiers[]` | ✅ Existe |
| Tier: ID | `types.ts:55` | `tier.id` | `tier.id` | ✅ Existe |
| Tier: Nome | `Calculator.tsx:103` | `tier.name` | `tier.name` | ✅ Existe |
| Tier: Setup Price | `Calculator.tsx:36` | `tier.setup_price` | `tier.setup_price` | ✅ Existe |
| Tier: Monthly Price | `Calculator.tsx:37` | `tier.monthly_price` | `tier.monthly_price` | ✅ Existe |
| Tier: Recommended | `Calculator.tsx:94` | `tier.recommended` | `tier.recommended` | ✅ Existe |
| Tier: Features | `Calculator.tsx:127` | `tier.features[]` | `tier.features[]` | ✅ Existe |
| Badge "Recomendado" | `Calculator.tsx:97` | `"Recomendado"` | — | ⚠️ Hardcoded (pode manter) |
| Badge "Selecionado/Selecionar" | `Calculator.tsx:141` | Hardcoded | — | ⚠️ Hardcoded (pode manter) |

### Versão Express (PricingExpress.tsx)

| Campo Frontend | Localização | Valor Hardcoded | Campo Payload | Status |
|----------------|-------------|-----------------|---------------|--------|
| Tier selecionado | `PricingExpress.tsx:37` | `selectedTier` from props | Dinâmico via props | ✅ Existe |
| Features | `PricingExpress.tsx:51` | `selectedTier.features` | Dinâmico via props | ✅ Existe |
| Badge "Recomendado" | `PricingExpress.tsx:34` | `"Recomendado"` | — | ⚠️ Hardcoded |
| Label "Setup Único" | `PricingExpress.tsx:41` | `"Setup Único"` | — | ⚠️ Hardcoded |
| Label "Mensal" | `PricingExpress.tsx:45` | `"Mensal"` | — | ⚠️ Hardcoded |
| Título "Add-ons Populares" | `PricingExpress.tsx:62` | `"Add-ons Populares"` | — | ⚠️ Hardcoded |

---

## Motores CMS

| Campo Frontend | Localização | Valor Hardcoded | Campo Payload | Status |
|----------------|-------------|-----------------|---------------|--------|
| Lista de motores | `CmsMotors.tsx:21` | `motors` prop | `proposal.motoresIncluidos[]` | ✅ Existe |
| Motor: ID | `CmsMotors.tsx:23` | `motor.id` | `motor.id` | ✅ Existe |
| Motor: Título | `CmsMotors.tsx:42` | `motor.title` | `motor.title` | ✅ Existe |
| Motor: Descrição | `CmsMotors.tsx:45` | `motor.description` | `motor.description` | ✅ Existe |
| Motor: Ícone | `CmsMotors.tsx:34` | `getIcon(motor.icon)` | `motor.icon` | ✅ Existe |
| Motor: Features | `CmsMotors.tsx:58-62` | `motor.features[].feature_text` | `motor.features[].featureText` | ✅ Existe |
| Label "Capacidades:" | `CmsMotors.tsx:56` | `"Capacidades:"` | — | ⚠️ Hardcoded (pode manter) |

---

## Addons

| Campo Frontend | Localização | Valor Hardcoded | Campo Payload | Status |
|----------------|-------------|-----------------|---------------|--------|
| Lista de addons | `Calculator.tsx:28` | `proposal.addons_disponiveis` | `proposal.addonsDisponiveis[]` | ✅ Existe |
| Addon: ID | `Calculator.tsx:186` | `addon.id` | `addon.id` | ✅ Existe |
| Addon: Nome | `Calculator.tsx:194` | `addon.name` | `addon.name` | ✅ Existe |
| Addon: Setup Price | `Calculator.tsx:44` | `addon.setup_price` | `addon.setup_price` | ✅ Existe |
| Addon: Monthly Price | `Calculator.tsx:45` | `addon.monthly_price` | `addon.monthly_price` | ✅ Existe |
| Addon: Descrição | `Calculator.tsx:212` | `addon.description` | `addon.description` | ✅ Existe |
| Addon: Hours Saved | `Calculator.tsx:65` | `addon.hours_saved` | `addon.hours_saved` | ✅ Existe |
| Addon: Retention Boost | `Calculator.tsx:66` | `addon.retention_boost` | `addon.retention_boost` | ✅ Existe |
| Addon: Detailed Solution | `Calculator.tsx:212` | `addon.detailed_solution` | `addon.detailed_solution` | ✅ Existe |
| Addon: ROI Impact | `Calculator.tsx:216` | `addon.roi_impact` | `addon.roi_impact` | ✅ Existe |
| Label "Ver Detalhe & ROI" | `Calculator.tsx:197` | `"Ver Detalhe & ROI"` | — | ⚠️ Hardcoded (pode manter) |
| Label "Ativo" | `Calculator.tsx:195` | `"Ativo"` | — | ⚠️ Hardcoded (pode manter) |
| Label "Para que serve?" | `PricingExpress.tsx:112` | `"Para que serve?"` | — | ⚠️ Hardcoded |
| Label "Impacto Esperado" | `PricingExpress.tsx:118` | `"Impacto Esperado"` | — | ⚠️ Hardcoded |

---

## Roadmap

| Campo Frontend | Localização | Valor Hardcoded | Campo Payload | Status |
|----------------|-------------|-----------------|---------------|--------|
| Lista de fases | `Roadmap.tsx:18` | `phases` prop | `proposal.roadmapPhases[]` | ✅ Existe |
| Fase: Número | `Roadmap.tsx:30` | `phase.phase` | `phase.phase` | ✅ Existe |
| Fase: Título | `Roadmap.tsx:44` | `phase.title` | `phase.title` | ✅ Existe |
| Fase: Duração | `Roadmap.tsx:33` | `phase.duration` | `phase.duration` | ✅ Existe |
| Fase: Agency Tasks | `Roadmap.tsx:57` | `phase.agency_tasks[]` | `phase.agency_tasks[]` | ✅ Existe |
| Fase: Client Tasks | `Roadmap.tsx:73` | `phase.client_tasks[]` | `phase.client_tasks[]` | ✅ Existe |
| Label "Responsabilidade Alinhadamente" | `Roadmap.tsx:55` | Hardcoded | — | ⚠️ Hardcoded (pode manter) |
| Label "A Sua Missão" | `Roadmap.tsx:71` | Hardcoded | — | ⚠️ Hardcoded (pode manter) |

---

## Testimonials

| Campo Frontend | Localização | Valor Hardcoded | Campo Payload | Status |
|----------------|-------------|-----------------|---------------|--------|
| Lista de depoimentos | `App.tsx:114` | `proposal.testimonials` | `proposal.testimonials[]` | ✅ Existe |
| Nome do cliente | `types.ts:79` | `testimonial.client_name` | `testimonial.clientName` | ✅ Existe |
| Cargo | `types.ts:80` | `testimonial.role` | `testimonial.role` | ✅ Existe |
| Empresa | `types.ts:81` | `testimonial.company` | `testimonial.company` | ✅ Existe |
| Quote | `types.ts:82` | `testimonial.quote` | `testimonial.quote` | ✅ Existe |
| Logo URL | `types.ts:83` | `testimonial.logo_url` | `testimonial.logo` | ✅ Existe (Media) |
| Photo URL | `types.ts:84` | `testimonial.photo_url` | `testimonial.photo` | ✅ Existe (Media) |

---

## Team

| Campo Frontend | Localização | Valor Hardcoded | Campo Payload | Status |
|----------------|-------------|-----------------|---------------|--------|
| Lista de membros | `App.tsx:192` | `proposal.team` | `proposal.team[]` | ✅ Existe |
| Nome | `types.ts:89` | `team.name` | `team.name` | ✅ Existe |
| Cargo | `types.ts:90` | `team.role` | `team.role` | ✅ Existe |
| Bio | `types.ts:91` | `team.bio` | `team.bio` | ✅ Existe |
| Photo URL | `types.ts:92` | `team.image_url` | `team.photo` | ✅ Existe (Media) |
| Email | `types.ts:93` | `team.email` | `team.email` | ✅ Existe |
| LinkedIn | `types.ts:94` | `team.linkedin` | `team.linkedin` | ✅ Existe |

---

## FAQs

| Campo Frontend | Localização | Valor Hardcoded | Campo Payload | Status |
|----------------|-------------|-----------------|---------------|--------|
| Lista de FAQs | `FAQSection.tsx:32` | `faqs` prop | `proposal.faqs[]` | ✅ Existe |
| Pergunta | `FAQSection.tsx:42` | `faq.question` | `faq.question` | ✅ Existe |
| Resposta | `FAQSection.tsx:61` | `faq.answer` | `faq.answer` | ✅ Existe |
| Categoria | `types.ts:100` | `faq.category` | `faq.category` | ✅ Existe |
| Título da secção "Deveres & Direitos" | `FAQSection.tsx:19` | `"Deveres & Direitos"` | — | ⚠️ Hardcoded (pode manter) |
| Subtítulo da secção | `FAQSection.tsx:21` | Hardcoded | — | ⚠️ Hardcoded (pode manter) |
| Badge "Proteção de Ativos Intelectuais" | `FAQSection.tsx:27` | Hardcoded | — | ⚠️ Hardcoded (pode manter) |

---

## Included Items (Express)

| Campo Frontend | Localização | Valor Hardcoded | Campo Payload | Status |
|----------------|-------------|-----------------|---------------|--------|
| Lista de items incluídos | `IncludedAccordion.tsx:21` | `items` prop | `proposal.included_items[]` | ✅ Existe |
| Item: ID | `types.ts:104` | `item.id` | `item.id` | ✅ Existe |
| Item: Ícone | `IncludedAccordion.tsx:29` | `getIcon(item.icon)` | `item.icon` | ✅ Existe |
| Item: Título | `IncludedAccordion.tsx:32` | `item.title` | `item.title` | ✅ Existe |
| Item: Subtítulo | `IncludedAccordion.tsx:33` | `item.subtitle` | `item.subtitle` | ✅ Existe |
| Item: Features | `IncludedAccordion.tsx:50` | `item.features[]` | `item.features[]` | ✅ Existe |
| Título da secção | `IncludedAccordion.tsx:19` | `"O Que Está Incluído"` | — | ⚠️ Hardcoded (pode manter) |

---

## Variable Costs

| Campo Frontend | Localização | Valor Hardcoded | Campo Payload | Status |
|----------------|-------------|-----------------|---------------|--------|
| Lista de custos variáveis | `VariableCostsAccordion.tsx:42` | `costs` prop | `proposal.variable_costs[]` | ✅ Existe |
| Cost: ID | `types.ts:113` | `cost.id` | `cost.id` | ✅ Existe |
| Cost: Nome | `VariableCostsAccordion.tsx:45` | `cost.name` | `cost.name` | ✅ Existe |
| Cost: Custo estimado | `VariableCostsAccordion.tsx:48` | `cost.estimated_cost` | `cost.estimated_cost` | ✅ Existe |
| Cost: Descrição | `VariableCostsAccordion.tsx:51` | `cost.description` | `cost.description` | ✅ Existe |
| Cost: Required | `VariableCostsAccordion.tsx:54` | `cost.required` | `cost.required` | ✅ Existe |
| Título da secção | `VariableCostsAccordion.tsx:17` | `"Custos Variáveis Externos"` | — | ⚠️ Hardcoded (pode manter) |
| Badge "Transparência Radical" | `VariableCostsAccordion.tsx:24` | Hardcoded | — | ⚠️ Hardcoded |
| Label "Obrigatório/Opcional" | `VariableCostsAccordion.tsx:54-57` | Hardcoded | — | ⚠️ Hardcoded |

---

## ROI Section

| Campo Frontend | Localização | Valor Hardcoded | Campo Payload | Status |
|----------------|-------------|-----------------|---------------|--------|
| Lista de ROI items | `ROISection.tsx:5-24` | `ROI_DATA` array hardcoded | — | ❌ Em falta |
| Item: Feature name | `ROISection.tsx:7` | `'Agendamento (Cal.com)'`, etc. | — | ❌ Em falta |
| Item: Value | `ROISection.tsx:8` | Strings hardcoded | — | ❌ Em falta |
| Item: Metric | `ROISection.tsx:9` | `'+25% na taxa...'`, etc. | — | ❌ Em falta |
| Item: Color | `ROISection.tsx:10` | Classes hardcoded | — | ❌ Em falta |
| Título da secção | `ROISection.tsx:30` | `"Porquê a Alinhadamente?"` | — | ⚠️ Hardcoded (pode manter) |
| Subtítulo da secção | `ROISection.tsx:31` | Hardcoded | — | ⚠️ Hardcoded (pode manter) |
| Badge "Funcionalidade Impactante" | `ROISection.tsx:46` | Hardcoded | — | ⚠️ Hardcoded (pode manter) |
| Label "Métrica de ROI" | `ROISection.tsx:53` | Hardcoded | — | ⚠️ Hardcoded (pode manter) |

**Nota:** Esta secção não é atualmente renderizada no `App.tsx`. Pode ser removida ou integrada como dinâmica.

---

## Trust Bar

### Versão Complete (TrustBar.tsx)

| Campo Frontend | Localização | Valor Hardcoded | Campo Payload | Status |
|----------------|-------------|-----------------|---------------|--------|
| Badge 1: Text1 | `TrustBar.tsx:7` | `"Sem Vendor Lock-in"` | — | ⚠️ Hardcoded |
| Badge 1: Text2 | `TrustBar.tsx:7` | `"Stack Open Source"` | — | ⚠️ Hardcoded |
| Badge 2: Text1 | `TrustBar.tsx:8` | `"GDPR Compliant"` | — | ⚠️ Hardcoded |
| Badge 2: Text2 | `TrustBar.tsx:8` | `"Dados em Solo Europeu"` | — | ⚠️ Hardcoded |
| Badge 3: Text1 | `TrustBar.tsx:9` | `"Soberania Digital"` | — | ⚠️ Hardcoded |
| Badge 3: Text2 | `TrustBar.tsx:9` | `"Infraestrutura Dedicada"` | — | ⚠️ Hardcoded |

### Versão Express (TrustBarExpress.tsx)

| Campo Frontend | Localização | Valor Hardcoded | Campo Payload | Status |
|----------------|-------------|-----------------|---------------|--------|
| Badge 1: Label | `TrustBarExpress.tsx:9` | `"Propriedade Total"` | — | ⚠️ Hardcoded |
| Badge 1: Description | `TrustBarExpress.tsx:10` | `"Código 100% seu. Sem vendor lock-in."` | — | ⚠️ Hardcoded |
| Badge 2: Label | `TrustBarExpress.tsx:14` | `"GDPR Compliant"` | — | ⚠️ Hardcoded |
| Badge 2: Description | `TrustBarExpress.tsx:15` | `"Dados em servidores europeus (Alemanha)."` | — | ⚠️ Hardcoded |
| Badge 3: Label | `TrustBarExpress.tsx:19` | `"Open Source"` | — | ⚠️ Hardcoded |
| Badge 3: Description | `TrustBarExpress.tsx:20` | `"Stack auditável e seguro."` | — | ⚠️ Hardcoded |

---

## Header

| Campo Frontend | Localização | Valor Hardcoded | Campo Payload | Status |
|----------------|-------------|-----------------|---------------|--------|
| Nome da marca | Não existe ficheiro | — | `tenant.name` / `siteConfig.siteName` | ✅ Existe |
| Logo | Não existe ficheiro | — | `tenant.logo` / `siteConfig.logo` | ✅ Existe |
| Nav items | Não existe ficheiro | — | `siteConfig.header.navigation[]` | ✅ Existe |

**Nota:** O componente `Header.tsx` não foi encontrado no codebase atual. O `HeaderExpress.tsx` existe mas não foi analisado.

---

## Chat Widget

| Campo Frontend | Localização | Valor Hardcoded | Campo Payload | Status |
|----------------|-------------|-----------------|---------------|--------|
| Título | `ChatWidget.tsx:28` | `"Dúvidas?"` | — | ⚠️ Hardcoded (pode manter) |
| Descrição | `ChatWidget.tsx:29` | `"A nossa equipa responde tipicamente..."` | — | ⚠️ Hardcoded (pode manter) |
| Email | `ChatWidget.tsx:33` | `contact.email` | `siteConfig.contact.email` | ✅ Existe |
| WhatsApp | `ChatWidget.tsx:39-48` | `contact.whatsapp` | `siteConfig.contact.whatsapp` | ✅ Existe |
| Label "Enviar Email" | `ChatWidget.tsx:37` | `"Enviar Email"` | — | ⚠️ Hardcoded |
| Label "WhatsApp" | `ChatWidget.tsx:48` | `"WhatsApp"` | — | ⚠️ Hardcoded |

---

## Adjudication

| Campo Frontend | Localização | Valor Hardcoded | Campo Payload | Status |
|----------------|-------------|-----------------|---------------|--------|
| Título | `Adjudication.tsx:52` | `"Aceitar Proposta e Iniciar Projeto"` | — | ⚠️ Hardcoded (pode manter) |
| Descrição | `Adjudication.tsx:54` | `"Ao adjudicar, o seu gestor..."` | — | ⚠️ Hardcoded (pode manter) |
| Texto do botão | `Adjudication.tsx:73` | `"ADJUDICAR AGORA"` | — | ⚠️ Hardcoded (pode manter) |
| Texto de sucesso: título | `Adjudication.tsx:89` | `"Excelente escolha."` | — | ⚠️ Hardcoded (pode manter) |
| Texto de sucesso: mensagem | `Adjudication.tsx:90-92` | `"O seu interesse foi registado..."` | — | ⚠️ Hardcoded (pode manter) |
| ID do projeto | `Adjudication.tsx:95` | `proposalSlug.toUpperCase()` | `proposal.slug` | ✅ Existe |

---

## CTA Final (Express)

| Campo Frontend | Localização | Valor Hardcoded | Campo Payload | Status |
|----------------|-------------|-----------------|---------------|--------|
| Título | `CTAFinal.tsx:28` | `"Pronto para Avançar?"` | — | ⚠️ Hardcoded (pode manter) |
| Texto do botão | `CTAFinal.tsx:50` | `"ADJUDICAR AGORA"` | — | ⚠️ Hardcoded (pode manter) |
| Descrição do botão | `CTAFinal.tsx:52` | `"Gera contrato e fatura automaticamente"` | — | ⚠️ Hardcoded (pode manter) |
| Título de sucesso | `CTAFinal.tsx:63` | `"Sucesso!"` | — | ⚠️ Hardcoded (pode manter) |
| Mensagem de sucesso | `CTAFinal.tsx:64` | `"O seu gestor de conta..."` | — | ⚠️ Hardcoded (pode manter) |
| Título FAQs | `CTAFinal.tsx:73` | `"Perguntas Frequentes"` | — | ⚠️ Hardcoded (pode manter) |
| FAQs | `CTAFinal.tsx:76` | `faqs` prop | `proposal.faqs[]` | ✅ Existe |

---

## Sticky Bottom Bar (Express)

| Campo Frontend | Localização | Valor Hardcoded | Campo Payload | Status |
|----------------|-------------|-----------------|---------------|--------|
| Label Total | `StickyBottomBar.tsx:17` | `"Total Estimado"` | — | ⚠️ Hardcoded (pode manter) |
| Texto do botão | `StickyBottomBar.tsx:30` | `"Avançar"` | — | ⚠️ Hardcoded (pode manter) |
| Total Setup | `StickyBottomBar.tsx:19` | `totalSetup` prop | Calculado dinamicamente | ✅ Dinâmico |
| Total Monthly | `StickyBottomBar.tsx:20` | `totalMonthly` prop | Calculado dinamicamente | ✅ Dinâmico |

---

## Secção Títulos

| Campo | Localização | Valor Hardcoded | Campo Payload | Status |
|-------|-------------|-----------------|---------------|--------|
| "Confiança" | `App.tsx:117` | Hardcoded | — | ⚠️ Hardcoded (pode manter) |
| "Quem confia na Alinhadamente" | `App.tsx:118` | Hardcoded | — | ⚠️ Hardcoded (pode manter) |
| "Diagnóstico de Impacto" | `App.tsx:128` | Hardcoded | — | ⚠️ Hardcoded (pode manter) |
| "Plano de Ação Mútuo" | `App.tsx:139` | Hardcoded | — | ⚠️ Hardcoded (pode manter) |
| "Arquitetura de Performance" | `App.tsx:150` | Hardcoded | — | ⚠️ Hardcoded (pode manter) |
| "Investimento" | `Calculator.tsx:72` | Hardcoded | — | ⚠️ Hardcoded (pode manter) |
| "Diagnóstico" | `DiagnosticSwiper.tsx:25` | Hardcoded | — | ⚠️ Hardcoded (pode manter) |
| "1. Escolha o Nível Base" | `Calculator.tsx:78` | Hardcoded | — | ⚠️ Hardcoded |
| "2. Adicione Capacidades" | `Calculator.tsx:155` | Hardcoded | — | ⚠️ Hardcoded |
| "Resumo de Investimento" | `Calculator.tsx:233` | Hardcoded | — | ⚠️ Hardcoded |
| "Infraestrutura Base" | `Calculator.tsx:236` | Hardcoded | — | ⚠️ Hardcoded |
| "Total Setup" | `Calculator.tsx:249` | Hardcoded | — | ⚠️ Hardcoded |
| "Total Mensal" | `Calculator.tsx:257` | Hardcoded | — | ⚠️ Hardcoded |

---

## Footer

| Campo | Localização | Valor Hardcoded | Campo Payload | Status |
|-------|-------------|-----------------|---------------|--------|
| Copyright | `App.tsx:189` | `siteConfig?.footer.copyright` | `siteConfig.footer.copyright` | ✅ Existe |
| "Proposta preparada por" | `App.tsx:194` | Hardcoded | — | ⚠️ Hardcoded (pode manter) |
| Nome do preparador | `App.tsx:199` | `proposal.team[0].name` | `proposal.team[0].name` | ✅ Dinâmico |
| Foto do preparador | `App.tsx:197` | `proposal.team[0].image_url` | `proposal.team[0].photo` | ✅ Dinâmico |

---

## Outros Textos UI Hardcoded

| Campo | Localização | Valor Hardcoded | Status |
|-------|-------------|-----------------|--------|
| "Explorar Solução" (botão Hero) | `Hero.tsx:31` | Hardcoded | ⚠️ Hardcoded (pode manter) |
| "Ver Investimento" (botão Express) | `HeroExpress.tsx:71` | Hardcoded | ⚠️ Hardcoded (pode manter) |
| "Tempo Poupado" | `Calculator.tsx:169` | Hardcoded | ⚠️ Hardcoded (pode manter) |
| "Retenção" | `Calculator.tsx:176` | Hardcoded | ⚠️ Hardcoded (pode manter) |
| "Mensalidade Incluída" | `Calculator.tsx:202` | Hardcoded | ⚠️ Hardcoded (pode manter) |
| "ADJUDICAR" | `Calculator.tsx:269` | Hardcoded | ⚠️ Hardcoded (pode manter) |
| "Valores s/ IVA • Pagamento 50% na Adjudicação" | `Calculator.tsx:272` | Hardcoded | ⚠️ Hardcoded (pode manter) |
| "O que inclui:" | `Calculator.tsx:124` | Hardcoded | ⚠️ Hardcoded |
| "PROCESSANDO..." | `Adjudication.tsx:70` | Hardcoded | ⚠️ Hardcoded |
| "REF:" | `Adjudication.tsx:95` | Hardcoded | ⚠️ Hardcoded |
| "Deslize para comparar cenários" | `DiagnosticSwiper.tsx:26` | Hardcoded | ⚠️ Hardcoded |

---

## Campos em Falta no Payload

### 1. ROI Section Items (Prioridade: Baixa)

**Sugestão:** Criar nova collection `roi-items` ou adicionar array à Proposal.

```typescript
interface RoiItem {
  id: string
  feature: string
  value: string
  metric: string
  color?: string
  order?: number
}
```

**Nota:** Esta secção não está atualmente renderizada no App.tsx. Avaliar se deve ser mantida.

### 2. Trust Bar Items (Prioridade: Baixa)

**Sugestão:** Adicionar array de trust badges ao SiteConfig ou Proposal.

```typescript
interface TrustBadge {
  id: string
  icon: 'ShieldCheck' | 'LockClosed' | 'CodeBracket' | 'Cloud'
  label: string
  description?: string
}
```

---

## Resumo e Recomendações

### ✅ Campos que JÁ EXISTEM no Payload

| Estrutura | Campos |
|-----------|--------|
| **Proposal** | `client`, `hero` (com `thumbnailImage`), `diagnostic` (com `problemLabel`, `solutionLabel`), `motores_incluidos`, `addons_disponiveis`, `pricing`, `roadmap_phases`, `testimonials`, `team`, `faqs`, `included_items`, `variable_costs`, `public_token` |
| **SiteConfig** | `siteName`, `contact.email`, `contact.whatsapp`, `footer.copyright` |

### ❌ Campos EM FALTA (necessitam criação)

| Categoria | Campos | Prioridade |
|-----------|--------|------------|
| **ROI Section** | Array de items (`feature`, `value`, `metric`, `color`) | Baixa (secção não usada) |
| **Trust Bar** | Array de badges (`icon`, `label`, `description`) | Baixa |

### ⚠️ Campos HARDCODED (podem manter-se)

A maioria dos textos de UI (botões, labels, títulos de secções) estão hardcoded no frontend. Isto é aceitável porque:

1. **Não variam por proposta** - são textos da marca Alinhadamente
2. **Tradução** - se houver necessidade de multi-idioma, pode ser gerido por i18n
3. **Manutenção** - alterações requerem deploy, mas são raras

**Recomendação:** Manter hardcoded a menos que haja requisito específico de customização por cliente/tenant.

---

## Arquitetura Atual

### Hook de Dados

O projeto agora usa um hook customizado `useProposal` para buscar dados:

```typescript
// hooks/useProposal.ts
export const useProposal = (slug?: string) => {
  // Returns: { proposal, siteConfig, loading, error }
}
```

### Estrutura de Tipos (types.ts)

```typescript
interface Proposal {
  id: string
  slug: string
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired'
  version_type: 'express' | 'complete' | 'both'
  public_token: string

  client: ClientData
  hero: ProposalHero
  diagnostic?: ProposalDiagnostic

  motores_incluidos?: CmsMotor[]
  addons_disponiveis?: AddOn[]

  pricing: ProposalPricing
  roadmap_phases?: RoadmapPhase[]
  testimonials?: Testimonial[]
  team?: TeamMember[]
  faqs?: Faq[]

  included_items?: IncludedItem[]
  variable_costs?: VariableCost[]

  valid_until?: string
}
```

### Fluxo de Dados

```
useProposal(slug)
    ↓
App.tsx (state: proposal, siteConfig)
    ↓
├── Complete View (viewMode === 'complete')
│   ├── Hero (proposal prop)
│   ├── TrustBar (hardcoded)
│   ├── DiagnosticSection (diagnostic prop)
│   ├── Roadmap (phases prop)
│   ├── CmsMotors (motors prop)
│   ├── Calculator (proposal prop)
│   ├── VariableCostsAccordion (costs prop)
│   ├── FAQSection (faqs prop)
│   └── Adjudication (proposalSlug prop)
│
└── Express View (viewMode === 'express')
    └── ProposalExpress (proposalData prop)
        ├── HeroExpress (proposal prop)
        ├── TrustBarExpress (hardcoded)
        ├── DiagnosticSwiper (problemSlug, solutionSlug props)
        ├── IncludedAccordion (items prop)
        ├── PricingExpress (proposal prop)
        ├── CTAFinal (faqs prop)
        └── StickyBottomBar (totals props)
```

---

## Próximos Passos

### Para o Agent do Payload:

1. ✅ Confirmar que todos os campos mapeados como "Existe" estão corretos
2. ❌ Criar collection `roi-items` (opcional, secção não usada)
3. ❌ Adicionar trust badges ao SiteConfig (opcional)

### Para o Agent do Frontend:

1. ✅ Hook `useProposal(slug)` implementado
2. ✅ Componentes atualizados para usar props dinâmicas
3. ✅ Fallback/loading states implementados
4. Manter textos UI hardcoded a menos que requisito contrário
5. Considerar remover `ROISection.tsx` se não for usado

---

## Apêndice: Estrutura Completa da Proposal no Payload

```typescript
interface Proposal {
  id: string
  slug: string
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired'
  version_type: 'express' | 'complete' | 'both'
  public_token: string

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
    thumbnailImage?: string  // ✅ Adicionado
  }

  diagnostic?: {
    problem?: string
    solution?: string
    problemLabel?: string    // ✅ Adicionado
    solutionLabel?: string   // ✅ Adicionado
  }

  motores_incluidos?: {
    id: string
    slug: string
    title: string
    description: string
    icon: string
    features?: { feature_text: string }[]
  }[]

  addons_disponiveis?: {
    id: string
    slug: string
    name: string
    setup_price: number
    monthly_price: number
    description?: string
    hours_saved?: number
    retention_boost?: number
    detailed_solution?: string
    roi_impact?: string
    third_party_costs?: string
  }[]

  pricing: {
    setupPrice: number
    monthlyBase: number
    tiers?: {
      id: string
      name: string
      setup_price: number
      monthly_price: number
      features: string[]
      recommended?: boolean
    }[]
  }

  roadmap_phases?: {
    phase: number
    title: string
    duration: string
    agency_tasks: string[]
    client_tasks: string[]
  }[]

  testimonials?: {
    id: string
    client_name: string
    role: string
    company: string
    quote: string
    logo_url?: string
    photo_url?: string
  }[]

  team?: {
    id: string
    name: string
    role: string
    bio: string
    image_url?: string
    email?: string
    linkedin?: string
  }[]

  faqs?: {
    question: string
    answer: string
    category?: string
  }[]

  included_items?: {        // ✅ Adicionado
    id: string
    icon: string
    title: string
    subtitle: string
    features: string[]
    order?: number
  }[]

  variable_costs?: {        // ✅ Adicionado
    id: string
    name: string
    estimated_cost: number
    description: string
    required: boolean
  }[]

  valid_until?: string
}

interface SiteConfig {
  siteName: string
  contact: {
    email: string
    whatsapp?: string      // ✅ Adicionado
  }
  footer: {
    copyright: string
  }
}
```

---

*Documento atualizado automaticamente pela análise do código frontend.*
*Última atualização: 2026-02-15*
