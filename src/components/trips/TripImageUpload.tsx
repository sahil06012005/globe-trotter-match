
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TripImageUploadProps {
  onChange: (url: string) => void;
  value?: string;
}

const TripImageUpload = ({ onChange, value }: TripImageUploadProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(value);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    setUploading(true);
    
    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `trip-images/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('trip-images')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('trip-images')
        .getPublicUrl(filePath);
      
      // Set preview and pass URL to parent component
      setPreviewUrl(publicUrl);
      onChange(publicUrl);
      
      toast({
        title: "Image uploaded",
        description: "Your cover image has been uploaded successfully",
      });
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Trip Cover Image</Label>
      
      <div className="flex flex-col items-center gap-4">
        {previewUrl ? (
          <div className="relative w-full h-48 mb-4">
            <img 
              src={previewUrl} 
              alt="Trip cover" 
              className="w-full h-full object-cover rounded-md"
            />
            <Button
              type="button"
              variant="outline" 
              size="sm"
              className="absolute right-2 bottom-2 bg-white"
              onClick={() => {
                setPreviewUrl(undefined);
                onChange('');
              }}
            >
              Change Image
            </Button>
          </div>
        ) : (
          <div className="flex justify-center items-center bg-gray-100 rounded-md w-full h-48 border-2 border-dashed border-gray-300">
            <div className="text-center p-4">
              <Upload className="mx-auto h-10 w-10 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Upload a cover image</p>
              <p className="text-xs text-gray-400">PNG, JPG, WebP up to 5MB</p>
            </div>
          </div>
        )}
        
        <div className="w-full">
          <input
            type="file"
            id="cover-image"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button 
            type="button" 
            variant="outline"
            onClick={() => document.getElementById('cover-image')?.click()}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TripImageUpload;
