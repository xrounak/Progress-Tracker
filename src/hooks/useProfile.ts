import { useState, useEffect } from "react";
import { supabase } from "@/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type { UserProfile } from "@/types/habits";

export const useProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            void fetchProfile();
        } else {
            setProfile(null);
            setLoading(false);
        }
    }, [user]);

    const fetchProfile = async () => {
        if (!user) return;

        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from("user_profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (fetchError) {
                // If profile doesn't exist, create a default one
                if (fetchError.code === "PGRST116") {
                    await createProfile();
                    return;
                }
                throw fetchError;
            }

            setProfile(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch profile");
            console.error("Error fetching profile:", err);
        } finally {
            setLoading(false);
        }
    };

    const createProfile = async () => {
        if (!user) return;

        try {
            const { data, error: createError } = await supabase
                .from("user_profiles")
                .insert({
                    id: user.id,
                    name: user.email?.split("@")[0] || null,
                    mood_sticker: "😊",
                })
                .select()
                .single();

            if (createError) throw createError;
            setProfile(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create profile");
            console.error("Error creating profile:", err);
        }
    };

    const updateProfile = async (updates: Partial<Omit<UserProfile, "id" | "created_at" | "updated_at">>) => {
        if (!user) return { success: false, error: "No user logged in" };

        try {
            setError(null);

            const { data, error: updateError } = await supabase
                .from("user_profiles")
                .update(updates)
                .eq("id", user.id)
                .select()
                .single();

            if (updateError) throw updateError;

            setProfile(data);
            return { success: true, data };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to update profile";
            setError(errorMessage);
            console.error("Error updating profile:", err);
            return { success: false, error: errorMessage };
        }
    };

    const uploadAvatar = async (file: File) => {
        if (!user) return { success: false, error: "No user logged in" };

        try {
            setError(null);

            // Upload file to Supabase storage
            const fileExt = file.name.split(".").pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: urlData } = supabase.storage
                .from("avatars")
                .getPublicUrl(filePath);

            // Update profile with new avatar URL
            const result = await updateProfile({ avatar_url: urlData.publicUrl });
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to upload avatar";
            setError(errorMessage);
            console.error("Error uploading avatar:", err);
            return { success: false, error: errorMessage };
        }
    };

    return {
        profile,
        loading,
        error,
        updateProfile,
        uploadAvatar,
        refetch: fetchProfile,
    };
};
