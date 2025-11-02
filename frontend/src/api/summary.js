import axios from "axios";

const api = axios.create({
  baseURL: "/api/summary",          // e.g.: http://localhost:8001/api/summary
});

/**
 * Envia a pergunta para o backend e devolve o resumo.
 * @param {string} question - Texto digitado pelo usuário
 * @returns {Promise<{summary:string}>}
 */
export async function fetchSummary(question) {
  const response = await api.post("/summarize/", { question });
  // O backend devolve {question: "...", summary: "..."}
  return response.data;   // { question: "...", summary: "..." }
}
