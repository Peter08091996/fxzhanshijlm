import { Meme, MemeCategory } from "@/components/Gallery/MemeCard";
import { supabase } from "@/lib/supabase";

export async function fetchMemes(): Promise<Meme[]> {
    const { data, error } = await supabase
        .from('memes')
        .select('*')
        .order('likes', { ascending: false });

    if (error) {
        console.error('Error fetching memes:', error);
        return [];
    }

    return (data || []).map((item: any) => ({
        id: item.id,
        url: item.image_url,
        title: item.title,
        category: item.category as MemeCategory,
        likes: item.likes,
        liked: false // Basic state, in real app check against user ID
    }));
}

export async function uploadMeme(file: File, title: string, category: MemeCategory): Promise<Meme> {
    // 0. Validation & Compression
    const MAX_SIZE_MB = 5;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        throw new Error(`File too large (Max ${MAX_SIZE_MB}MB)`);
    }

    if (!file.type.startsWith('image/')) {
        throw new Error("Only image files are allowed");
    }

    // Compress client-side
    // Dynamic import to avoid SSR issues if this were a server component (though it's called from client)
    const { compressImage } = await import("@/lib/utils");
    const compressedFile = await compressImage(file);

    // 1. Upload to Storage
    // Use original extension or .jpg if it was converted
    const fileExt = compressedFile.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = fileName; // No folders, flat structure for simplicity

    const { error: uploadError } = await supabase.storage
        .from('memes')
        .upload(filePath, compressedFile, {
            cacheControl: '3600',
            upsert: false
        });

    if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
        .from('memes')
        .getPublicUrl(filePath);

    // 3. Insert into Database
    const { data, error: insertError } = await supabase
        .from('memes')
        .insert([
            {
                image_url: publicUrl,
                title,
                category,
                likes: 0
            }
        ])
        .select()
        .single();

    if (insertError) {
        throw new Error(`Database insert failed: ${insertError.message}`);
    }

    return {
        id: data.id,
        url: data.image_url,
        title: data.title,
        category: data.category as MemeCategory,
        likes: data.likes,
        liked: false
    };
}

export async function likeMeme(id: string): Promise<Meme | null> {
    // 1. Get current likes
    const { data: current, error: fetchError } = await supabase
        .from('memes')
        .select('likes')
        .eq('id', id)
        .single();

    if (fetchError || !current) return null;

    // 2. Increment (Simple implementation, prone to race conditions but fine for now)
    const newLikes = current.likes + 1;

    const { data, error } = await supabase
        .from('memes')
        .update({ likes: newLikes })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating likes:', error);
        return null;
    }

    return {
        id: data.id,
        url: data.image_url,
        title: data.title,
        category: data.category as MemeCategory,
        likes: data.likes,
        liked: true
    };
}
