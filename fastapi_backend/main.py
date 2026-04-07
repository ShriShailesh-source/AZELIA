from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from typing import Literal
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
TASKS_FILE = DATA_DIR / "tasks.json"

CATEGORIES = {"Work", "Personal", "Health", "Learning", "Finance", "Creative"}
PRIORITIES = {"Low", "Medium", "High", "Critical"}


class TaskBase(BaseModel):
    title: str = Field(min_length=1)
    description: str = ""
    category: Literal["Work", "Personal", "Health", "Learning", "Finance", "Creative"] = "Work"
    priority: Literal["Low", "Medium", "High", "Critical"] = "Medium"
    dueDate: str
    completed: bool = False

    @field_validator("title")
    @classmethod
    def title_must_not_be_blank(cls, value: str) -> str:
        clean = value.strip()
        if not clean:
            raise ValueError("title is required")
        return clean


class TaskCreate(TaskBase):
    pass


class TaskUpdate(TaskBase):
    pass


class TaskPatch(BaseModel):
    title: str | None = None
    description: str | None = None
    category: str | None = None
    priority: str | None = None
    dueDate: str | None = None
    completed: bool | None = None


def ensure_store() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not TASKS_FILE.exists():
        TASKS_FILE.write_text("[]\n", encoding="utf-8")


def read_tasks() -> list[dict]:
    ensure_store()
    raw = TASKS_FILE.read_text(encoding="utf-8")
    data = json.loads(raw)
    return data if isinstance(data, list) else []


def write_tasks(tasks: list[dict]) -> None:
    ensure_store()
    TASKS_FILE.write_text(json.dumps(tasks, indent=2) + "\n", encoding="utf-8")


app = FastAPI(title="Azelia FastAPI Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root() -> dict:
    return {
        "ok": True,
        "message": "AZELIA FastAPI backend is running",
        "endpoints": ["/api/health", "/api/tasks"],
    }


@app.get("/api/health")
def health() -> dict:
    return {"ok": True, "service": "azelia-fastapi-backend"}


@app.get("/api/tasks")
def list_tasks() -> list[dict]:
    return read_tasks()


@app.post("/api/tasks", status_code=201)
def create_task(payload: TaskCreate) -> dict:
    tasks = read_tasks()
    now_iso = datetime.utcnow().isoformat() + "Z"
    task = {
        "id": str(uuid4()),
        "title": payload.title,
        "description": payload.description,
        "category": payload.category,
        "priority": payload.priority,
        "completed": payload.completed,
        "dueDate": payload.dueDate,
        "createdAt": int(datetime.utcnow().timestamp() * 1000),
        "completedAt": now_iso if payload.completed else None,
    }
    tasks.insert(0, task)
    write_tasks(tasks)
    return task


@app.put("/api/tasks/{task_id}")
def replace_task(task_id: str, payload: TaskUpdate) -> dict:
    tasks = read_tasks()
    idx = next((i for i, t in enumerate(tasks) if t.get("id") == task_id), -1)
    if idx == -1:
        raise HTTPException(status_code=404, detail="task not found")

    existing = tasks[idx]
    completed_at = existing.get("completedAt")
    if payload.completed and not completed_at:
        completed_at = datetime.utcnow().isoformat() + "Z"
    if not payload.completed:
        completed_at = None

    updated = {
        **existing,
        "title": payload.title,
        "description": payload.description,
        "category": payload.category,
        "priority": payload.priority,
        "dueDate": payload.dueDate,
        "completed": payload.completed,
        "completedAt": completed_at,
    }
    tasks[idx] = updated
    write_tasks(tasks)
    return updated


@app.patch("/api/tasks/{task_id}")
def patch_task(task_id: str, payload: TaskPatch) -> dict:
    tasks = read_tasks()
    idx = next((i for i, t in enumerate(tasks) if t.get("id") == task_id), -1)
    if idx == -1:
        raise HTTPException(status_code=404, detail="task not found")

    task = tasks[idx]
    updates = payload.model_dump(exclude_unset=True)

    if "title" in updates:
        title = (updates["title"] or "").strip()
        if not title:
            raise HTTPException(status_code=400, detail="title is required")
        updates["title"] = title

    if "category" in updates and updates["category"] not in CATEGORIES:
        raise HTTPException(status_code=400, detail="category is invalid")

    if "priority" in updates and updates["priority"] not in PRIORITIES:
        raise HTTPException(status_code=400, detail="priority is invalid")

    if "completed" in updates:
        if updates["completed"]:
            task["completedAt"] = task.get("completedAt") or (datetime.utcnow().isoformat() + "Z")
        else:
            task["completedAt"] = None

    task.update(updates)
    tasks[idx] = task
    write_tasks(tasks)
    return task


@app.delete("/api/tasks/{task_id}", status_code=204)
def delete_task(task_id: str) -> None:
    tasks = read_tasks()
    next_tasks = [t for t in tasks if t.get("id") != task_id]
    if len(next_tasks) == len(tasks):
        raise HTTPException(status_code=404, detail="task not found")

    write_tasks(next_tasks)
    return None
