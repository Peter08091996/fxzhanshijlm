"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export type MemeCategory = "profit" | "loss" | "other";

export const CATEGORY_LABELS: Record<MemeCategory, string> = {
    profit: "赚钱了",
    loss: "亏钱了",
    other: "其他",
};

export interface Meme {
    id: string;
    url: string;
    title: string;
    category: MemeCategory;
    likes: number;
    liked?: boolean;
}

interface MemeCardProps {
    meme: Meme;
    onLike: (id: string) => void;
}

export function MemeCard({ meme, onLike }: MemeCardProps) {
    return (
        <div className="group relative break-inside-avoid mb-4 border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all">
            <div className="relative aspect-auto w-full border-b-4 border-black">
                <img
                    src={meme.url}
                    alt={meme.title || "FX WARRIOR MEME"}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                />
            </div>
            <div className="p-3 flex justify-between items-center bg-white">
                <span className="text-xs font-bold uppercase truncate max-w-[70%] text-black font-mono">
                    {meme.title || "UNTITLED_ASSET"}
                </span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onLike(meme.id);
                    }}
                    className={cn(
                        "flex items-center gap-1.5 text-xs font-bold font-mono transition-all border-2 border-black px-2 py-1",
                        meme.liked
                            ? "bg-black text-white"
                            : "bg-white text-black hover:bg-accent-pink"
                    )}
                >
                    <Heart className={cn("w-4 h-4", meme.liked && "fill-white")} />
                    [{meme.likes}]
                </button>
            </div>
        </div>
    );
}
