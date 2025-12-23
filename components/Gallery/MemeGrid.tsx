"use client";

import { useEffect, useState, useMemo } from "react";
import { Meme, MemeCard, MemeCategory, CATEGORY_LABELS } from "./MemeCard";
import { UploadModal } from "./UploadModal";
import { fetchMemes, likeMeme, uploadMeme } from "@/lib/api/memeService";
import { Loader2, Search } from "lucide-react";

interface MemeGridProps {
    uploadInputRef?: React.RefObject<HTMLInputElement | null>;
}

type FilterCategory = MemeCategory | "all";

export default function MemeGrid({ uploadInputRef }: MemeGridProps) {
    const [memes, setMemes] = useState<Meme[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Upload modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        loadMemes();
    }, []);

    useEffect(() => {
        if (uploadInputRef?.current) {
            const handleChange = (e: Event) => {
                const input = e.target as HTMLInputElement;
                const files = input.files;
                if (files && files.length > 0) {
                    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
                    if (imageFiles.length > 0) {
                        setSelectedFile(imageFiles[0]);
                        setIsModalOpen(true);
                    }
                }
                input.value = '';
            };

            uploadInputRef.current.addEventListener('change', handleChange);
            return () => {
                uploadInputRef.current?.removeEventListener('change', handleChange);
            };
        }
    }, [uploadInputRef]);

    async function loadMemes() {
        try {
            const data = await fetchMemes();
            setMemes(data);
        } catch (error) {
            console.error("Failed to fetch memes", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleUploadSubmit(file: File, title: string, category: MemeCategory) {
        // Error will propagate to UploadModal to be caught and alerted
        const newMeme = await uploadMeme(file, title, category);
        setMemes(prev => [newMeme, ...prev]);
    }

    async function handleLike(id: string) {
        setMemes(prev => prev.map(m => {
            if (m.id === id) {
                return {
                    ...m,
                    liked: !m.liked,
                    likes: m.liked ? m.likes - 1 : m.likes + 1
                };
            }
            return m;
        }));

        try {
            await likeMeme(id);
        } catch (error) {
            console.error("Like failed", error);
        }
    }

    // Filter memes based on category and search
    const filteredMemes = useMemo(() => {
        return memes.filter(meme => {
            const matchesCategory = selectedCategory === "all" || meme.category === selectedCategory;
            const matchesSearch = searchQuery === "" ||
                meme.title.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [memes, selectedCategory, searchQuery]);

    const categoryTabs: { key: FilterCategory; label: string }[] = [
        { key: "all", label: "全部" },
        { key: "profit", label: "赚钱了" },
        { key: "loss", label: "亏钱了" },
        { key: "other", label: "其他" },
    ];

    return (
        <div className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Category Tabs */}
                <div className="flex gap-2 flex-wrap">
                    {categoryTabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setSelectedCategory(tab.key)}
                            className={`px-4 py-2 text-sm font-mono font-bold border-2 transition-all ${selectedCategory === tab.key
                                ? "bg-black text-white border-black"
                                : "bg-white text-black border-zinc-300 hover:border-black"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="搜索表情包..."
                        className="w-full pl-10 pr-4 py-2 border-2 border-zinc-300 focus:border-black focus:outline-none font-mono text-sm"
                    />
                </div>
            </div>

            {/* Meme Grid */}
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="break-inside-avoid mb-4 border-2 border-zinc-200 bg-zinc-50 h-48 sm:h-64 animate-pulse relative" />
                    ))
                ) : filteredMemes.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-zinc-500 font-mono">
                        {memes.length === 0 ? "还没有表情包，快来上传第一个吧！" : "没有找到匹配的表情包"}
                    </div>
                ) : (
                    filteredMemes.map(meme => (
                        <MemeCard key={meme.id} meme={meme} onLike={handleLike} />
                    ))
                )}
            </div>

            {/* Upload Modal */}
            <UploadModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedFile(null);
                }}
                onSubmit={handleUploadSubmit}
                selectedFile={selectedFile}
            />
        </div>
    );
}
