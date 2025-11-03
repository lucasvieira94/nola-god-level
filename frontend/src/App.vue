<!-- src/App.vue -->
<template>
  <el-container class="app-container">
    <el-header height="60px" class="header">
      <h2>Dashboard Nola – IA de Resumos</h2>
    </el-header>

    <el-main class="main">
      <!-- Seção de Pergunta -->
      <question-form @summary="onSummary" />

      <!-- Exibe o resumo retornado -->
      <summary-card v-if="summary" :summary="summary" />

      <!-- Métricas (flexbox, responsivo) -->
      <div class="metrics-grid">
        <revenue-card />
        <top-products-card />
        <peak-hours-card />
      </div>
    </el-main>

    <el-footer height="40px" class="footer">
      <small>© 2025 Nola – Todos os direitos reservados</small>
    </el-footer>
  </el-container>
</template>

<script setup>
import { ref } from "vue";
import QuestionForm from "./components/QuestionForm.vue";
import SummaryCard from "./components/SummaryCard.vue";
import RevenueCard from "./components/RevenueCard.vue";
import TopProductsCard from "./components/TopProductsCard.vue";
import PeakHoursCard from "./components/PeakHoursCard.vue";

const summary = ref("");

function onSummary(text) {
  summary.value = text;
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header / Footer */
.header {
  background-color: #2c3e50;
  color: #fff;
  display: flex;
  align-items: center;
  padding-left: 1rem;
}
.footer {
  text-align: center;
  background-color: #ecf0f1;
}

/* Main area */
.main {
  flex: 1;
  padding: 1rem;
}

/* Grid responsiva para os cards de métricas */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}
</style>
