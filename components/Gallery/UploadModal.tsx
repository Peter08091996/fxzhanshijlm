"use client";

import { useState, useCallback, useEffect } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { MemeCategory, CATEGORY_LABELS } from "./MemeCard";

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (file: File, title: string, category: MemeCategory) => Promise<void>;
    selectedFile: File | null;
}

export function UploadModal({ isOpen, onClose, onSubmit, selectedFile }: UploadModalProps) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState<MemeCategory | "">("");
    const [preview, setPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isValid = title.trim() !== "" && category !== "" && selectedFile !== null;

    useEffect(() => {
        if (selectedFile) {
            const url = URL.createObjectURL(selectedFile);
            setPreview(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreview(null);
        }
    }, [selectedFile]);

    useEffect(() => {
        if (!isOpen) {
            setTitle("");
            setCategory("");
            setPreview(null);
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!isValid || !selectedFile) return;

        setIsSubmitting(true);
        try {
            await onSubmit(selectedFile, title.trim(), category as MemeCategory);
            onClose();
        } catch (error) {
            console.error("Upload failed in modal:", error);
            alert(`上传失败: ${error instanceof Error ? error.message : "未知错误"}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md mx-4 p-6">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 border-2 border-black hover:bg-accent-pink transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold mb-6 font-mono uppercase border-b-4 border-black pb-2">上传表情包</h2>

                {/* Preview */}
                {preview ? (
                    <div className="mb-4 border-4 border-black p-2 bg-accent-blue">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-48 object-contain"
                        />
                    </div>
                ) : (
                    <div className="mb-4 border-4 border-dashed border-black p-8 flex items-center justify-center bg-background-alt">
                        <Upload className="w-8 h-8 text-black" />
                    </div>
                )}

                {/* Title input */}
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2 font-mono uppercase">
                        表情包名称 <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="给你的表情包起个名字"
                        className="w-full px-3 py-2 border-4 border-black focus:outline-none focus:ring-0 font-mono bg-white"
                    />
                </div>

                {/* Category selector */}
                <div className="mb-6">
                    <label className="block text-sm font-bold mb-2 font-mono uppercase">
                        分类 <span className="text-red-600">*</span>
                    </label>
                    <div className="flex gap-2">
                        {(Object.keys(CATEGORY_LABELS) as MemeCategory[]).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`flex-1 px-3 py-2 border-4 font-mono font-bold text-sm transition-all ${category === cat
                                    ? "border-black bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                    : "border-black bg-white hover:bg-accent-green"
                                    }`}
                            >
                                {CATEGORY_LABELS[cat]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit button */}
                <button
                    onClick={handleSubmit}
                    disabled={!isValid || isSubmitting}
                    className={`w-full px-4 py-3 font-bold font-mono transition-all ${isValid && !isSubmitting
                        ? "bg-black text-white hover:bg-zinc-800"
                        : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                        }`}
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            上传中...
                        </span>
                    ) : (
                        "确认上传"
                    )}
                </button>
            </div>
        </div>
    );
}
