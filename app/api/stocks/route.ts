import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");
  const query = searchParams.get("query");

  if (query) {
    // Handle Search
    try {
      const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${query}&quotesCount=1&newsCount=0`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch from Yahoo");
      const data = await response.json();
      return NextResponse.json(data);
    } catch {
      return NextResponse.json(
        { error: "Failed to search stocks" },
        { status: 500 }
      );
    }
  }

  if (!symbol) {
    return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
  }

  // Handle Stock Data
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1mo`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Stock fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stock data" },
      { status: 500 }
    );
  }
}
