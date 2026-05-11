# AGENTS.md

## Informações do Projeto

### Nome do Projeto

fsw-barber

### Descrição

Este projeto é uma aplicação web desenvolvida com Next.js, TailwindCSS e Prisma. Ele utiliza autenticação com NextAuth e possui integração com um banco de dados PostgreSQL.

---

## Arquitetura do Projeto

### Estrutura de Pastas

- **app/**: Contém os componentes principais, páginas e ações do projeto.

  - **\_actions/**: Funções para manipulação de dados, como criar, deletar e buscar agendamentos.
  - **\_components/**: Componentes reutilizáveis, como itens de barbearia, rodapé, cabeçalho, etc.
  - **\_constants/**: Constantes usadas no projeto.
  - **\_data/**: Funções para buscar dados específicos, como agendamentos concluídos e confirmados.
  - **\_lib/**: Bibliotecas auxiliares, como autenticação e utilitários.
  - **\_providers/**: Provedores de contexto, como autenticação.
  - **api/**: Rotas de API, como autenticação.
  - **barbershops/**: Páginas relacionadas às barbearias.
  - **bookings/**: Páginas relacionadas aos agendamentos.
  - **fonts/**: Fontes utilizadas no projeto.

- **prisma/**: Configuração do Prisma e migrações do banco de dados.
- **public/**: Arquivos públicos, como imagens e ícones.
- **messages/**: Arquivos de tradução para internacionalização.

---

## Dependências

### Dependências Principais

- **@auth/prisma-adapter**: ^2.9.0
- **@hookform/resolvers**: ^5.0.1
- **@prisma/client**: ^6.6.0
- **@radix-ui/react-avatar**: ^1.1.7
- **@radix-ui/react-dialog**: ^1.1.11
- **@radix-ui/react-label**: ^2.1.4
- **class-variance-authority**: ^0.7.1
- **clsx**: ^2.1.1
- **date-fns**: ^3.6.0
- **framer-motion**: ^12.29.0
- **next**: ^14.2.28
- **next-auth**: ^4.24.7
- **react**: ^18
- **react-hook-form**: ^7.56.1
- **tailwindcss**: ^3.2.0
- **zod**: ^3.24.3

### Dependências de Desenvolvimento

- **@types/node**: ^20
- **@types/react**: ^18
- **eslint**: ^8
- **husky**: ^9.1.7
- **lint-staged**: ^15.5.1

---

## Configurações

### TypeScript

- **strict**: true
- **moduleResolution**: bundler
- **paths**: Configurado para usar alias `@/*`.

### TailwindCSS

- **darkMode**: class
- **content**: Inclui arquivos em `pages`, `components` e `app`.
- **theme**: Personalizado com cores baseadas em variáveis CSS.

### Prisma

- **Banco de Dados**: PostgreSQL
- **Modelos**:
  - **User**: Representa os usuários do sistema.
  - **Account**: Informações de contas de autenticação.
  - **Session**: Sessões de autenticação.

---

## Scripts Disponíveis

- **dev**: Inicia o servidor de desenvolvimento.
- **build**: Gera a build de produção.
- **start**: Inicia o servidor em produção.
- **lint**: Executa o linter.
- **prepare**: Configura o Husky e gera o cliente Prisma.

---

## Observações

- O projeto utiliza internacionalização com arquivos JSON em `messages/`.
- As migrações do banco de dados estão localizadas em `prisma/migrations/`.
- O arquivo `prisma/seed.ts` é usado para popular o banco de dados inicial.

---

## Como Continuar o Desenvolvimento

1. Certifique-se de que o banco de dados PostgreSQL está configurado e acessível.
2. Use `npm run dev` para iniciar o servidor de desenvolvimento.
3. Para adicionar novas funcionalidades:
   - Crie ou edite componentes em `app/_components/`.
   - Adicione novas rotas em `app/`.
   - Atualize o esquema Prisma em `prisma/schema.prisma` e execute `npx prisma migrate dev`.
4. Para internacionalização, edite os arquivos em `messages/`.

---

## Contato

Para dúvidas ou suporte, entre em contato com o desenvolvedor responsável.
