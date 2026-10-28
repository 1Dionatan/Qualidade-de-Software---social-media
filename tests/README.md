# Projeto de Testes — SQA Social Media

Projeto de testes **End-to-End (E2E)** e de **API (Caixa Preta)** para o sistema [SQA Social Media](https://github.com/PepeTonin/sqa-social-media), desenvolvido com **Playwright**.

## Estrutura do Projeto

```
tests/
├── tests/
│   ├── e2e.signup.spec.ts   → Testes E2E: fluxo de cadastro
│   ├── e2e.signin.spec.ts   → Testes E2E: fluxo de login
│   ├── e2e.posts.spec.ts    → Testes E2E: curtida em posts (com/sem login)
│   ├── api.auth.spec.ts     → Testes de API: endpoints de autenticação
│   └── api.posts.spec.ts    → Testes de API: endpoints de posts e curtidas
├── playwright.config.ts     → Configuração do Playwright
└── package.json             → Dependências e scripts
```

## Pré-requisitos

Antes de rodar os testes, garanta que o sistema está rodando:

1. **API Spring Boot** rodando em `http://localhost:8080`
2. **Frontend Next.js** rodando em `http://localhost:3000`
3. **MySQL** configurado e com o banco criado
4. Acesso à internet para a API DummyJSON, usada pelo feed de posts

Os testes criam seus próprios usuários quando necessário; não é preciso cadastrar um usuário manualmente.

## Instalação

```bash
# Dentro da pasta /tests
npm install

# Instalar o navegador Chromium para o Playwright
npx playwright install chromium
```

## Como Executar os Testes

```bash
# Rodar TODOS os testes (E2E + API)
npm test

# Rodar apenas os testes E2E
npm run test:e2e

# Rodar apenas os testes de API
npm run test:api

# Rodar com interface gráfica do Playwright
npm run test:ui

# Rodar com navegador visível (modo headed)
npm run test:headed

# Ver relatório HTML após execução
npm run report
```

## Descrição dos Testes

### Testes E2E (3 arquivos, 9 testes)

| Arquivo | Teste | Descrição |
|---------|-------|-----------|
| `e2e.signup.spec.ts` | Cadastro com sucesso | Preenche formulário e verifica redirecionamento |
| `e2e.signup.spec.ts` | E-mail duplicado | Verifica mensagem de erro para e-mail já cadastrado |
| `e2e.signup.spec.ts` | Formulário vazio | Verifica validações do frontend |
| `e2e.signin.spec.ts` | Login com sucesso | Login e redirecionamento para home |
| `e2e.signin.spec.ts` | Senha incorreta | Verifica mensagem de erro |
| `e2e.signin.spec.ts` | Link de cadastro | Navegação para página de signup |
| `e2e.posts.spec.ts` | Curtir autenticado | Usuário logado curte um post |
| `e2e.posts.spec.ts` | Curtir sem login | Visitante não consegue curtir |
| `e2e.posts.spec.ts` | Lista de posts | Home exibe posts carregados |

### Testes de API — Caixa Preta (2 arquivos, 11 testes)

| Arquivo | Endpoint | Cenário |
|---------|----------|---------|
| `api.auth.spec.ts` | POST /auth/signup | Cadastro com sucesso (201) |
| `api.auth.spec.ts` | POST /auth/signup | E-mail duplicado (400/409) |
| `api.auth.spec.ts` | POST /auth/signin | Login com sucesso (200) |
| `api.auth.spec.ts` | POST /auth/signin | Senha incorreta (400/401) |
| `api.auth.spec.ts` | POST /auth/signin | E-mail inexistente (400/404) |
| `api.auth.spec.ts` | POST /auth/reset-password | Recuperação de senha |
| `api.posts.spec.ts` | GET /posts | Listar todos os posts |
| `api.posts.spec.ts` | GET /posts?limit=5 | Listar com limite |
| `api.posts.spec.ts` | GET /posts?limit=5&page=1 | Paginação |
| `api.posts.spec.ts` | POST /posts/like/{userId}/{postId} | Curtir post |
| `api.posts.spec.ts` | GET /posts/liked/{userId} | Posts curtidos do usuário |
| `api.posts.spec.ts` | POST /posts/unlike/{userId}/{postId} | Descurtir post |
