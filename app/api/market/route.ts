import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export const dynamic = 'force-dynamic'; // Disable caching for real-time-ish data

// Mapping for user friendly names
const SYMBOLS = [
    { symbol: 'GC=F', name: 'Gold', type: 'commodity' },
    { symbol: 'CL=F', name: 'Crude Oil', type: 'commodity' },
    { symbol: 'BTC-USD', name: 'Bitcoin', type: 'crypto' },
    { symbol: '^GSPC', name: 'S&P 500', type: 'index' },
    { symbol: '^DJI', name: 'Dow Jones', type: 'index' },
    { symbol: 'JPY=X', name: 'USD/JPY', type: 'forex' }, // Yahoo uses JPY=X for USD to JPY
];

export async function GET() {
    try {
        const results = await Promise.all(
            SYMBOLS.map(async (item) => {
                try {
                    const quote = await yahooFinance.quote(item.symbol) as any;
                    return {
                        symbol: item.name, // Use friendly name as symbol display or keep symbol? User asked for "Realtime Asset Board"
                        // Let's use the friendly name for display "Symbol" and keep the real symbol if needed
                        originalSymbol: item.symbol,
                        name: item.name,
                        price: quote.regularMarketPrice,
                        change: quote.regularMarketChange,
                        changePercent: quote.regularMarketChangePercent,
                        type: item.type,
                    };
                } catch (e) {
                    console.error(`Failed to fetch ${item.symbol}`, e);
                    return null;
                }
            })
        );

        const data = results.filter(Boolean);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Market API Error", error);
        return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 });
    }
}
