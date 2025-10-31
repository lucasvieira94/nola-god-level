import React, { useEffect, useState } from "react";
import { useFilterStore } from "@/store/filterStore";
import { apiClient, Filters } from "@/api/client";

export const FilterBar: React.FC = () => {
  const { filters, setDateRange, setChannel, setStore, resetFilters } =
    useFilterStore();
  const [availableFilters, setAvailableFilters] = useState<Filters | null>(
    null
  );

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const data = await apiClient.getFilters();
        setAvailableFilters(data);
      } catch (error) {
        console.error("Failed to load filters:", error);
      }
    };
    loadFilters();
  }, []);

  return (
    <div className="card">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="label">Data Inicial</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setDateRange(e.target.value, filters.endDate)}
            className="input"
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="label">Data Final</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setDateRange(filters.startDate, e.target.value)}
            className="input"
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="label">Canal</label>
          <select
            value={filters.channelId || ""}
            onChange={(e) => setChannel(e.target.value || undefined)}
            className="input"
          >
            <option value="">Todos os Canais</option>
            {availableFilters?.channels.map((channel) => (
              <option key={channel.id} value={channel.id}>
                {channel.name} ({channel.type})
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="label">Loja</label>
          <select
            value={filters.storeId || ""}
            onChange={(e) => setStore(e.target.value || undefined)}
            className="input"
          >
            <option value="">Todas as Lojas</option>
            {availableFilters?.stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name} - {store.city}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button onClick={resetFilters} className="btn-secondary">
            Limpar
          </button>
        </div>
      </div>
    </div>
  );
};
