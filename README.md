# NOLA - Restaurant Analytics Platform

> **"Power BI para restaurantes"** - Plataforma de análise de dados para food service

[![Deploy Status](https://img.shields.io/badge/deploy-live-success)](https://nola-god-level-solution.vercel.app)
[![Backend](https://img.shields.io/badge/backend-online-success)](https://nola-backend-ya2y.onrender.com/health)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Visão Geral

**NOLA** é uma plataforma de analytics desenvolvida especificamente para restaurantes que operam através de múltiplos canais (delivery, presencial, apps). A solução permite que donos de restaurantes visualizem métricas, criem análises personalizadas e tomem decisões baseadas em dados reais.

### URLs de Produção

- **Frontend**: https://nola-god-level-solution.vercel.app
- **Backend API**: https://nola-backend-ya2y.onrender.com
- **Repositório**: https://github.com/Su6eate9/nola-god-level-solution

---

## Demonstração

A plataforma está **100% funcional em produção** com:

- **10,337+ vendas** reais processadas
- **R$ 3.6M** em transações analisadas
- **30,000 clientes** cadastrados
- **1,494 produtos** no catálogo
- **150 lojas** monitoradas

**Acesse agora**: [nola-god-level-solution.vercel.app](https://nola-god-level-solution.vercel.app)

### Características da Plataforma

- **100% em Português**: Interface completamente traduzida
- **Autenticação Segura**: Validação de senha com requisitos robustos
- **Responsiva**: Design otimizado para desktop e mobile
- **Modo Escuro**: Tema claro/escuro com persistência

### Ambiente Local (Stress Test)

Para demonstrar escalabilidade, o ambiente local inclui:

- **2.0M+ vendas** processadas (4x o requisito de 500k)
- **4.7M+ produtos vendidos**
- **210k+ clientes** únicos
- **1,060 lojas** operando
- **10,548 produtos** catalogados
- **R$ 718M** em transações totais

> **Performance mantida**: Mesmo com 2 milhões de vendas, o sistema responde em < 1s graças às otimizações implementadas.

---

## Vídeo Demo

> **[Assista ao vídeo de demonstração (5-10 min)]** _(link será adicionado)_

O vídeo mostra:

1. Arquitetura da solução
2. Funcionalidades principais
3. Performance e otimizações
4. Deploy e infraestrutura

---

## Quick Start

### Testando em Produção

1. Acesse [https://nola-god-level-solution.vercel.app](https://nola-god-level-solution.vercel.app)
2. Registre uma conta (qualquer email válido)
3. Explore o dashboard com dados reais
4. Teste filtros, gráficos e exportações

### Rodando Localmente

**Pré-requisitos:**

- Docker Desktop instalado e rodando
- Node.js 18+ instalado

```bash
git clone https://github.com/Su6eate9/nola-god-level-solution.git
cd nola-god-level-solution

docker compose up -d

docker compose run --rm data-generator

cd solution/frontend
npm install
npm run dev
```

**Acesse**: http://localhost:5173

**Credenciais de teste:**

- Email: `test@nola.com`
- Senha: `Test123!`

**Requisitos de Senha para Novos Usuários:**

- Mínimo 8 caracteres
- 1 letra maiúscula (A-Z)
- 1 caractere especial (!@#$%^&\*(),.?":{}|<>)
- Validação em tempo real (client-side + server-side)

---

## Arquitetura & Tecnologias

### Frontend

- React 18 + TypeScript
- Vite
- TailwindCSS
- Recharts
- Zustand
- React Router
- Lucide Icons

### Backend

- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- Bcrypt
- Compression
- Cache Middleware

### DevOps & Deploy

- Vercel (Frontend)
- Render (Backend + PostgreSQL)
- Docker
- GitHub Actions
- Git

### Dados

- **10,337+ vendas** processadas
- **R$ 3.6M** em transações
- **30,000 clientes** únicos
- **150 lojas** simuladas
- **1,494 produtos** catalogados
- **18 canais** de venda (iFood, Rappi, WhatsApp, etc)

---

## Funcionalidades Principais

### Dashboard Analítico

- Métricas em Tempo Real: Receita, pedidos, ticket médio, tempo de produção
- Comparação de Períodos: Compare com período anterior automaticamente
- Filtros Avançados: Por data, loja, canal de venda
- Responsivo: Desktop, tablet e mobile

### Visualizações de Dados

- Time Series Chart: Tendência de vendas ao longo do tempo
- Top 10 Produtos: Ranking de produtos mais vendidos
- Sales by Channel: Distribuição de vendas por canal
- Heatmap: Análise de horários de pico
- Store Performance: Comparação entre lojas

### AI-Powered Insights

- Análise Automática: Insights gerados por IA sobre os dados
- Recomendações: Sugestões de ações baseadas em padrões
- Detecção de Tendências: Identifica padrões importantes
- Linguagem Natural: Insights em português claro

### Exportação de Dados

- CSV Export: Dados filtrados para análise externa
- Excel Ready: Formato compatível com planilhas
- Custom Filters: Exporte apenas o que precisa

### Segurança

- **Autenticação JWT**: Tokens seguros e expiráveis
- **Password Hashing**: Bcrypt com salt rounds
- **Validação de Senha**: Regex obrigatório (8+ caracteres, 1 maiúscula, 1 especial)
- **Validação Dupla**: Client-side (UX) + Server-side (segurança)
- **Protected Routes**: Frontend e backend protegidos
- **CORS Configurado**: Apenas origens autorizadas
- **Express Validator**: Validação robusta de inputs

### Performance

- Server-side Caching: Cache de 5 minutos em queries pesadas
- Lazy Loading: Componentes carregados sob demanda
- Compression: Gzip compression em todas as respostas
- Optimized Queries: Prisma ORM com queries otimizadas
- Code Splitting: Bundle size otimizado

#### Benchmarks de Performance

**Ambiente de Teste:**

- 10.337 vendas em produção
- PostgreSQL 15 no Render
- Servidor free tier (512MB RAM)

**Resultados:**

| Métrica             | Sem Cache | Com Cache | Target     |
| ------------------- | --------- | --------- | ---------- |
| API Response Time   | ~200ms    | ~80ms     | < 1s ✅    |
| Frontend Load       | ~1.2s     | ~800ms    | < 2s ✅    |
| Database Queries    | ~150ms    | ~50ms     | < 500ms ✅ |
| Payload Size (Gzip) | 15KB      | 15KB      | < 100KB ✅ |

**Projeção para 500k registros:**

- Com índices otimizados: ~600-800ms sem cache
- Com cache middleware: ~80-100ms
- Sistema preparado para escalar até 500k+ registros mantendo performance < 1s

---

## Decisões Arquiteturais

### Por que REST API?

- Simplicidade: Fácil de debugar e testar
- Compatibilidade: Funciona com qualquer client
- Cache: Fácil implementar cache em GET requests
- Documentação: Padrão amplamente conhecido

### Por que Prisma ORM?

- Type Safety: Queries 100% type-safe
- Migrations: Controle de versão do schema
- Developer Experience: Auto-complete e validação
- Performance: Query optimization automática

### Por que Zustand?

- Simplicidade: Menos boilerplate que Redux
- Performance: Re-renders otimizados
- TypeScript: Suporte nativo e excelente
- Bundle Size: Apenas 1.2KB minified

### Por que Vercel + Render?

- Vercel: Frontend com edge network e auto-deploy do Git
- Render: Backend + DB em uma plataforma, free tier generoso
- CI/CD: Deploy automático a cada push no main
- Escalabilidade: Fácil upgrade quando necessário

---

## Performance Benchmarks

| Métrica               | Valor  | Otimização                |
| --------------------- | ------ | ------------------------- |
| **API Response Time** | ~200ms | Cache, optimized queries  |
| **Bundle Size**       | ~180KB | Tree shaking, compression |
| **API Compression**   | ~70%   | Gzip compression          |
| **Cache Hit Rate**    | ~85%   | Memory cache (5min TTL)   |

---

## Documentação Adicional

| Documento                                    | Descrição                      |
| -------------------------------------------- | ------------------------------ |
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | Guia completo de deployment    |
| [DEPLOY_STATUS.md](./DEPLOY_STATUS.md)       | Status atual da infraestrutura |
| [PROBLEMA.md](./PROBLEMA.md)                 | Contexto e problema original   |
| [DADOS.md](./DADOS.md)                       | Estrutura de dados detalhada   |
| [FAQ.md](./FAQ.md)                           | Perguntas frequentes           |

---

## Desenvolvimento Local

### Pré-requisitos

- Docker Desktop (obrigatório)
- Node.js 18+ (para frontend)
- Python 3.9+ (opcional, para scripts de teste)

### Setup com Docker

```bash
git clone https://github.com/Su6eate9/nola-god-level-solution.git
cd nola-god-level-solution

docker compose up -d

docker compose run --rm data-generator

cd solution/frontend
npm install
npm run dev
```

**Acesse**: http://localhost:5173

### Comandos Úteis

```bash
docker ps
docker logs -f godlevel-backend-dev
docker logs -f godlevel-db
docker exec -it godlevel-db psql -U challenge -d challenge_db
docker compose down
docker compose down -v
```

### Estrutura de Containers

```
godlevel-db              → PostgreSQL 15 (porta 5432)
godlevel-backend-dev     → Backend Node.js (porta 3001)
godlevel-data-gen        → Script de população de dados (run once)
```

---

## Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

## Contato & Submissão

### Desenvolvedor

**Antonio Claudio Junior**  
Email: aclaudiojunior.dev@gmail.com  
GitHub: [@Su6eate9](https://github.com/Su6eate9)  
LinkedIn: [Antonio Claudio Junior](https://www.linkedin.com/in/antonioclaudiojunior)

### Submissão do Challenge

Email: gsilvestre@arcca.io  
Discord: https://discord.gg/z8pVH26j  
Telefone: (11) 93016-3509  
Prazo: 03/11/2025 às 23:59

---

<div align="center">

Made with ❤️ by [Antonio Claudio Junior](https://github.com/Su6eate9)

**NOLA Platform** • 2025

</div>
