<template>
  <el-card class="metric-card">
    <h4>Top 5 Produtos (últimos 30 dias)</h4>

    <el-skeleton v-if="loading" rows="5" animated />

    <el-table v-else :data="products" stripe style="width: 100%">
      <el-table-column prop="name" label="Produto" />
      <el-table-column prop="quantity" label="Qtd." width="80" />
      <el-table-column prop="revenue" label="Faturamento" width="120">
        <template #default="{ row }">
          R$ {{ Number(row.revenue).toFixed(2) }}
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getTopProducts } from "@/api/summary";

const products = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const data = await getTopProducts();
    products.value = data;
  } catch (e) {
    console.error("Erro ao buscar top products:", e);
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
