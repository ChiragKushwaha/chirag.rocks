import React, { useState } from "react";
import { Search } from "lucide-react";

// Mock Data
const STOCKS = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 178.35,
    change: 1.25,
    changePercent: 0.71,
    data: [170, 172, 171, 174, 176, 175, 178],
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 135.6,
    change: -0.45,
    changePercent: -0.33,
    data: [138, 137, 136, 135, 136, 135, 135],
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 245.5,
    change: 5.2,
    changePercent: 2.16,
    data: [230, 235, 232, 240, 242, 241, 245],
  },
  {
    symbol: "AMZN",
    name: "Amazon.com",
    price: 142.1,
    change: 0.8,
    changePercent: 0.57,
    data: [140, 141, 140, 142, 141, 142, 142],
  },
  {
    symbol: "MSFT",
    name: "Microsoft",
    price: 328.75,
    change: -1.1,
    changePercent: -0.33,
    data: [332, 330, 331, 329, 330, 329, 328],
  },
  {
    symbol: "NFLX",
    name: "Netflix",
    price: 410.2,
    change: 8.5,
    changePercent: 2.12,
    data: [390, 395, 398, 400, 405, 408, 410],
  },
];

const NEWS = [
  {
    source: "Bloomberg",
    title: "Tech Stocks Rally Ahead of Earnings",
    time: "2h ago",
  },
  {
    source: "CNBC",
    title: "Market Watch: What to Expect This Week",
    time: "4h ago",
  },
  {
    source: "Reuters",
    title: "Global Markets Update: Asia Mixed",
    time: "5h ago",
  },
  { source: "WSJ", title: "Fed Signals Potential Rate Pause", time: "6h ago" },
];

// Simple Sparkline Component
const Sparkline = ({
  data,
  color,
  width = 60,
  height = 30,
}: {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Main Chart Component
const MainChart = ({ data, color }: { data: number[]; color: string }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 600;
  const height = 300;

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  // Fill area
  const fillPoints = `${points} ${width},${height} 0,${height}`;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="overflow-visible"
    >
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPoints} fill="url(#chartGradient)" />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const Stocks: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState(STOCKS[0]);

  return (
    <div className="flex h-full w-full bg-[#1e1e1e] text-white overflow-hidden font-sans select-none">
      {/* Sidebar */}
      <div className="w-80 bg-[#2C2C2E]/90 backdrop-blur-xl border-r border-white/10 flex flex-col z-20">
        <div className="p-4 border-b border-white/10">
          <div className="text-2xl font-bold mb-1">Stocks</div>
          <div className="text-xs opacity-50 font-medium">September 12</div>
          <div className="mt-4 relative">
            <Search
              className="absolute left-2.5 top-1.5 text-white/40"
              size={14}
            />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-white/10 rounded-lg pl-8 pr-3 py-1 text-sm text-white placeholder-white/30 focus:outline-none focus:bg-white/20 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-2 text-xs font-semibold opacity-50 uppercase tracking-wider">
            Watchlist
          </div>
          {STOCKS.map((stock) => {
            const isPositive = stock.change >= 0;
            const color = isPositive ? "#34C759" : "#FF3B30";

            return (
              <div
                key={stock.symbol}
                onClick={() => setSelectedStock(stock)}
                className={`px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors border-b border-white/5 ${
                  selectedStock.symbol === stock.symbol ? "bg-white/10" : ""
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{stock.symbol}</span>
                  <span className="font-medium">{stock.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <Sparkline data={stock.data} color={color} />
                  <div
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      isPositive
                        ? "bg-[#34C759]/20 text-[#34C759]"
                        : "bg-[#FF3B30]/20 text-[#FF3B30]"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {stock.change.toFixed(2)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#1C1C1E] relative overflow-hidden">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-8 border-b border-white/10 z-10 bg-[#1C1C1E]/80 backdrop-blur-md">
          <div>
            <div className="text-2xl font-bold">{selectedStock.symbol}</div>
            <div className="text-sm opacity-60">{selectedStock.name}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-medium">
              {selectedStock.price.toFixed(2)}
            </div>
            <div
              className={`text-sm font-medium ${
                selectedStock.change >= 0 ? "text-[#34C759]" : "text-[#FF3B30]"
              }`}
            >
              {selectedStock.change >= 0 ? "+" : ""}
              {selectedStock.change.toFixed(2)} (
              {selectedStock.changePercent.toFixed(2)}%)
            </div>
          </div>
        </div>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Chart Section */}
          <div className="h-[400px] w-full p-8 relative">
            <div className="absolute top-8 right-8 flex gap-2">
              {["1D", "1W", "1M", "3M", "6M", "1Y", "2Y"].map((period) => (
                <button
                  key={period}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    period === "1D"
                      ? "bg-white/20 text-white"
                      : "text-white/40 hover:bg-white/10"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>

            <div className="w-full h-full pt-12">
              <MainChart
                data={selectedStock.data}
                color={selectedStock.change >= 0 ? "#34C759" : "#FF3B30"}
              />
            </div>

            {/* Chart Grid Lines (Visual only) */}
            <div className="absolute inset-x-8 bottom-8 h-px bg-white/10" />
            <div className="absolute inset-x-8 top-[50%] h-px bg-white/5 dashed" />
          </div>

          {/* Stats Grid */}
          <div className="px-8 pb-8">
            <div className="text-lg font-semibold mb-4">Key Statistics</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  label: "Open",
                  value: (selectedStock.price - selectedStock.change).toFixed(
                    2
                  ),
                },
                {
                  label: "High",
                  value: (selectedStock.price * 1.02).toFixed(2),
                },
                {
                  label: "Low",
                  value: (selectedStock.price * 0.98).toFixed(2),
                },
                { label: "Vol", value: "45.2M" },
                { label: "P/E", value: "28.5" },
                { label: "Mkt Cap", value: "2.4T" },
                {
                  label: "52W H",
                  value: (selectedStock.price * 1.1).toFixed(2),
                },
                {
                  label: "52W L",
                  value: (selectedStock.price * 0.8).toFixed(2),
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex justify-between border-b border-white/10 pb-2"
                >
                  <span className="text-sm opacity-50">{stat.label}</span>
                  <span className="text-sm font-medium">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* News Section */}
          <div className="bg-[#2C2C2E] px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">Business News</div>
              <button className="text-blue-400 text-sm hover:underline">
                Show More
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {NEWS.map((item, i) => (
                <div
                  key={i}
                  className="bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-blue-400 uppercase">
                      {item.source}
                    </span>
                    <span className="text-xs opacity-40">{item.time}</span>
                  </div>
                  <div className="font-medium leading-snug mb-2">
                    {item.title}
                  </div>
                  <div className="text-xs opacity-60 line-clamp-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
