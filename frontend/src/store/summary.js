// src/store/summary.js
import { defineStore } from "pinia";
import { fetchSummary } from "@/api/summary";

export const useSummaryStore = defineStore("summary", {
  // ------------------- STATE -------------------
  state: () => ({
    loading: false,
    error: null,
    question: "",          // última pergunta enviada (opcional)
    summary: "",           // resumo retornado pela IA
  }),

  // ------------------- GETTERS -----------------
  getters: {
    hasResult(state) {
      return !!state.summary;
    },
  },

  // ------------------- ACTIONS -----------------
  actions: {
    /**
     * Chama a API de resumo e atualiza o state.
     * @param {string} question
     */
    async getSummary(question) {
      this.loading = true;
      this.error = null;
      this.question = question;
      this.summary = "";

      try {
        const data = await fetchSummary(question); // ← aqui usamos o service
        this.summary = data.summary;               // salva no state
      } catch (err) {
        // tratamento simples – pode ser mais elaborado (ex.: mapear códigos HTTP)
        this.error = err.response?.data?.detail || err.message;
      } finally {
        this.loading = false;
      }
    },

    // opcional: limpa o formulário
    clear() {
      this.question = "";
      this.summary = "";
      this.error = null;
    },
  },
});
