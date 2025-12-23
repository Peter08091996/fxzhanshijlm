import { Asset } from "@/lib/api/marketData";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

interface AssetCardProps {
    asset: Asset;
}

const pastelBackgrounds = [
    "bg-accent-blue",
    "bg-accent-pink",
    "bg-accent-green",
    "bg-accent-orange"
];

export function AssetCard({ asset }: AssetCardProps) {
    const isUp = asset.change >= 0;
    // Rotate through pastel backgrounds based on symbol hash
    const bgIndex = asset.symbol.charCodeAt(0) % pastelBackgrounds.length;
    const bgColor = pastelBackgrounds[bgIndex];

    return (
        <div className={cn(
            "flex flex-col min-w-[140px] px-4 py-2 border-4 border-black mx-2 shrink-0",
            "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
            bgColor
        )}>
            <div className="flex justify-between items-center mb-1">
                <span className="font-mono font-bold text-sm text-black uppercase">{asset.symbol}</span>
                {isUp ? (
                    <ArrowUp className="w-4 h-4 text-black" />
                ) : (
                    <ArrowDown className="w-4 h-4 text-black" />
                )}
            </div>
            <div className="text-lg font-mono font-bold tracking-tight text-black">
                {asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs font-mono font-bold flex items-center gap-1 text-black">
                <span>{asset.change > 0 ? "+" : ""}{asset.change.toFixed(2)}</span>
                <span>({asset.changePercent.toFixed(2)}%)</span>
            </div>
        </div>
    );
}
