
# 📄 MonoRepo CourseSphere - jvras

## 📚 Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Stack Tecnológica Principal](#stack-tecnológica-principal)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Instalação e Configuração](#instalação-e-configuração)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Checklist](#checklist)
- [Desafio](#desafio)
- [Documentação](#documentação)
- [Autor](#autor)
- [Licença](#licença)
- [Referências Técnicas](#referências-técnicas)

---

## 📖 Sobre o Projeto

O **MonoRepo CourseSphere** é um template para criar projetos rapidos com Next.js e Fastify RestApi

---

## 🛠️ Stack Tecnológica Principal

Tecnologias principais utilizadas no projeto:

| **Categoria**         | **Tecnologia**    | **Versão**       |
|-----------------------|-------------------|------------------|
| **Runtime**           | Node.js           | v20.x.x          |
| **Frontend**          | Next.js           | v15.x.x          |
| **Backend**           | Fastify.js        | v5.x.x           |
| **ORM**               | Prisma            | v5.x.x           |
| **Linguagem**         | TypeScript        | -                |
| **Componentes UI**    | shadcn/UI         | -                |
| **Gerenciador de pacotes** | pnpm         | v5.x.x           |

Outras bibliotecas:
- **Zod** para validação de dados
- **React Hook Form** para formulários
- **TanStack** para manipulação avançada de dados

---

## 🧱 Arquitetura do Projeto

Este é um monorepo com a seguinte estrutura principal:

```bash

CourseSphere/
├── apps/
│   ├── web/           # Front-end (Next.js)
│   └── server/        # Back-end (Fastify)
├── packages/
│   ├── eslint-config/ # Configurações de lint
│   └── typescript-config/
└── docs/              # Documentações adicionais

```

---

## ⚙️ Instalação e Configuração

Siga os passos abaixo para rodar o projeto localmente:

### 1. Clone o repositório

```bash
git clone https://github.com/jvras58/CourseSphere-vlab
cd CourseSphere
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure variáveis de ambiente

Crie um arquivo `.env` baseado em `.env-example` com as credenciais necessárias.

### 4. Configure o banco de dados

```bash
npx prisma generate
npx prisma migrate dev
npx run db:seed
```

### 5. Inicie o ambiente de desenvolvimento

```bash
pnpm dev
```

Acesse em: [http://localhost:3000](http://localhost:3000)

---

## 💻 Funcionalidades Principais

* Página inicial

## WEB:
[🔗 Acesse a Landing Page](http://localhost:3000/)
[login Page](http://localhost:3000/sign-in)
[Cadastro Page](http://localhost:3000/sign-up)
[Dashboard page](http://localhost:3000/dashboard)

## SERVER:
[📘 Documentação Swagger ](http://localhost:8000/docs)
[⚙️ Testes](#Testes)

## 📖 Testes:

Execute os testes do projeto com os comandos abaixo:

| Comando                | Descrição                                              |
|------------------------|--------------------------------------------------------|
| `pnpm run test`        | Executa todos os testes uma vez (modo padrão)          |
| `pnpm run test:watch`  | Executa os testes em modo watch (atualização contínua) |
| `pnpm run test:cov`    | Executa os testes e exibe o relatório de cobertura     |

---

## 📝 Checklist

> Acompanhe o progresso por etapas do projeto:

[📋 Checklist de Desenvolvimento](/docs/PERSONAL/CHECKPOINT.MD)

---

## 📘 Documentação

> Documentação técnica interna detalhada:

[📁 Documentação Técnica do Projeto](/CourseSphere/README.md)

[📄DBML BANCO DE DADOS](/docs/PERSONAL/DBML.png)

---

## 🧑‍💻 Autor

* [jvras](https://github.com/jvras58)

---

## 📜 Licença

Este projeto ainda não possui uma licença definida.

---

## 🔍 Referências Técnicas

* [Next.js 15 Docs](https://nextjs.org/docs/getting-started)
* [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching)
* [TanStack](https://tanstack.com/)
* [React Hook Form](https://react-hook-form.com/)
* [Zod](https://zod.dev/)
* [Fastify](https://www.fastify.io/)
