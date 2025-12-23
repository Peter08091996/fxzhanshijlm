import { Meme, MemeCategory } from "@/components/Gallery/MemeCard";

// Mock data (Empty initially to force "Start new" vibe or let user upload)
let MOCK_MEMES: Meme[] = [];

export async function fetchMemes(): Promise<Meme[]> {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate latency
    return [...MOCK_MEMES].sort((a, b) => b.likes - a.likes);
}

export async function uploadMeme(file: File, title: string, category: MemeCategory): Promise<Meme> {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload

    // Create object URL for local preview since we don't have a real backend storage yet
    const url = URL.createObjectURL(file);

    const newMeme: Meme = {
        id: Math.random().toString(36).substring(7),
        url,
        title,
        category,
        likes: 0,
        liked: false
    };

    MOCK_MEMES = [newMeme, ...MOCK_MEMES];
    return newMeme;
}

export async function likeMeme(id: string): Promise<Meme | null> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const index = MOCK_MEMES.findIndex(m => m.id === id);
    if (index !== -1) {
        const meme = MOCK_MEMES[index];
        const newLiked = !meme.liked;
        const newLikes = newLiked ? meme.likes + 1 : meme.likes - 1;

        MOCK_MEMES[index] = { ...meme, liked: newLiked, likes: newLikes };
        return MOCK_MEMES[index];
    }
    return null;
}
