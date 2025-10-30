import { create } from "zustand";

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
  // Use the date range where we have actual data in the database
  // Data range: 2025-05-02 to 2025-05-04 (can be expanded as more data is generated)
  return {
    startDate: "2025-05-01",
    endDate: "2025-05-31",
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
