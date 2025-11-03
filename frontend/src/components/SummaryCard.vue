<template>
  <el-card v-if="summary" class="summary-card">
    <h3>Resumo da Pergunta</h3>
    <p>{{ summary }}</p>
  </el-card>
</template>

<script setup>
defineProps({
  summary: { type: String, required: true },
});
</script>

<style scoped>
.summary-card {
  margin-top: 1.5rem;
}
</style>
