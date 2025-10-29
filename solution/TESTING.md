# 🧪 Testes Automatizados

## Backend Tests

### Configuração

Os testes do backend usam Jest e Supertest para testar a API.

**Dependências:**

- `jest`: Test runner
- `ts-jest`: Suporte TypeScript para Jest
- `supertest`: Testar HTTP endpoints
- `@types/jest`: Tipos TypeScript para Jest

### Executar Testes

```bash
cd solution/backend

# Instalar dependências (caso ainda não tenha feito)
npm install

# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar com cobertura
npm test -- --coverage
```

### Estrutura dos Testes

```
backend/src/__tests__/
├── auth.test.ts      # Testes de autenticação
└── metrics.test.ts   # Testes de métricas
```

### Cobertura de Testes

#### Autenticação (auth.test.ts)

✅ **POST /api/auth/register**

- Registrar novo usuário com sucesso
- Falhar com email inválido
- Falhar com senha curta
- Falhar com nome ausente

✅ **POST /api/auth/login**

- Login com credenciais corretas
- Falhar com senha incorreta
- Falhar com usuário inexistente
- Falhar com credenciais ausentes

✅ **GET /api/auth/profile**

- Obter perfil com token válido
- Falhar sem header de autorização
- Falhar com token inválido

#### Métricas (metrics.test.ts)

✅ **GET /api/metrics/overview**

- Retornar métricas gerais
- Falhar sem autenticação
- Aceitar filtros de data

✅ **GET /api/metrics/top-products**

- Retornar top produtos
- Aceitar parâmetro de limite

✅ **GET /api/metrics/sales-by-channel**

- Retornar vendas por canal

✅ **GET /api/metrics/filters**

- Retornar filtros disponíveis (canais, lojas, categorias)

✅ **GET /api/metrics/export-csv**

- Exportar dados como CSV
- Aceitar filtros para exportação

### Executar Testes Específicos

```bash
# Executar apenas testes de autenticação
npm test -- auth.test.ts

# Executar apenas testes de métricas
npm test -- metrics.test.ts

# Executar teste específico por nome
npm test -- -t "should register a new user successfully"
```

### Relatório de Cobertura

Após executar `npm test`, um relatório de cobertura será gerado em `coverage/`:

```bash
# Abrir relatório HTML no navegador
start coverage/index.html  # Windows
open coverage/index.html   # Mac
xdg-open coverage/index.html  # Linux
```

**Meta de Cobertura:**

- Statements: > 70%
- Branches: > 60%
- Functions: > 70%
- Lines: > 70%

---

## Frontend Tests

### Configuração

Os testes do frontend usam Vitest e React Testing Library.

**Dependências:**

- `vitest`: Test runner para Vite
- `@testing-library/react`: Testar componentes React
- `@testing-library/jest-dom`: Matchers adicionais
- `jsdom`: DOM environment para testes

### Executar Testes

```bash
cd solution/frontend

# Instalar dependências
npm install

# Executar todos os testes
npm test

# Executar em modo watch
npm run test:watch

# Executar com UI
npm run test:ui

# Executar com cobertura
npm run test:coverage
```

### Estrutura dos Testes

```
frontend/src/__tests__/
├── MetricCard.test.tsx   # Teste do componente MetricCard
└── FilterBar.test.tsx    # Teste do componente FilterBar
```

### Cobertura de Testes

#### MetricCard

✅ Renderizar título e valor
✅ Formatar valor como moeda
✅ Formatar valor como número
✅ Exibir trend positivo corretamente
✅ Exibir trend negativo corretamente
✅ Renderizar ícone personalizado

#### FilterBar

✅ Renderizar filtros de data, canal e loja
✅ Atualizar filtros ao selecionar opções
✅ Aplicar filtros ao clicar em "Apply"
✅ Resetar filtros ao clicar em "Reset"

---

## 🚀 CI/CD Integration

### GitHub Actions

Crie `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: cd solution/backend && npm install
      - run: cd solution/backend && npm test

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: cd solution/frontend && npm install
      - run: cd solution/frontend && npm test
```

---

## 📝 Notas Importantes

### Database para Testes

Os testes atuais usam o banco de dados configurado no `.env`. Para testes isolados, considere:

1. **Usar banco de teste separado:**

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/nola_test"
```

2. **Setup e Teardown:**

```typescript
beforeAll(async () => {
  // Limpar tabelas antes dos testes
});

afterAll(async () => {
  // Fechar conexões
});
```

### Mocking

Para testes mais rápidos, considere mockar o Prisma Client:

```typescript
jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(() => ({
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  })),
}));
```

---

## 📊 Exemplo de Saída

```bash
$ npm test

 PASS  src/__tests__/auth.test.ts
  Auth Controller
    POST /api/auth/register
      ✓ should register a new user successfully (245ms)
      ✓ should fail with invalid email (89ms)
      ✓ should fail with short password (72ms)
      ✓ should fail with missing name (68ms)
    POST /api/auth/login
      ✓ should login successfully with correct credentials (187ms)
      ✓ should fail with incorrect password (145ms)
      ✓ should fail with non-existent user (112ms)
    GET /api/auth/profile
      ✓ should get user profile with valid token (98ms)
      ✓ should fail without authorization header (45ms)

 PASS  src/__tests__/metrics.test.ts
  Metrics Controller
    GET /api/metrics/overview
      ✓ should return overview metrics (234ms)
      ✓ should fail without authentication (67ms)
    GET /api/metrics/top-products
      ✓ should return top products (189ms)

Test Suites: 2 passed, 2 total
Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        5.432 s
```

---

## 🎯 Best Practices

1. **Nomes descritivos:** Use `describe` e `it` com nomes claros
2. **Arrange-Act-Assert:** Organize testes em 3 etapas
3. **Isolamento:** Cada teste deve ser independente
4. **Cleanup:** Use `afterEach` para limpar estado
5. **Mocking:** Mock apenas o necessário
6. **Cobertura:** Aim for 70%+ coverage
7. **Performance:** Testes rápidos (< 10s total)

---

## 📚 Recursos

- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
