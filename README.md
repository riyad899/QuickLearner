# QuickLearner API

Backend API project built with **Node.js**, **TypeScript**, **Express**, **Prisma**, and **Better Auth**.

## Tech Stack

- Node.js + TypeScript
- Express 5
- Prisma ORM + PostgreSQL
- Better Auth
- ESLint

## Project Structure

```text
.
├── prisma/
│   └── Schema/
├── src/
│   ├── app/
│   │   ├── lib/
│   │   ├── module/
│   │   │   ├── Auth/
│   │   │   ├── instructor/
│   │   │   └── speciality/
│   │   ├── routes/
│   │   └── shared/
│   ├── config/
│   ├── generated/
│   └── middleware/
├── prisma.config.ts
├── tsconfig.json
└── package.json
```

## Prerequisites

- Node.js (LTS recommended)
- npm
- PostgreSQL connection string (`DATABASE_URL`)

## Environment Variables

Create a `.env` file in the project root and add:

```env
NODE_ENV=development
PORT=8000
DATABASE_URL="postgres://username:password@host:5432/dbname?sslmode=require"
BETTER_AUTH_SECRET=your_secret_here
BETTER_AUTH_URL=http://localhost:8000
```

## Install & Run

```bash
npm install
npm run generate
npm run dev
```

Server starts using `src/server.ts` and mounts API routes under `/api/v1`.

## Available Scripts

- `npm run dev` – Run development server with `tsx watch`
- `npm run build` – Compile TypeScript to `dist/`
- `npm start` – Run production build from `dist/server.js`
- `npm run lint` – Lint `src/`
- `npm run generate` – Generate Prisma client
- `npm run migrate` – Run `prisma migrate dev`
- `npm run studio` – Open Prisma Studio

## Prisma Workflow

```bash
npx prisma migrate dev --name init
npm run generate
npm run studio
```

If `prisma` is not installed globally, always use `npx prisma ...`.

## API Routes

Base URL: `http://localhost:<PORT>/api/v1`

### Auth

- `POST /auth/regsiter`
- `POST /auth/login`

### Speciality

- `POST /spaciality`
- `GET /spaciality`
- `DELETE /spaciality/:id`

### Instructor

- `POST /instructor/create-doctor`

## Notes

- Route and file naming currently use `spaciality`/`regsiter` spellings in code; keep requests aligned with existing routes unless you refactor.
- There is also a direct route in `src/server.ts`: `POST /specialities`.

## Build for Production

```bash
npm run build
npm start
```
