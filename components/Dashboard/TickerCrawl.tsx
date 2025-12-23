"use client";

import { useEffect, useState } from "react";
import { Asset, getMarketData } from "@/lib/api/marketData";
import { AssetCard } from "./AssetCard";

export default function TickerCrawl() {
    const [assets, setAssets] = useState<Asset[]>([]);

    useEffect(() => {
        // Initial fetch
        getMarketData().then(setAssets);

        // Polling every 5 seconds
        const interval = setInterval(() => {
            getMarketData().then(setAssets);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    if (assets.length === 0) {
        // Return a loading skeleton that occupies space
        return (
            <div className="w-full h-12 bg-accent-pink border-b-4 border-black flex items-center justify-center text-sm font-mono font-bold text-black uppercase">
                LOADING MARKET DATA...
            </div>
        );
    }

    return (
        <div className="w-full bg-background-alt border-b-4 border-black overflow-hidden relative">
            {/* No gradient masks for brutalist look - sharp edges */}

            <div className="flex animate-scroll hover:[animation-play-state:paused] py-3 w-max">
                {/* Double the list to create seamless loop */}
                {[...assets, ...assets, ...assets].map((asset, i) => (
                    <AssetCard key={`${asset.symbol}-${i}`} asset={asset} />
                ))}
            </div>

            {/* Disclaimer for mock data */}
            <div className="text-center py-1 text-[10px] text-black font-mono font-bold border-t-4 border-black bg-background uppercase">
                * SIMULATED DATA FOR DEMONSTRATION ONLY. DO NOT TAKE SERIOUSLY.
            </div>
        </div>
    );
}
