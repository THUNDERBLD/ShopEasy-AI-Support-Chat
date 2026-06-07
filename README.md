# ShopEasy AI Support Chat

A production-ready AI live chat support widget for **ShopEasy**, a fictional e-commerce store. Built as a take-home assignment for the Spur Founding Full-Stack Engineer role.

Users chat with an AI support agent that answers questions about shipping, returns, payments, and orders. Every conversation is persisted, sessions survive page reloads, and the LLM layer is fully swappable via a single environment variable.

---

## Tech Stack

**Frontend**
- React + TypeScript + Vite
- Tailwind CSS
- Zustand (state management)
- Axios

**Backend**
- Node.js + TypeScript + Express
- SQLite via `better-sqlite3` (zero-setup, file-based)
- ES Modules throughout (`"type": "module"`)

**LLM Providers (switchable)**
| Provider | Model | Free Tier |
|---|---|---|
| Google Gemini | `gemini-1.5-flash` | ✅ Default — free |
| Cohere | `command-r-plus` | ✅ Free tier available |
| OpenAI | `gpt-4o-mini` | ❌ Paid |
| Anthropic Claude | `claude-haiku-4-5` | ❌ Paid |

---

## Local Setup

### Prerequisites
- Node.js 18+
- npm
- A free API key from [Google AI Studio](https://aistudio.google.com/app/apikey) or [Cohere](https://dashboard.cohere.com/api-keys)

---

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

---

### 2. Set up the Server

```bash
cd Server
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Open `Server/.env` and fill in your values:

```env
# Which LLM to use — options: gemini | cohere | openai | claude
LLM_PROVIDER=gemini

# Add the key for whichever provider you chose above
GEMINI_API_KEY=your_gemini_key_here
COHERE_API_KEY=your_cohere_key_here
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here

PORT=3001
MAX_MESSAGE_LENGTH=5000
MAX_HISTORY_MESSAGES=10
```

> You only need to fill in the key for the provider you set in `LLM_PROVIDER`. The rest can stay empty.

**Get a free Gemini key:** https://aistudio.google.com/app/apikey — sign in with Google, click "Create API Key". No credit card needed.

**Get a free Cohere key:** https://dashboard.cohere.com/api-keys — sign up, copy your trial key. No credit card needed.

Start the server:

```bash
npm run dev
```

You should see:
```
✅ LLM Provider: gemini
✅ Database migrations complete
🚀 Server running at http://localhost:3001
```

> The SQLite database is created automatically at `Server/data/chat.db` on first run. No migrations to run manually.

---

### 3. Set up the Client

Open a new terminal:

```bash
cd Client
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

`Client/.env` should contain:

```env
VITE_API_BASE_URL=http://localhost:3001
```

Start the frontend:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

### 4. Verify it works

- Type a message like *"What is your return policy?"*
- The AI should reply within a few seconds
- Refresh the page — your conversation history should restore automatically

---

## Switching LLM Providers

Change one line in `Server/.env`:

```env
LLM_PROVIDER=cohere   # or: gemini | openai | claude
```

Then add the corresponding API key and restart the server. No code changes needed — the provider layer is fully encapsulated.

---

## Architecture Overview

```
Client (React + Zustand)
    ↓  HTTP (Axios)
Server (Express + TypeScript)
    ├── routes/chat.ts          → POST /chat/message, GET /chat/history/:sessionId
    ├── middleware/
    │   ├── validate.ts         → Input validation (empty, length)
    │   └── errorHandler.ts     → Global error handler — server never crashes on bad input
    ├── services/
    │   ├── chatService.ts      → All DB operations (save messages, fetch history)
    │   └── llm/
    │       ├── llmService.ts   → Provider router — reads LLM_PROVIDER env var
    │       ├── geminiProvider.ts
    │       ├── cohereProvider.ts
    │       ├── openaiProvider.ts
    │       └── claudeProvider.ts
    └── db/
        ├── database.ts         → SQLite singleton with WAL mode
        └── migrations.ts       → Auto-creates tables on server start
```

### Request flow

1. User types a message → Zustand `sendMessage()` action fires
2. User message appended to UI immediately (optimistic update)
3. POST `/chat/message` sent to backend with `{ message, sessionId }`
4. Backend validates input → resolves or creates session → saves user message to DB
5. Last 10 messages fetched as context → passed to `generateReply()`
6. LLM provider called → reply returned
7. AI reply saved to DB → returned to client
8. Zustand appends AI reply → UI updates

### Session management

- On first message, the backend creates a new `conversationId` (UUID) and returns it
- Client stores it in `localStorage` as `shopeasy_session_id`
- On every subsequent message, the same `sessionId` is sent — backend continues the existing conversation
- On page reload, client reads `sessionId` from `localStorage` and calls `GET /chat/history/:sessionId` to restore the full conversation

---

## Data Model

```sql
conversations (
  id          TEXT PRIMARY KEY,   -- UUID
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
)

messages (
  id              TEXT PRIMARY KEY,   -- UUID
  conversation_id TEXT NOT NULL,      -- FK → conversations.id
  sender          TEXT NOT NULL,      -- "user" | "ai"
  text            TEXT NOT NULL,
  timestamp       TEXT NOT NULL
)
```

---

## LLM Notes

### Provider
Google Gemini (`gemini-1.5-flash`) is the default — it has a generous free tier with no credit card required, making it easy for anyone to clone and run this project without any cost.

### Prompting strategy
Each request sends:
1. A **system prompt** containing the agent's persona and the full ShopEasy store knowledge base (shipping policy, returns, refunds, support hours, payment methods, order tracking, cancellations) — hardcoded in `llmService.ts`
2. The **last 10 messages** from the conversation as context so replies are always coherent and contextual
3. The current **user message**

The store knowledge is embedded directly in the system prompt rather than stored in a separate DB table — this keeps the architecture simple and the context always available without an extra query per request.

### Error handling
All LLM API errors (timeouts, rate limits, invalid keys, empty responses) are caught inside each provider file. On failure, a friendly fallback message is returned to the user instead of crashing: *"I'm sorry, I'm having trouble connecting right now. Please try again in a moment or email us at support@shopeasy.com."*

---

## Robustness

| Scenario | Handling |
|---|---|
| Empty message | Frontend: send button disabled. Backend: 400 error |
| Message > 5000 chars | Frontend: character counter warning. Backend: 400 error |
| LLM API failure | Caught per-provider, friendly message returned |
| Invalid / expired sessionId | New session created automatically |
| Missing API key | Server exits on startup with a clear error message |
| Backend crash | Global `errorHandler.ts` middleware catches all unhandled errors |
| Network failure | Zustand `error` state → shown as dismissible banner in UI |
| Rapid consecutive sends | Send button disabled while request is in flight |

---

## Trade-offs & If I Had More Time

**SQLite over PostgreSQL**
SQLite was chosen deliberately — zero setup for the reviewer, no running database process, and it's perfectly sufficient for this scale. The `chatService.ts` layer is fully abstracted so swapping to PostgreSQL would only require changing the DB connection and query syntax.

**FAQ in system prompt vs DB**
The store knowledge is hardcoded in the system prompt. For a real product this would live in a database table so support teams could update it without touching code. The `llmService.ts` interface is already structured to accept a dynamic system prompt, so this would be a small change.

**Redis caching (planned, not implemented)**
The architecture was designed with Redis in mind. The plan is to cache `conversation:{sessionId}` → last 10 messages with a 1-hour TTL, so the DB isn't hit on every message. For this exercise SQLite reads are fast enough that Redis isn't necessary, and keeping v1 simple makes it easier to review.

**Streaming responses**
Currently the full LLM response arrives at once. Streaming (token by token, like ChatGPT) would significantly improve perceived performance for longer replies. All major providers support streaming — this would be the first UX improvement in a v2.

**Multi-session UI**
The current UI manages one active conversation. A sidebar showing past conversations (pulled from the DB) would make this feel like a complete support tool.

**Deployment & horizontal scaling**
SQLite is file-based so it doesn't work across multiple server instances. A move to PostgreSQL + Redis would be needed before deploying behind a load balancer.

---

## API Reference

### `POST /chat/message`

```
Body:   { message: string, sessionId?: string }
200:    { reply: string, sessionId: string }
400:    { error: string }
500:    { error: string }
```

### `GET /chat/history/:sessionId`

```
200:    { messages: Message[] }
404:    { error: "Session not found." }
```

### `GET /health`

```
200:    { status: "ok", provider: string }
```

---

## Project Structure

```
0.spurAssignment/
├── Client/                  # React frontend
│   └── src/
│       ├── components/      # ChatWidget, MessageList, MessageBubble, ChatInput, TypingIndicator
│       ├── store/           # Zustand chat store
│       ├── services/        # Axios API wrapper
│       └── types/           # Shared TypeScript types
└── Server/                  # Express backend
    └── src/
        ├── routes/          # Express route handlers
        ├── services/        # chatService + LLM providers
        ├── db/              # SQLite connection + migrations
        ├── middleware/       # Validation + error handler
        └── config/          # Constants + env validation
```

---

*Built for the Spur Founding Full-Stack Engineer take-home assignment.*
