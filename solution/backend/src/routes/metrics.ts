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

const router = express.Router();

router.use(authMiddleware);

router.get("/overview", getOverview);
router.get("/top-products", getTopProducts);
router.get("/sales-by-channel", getSalesByChannel);
router.get("/sales-by-store", getSalesByStore);
router.get("/heatmap", getHourlyHeatmap);
router.get("/time-series", getTimeSeries);
router.get("/categories", getCategories);
router.get("/filters", getFilters);
router.get("/export-csv", exportToCSV);
router.get("/insights", getInsights);

export default router;
