<template>
  <div>
    <el-button @click="addWidget('revenue')">+ Faturamento</el-button>
    <el-button @click="addWidget('top-products')">+ Top Produtos</el-button>
    <el-button @click="addWidget('peak-hours')">+ Horário de pico</el-button>

    <grid-layout
      :layout="layout"
      :col-num="12"
      :row-height="30"
      :is-draggable="true"
      :is-resizable="true"
      @layout-updated="onLayoutUpdate"
    >
      <grid-item v-for="item in layout" :key="item.i" :x="item.x" :y="item.y" :w="item.w" :h="item.h">
        <component :is="widgetComponent(item.type)" :params="item.params" />
      </grid-item>
    </grid-layout>

    <el-button type="primary" @click="saveDashboard">Salvar</el-button>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { GridLayout, GridItem } from "vue3-grid-layout"
import RevenueWidget from "./widgets/RevenueWidget.vue"
import TopProductsWidget from "./widgets/TopProductsWidget.vue"
import PeakHoursWidget from "./widgets/PeakHoursWidget.vue"
import axios from "axios"

const layout = ref([])          // array de objetos {i, x, y, w, h, type, params}

/* ---------- Helper ---------- */
function widgetComponent(type) {
  const map = {
    revenue: RevenueWidget,
    "top-products": TopProductsWidget,
    "peak-hours": PeakHoursWidget,
  }
  return map[type] || RevenueWidget
}

/* ---------- Add widgets ---------- */
let counter = 0
function addWidget(type) {
  const now = new Date()
  const defaultParams = {
    start: dayjs().subtract(30, "day").format("YYYY-MM-DD"),
    end: dayjs().format("YYYY-MM-DD"),
  }
  layout.value.push({
    i: `w${counter++}`,
    x: 0,
    y: 0,
    w: 4,
    h: 5,
    type,
    params: defaultParams,
  })
}

/* ---------- Persist layout ---------- */
async function saveDashboard() {
  const name = prompt("Nome do dashboard")
  if (!name) return

  await axios.post(
    "/api/summary/dashboards/",
    { name, layout: layout.value },
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  )
  alert("Dashboard salvo!")
}

/* ---------- Load existente (exemplo) ---------- */
async function loadDashboard(id) {
  const resp = await axios.get(`/api/summary/dashboards/${id}/`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
  layout.value = resp.data.layout
}

/* ---------- Update layout (when drag‑drop) ---------- */
function onLayoutUpdate(newLayout) {
  layout.value = newLayout.map(item => ({
    ...item,
    type: layout.value.find(i => i.i === item.i).type,
    params: layout.value.find(i => i.i === item.i).params,
  }))
}
</script>

<style scoped>
/* Ajuste de espaçamento */
.grid-item { background: #fafafa; border: 1px solid #e0e0e0; }
</style>
