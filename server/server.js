import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dataRouter from "./routes/data.js";
import {
  getSearchCount,
  resetSearchCount
} from "./services/externalApiService.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());

// Basic request logging for debugging and demo visibility.
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  res.on("finish", () => {
    const elapsedMs = Date.now() - start;
    console.log(`[RES] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${elapsedMs}ms)`);
  });
  next();
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "azelia-server" });
});

app.get("/api/stats", (_req, res) => {
  res.json({
    totalSearches: getSearchCount()
  });
});

app.post("/api/stats/reset", (_req, res) => {
  // Demo helper route: resets in-memory search counter.
  resetSearchCount();
  res.json({
    ok: true,
    totalSearches: getSearchCount()
  });
});

app.use("/api/data", dataRouter);

// Centralized error handler keeps route code clean.
app.use((err, _req, res, _next) => {
  console.error("[ERROR]", err.message);
  res.status(err.statusCode || 500).json({
    error: err.publicMessage || "Internal server error"
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
