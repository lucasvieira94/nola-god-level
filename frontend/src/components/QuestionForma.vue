<template>
  <el-card class="question-card">
    <el-form @submit.prevent="onSubmit">
      <el-form-item label="Faça sua pergunta">
        <el-input
          v-model="question"
          placeholder="Ex.: Qual foi o faturamento de janeiro?"
          :disabled="loading"
        />
      </el-form-item>

      <el-button
        type="primary"
        native-type="submit"
        :loading="loading"
        :disabled="!question.trim()"
      >
        Gerar resumo
      </el-button>
    </el-form>

    <el-alert
      v-if="error"
      type="error"
      :title="error"
      show-icon
      class="mt-3"
    />
  </el-card>
</template>

<script setup>
import { ref, watch } from "vue";
import { summarizeQuestion } from "@/api/summary";
import { useSummaryStore } from "@/store/summary"; // opcional, pode usar props

const emit = defineEmits(["summary"]);

const question = ref("");
const loading = ref(false);
const error = ref(null);

async function onSubmit() {
  if (!question.value.trim()) return;
  loading.value = true;
  error.value = null;

  try {
    const data = await summarizeQuestion(question.value);
    // Emite o resumo para o componente pai (App.vue ou Dashboard)
    emit("summary", data.summary);
  } catch (e) {
    error.value =
      e.response?.data?.detail ||
      e.message ||
      "Erro ao conectar com o servidor.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.question-card {
  max-width: 600px;
  margin: 0 auto;
}
</style>
