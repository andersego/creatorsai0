
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Camera, Loader2, UploadCloud, X } from "lucide-react";

interface ImageUploadProps {
  onImageSelected: (imageUrl: string) => void;
  className?: string;
}

const ImageUpload = ({ onImageSelected, className }: ImageUploadProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Create a local preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImagePreview(result);
      
      // Simulate upload delay
      setTimeout(() => {
        onImageSelected(result);
        setIsUploading(false);
      }, 1000);
    };
    
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      
      {!imagePreview ? (
        <div className="w-full aspect-[3/2] rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-6 transition-all hover:border-primary/50">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer flex flex-col items-center justify-center text-center"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Camera className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-medium text-lg mb-1">Upload an image</h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-4">
              Upload a photo to generate a personalized mission
            </p>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              Select Image
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative w-full aspect-[3/2] rounded-lg overflow-hidden group">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="w-full h-full object-cover transition-all"
          />
          
          {isUploading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                <p className="text-sm font-medium">Processing image...</p>
              </div>
            </div>
          )}
          
          {!isUploading && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="destructive" 
                size="icon" 
                onClick={handleRemoveImage}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
