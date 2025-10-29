import { create } from "zustand";
import { subDays, format } from "date-fns";

export interface FilterState {
  startDate: string;
  endDate: string;
  channelId?: string;
  storeId?: string;
}

interface FilterStore {
  filters: FilterState;
  setDateRange: (startDate: string, endDate: string) => void;
  setChannel: (channelId?: string) => void;
  setStore: (storeId?: string) => void;
  resetFilters: () => void;
  getQueryParams: () => Record<string, string>;
}

const getDefaultDateRange = () => {
  const end = new Date();
  const start = subDays(end, 30);
  return {
    startDate: format(start, "yyyy-MM-dd"),
    endDate: format(end, "yyyy-MM-dd"),
  };
};

export const useFilterStore = create<FilterStore>((set, get) => ({
  filters: getDefaultDateRange(),

  setDateRange: (startDate: string, endDate: string) => {
    set((state) => ({
      filters: { ...state.filters, startDate, endDate },
    }));
  },

  setChannel: (channelId?: string) => {
    set((state) => ({
      filters: { ...state.filters, channelId },
    }));
  },

  setStore: (storeId?: string) => {
    set((state) => ({
      filters: { ...state.filters, storeId },
    }));
  },

  resetFilters: () => {
    set({ filters: getDefaultDateRange() });
  },

  getQueryParams: () => {
    const { filters } = get();
    const params: Record<string, string> = {
      startDate: filters.startDate,
      endDate: filters.endDate,
    };

    if (filters.channelId) params.channelId = filters.channelId;
    if (filters.storeId) params.storeId = filters.storeId;

    return params;
  },
}));
