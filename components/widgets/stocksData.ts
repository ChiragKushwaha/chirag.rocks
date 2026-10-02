export interface StockItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  spark: string;
  area: string;
}

export const DEFAULT_STOCKS: StockItem[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 232.84,
    change: 1.42,
    spark: "M0,16 C20,14 40,8 60,11 C75,13 85,5 90,3",
    area: "M0,16 C20,14 40,8 60,11 C75,13 85,5 90,3 L90,22 L0,22 Z",
  },
  {
    symbol: "MSFT",
    name: "Microsoft",
    price: 448.37,
    change: 0.88,
    spark: "M0,15 C20,18 45,9 65,11 C78,12 85,6 90,4",
    area: "M0,15 C20,18 45,9 65,11 C78,12 85,6 90,4 L90,22 L0,22 Z",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA",
    price: 126.15,
    change: -1.15,
    spark: "M0,5 C25,7 45,15 65,14 C80,13 85,19 90,20",
    area: "M0,5 C25,7 45,15 65,14 C80,13 85,19 90,20 L90,22 L0,22 Z",
  },
];
