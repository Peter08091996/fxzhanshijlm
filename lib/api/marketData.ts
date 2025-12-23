// lib/api/marketData.ts

export interface Asset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  type: 'index' | 'commodity' | 'crypto' | 'forex';
}

// Mock data for demonstration purposes
const mockAssets: Asset[] = [
  { symbol: 'SPX', name: 'S&P 500', price: 5998.74, change: 73.92, changePercent: 1.25, type: 'index' },
  { symbol: 'NDX', name: 'NASDAQ 100', price: 21453.30, change: -142.18, changePercent: -0.66, type: 'index' },
  { symbol: 'DJI', name: 'Dow Jones', price: 42840.26, change: 498.02, changePercent: 1.18, type: 'index' },
  { symbol: 'GOLD', name: 'Gold', price: 2623.45, change: 18.30, changePercent: 0.70, type: 'commodity' },
  { symbol: 'OIL', name: 'Crude Oil', price: 69.24, change: -1.87, changePercent: -2.63, type: 'commodity' },
  { symbol: 'BTC', name: 'Bitcoin', price: 94286.50, change: -2341.20, changePercent: -2.42, type: 'crypto' },
  { symbol: 'ETH', name: 'Ethereum', price: 3342.18, change: -89.45, changePercent: -2.61, type: 'crypto' },
  { symbol: 'EUR/USD', name: 'Euro/Dollar', price: 1.0428, change: 0.0012, changePercent: 0.12, type: 'forex' },
  { symbol: 'USD/JPY', name: 'Dollar/Yen', price: 156.82, change: 0.94, changePercent: 0.60, type: 'forex' },
  { symbol: 'GBP/USD', name: 'Pound/Dollar', price: 1.2534, change: -0.0078, changePercent: -0.62, type: 'forex' },
];

export async function getMarketData(): Promise<Asset[]> {
  // Simulate a small delay for realism
  await new Promise(resolve => setTimeout(resolve, 100));

  // Add slight random variation to prices for a dynamic feel
  return mockAssets.map(asset => ({
    ...asset,
    price: asset.price * (1 + (Math.random() - 0.5) * 0.001),
    change: asset.change + (Math.random() - 0.5) * 0.1,
    changePercent: asset.changePercent + (Math.random() - 0.5) * 0.05,
  }));
}

