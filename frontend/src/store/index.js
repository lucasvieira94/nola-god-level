<!-- src/App.vue -->
<template>
  <router-view />
</template>

<script setup>
import { onMounted } from "vue"
import axios from "axios"
import { useRouter } from "vue-router"

const router = useRouter()

onMounted(() => {
  // Se houver token salvo, tenta validar e redireciona
  const token = localStorage.getItem("token")
  if (token) {
    // opcional: validar token chamando um endpoint protegido
    router.push({ name: "DashboardBuilder" })
  } else {
    router.push({ name: "Login" })
  }
})
</script>
