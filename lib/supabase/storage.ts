import { supabase } from "./client";

/**
 * Upload an image to Supabase Storage
 * @param file - The file to upload
 * @param bucket - The storage bucket name ('avatars' or 'banners')
 * @param userId - The user's ID for organizing files
 * @returns The public URL of the uploaded image
 */
export async function uploadImage(
    file: File,
    bucket: 'avatars' | 'banners',
    userId: string
): Promise<string> {
    try {
        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (error) {
            throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error: any) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload image: ' + error.message);
    }
}

/**
 * Delete an image from Supabase Storage
 * @param url - The public URL of the image to delete
 * @param bucket - The storage bucket name
 */
export async function deleteImage(url: string, bucket: 'avatars' | 'banners'): Promise<void> {
    try {
        // Extract file path from URL
        const urlParts = url.split(`/${bucket}/`);
        if (urlParts.length < 2) return;

        const filePath = urlParts[1];

        const { error } = await supabase.storage
            .from(bucket)
            .remove([filePath]);

        if (error) {
            console.error('Error deleting image:', error);
        }
    } catch (error) {
        console.error('Error deleting image:', error);
    }
}
