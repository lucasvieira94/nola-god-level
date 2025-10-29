import request from "supertest";
import app from "../index";

describe("Metrics Controller", () => {
  let authToken: string;

  beforeAll(async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        email: `metrics${Date.now()}@example.com`,
        password: "Test123!@#",
        name: "Metrics Test User",
      });
    authToken = response.body.token;
  });

  describe("GET /api/metrics/overview", () => {
    it("should return overview metrics", async () => {
      const response = await request(app)
        .get("/api/metrics/overview")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("currentPeriod");
      expect(response.body).toHaveProperty("metrics");
      expect(response.body).toHaveProperty("growth");
      expect(response.body.metrics).toHaveProperty("totalRevenue");
      expect(response.body.metrics).toHaveProperty("totalOrders");
      expect(response.body.metrics).toHaveProperty("averageTicket");
    });

    it("should fail without authentication", async () => {
      const response = await request(app).get("/api/metrics/overview");

      expect(response.status).toBe(401);
    });

    it("should accept date filters", async () => {
      const response = await request(app)
        .get("/api/metrics/overview")
        .query({
          startDate: "2024-01-01",
          endDate: "2024-12-31",
        })
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.currentPeriod).toHaveProperty("startDate");
      expect(response.body.currentPeriod).toHaveProperty("endDate");
    });
  });

  describe("GET /api/metrics/top-products", () => {
    it("should return top products", async () => {
      const response = await request(app)
        .get("/api/metrics/top-products")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty("productId");
        expect(response.body[0]).toHaveProperty("productName");
        expect(response.body[0]).toHaveProperty("totalQuantity");
        expect(response.body[0]).toHaveProperty("totalRevenue");
      }
    });

    it("should accept limit parameter", async () => {
      const response = await request(app)
        .get("/api/metrics/top-products")
        .query({ limit: "5" })
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });
  });

  describe("GET /api/metrics/sales-by-channel", () => {
    it("should return sales grouped by channel", async () => {
      const response = await request(app)
        .get("/api/metrics/sales-by-channel")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty("channelId");
        expect(response.body[0]).toHaveProperty("channelName");
        expect(response.body[0]).toHaveProperty("totalRevenue");
        expect(response.body[0]).toHaveProperty("totalOrders");
      }
    });
  });

  describe("GET /api/metrics/filters", () => {
    it("should return available filters", async () => {
      const response = await request(app)
        .get("/api/metrics/filters")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("channels");
      expect(response.body).toHaveProperty("stores");
      expect(response.body).toHaveProperty("categories");
      expect(Array.isArray(response.body.channels)).toBe(true);
      expect(Array.isArray(response.body.stores)).toBe(true);
      expect(Array.isArray(response.body.categories)).toBe(true);
    });
  });

  describe("GET /api/metrics/export-csv", () => {
    it("should export data as CSV", async () => {
      const response = await request(app)
        .get("/api/metrics/export-csv")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toContain("text/csv");
      expect(response.headers["content-disposition"]).toContain("attachment");
    });

    it("should accept filters for CSV export", async () => {
      const response = await request(app)
        .get("/api/metrics/export-csv")
        .query({
          startDate: "2024-01-01",
          endDate: "2024-12-31",
          limit: "100",
        })
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toContain("text/csv");
    });
  });
});
