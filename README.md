# GigaBrain Frontend

Web application of GigaBrain, built with React, TypeScript, Vite and TanStack Router. The
Product Owner (PO) creates projects, talks to the Digital Twin to define requirements and
browses the requirements and experts of each project.

## Requirements

- Node.js compatible with the Vite version of the project.
- The GigaBrain API running locally or reachable at the configured URL
  (`python main.py api` in the backend repository).

## API configuration

Copy `.env.example` to `.env.local` and adjust it:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
VITE_API_TOKEN=
```

`VITE_API_BASE_URL` is the base URL of the backend (default: `http://127.0.0.1:8000/api/v1`).

`VITE_API_TOKEN` is optional and only for local development, when the API was started with
`--token`. `VITE_*` variables are embedded in the browser bundle: **do not put production
secrets in it**.

The API documents itself at `http://127.0.0.1:8000/docs`.

### DeepSeek key

The key can be set on the server (`DEEPSEEK_API_KEY`) or typed in the app, under **Settings**
in the sidebar. A key typed in the app stays in the browser (`localStorage`) and is sent to
the API in the `X-LLM-Key` header when a conversation is opened; the API does not store it.

## Development

```bash
npm install
npm run dev
```

## Checks

```bash
npm run build
npm run lint
```

## Routes

| Route | What it shows |
|---|---|
| `/` | Institutional page |
| `/projects` | List, create and rename projects |
| `/projects/$projectId/chat` | New conversation with the Digital Twin |
| `/projects/$projectId/conversations/$id` | History of a conversation |
| `/projects/$projectId/requirements` | Saved requirements, with search and filters |
| `/projects/$projectId/requirements/$id` | Details, Critic validation, quality checks, versions and traceability |
| `/projects/$projectId/experts` | Expert catalog |
| `/projects/$projectId/experts/$id` | Knowledge file and versions of an expert |

Each project has its own requirements, conversations and experts.

## Structure

- `src/services/api.ts`: shared Axios client, environment configuration, timeout and error messages.
- `src/services/api.types.ts`: TypeScript contracts of the API.
- `src/services/projects.service.ts`: projects.
- `src/services/chat.service.ts`: open, message, approve and close a conversation.
- `src/services/history.service.ts`: read-only queries (conversations, events, requirements, links, experts).
- `src/services/llmKey.ts`: the DeepSeek key typed by the user.
- `src/components/ValidationPanel`: the Critic's scores and findings.
