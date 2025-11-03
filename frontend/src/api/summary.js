import api from "./axios";

export async function summarizeQuestion(question) {
  const resp = await api.post("/summary/summarize/", { question });
  return resp.data;
}

export async function getRevenue() {
  const today = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  const fmt = d => d.toISOString().split("T")[0];
  const resp = await api.get("/summary/revenue/", {
    params: { start: fmt(start), end: fmt(today) },
  });
  return resp.data;
}

export async function getTopProducts() {
  const today = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  const fmt = d => d.toISOString().split("T")[0];
  const resp = await api.get("/summary/top-products/", {
    params: { start: fmt(start), end: fmt(today), limit: 5 },
  });
  return resp.data;
}

export async function getPeakHours() {
  const today = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  const fmt = d => d.toISOString().split("T")[0];
  const resp = await api.get("/summary/peak-hours/", {
    params: { start: fmt(start), end: fmt(today) },
  });
  return resp.data;
}
