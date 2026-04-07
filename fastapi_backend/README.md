# FastAPI Backend

This backend mirrors the task API used by the frontend.

## Run

```bash
pip install -r fastapi_backend/requirements.txt
uvicorn fastapi_backend.main:app --host 0.0.0.0 --port 4000 --reload
```

## Endpoints

- `GET /` 
- `GET /api/health`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/{id}`
- `PATCH /api/tasks/{id}`
- `DELETE /api/tasks/{id}`

Interactive docs:

- `http://localhost:4000/docs`
