# SQA Social Media Frontend

Interface web da aplicação, desenvolvida com Next.js, React e TypeScript.

## Visão Geral

- Next.js 15
- React 19
- TypeScript
- Axios

O frontend roda por padrão em `http://localhost:3000` e consome a API em `http://localhost:8080`.

## Como Rodar

Pré-requisitos:

- Node.js 18+
- npm
- API rodando em `http://localhost:8080`

Clone o Repositório

```bash
git clone <url-do-repositorio>
cd client
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` em `client/`:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:8080
```

Execute em modo desenvolvimento:

```bash
npm run dev
```

Build de produção:

```bash
npm run build
npm start
```

## Rotas

- `/`: feed de posts
- `/signup`: cadastro
- `/signin`: login
- `/reset-password`: recuperação de senha
- `/auth/liked`: posts curtidos

## Estrutura

```
client/
├── src/
│   ├── app/                     # Páginas Next.js (App Router)
│   │   ├── page.tsx             # Home - Feed de posts
│   │   ├── signin/              # Página de login
│   │   ├── signup/              # Página de cadastro
│   │   ├── reset-password/      # Página de recuperação de senha
│   │   ├── auth/
│   │   │   └── liked/           # Página de posts curtidos (protegida)
│   │   ├── layout.tsx           # Layout principal da aplicação
│   │   └── globals.css          # Estilos globais e variáveis CSS
│   │
│   ├── components/              # Componentes reutilizáveis
│   │   ├── Button.tsx           # Botão customizado
│   │   ├── Input.tsx            # Input com validação
│   │   ├── Header.tsx           # Cabeçalho com navegação
│   │   ├── PostCard.tsx         # Card de post com like
│   │   └── TextButton.tsx       # Botão de texto (links)
│   │
│   ├── contexts/                # Contexts React
│   │   └── AuthContext.tsx      # Context de autenticação
│   │
│   ├── service/                 # Camada de serviços
│   │   ├── api.ts               # Cliente Axios configurado
│   │   ├── auth/
│   │   │   └── auth.ts          # Serviços de autenticação
│   │   ├── posts/
│   │   │   └── posts.ts         # Serviços de posts
│   │   └── types/
│   │       └── index.ts         # Interfaces TypeScript
│   │
│   ├── utils/                   # Funções utilitárias
│   │   ├── email.ts             # Validação de email
│   │   └── password.ts          # Validação de senha
│   │
│   └── lib/                     # Bibliotecas auxiliares
│       └── localStorage.ts      # Gerenciamento de localStorage
│
├── .env                         # Variáveis de ambiente (não commitado)
├── .gitignore                   # Arquivos ignorados pelo git
├── next.config.ts               # Configuração do Next.js
├── package.json                 # Dependências e scripts
└── tsconfig.json                # Configuração do TypeScript
```

## Scripts

- `npm run dev`: inicia o servidor de desenvolvimento.
- `npm run build`: gera o build de produção.
- `npm start`: inicia o build de produção.
- `npm run lint`: executa ESLint.
