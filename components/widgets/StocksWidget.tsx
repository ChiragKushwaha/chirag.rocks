import React, { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchStockData } from "../../lib/stockApi";
import { DEFAULT_STOCKS } from "./stocksData";

interface StocksWidgetProps {
  size: "small" | "medium" | "large";
}

export const StocksWidget: React.FC<StocksWidgetProps> = ({ size }) => {
  const [showPercent, setShowPercent] = useState(true);
  const { data: aaplData } = useQuery({
    queryKey: ["stock", "AAPL"],
    queryFn: () => fetchStockData("AAPL"),
    staleTime: 5 * 60 * 1000,
  });

  const displayStocks = DEFAULT_STOCKS.map((s) => {
    if (s.symbol === "AAPL" && aaplData) {
      return { ...s, price: aaplData.price, change: aaplData.changePercent };
    }
    return s;
  });

  if (size === "small") {
    const main = displayStocks[0];
    const isUp = main.change >= 0;
    const color = isUp ? "#30D158" : "#FF453A";
    return (
      <div className="flex flex-col justify-between p-3.5 h-full bg-[#1c1c1e] text-white select-none">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[13px] font-bold tracking-tight text-white">{main.symbol}</div>
            <div className="text-[10px] text-gray-400 truncate">{main.name}</div>
          </div>
          {isUp ? <TrendingUp size={14} className="text-[#30D158]" /> : <TrendingDown size={14} className="text-[#FF453A]" />}
        </div>
        <svg className="w-full h-7 stroke-current overflow-visible my-1" viewBox="0 0 90 22">
          <path d={main.area} fill={color} fillOpacity="0.15" />
          <path d={main.spark} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
        <div>
          <div className="text-[19px] font-semibold tracking-tight tabular-nums">${main.price.toFixed(2)}</div>
          <div className={`inline-block px-1.5 py-0.5 rounded-[5px] text-[10px] font-bold mt-0.5 ${isUp ? "bg-[#30D158] text-white" : "bg-[#FF453A] text-white"}`}>
            {isUp ? "+" : ""}{main.change.toFixed(2)}%
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between p-3.5 h-full bg-[#1c1c1e] text-white select-none">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">WATCHLIST</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowPercent(!showPercent);
          }}
          className="text-[10px] text-gray-400 hover:text-white bg-white/10 hover:bg-white/20 px-1.5 py-0.5 rounded transition-colors"
        >
          {showPercent ? "%" : "$"}
        </button>
      </div>
      <div className="space-y-1.5">
        {displayStocks.map((stk) => {
          const isUp = stk.change >= 0;
          const color = isUp ? "#30D158" : "#FF453A";
          const diff = ((stk.price * stk.change) / 100).toFixed(2);
          return (
            <div key={stk.symbol} className="flex items-center justify-between py-1 px-1 rounded-md hover:bg-white/5 transition-colors">
              <div className="w-[72px]">
                <div className="text-[13px] font-bold text-white tracking-tight">{stk.symbol}</div>
                <div className="text-[10px] text-gray-400 truncate">{stk.name}</div>
              </div>
              <svg className="w-16 h-5 stroke-current overflow-visible" viewBox="0 0 90 22">
                <path d={stk.area} fill={color} fillOpacity="0.18" />
                <path d={stk.spark} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <div className="text-right flex items-center gap-2">
                <div className="text-[13px] font-medium tracking-tight tabular-nums text-white">${stk.price.toFixed(2)}</div>
                <div className={`min-w-[52px] text-center px-1.5 py-0.5 rounded-[5px] text-[10px] font-bold tabular-nums ${isUp ? "bg-[#30D158] text-white" : "bg-[#FF453A] text-white"}`}>
                  {showPercent ? `${isUp ? "+" : ""}${stk.change.toFixed(2)}%` : `${isUp ? "+" : ""}$${diff}`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
