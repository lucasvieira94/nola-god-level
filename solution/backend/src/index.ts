import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import metricsRoutes from "./routes/metrics";
import dashboardRoutes from "./routes/dashboards";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/dashboards", dashboardRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API Documentation: http://localhost:${PORT}/health`);
});

export default app;
