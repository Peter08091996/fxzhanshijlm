import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Compresses an image file if it's too large.
 * Resizes to max 1920px width/height and quality 0.8.
 */
export async function compressImage(file: File): Promise<File> {
    // If file is small enough (< 500KB) and not huge resolution, return as is
    if (file.size < 500 * 1024) return file;

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(img.src);

            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Max dimension 1920px
            const MAX_SIZE = 1920;
            if (width > MAX_SIZE || height > MAX_SIZE) {
                if (width > height) {
                    height *= MAX_SIZE / width;
                    width = MAX_SIZE;
                } else {
                    width *= MAX_SIZE / height;
                    height = MAX_SIZE;
                }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve(file); // Fallback to original
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                if (!blob) {
                    resolve(file);
                    return;
                }

                // If compressed is larger, use original
                if (blob.size >= file.size) {
                    resolve(file);
                    return;
                }

                // Create new file with same name but maybe different type (webp/jpeg)
                const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                });

                resolve(newFile);
            }, 'image/jpeg', 0.8);
        };

        img.onerror = (err) => {
            console.error("Image compression error", err);
            resolve(file); // Return original on error
        };
    });
}
