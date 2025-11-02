import { createRouter, createWebHistory } from "vue-router"
import Login from "@/components/Login.vue"
import DashboardBuilder from "@/components/DashboardBuilder.vue"
import AiQuestion from "@/components/AiQuestion.vue"

const routes = [
  { path: "/", name: "Login", component: Login },
  { path: "/builder", name: "DashboardBuilder", component: DashboardBuilder },
  { path: "/ask", name: "AiQuestion", component: AiQuestion },
]

export default createRouter({ history: createWebHistory(), routes })
