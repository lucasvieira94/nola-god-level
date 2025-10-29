import React, { useEffect, useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { FilterBar } from "@/components/FilterBar";
import { InsightsCard } from "@/components/InsightsCard";
import { useFilterStore } from "@/store/filterStore";
import {
  apiClient,
  MetricsOverview,
  TopProduct,
  ChannelSales,
  TimeSeriesData,
  Insight,
} from "@/api/client";
import {
  DollarSign,
  ShoppingCart,
  Clock,
  TrendingUp,
  Download,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#84cc16",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
];

export const DashboardPage: React.FC = () => {
  const { filters, getQueryParams } = useFilterStore();
  const [overview, setOverview] = useState<MetricsOverview | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [channels, setChannels] = useState<ChannelSales[]>([]);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesData[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.startDate, filters.endDate, filters.channelId, filters.storeId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params = getQueryParams();
      const [
        overviewData,
        productsData,
        channelsData,
        timeSeriesData,
        insightsData,
      ] = await Promise.all([
        apiClient.getOverview(params),
        apiClient.getTopProducts({ ...params, limit: "10" }),
        apiClient.getSalesByChannel(params),
        apiClient.getTimeSeries({ ...params, groupBy: "day" }),
        apiClient.getInsights(params),
      ]);

      setOverview(overviewData);
      setTopProducts(productsData);
      setChannels(channelsData);
      setTimeSeries(timeSeriesData);
      setInsights(insightsData.insights);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const params = getQueryParams();
      const blob = await apiClient.exportCSV(params);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sales-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to export CSV:", error);
      alert("Falha ao exportar CSV. Por favor, tente novamente.");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        role="status"
        aria-live="polite"
      >
        <div className="text-20" aria-label="Carregando dados do dashboard">
          Carregando dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-32 font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Visão geral das operações do seu restaurante
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={exporting}
          className="btn-secondary flex items-center gap-2"
          aria-label="Exportar dados para CSV"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          {exporting ? "Exportando..." : "Exportar CSV"}
        </button>
      </header>

      <FilterBar />

      {/* KPI Cards */}
      <section aria-label="Indicadores Principais de Desempenho">
        <h2 className="sr-only">Indicadores Principais de Desempenho</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Receita Total"
            value={overview?.metrics.totalRevenue || 0}
            format="currency"
            icon={
              <div
                title="Receita Total - Soma de todas as vendas no período"
                className="cursor-help"
              >
                <DollarSign
                  className="w-5 h-5 text-primary-600"
                  aria-hidden="true"
                />
              </div>
            }
            trend={overview?.growth.revenueGrowth}
          />
          <MetricCard
            title="Total de Pedidos"
            value={overview?.metrics.totalOrders || 0}
            icon={
              <div
                title="Total de Pedidos - Quantidade de pedidos completados"
                className="cursor-help"
              >
                <ShoppingCart
                  className="w-5 h-5 text-primary-600"
                  aria-hidden="true"
                />
              </div>
            }
            trend={overview?.growth.ordersGrowth}
          />
          <MetricCard
            title="Ticket Médio"
            value={overview?.metrics.averageTicket || 0}
            format="currency"
            icon={
              <div
                title="Ticket Médio - Valor médio por pedido"
                className="cursor-help"
              >
                <TrendingUp
                  className="w-5 h-5 text-primary-600"
                  aria-hidden="true"
                />
              </div>
            }
          />
          <MetricCard
            title="Tempo Médio de Produção"
            value={overview?.metrics.averageProductionTime || 0}
            format="time"
            icon={
              <div
                title="Tempo Médio de Produção - Tempo para preparar os pedidos"
                className="cursor-help"
              >
                <Clock
                  className="w-5 h-5 text-primary-600"
                  aria-hidden="true"
                />
              </div>
            }
          />
        </div>
      </section>

      {/* Charts Grid */}
      <section aria-label="Data Visualizations">
        <h2 className="sr-only">Data Visualizations</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Over Time */}
          <div className="card">
            <h3 className="text-20 font-semibold mb-4 text-gray-900 dark:text-white">
              Tendência de Receita
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Orders Over Time */}
          <div className="card">
            <h3 className="text-20 font-semibold mb-4 text-gray-900 dark:text-white">
              Tendência de Pedidos
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products */}
          <div className="card">
            <h3 className="text-20 font-semibold mb-4 text-gray-900 dark:text-white">
              Top 10 Produtos
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="productName"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fontSize: 11 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="totalRevenue"
                  fill="#ef4444"
                  name="Receita (R$)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Sales by Channel */}
          <div className="card">
            <h3 className="text-20 font-semibold mb-4 text-gray-900 dark:text-white">
              Vendas por Canal
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={channels}
                  dataKey="totalRevenue"
                  nameKey="channelName"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {channels.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* AI Insights */}
      {insights.length > 0 && (
        <section aria-label="Insights Gerados por IA">
          <h2 className="text-20 font-semibold text-gray-900 dark:text-white mb-4">
            💡 Insights
          </h2>
          <InsightsCard insights={insights} />
        </section>
      )}

      {/* Tables */}
      <section aria-label="Dados de Desempenho por Canal">
        <h2 className="sr-only">Dados de Desempenho por Canal</h2>
        <div className="card">
          <h3 className="text-20 font-semibold mb-4 text-gray-900 dark:text-white">
            Desempenho por Canal
          </h3>
          <div className="overflow-x-auto">
            <table
              className="w-full"
              role="table"
              aria-label="Métricas de desempenho por canal"
            >
              <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-12 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    scope="col"
                  >
                    Canal
                  </th>
                  <th
                    className="px-4 py-3 text-right text-12 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    scope="col"
                  >
                    Pedidos
                  </th>
                  <th
                    className="px-4 py-3 text-right text-12 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    scope="col"
                  >
                    Receita
                  </th>
                  <th
                    className="px-4 py-3 text-right text-12 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    scope="col"
                  >
                    Ticket Médio
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {channels.map((channel) => (
                  <tr
                    key={channel.channelId}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-16 font-medium text-gray-900 dark:text-white">
                        {channel.channelName}
                      </div>
                      <div className="text-16 text-gray-500 dark:text-gray-400">
                        {channel.channelType}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-16 text-gray-900 dark:text-white">
                      {channel.totalOrders.toLocaleString("pt-BR")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-16 text-gray-900 dark:text-white">
                      {channel.totalRevenue.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-16 text-gray-900 dark:text-white">
                      {channel.averageTicket.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
