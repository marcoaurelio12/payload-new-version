# Deploy Guide — Payload CMS Multi-tenant

## Novas Collections (Fev 2025)

Foram adicionadas as seguintes collections para suportar o sistema de propostas:

| Collection | Slug | Multi-tenant | Access |
|------------|------|--------------|--------|
| Proposals | `proposals` | ✅ | Tenant members |
| Proposal Templates | `proposal-templates` | ❌ | SuperAdmin + Alinhadamente |
| Motores | `motores` | ❌ | SuperAdmin + Alinhadamente |
| Addons | `addons` | ❌ | SuperAdmin + Alinhadamente |
| Testimonials | `testimonials` | ❌ | SuperAdmin + Alinhadamente |
| Team | `team` | ❌ | SuperAdmin + Alinhadamente |
| FAQs | `faqs` | ❌ | SuperAdmin + Alinhadamente |

## Migrações

As migrações são corridas automaticamente no arranque do container (ver Dockerfile).

Se necessário correr manualmente:
```bash
pnpm payload migrate
```

## Seed Data

Após o primeiro deploy, correr o seed para criar dados iniciais:

```bash
pnpm payload run src/scripts/seed.ts
```

Isto cria:
- Tenant "alinhadamente"
- Super admin: `admin@alinhadamente.pt` / `ChangeMe123!`
- 4 motores de exemplo
- 4 addons de exemplo
- 3 depoimentos
- 4 FAQs
- 2 membros de equipa
- 1 template de proposta
- 1 proposta de exemplo

⚠️ **IMPORTANTE:** Alterar a password do super admin após o seed!

## Variáveis de Ambiente

```env
DATABASE_URL=postgresql://user:password@host:5432/database
PAYLOAD_SECRET=<chave-secreta-min-32-chars>
NEXT_PUBLIC_SITE_URL=https://cms.alinhadamente.pt
NODE_ENV=production
```

## CORS

Configurar no `payload.config.ts` ou via variáveis de ambiente:

```typescript
cors: [
  'https://alinhadamente.pt',
  'https://www.alinhadamente.pt',
  'https://propostas.alinhadamente.pt',
  // Adicionar domínios de clientes
],
```

## Roles de Utilizadores

- `superAdmin` — Acesso total a todos os tenants
- `tenantAdmin` — Admin do tenant
- `tenantEditor` — Editor do tenant (pode criar/editar propostas)
- `tenantViewer` — Só leitura

## Troubleshooting

### Erro: "relation does not exist"
- Verificar se as migrações foram aplicadas
- Correr `pnpm payload migrate` manualmente

### Erro: "permission denied"
- Verificar access control em `src/access/index.ts`
- Verificar role do utilizador

### Tipos TypeScript desatualizados
- Correr `pnpm generate:types` para regenerar `payload-types.ts`
