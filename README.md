# ThotTalk — Real-Time Chat Application

![CI](https://github.com/Sylviedistribution/Real-time-Chat-Application/actions/workflows/ci.yml/badge.svg)
![Node](https://img.shields.io/badge/node-20.x-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/react-18-61DAFB?logo=react&logoColor=black)
![License](https://img.shields.io/badge/license-MIT-blue)

> **Master's Final Project — Software Engineering, GOMYCODE**
> Author: **Sylvestre IBOMBO GAKOSSO** · Dakar, Senegal · 2026

ThotTalk is a real-time messaging platform where users exchange messages instantly, either in **public rooms** (Discord-style communities anyone can discover and join) or in **private one-to-one conversations**. The name honors **Thoth**, the Egyptian god of writing and knowledge — the scribe of the gods, patron of everyone who has something to say.

| | |
|---|---|
| 🌍 **Live application** | https://thottalk.vercel.app |
| ⚙️ **API (health check)** | https://thottalk-api.onrender.com/api/health |
| 📖 **Interactive API docs** | https://thottalk-api.onrender.com/api-docs |
| 📄 **Academic report** | [`docs/report/`](docs/report/) *(2,500–3,500 words — research, design and deployment discussion)* |

> ⏱️ **Note:** the backend runs on Render's free tier, which sleeps after 15 minutes of inactivity. The first request may take up to a minute — the in-app loading screen covers this wake-up time.

---

## 1. The problem

Mainstream messaging platforms are **proprietary, centralized and opaque**: their code cannot be audited, their infrastructure cannot be self-hosted, and their business models rely on collecting user data. For communities, schools, and small organizations — particularly in resource-constrained contexts — there is a real need for communication tools that are **lightweight, open, auditable and deployable at zero infrastructure cost**.

ThotTalk addresses this need as a **proof of feasibility**: a complete, secure, production-deployed real-time messaging system built exclusively with open technologies, documented end-to-end (from UML design to incident journal), reproducible on any machine with a single Docker command, and hosted entirely on free-tier cloud services.

The project also serves a transparent second purpose, discussed in the academic report: mastering the engineering challenges specific to real-time systems — concurrency, connection lifecycle, per-channel authorization, optimistic UI reconciliation — which are among the hardest problems in modern web development.

**Who is it for?** Students, colleagues, and interest-based communities: anyone who needs instant group or private communication through discoverable rooms, without creating an account on a data-hungry platform.

## 2. Key features

- 🔐 **Full authentication** — registration, login, JWT sessions restored via `/auth/me`, bcrypt-hashed passwords (12 rounds), identical error messages that never reveal whether an email exists
- 🏛️ **Public rooms** — create, discover, join and leave rooms; ownership transfers automatically to the oldest member when the owner leaves; empty rooms are deleted
- 🛡️ **Moderation** — room owners can kick (temporary) or ban (permanent) members; banned users cannot rejoin
- 💬 **Private conversations** — one-to-one messaging with user search (debounced, regex-escaped); a canonical key in the database guarantees a single conversation per pair of users
- ⚡ **Real-time messaging** — Socket.IO with JWT-authenticated handshake, per-channel broadcast, optimistic sending with acknowledgment reconciliation, automatic re-join after reconnection
- 📜 **Paginated history** — compound-indexed message retrieval (30 per page, "has more" flag), loaded via REST while live messages arrive via socket
- 🎨 **Crafted UI** — a design system rooted in the Thoth mythology (lapis lazuli, gold, papyrus), three-tier loading states (splash screen / skeletons / discreet reconnection pill), URL-driven responsive layout down to 320 px
- 📖 **Interactive API documentation** — OpenAPI 3 specification with Swagger UI, testable in the browser

## 3. Architecture

```
                    ┌──────────────────────────┐
                    │        Browser (SPA)      │
                    │   React 18 + Vite + TW    │
                    └────────┬─────────┬───────┘
                     HTTPS   │         │  WSS (Socket.IO,
                     (REST)  │         │  JWT handshake)
                             ▼         ▼
   Vercel (static CDN)  ┌──────────────────────────┐
   serves the frontend  │      Node.js backend      │   Render
                        │  Express 5 · Socket.IO    │   (Docker container,
                        │                           │    non-root, healthcheck)
                        │  routes → controllers →   │
                        │  ★ shared service layer ★ │
                        │  → Mongoose models        │
                        └────────────┬──────────────┘
                                     │ mongodb+srv
                                     ▼
                        ┌──────────────────────────┐
                        │      MongoDB Atlas        │
                        │  users · rooms ·          │
                        │  conversations · messages │
                        └──────────────────────────┘
```

The defining architectural decision is the **shared service layer** (★): REST controllers and Socket.IO event handlers call the *same* service functions (`createMessage`, `assertCanAccess`…). Authorization rules and business logic are written once and enforced identically on both channels — eliminating the classic vulnerability of real-time apps where the socket path bypasses the REST security checks.

Other structuring decisions (all discussed in the academic report):

- **REST for state, sockets for events** — history and CRUD travel over paginated REST; live events are pushed through the socket. Each protocol does what it is best at.
- **Token-only client storage** — `localStorage` holds nothing but the JWT; the user profile is re-fetched from `/auth/me` at startup. The client is never a source of truth.
- **Two React contexts split by change frequency** — `AuthContext` (rarely changes) and `ChatContext` (changes constantly), preventing app-wide re-renders on every message.
- **URL as the single source of navigation truth** — `/chat/:channelId` drives the layout, so the browser back button, refresh and deep links behave natively, including on mobile.
- **Canonical pair key** — conversations store a sorted `userA_userB` key with a unique index; uniqueness is guaranteed by the database, not by application code, and survives race conditions.

Full UML documentation (use-case, class, sequence, activity, component and deployment diagrams) is available in [`docs/diagrams/`](docs/diagrams/).

## 4. Technology stack

| Layer | Technology | Why this choice |
|---|---|---|
| Frontend | **React 18 + Vite** | Component model fits a chat UI (message lists, panels); Vite's build outputs static files served free on a global CDN |
| Styling | **Tailwind CSS v4** | The design system (colors, fonts) is encoded in the theme — using an off-palette color is impossible by construction |
| State | **Context API** (2 contexts) | Redux would be over-engineering at this scale; splitting by change frequency solves the re-render problem Redux is often bought for |
| Backend | **Node.js 20 + Express** | Single language across the stack; Express's middleware chain maps naturally onto the security pipeline (helmet → CORS → rate-limit → validation → auth) |
| Real-time | **Socket.IO** | Chosen over raw WebSocket after studying its limits: rooms, acknowledgments, auto-reconnection and long-polling fallback would each require weeks of custom infrastructure |
| Database | **MongoDB Atlas + Mongoose** | Document model fits heterogeneous chat data; compound indexes `{room, createdAt}` make paginated history O(log n); free M0 cluster |
| Auth | **JWT + bcrypt** | Stateless sessions (no server-side session store to scale); bcrypt with 12 rounds for password storage |
| Validation | **express-validator** | Three defensive layers: HTML constraints → express-validator sanitization → Mongoose schema rules |
| Tests | **Jest + Supertest + mongodb-memory-server** | Integration tests over a real in-memory MongoDB: authentic Mongoose behavior (indexes, hooks) with total isolation and no network |
| API docs | **swagger-autogen + Swagger UI** | OpenAPI 3 spec generated from route annotations, served interactively at `/api-docs` |
| Containers | **Docker + docker-compose** | Multi-stage Alpine build, non-root user, healthcheck; `docker compose up` reproduces the full stack (API + MongoDB) on any machine |
| CI | **GitHub Actions** | Backend test suite + frontend lint & build on every push; broken code never reaches production |
| Hosting | **Vercel + Render + Atlas** | Static frontend on a CDN, containerized always-on backend, managed database — a realistic cloud topology at zero cost |

## 5. Repository structure

```
Real-time-Chat-Application/
├── chat-app/                  # Backend (Node.js / Express / Socket.IO)
│   ├── src/
│   │   ├── config/            # Environment validation (fail-fast), DB connection
│   │   ├── models/            # Mongoose schemas: User, Room, Conversation, Message
│   │   ├── services/          # ★ Business logic, shared by REST and sockets
│   │   ├── controllers/       # Thin HTTP adapters (try → service → respond)
│   │   ├── validators/        # express-validator rules per domain
│   │   ├── routes/            # Routers + index.js mounting summary
│   │   ├── middlewares/       # auth (JWT), validation, rate-limit, error handling
│   │   ├── sockets/           # Socket.IO init (JWT handshake) + event handlers
│   │   ├── app.js             # Express app (exported without listening — testable)
│   │   └── server.js          # HTTP server + Socket.IO graft
│   ├── tests/                 # Jest/Supertest suites (39 tests) + in-memory DB setup
│   ├── Dockerfile             # Multi-stage, Alpine, non-root, healthcheck
│   ├── docker-compose.yml     # API + MongoDB in one command
│   └── swagger.js             # OpenAPI generation script
├── client/                    # Frontend (React / Vite / Tailwind)
│   └── src/
│       ├── api/               # Axios instance (interceptors) + one file per domain
│       ├── context/           # AuthContext, ChatContext
│       ├── hooks/             # useAuth, useChat, useSocket, useMessages
│       ├── sockets/           # Socket.IO client singleton
│       ├── components/        # ui/ · chat/ · rooms/ · layouts/
│       └── pages/             # Login, Register, Chat, ChatRoom, Profile
├── docs/                      # Diagrams, screenshots, QA grids, academic report
└── .github/workflows/ci.yml   # Continuous integration
```

## 6. Running locally

**Prerequisites:** Node.js ≥ 20, npm, and either a MongoDB instance or Docker.

### Option A — Docker (recommended, one command)

```bash
git clone https://github.com/Sylviedistribution/Real-time-Chat-Application.git
cd Real-time-Chat-Application/chat-app
docker compose up --build
# API on http://localhost:5000 — docs on http://localhost:5000/api-docs
```

Then, in another terminal:

```bash
cd ../client
npm install
echo "VITE_API_URL=http://localhost:5000/api" > .env
npm run dev
# App on http://localhost:5173
```

### Option B — Manual

```bash
# Backend
cd chat-app
npm install
cp .env.example .env        # then fill in the values (see below)
npm run dev

# Frontend (second terminal)
cd client
npm install
echo "VITE_API_URL=http://localhost:5000/api" > .env
npm run dev
```

### Environment variables

| Variable | Location | Description |
|---|---|---|
| `PORT` | backend | HTTP port (default 5000; injected by Render in production) |
| `NODE_ENV` | backend | `development` / `production` / `test` |
| `MONGODB_URI` | backend | MongoDB connection string (Atlas or local/Docker) |
| `JWT_SECRET` | backend | Token signing secret — generate with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `JWT_EXPIRES_IN` | backend | Token lifetime (e.g. `7d`) |
| `CLIENT_URL` | backend | Comma-separated list of allowed CORS origins |
| `VITE_API_URL` | frontend | Base URL of the API (build-time variable) |

The server **fails fast**: it refuses to boot if a required variable is missing, instead of failing at the first request.

## 7. API overview

Sixteen REST endpoints across five domains — fully documented and testable at [`/api-docs`](https://thottalk-api.onrender.com/api-docs):

| Domain | Endpoints |
|---|---|
| Auth | `POST /auth/register` · `POST /auth/login` · `GET /auth/me` |
| Users | `GET /users/search?q=` · `PATCH /users/me` |
| Rooms | `GET/POST /rooms` · `GET/DELETE /rooms/:id` · `POST /rooms/:id/join` · `/leave` · `/kick/:userId` |
| Conversations | `GET /conversations` · `POST /conversations/with/:userId` |
| Messages | `GET /messages/:channelId?page=&limit=` · `POST /messages/:channelId` |

**Socket.IO events** (JWT required at handshake): `channel:join` / `channel:leave` (with server-side membership check), `message:send` (persist → broadcast → private ack), `message:new` (broadcast to channel members).

## 8. Security measures

- JWT verification on **both** channels: Express middleware for REST, handshake middleware for Socket.IO — an unauthenticated socket is refused before any event is processed
- **Per-channel authorization** (`assertCanAccess`): being logged in never grants access to a room or conversation you are not a member of; enforced in the shared service layer
- bcrypt (12 rounds), passwords stored with `select: false` and never serialized
- Generic authentication errors — the API never reveals whether an email exists
- Input validation and sanitization on every entry point; user search input is regex-escaped against ReDoS
- Rate limiting: 300 req/15 min globally, 10 req/15 min on auth routes (`/socket.io` path exempted — it has its own handshake protection)
- `helmet` security headers, strict CORS allow-list, bounded JSON bodies (1 MB), messages capped at 2,000 characters, pagination capped at 100
- Docker container runs as a **non-root user**; test tooling and secrets are excluded from the production image

## 9. Testing & CI

**39 integration and socket tests** run against a real in-memory MongoDB (`mongodb-memory-server`), wiped between tests:

```bash
cd chat-app
npm test              # full suite
npm run test:coverage # with coverage report
```

Coverage highlights: the full authentication flow (including the "identical error message" security property), every room business rule (ownership transfer, ban persistence, cascade deletion), per-channel authorization on both REST and socket paths, pagination arithmetic and chronological ordering, and a live Socket.IO server test (ephemeral port, two real clients, broadcast + persistence assertion).

The suite runs on **every push** via GitHub Actions, alongside the frontend lint and production build.

## 10. Deployment

| Component | Platform | Method |
|---|---|---|
| Frontend | **Vercel** | Static build from `client/`, SPA rewrite via `vercel.json`, `VITE_API_URL` injected at build time |
| Backend | **Render** | Docker image built from `chat-app/Dockerfile`, health-checked on `/api/health`, `trust proxy` enabled |
| Database | **MongoDB Atlas** | Managed M0 cluster |

Production-specific configuration: multi-origin CORS (production + local development), proxy-aware IP resolution for accurate rate limiting, and a freshly generated production JWT secret. Deployment issues encountered and resolved (CORS bootstrap, cold starts, WebSocket fallback) are documented in the academic report.

## 11. Engineering journal

Development was documented incident by incident: **20 anomalies** across the REST and real-time phases are recorded in a structured journal (symptom → diagnosis → root cause → fix → lesson), available in [`docs/`](docs/). Highlights include a race condition between socket broadcast and acknowledgment (duplicate rendering), room membership loss after reconnection (Socket.IO rooms are connection-scoped), and a missing auth guard revealed by a crash — each now locked by a regression test.

## 12. Known limitations

- **Presence indicators are static** — `User.status` is never updated, so members always appear offline; live presence is the next planned feature
- **Cold starts** on Render's free tier (≈ 50 s after 15 min of inactivity)
- Atlas network access is open (`0.0.0.0/0`) because free-tier Render has no fixed IP — security relies on credentials; a paid tier would allow IP allow-listing or VPC peering
- Native browser dialogs (`confirm`/`alert`) are used for destructive actions — custom modals are planned
- No end-to-end encryption (messages are TLS-protected in transit and access-controlled at rest, but readable by the server)

## 13. Future work

- **Live presence & activity** — online/offline status, typing indicator, read receipts, unread counters (the socket event pattern is already in place)
- Push the **Thoth visual identity** further: mascot (an ibis), themed illustrations, dark mode
- Room invitations and private rooms (`isPrivate` flag already modeled)
- File and image sharing; message editing and deletion
- Schema-first validation (zod) to unify the three validation layers into one source of truth
- Horizontal scaling of Socket.IO with the Redis adapter

## 14. Documentation

| Document | Location |
|---|---|
| Academic report (research, design, deployment — EN) | `docs/report/` |
| UML diagrams (6, Mermaid sources) | `docs/diagrams/` |
| Incident journal (20 documented anomalies) | `docs/` |
| Interactive API reference | [`/api-docs`](https://thottalk-api.onrender.com/api-docs) |

## 15. Author

**Sylvestre IBOMBO GAKOSSO**
Master's degree in Software Engineering — GOMYCODE, Dakar
GitHub: [@Sylviedistribution](https://github.com/Sylviedistribution)

*ThotTalk is the capstone of a 17-month software engineering program: the synthesis of everything learned, and a demonstration of what I can build — from a blank UML diagram to a tested, documented, containerized application running in production.*

## 16. License

Released under the **MIT License** — free to use, study, modify and distribute.