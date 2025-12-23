"use client";

import TickerCrawl from "@/components/Dashboard/TickerCrawl";
import MemeGrid from "@/components/Gallery/MemeGrid";
import { useRef } from "react";

export default function Home() {
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    uploadInputRef.current?.click();
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-50 bg-background border-b-4 border-black">
        <TickerCrawl />
        <div className="container mx-auto px-6 py-4 flex items-center justify-between border-b-4 border-black bg-white">
          <h1 className="text-2xl font-mono font-bold tracking-tight text-foreground uppercase">
            FX <span className="bg-black text-white px-2 py-1">WARRIOR</span> FAN CLUB
          </h1>
          <nav className="flex gap-4 items-center text-sm font-mono font-bold">
            <button
              onClick={handleUploadClick}
              className="px-4 py-2 bg-black text-white border-4 border-black hover:bg-foreground uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              UPLOAD MEME
            </button>
            <input
              ref={uploadInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
            />
          </nav>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-6 py-12" id="gallery">
        <MemeGrid uploadInputRef={uploadInputRef} />
      </section>
    </main>
  );
}
