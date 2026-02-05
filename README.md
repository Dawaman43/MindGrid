# MindGrid

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines Next.js, Elysia, TRPC, and more.

## Overview

MindGrid is an enterprise knowledge platform that centralizes, organizes, and makes company knowledge instantly accessible. It connects to common workplace tools, indexes information semantically, and powers AI-assisted Q&A so employees can find answers quickly. It also surfaces analytics about knowledge usage and gaps to help teams stay aligned and informed.

### Why it matters

Enterprise knowledge is often scattered across chat, docs, and intranets. MindGrid reduces time spent searching, improves onboarding, and gives leaders visibility into what information exists (and what is missing).

### Core capabilities

- **Data ingestion & integration** from sources like Google Workspace, Microsoft 365, Slack, Teams, Confluence, and SharePoint.
- **Semantic search** with embeddings and natural-language queries.
- **AI-powered Q&A** that summarizes answers or surfaces the most relevant documents.
- **Auto-tagging & categorization** by topic, team, project, or document type.
- **Role-based access control** aligned with SSO/LDAP permissions.
- **Analytics & insights** for knowledge usage, gaps, and adoption.

### Architecture at a glance

1. **Ingestion layer**: Crawlers and APIs pull content from connected systems.
2. **Storage layer**: Raw files in object storage, metadata in PostgreSQL, and embeddings in a vector database.
3. **AI processing**: Text cleaning, embedding generation, and auto-tagging.
4. **Application layer**: Web UI and APIs for search, Q&A, and document discovery.
5. **Analytics**: Dashboards for usage metrics and knowledge gaps.

## Features

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework
- **React Native** - Build mobile apps using React
- **Expo** - Tools for React Native development
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Elysia** - Type-safe, high-performance framework
- **tRPC** - End-to-end type-safe APIs
- **Bun** - Runtime environment
- **Drizzle** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Authentication** - Better-Auth
- **Turborepo** - Optimized monorepo build system
- **Biome** - Linting and formatting

## Getting Started

First, install the dependencies:

```bash
bun install
```

## Database Setup

This project uses PostgreSQL with Drizzle ORM.

1. Make sure you have a PostgreSQL database set up.
2. Update your `apps/server/.env` file with your PostgreSQL connection details.

3. Apply the schema to your database:

```bash
bun run db:push
```

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.
Use the Expo Go app to run the mobile application.
The API is running at [http://localhost:3000](http://localhost:3000).

## Deployment (Cloudflare via Alchemy)

- Dev: cd apps/web && bun run alchemy dev
- Deploy: cd apps/web && bun run deploy
- Destroy: cd apps/web && bun run destroy

For more details, see the guide on [Deploying to Cloudflare with Alchemy](https://www.better-t-stack.dev/docs/guides/cloudflare-alchemy).

## Git Hooks and Formatting

- Format and lint fix: `bun run check`

## Project Structure

```
MindGrid/
├── apps/
│   ├── web/         # Frontend application (Next.js)
│   ├── native/      # Mobile application (React Native, Expo)
│   └── server/      # Backend API (Elysia, TRPC)
├── packages/
│   ├── api/         # API layer / business logic
│   ├── auth/        # Authentication configuration & logic
│   └── db/          # Database schema & queries
```

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run dev:web`: Start only the web application
- `bun run dev:server`: Start only the server
- `bun run check-types`: Check TypeScript types across all apps
- `bun run dev:native`: Start the React Native/Expo development server
- `bun run db:push`: Push schema changes to database
- `bun run db:generate`: Generate database client/types
- `bun run db:migrate`: Run database migrations
- `bun run db:studio`: Open database studio UI
- `bun run check`: Run Biome formatting and linting
