
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  age: number | null;
  gender: string | null;
  interests: string[] | null;
  languages: string[] | null;
}

export function useProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          throw error;
        }

        setProfile(data);
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  async function updateProfile(updates: Partial<Profile>) {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;

      setProfile((prev) => (prev ? { ...prev, ...updates } : null));

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });

      return true;
    } catch (error: any) {
      console.error("Error updating profile:", error);
      
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
      
      return false;
    }
  }

  async function uploadAvatar(file: File) {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      await updateProfile({ avatar_url: data.publicUrl });
      
      return data.publicUrl;
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      
      toast({
        title: "Error uploading avatar",
        description: error.message,
        variant: "destructive",
      });
      
      return null;
    }
  }

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    uploadAvatar
  };
}
