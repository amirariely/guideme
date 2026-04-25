# GuideMe — Smart Ambient Parenting Companion

AI-powered baby cry interpretation, activity tracking, and parenting guidance.

---

## Architecture

```
guideme/
├── frontend/    ← React + Vite + Tailwind (iPhone-style web app)
└── backend/     ← Node.js + Express + Prisma + PostgreSQL
```

---

## Quick Start

### Prerequisites
- Node.js 18+ (you have v24)
- PostgreSQL running locally

### 1. Database setup (one-time)

```sql
psql -U postgres -h localhost
CREATE DATABASE guideme;
CREATE USER guideme_user WITH PASSWORD 'guideme123';
GRANT ALL PRIVILEGES ON DATABASE guideme TO guideme_user;
\q
```

### 2. Backend

```bash
cd backend
npm install
```

Edit `.env` — set your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-api03-your-real-key-here
```

Run database migration (creates all tables):
```bash
npx prisma migrate dev --name init
```

Start the server:
```bash
npm run dev
```

You should see: `✅ GuideMe backend running on http://localhost:3001`

### 3. Frontend

Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 — GuideMe is running!

---

## How It Works

### Auth Flow
1. User registers on Onboard Step 1 (name, email, password + baby name/DOB)
2. JWT token is returned and stored in localStorage
3. All subsequent API calls include the token in the Authorization header
4. On page reload, the app checks for an existing token and auto-logs in

### Data Flow
- **Baby Profile** → saved to PostgreSQL via Prisma on onboarding completion
- **Activity Logs** → saved to DB on every log, fetched on login/reload
- **Chat** → frontend sends messages to backend, backend calls Claude API (key never exposed to browser)
- **Partner Sync** → invite by email, auto-links if partner already has an account

### Folder Structure

```
backend/
├── prisma/schema.prisma          ← Database schema
├── src/
│   ├── index.js                  ← Server entry
│   ├── prisma.js                 ← Prisma client singleton
│   ├── middleware/
│   │   ├── auth.js               ← JWT verification
│   │   └── errorHandler.js       ← Global error handler
│   ├── routes/
│   │   ├── auth.js               ← /api/auth/*
│   │   ├── baby.js               ← /api/baby/*
│   │   ├── activities.js         ← /api/activities/*
│   │   ├── chat.js               ← /api/chat
│   │   └── partner.js            ← /api/partner/*
│   └── controllers/              ← Business logic
│       ├── auth.js
│       ├── baby.js
│       ├── activities.js
│       ├── chat.js
│       └── partner.js
```

### API Endpoints

| Method | Endpoint                    | Auth | Description |
|--------|-----------------------------|------|-------------|
| POST   | /api/auth/register          | No   | Create account |
| POST   | /api/auth/login             | No   | Sign in |
| GET    | /api/auth/me                | Yes  | Current user info |
| GET    | /api/baby                   | Yes  | Get baby profile |
| POST   | /api/baby                   | Yes  | Create baby profile |
| PATCH  | /api/baby/:id               | Yes  | Update baby profile |
| PATCH  | /api/baby/:id/permissions   | Yes  | Update AI permissions |
| GET    | /api/activities             | Yes  | List activities |
| POST   | /api/activities             | Yes  | Log activity |
| GET    | /api/activities/:id         | Yes  | Get single activity |
| DELETE | /api/activities/:id         | Yes  | Delete activity |
| POST   | /api/chat                   | Yes  | Send message to AI |
| POST   | /api/partner/invite         | Yes  | Invite partner |
| GET    | /api/partner                | Yes  | Get linked partner |
| GET    | /api/partner/pending        | Yes  | List invitations |
| PATCH  | /api/partner/:id/accept     | Yes  | Accept invitation |

### Useful Commands

```bash
# View database in browser
cd backend && npx prisma studio

# Reset database (deletes all data)
cd backend && npx prisma migrate reset

# Create a new migration after schema changes
cd backend && npx prisma migrate dev --name describe_change
```

---

## Stages

| Stage | Status | Description |
|-------|--------|-------------|
| 1 — Frontend Shell   | ✅ Done | All screens, navigation, iPhone UI |
| 2 — Backend          | ✅ Done | Express + Prisma + PostgreSQL + JWT |
| 3 — Wired Up         | ✅ Done | Frontend calls real backend |
| 4 — AI Engine        | ⏳ Next | Cry interpretation microservice |
