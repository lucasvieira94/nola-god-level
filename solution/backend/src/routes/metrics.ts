import express from "express";
import {
  getOverview,
  getTopProducts,
  getSalesByChannel,
  getSalesByStore,
  getHourlyHeatmap,
  getTimeSeries,
  getCategories,
  getFilters,
  exportToCSV,
} from "../controllers/metricsController";
import { getInsights } from "../controllers/insightsController";
import { authMiddleware } from "../middleware/auth";
import { cacheMiddleware } from "../middleware/cache";

const router = express.Router();

router.use(authMiddleware);

// Apply cache middleware to improve performance (5 min cache)
router.get("/overview", cacheMiddleware(), getOverview);
router.get("/top-products", cacheMiddleware(), getTopProducts);
router.get("/sales-by-channel", cacheMiddleware(), getSalesByChannel);
router.get("/sales-by-store", cacheMiddleware(), getSalesByStore);
router.get("/heatmap", cacheMiddleware(), getHourlyHeatmap);
router.get("/time-series", cacheMiddleware(), getTimeSeries);
router.get("/categories", cacheMiddleware(), getCategories);
router.get("/filters", cacheMiddleware(60 * 60 * 1000), getFilters); // 1 hour cache
router.get("/export-csv", exportToCSV); // No cache for exports
router.get("/insights", cacheMiddleware(), getInsights);

export default router;
