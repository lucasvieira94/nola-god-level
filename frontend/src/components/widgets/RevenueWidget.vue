<template>
  <el-card class="widget">
    <div class="title">Faturamento</div>
    <apexchart
      type="line"
      height="250"
      :options="chartOptions"
      :series="series"
    />
  </el-card>
</template>

<script setup>
import { ref, watch } from "vue"
import axios from "axios"
import dayjs from "dayjs"

const props = defineProps({
  // params vem do layout JSON -> { start, end }
  params: { type: Object, default: () => ({}) },
})

const series = ref([])
const chartOptions = ref({
  chart: { id: "revenue-line" },
  xaxis: { type: "datetime" },
  tooltip: { x: { format: "dd MMM yyyy" } },
})

function loadData() {
  const { start, end } = props.params
  axios
    .get("/api/summary/revenue/", {
      params: { start, end },
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(r => {
      const { gross, net } = r.data
      series.value = [
        { name: "Bruto", data: [{ x: new Date(start), y: gross }] },
        { name: "Líquido", data: [{ x: new Date(start), y: net }] },
      ]
    })
}
watch(() => props.params, loadData, { immediate: true })
</script>

<style scoped>
.widget { margin: 8px; }
.title { font-weight: 600; margin-bottom: 8px; }
</style>
