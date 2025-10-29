import express from "express";
import {
  createDashboard,
  getDashboards,
  getDashboard,
  updateDashboard,
  deleteDashboard,
  getSharedDashboard,
} from "../controllers/dashboardController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.get("/shared/:shareToken", getSharedDashboard);

router.use(authMiddleware);

router.post("/", createDashboard);
router.get("/", getDashboards);
router.get("/:id", getDashboard);
router.put("/:id", updateDashboard);
router.delete("/:id", deleteDashboard);

export default router;
