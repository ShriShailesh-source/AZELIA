import express from "express";
import {
  fetchExternalData,
  incrementSearchCount
} from "../services/externalApiService.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const query = (req.query.q || "").trim();

    if (!query) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    // Count each valid search request in memory.
    incrementSearchCount();
    const result = await fetchExternalData(query);

    if (result.cached) {
      console.log(`[DATA] Served query='${query}' from cache`);
    } else {
      console.log(`[DATA] Served query='${query}' from external API`);
    }

    return res.json({
      source: "external-api",
      cached: result.cached,
      query,
      count: result.items.length,
      items: result.items
    });
  } catch (error) {
    next(error);
  }
});

export default router;
