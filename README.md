# Azelia Full-Stack Upgrade

This project is now structured as a simple full-stack application:

- client: React + Vite frontend
- server: Node.js + Express backend

## Folder Structure

```text
AzeliaReact/
  client/
    index.html
    package.json
    vite.config.js
    src/
      App.jsx
      main.jsx
      styles.css
  server/
    .env.example
    package.json
    server.js
    routes/
      data.js
    services/
      externalApiService.js
```

## What Changed

- External API call moved from frontend to backend route: /api/data
- Added backend error handling and request logging
- Added in-memory cache for 60 seconds
- Frontend now calls backend endpoint instead of third-party API directly
- Added loading spinner, error message UI, and clean data list
- Added Search History (last 5 searches) with localStorage and click-to-reuse
- Added environment variable support in backend

## Backend Setup

1. Go to server folder:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Create env file:

```bash
copy .env.example .env
```

4. Start backend:

```bash
npm run dev
```

Backend runs on http://localhost:5000

## Frontend Setup

1. Open a second terminal and go to client:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Start frontend:

```bash
npm run dev
```

Frontend runs on http://localhost:5173

The Vite proxy forwards /api calls to backend on port 5000.

## API Endpoint

GET /api/data?q=your-search-term

Example:

```text
http://localhost:5000/api/data?q=productivity
```

Response shape:

```json
{
  "source": "external-api",
  "cached": false,
  "query": "productivity",
  "count": 10,
  "items": [
    { "term": "focus", "score": 1234 }
  ]
}
```

## Notes

- Cache is per query term and expires after 60 seconds
- You can change cache TTL with CACHE_TTL_SECONDS in .env
- EXTERNAL_API_KEY is optional and included for providers that need keys
