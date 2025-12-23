"use client";

import { useState, useCallback } from "react";
import { Upload, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
    onUpload: (files: File[]) => void;
}

export function UploadZone({ onUpload }: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files?.length) {
            const files = Array.from(e.dataTransfer.files);
            // Basic image validation
            const imageFiles = files.filter(f => f.type.startsWith('image/'));
            if (imageFiles.length > 0) {
                onUpload(imageFiles);
            }
        }
    }, [onUpload]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            const files = Array.from(e.target.files);
            const imageFiles = files.filter(f => f.type.startsWith('image/'));
            if (imageFiles.length > 0) {
                onUpload(imageFiles);
            }
        }
    }, [onUpload]);

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
                "relative w-full h-32 md:h-40 rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center cursor-pointer overflow-hidden group",
                isDragging
                    ? "border-red-500 bg-red-500/10"
                    : "border-zinc-700 bg-zinc-900/30 hover:border-zinc-600 hover:bg-zinc-900/50"
            )}
        >
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex flex-col items-center gap-2 text-zinc-400 group-hover:text-pink-500 transition-colors">
                <Upload className={cn("w-8 h-8", isDragging && "text-pink-600 animate-bounce")} />
                <p className="text-sm font-mono text-center">
                    {isDragging ? "Drop it here!" : "Drop memes here"}
                </p>
                <span className="text-xs text-zinc-500 group-hover:text-pink-400">
                    JPG, PNG, GIF, WEBP
                </span>
            </div>
        </div>
    );
}
