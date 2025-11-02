<template>
  <div class="ai-question">
    <el-input
      v-model="question"
      placeholder="Faça sua pergunta (ex.: 'Qual o faturamento de janeiro?')"
      @keyup.enter="ask"
    />
    <el-button type="primary" @click="ask" :loading="loading">
      Perguntar
    </el-button>

    <el-card v-if="answer" class="result">
      <p><strong>Resumo:</strong> {{ answer.summary }}</p>
      <p v-if="answer.data"><strong>Dados:</strong> {{ answer.data }}</p>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from "vue"
import axios from "axios"

const question = ref("")
const answer = ref(null)
const loading = ref(false)

async function ask() {
  if (!question.value.trim()) return
  loading.value = true
  try {
    const resp = await axios.post(
      "/api/summary/summarize/",
      { question: question.value },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    )
    answer.value = resp.data
  } catch (e) {
    console.error(e)
    alert("Erro ao chamar a IA")
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.ai-question { max-width: 600px; margin: 20px auto; }
.result { margin-top: 12px; }
</style>
