<template>
  <el-card class="metric-card">
    <h4>Faturamento (últimos 30 dias)</h4>

    <el-skeleton v-if="loading" :rows="2" animated />

    <div v-else>
      <p><strong>Bruto:</strong> R$ {{ revenue.gross.toFixed(2) }}</p>
      <p><strong>Líquido:</strong> R$ {{ revenue.net.toFixed(2) }}</p>
    </div>
  </el-card>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getRevenue } from "@/api/summary";

const revenue = ref({ gross: 0, net: 0 });
const loading = ref(true);

onMounted(async () => {
  try {
    const data = await getRevenue();
    revenue.value = data;
  } catch (e) {
    console.error("Erro ao buscar faturamento:", e);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.metric-card {
  width: 100%;
}
</style>
