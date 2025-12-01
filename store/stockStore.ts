import { create } from "zustand";
import { fetchStockData, StockData, searchStockSymbol } from "../lib/stockApi";

const DEFAULT_SYMBOLS = [
  "AAPL",
  "GOOGL",
  "TSLA",
  "AMZN",
  "MSFT",
  "NFLX",
  "NVDA",
  "META",
];
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface StockState {
  stocks: StockData[];
  loading: boolean;
  lastUpdated: number | null;
  fetchStocks: () => Promise<void>;
  addStock: (query: string) => Promise<string | null>;
}

export const useStockStore = create<StockState>((set, get) => ({
  stocks: [],
  loading: false,
  lastUpdated: null,

  fetchStocks: async () => {
    const { stocks, lastUpdated, loading } = get();
    const now = Date.now();

    // Return if already loading or data is fresh
    if (
      loading ||
      (lastUpdated && now - lastUpdated < CACHE_DURATION && stocks.length > 0)
    ) {
      return;
    }

    set({ loading: true });

    try {
      const promises = DEFAULT_SYMBOLS.map((symbol) => fetchStockData(symbol));
      const results = await Promise.all(promises);
      const validStocks = results.filter((s): s is StockData => s !== null);

      set({
        stocks: validStocks,
        loading: false,
        lastUpdated: now,
      });
    } catch (error) {
      console.error("Failed to fetch stocks", error);
      set({ loading: false });
    }
  },

  addStock: async (query: string) => {
    const { stocks } = get();

    // First try to find symbol
    const symbol = await searchStockSymbol(query);
    if (!symbol) return null;

    // Check if already exists
    const existing = stocks.find((s) => s.symbol === symbol);
    if (existing) return symbol;

    // Fetch data for new stock
    const data = await fetchStockData(symbol);
    if (data) {
      set((state) => ({
        stocks: [...state.stocks, data],
      }));
      return symbol;
    }

    return null;
  },
}));
