# 🧩 Turborepo — CourseSphere

Este repositório utiliza o [Turborepo](https://turbo.build/repo) para organizar o monorepo do projeto **CourseSphere**, com aplicações separadas de front-end e back-end, além de pacotes compartilháveis entre elas.

---

## 🗂 Estrutura do Monorepo

A estrutura de diretórios está organizada da seguinte forma:

```

CourseSphere/
├── apps/
│   ├── web/           # Aplicação Next.js (Front-end)
│   └── server/        # Aplicação Fastify.js (Back-end)
├── packages/
│   ├── ui/            # Biblioteca de componentes React reutilizáveis
│   ├── eslint-config/ # Configuração compartilhada de ESLint
│   └── typescript-config/ # Configurações globais de TypeScript
└── docs/              # Documentação geral

````

---

## 📦 Pacotes e Aplicações

### Aplicações

- **`apps/server`** — Servidor back-end com [Fastify](https://fastify.dev/)
- **`apps/web`** — Aplicação front-end com [Next.js](https://nextjs.org/)

### Pacotes Compartilhados

- **`@repo/eslint-config`** — Configuração unificada de lint
- **`@repo/typescript-config`** — Base `tsconfig` compartilhada

---

## 🧰 Utilitários e Ferramentas

Este repositório inclui:

- ✅ **TypeScript** — Tipagem estática
- ✅ **ESLint** — Análise de código com regras unificadas
- ✅ **Prettier** — Formatação automática
- ✅ **Turborepo** — Build system para monorepos

---

## 🛠️ Scripts Importantes

### 🔧 Build do Projeto

```bash
cd CourseSphere
pnpm build
````

Compila todas as aplicações e pacotes.

---

### 🚀 Ambiente de Desenvolvimento

```bash
cd CourseSphere
pnpm dev
```

Executa todas as aplicações (`web` e `server`) em modo de desenvolvimento.

---

## 📖 Referências

* [Turborepo Docs](https://turbo.build/repo/docs)
* [Next.js](https://nextjs.org/)
* [Fastify](https://fastify.dev/)
* [shadcn/UI](https://ui.shadcn.com/)
* [React Hook Form](https://react-hook-form.com/)
* [Zod](https://zod.dev/)


