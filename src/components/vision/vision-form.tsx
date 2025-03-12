
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Heart, Lightbulb, Target, Compass, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import type { VisionParameter } from "@/types";

export const VisionForm = () => {
  const { user, updateUser } = useAuth();
  const [parameters, setParameters] = useState({
    passion: "",
    mission: "",
    profession: "",
    vocation: ""
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (type: keyof typeof parameters) => (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setParameters(prev => ({ ...prev, [type]: e.target.value }));
  };

  const handleSave = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to save your vision",
      });
      return;
    }

    // Create vision parameters objects
    const visionParams: VisionParameter[] = Object.entries(parameters).map(([type, description]) => ({
      id: crypto.randomUUID(),
      userId: user.id,
      type: type as "passion" | "mission" | "profession" | "vocation",
      description,
      updatedAt: new Date()
    }));

    // Save to localStorage for now
    localStorage.setItem(`vision-${user.id}`, JSON.stringify(visionParams));
    
    toast({
      title: "Vision updated",
      description: "Your vision has been saved successfully",
    });

    // Force a re-render of the VisionBoard
    window.dispatchEvent(new Event('visionUpdated'));
  };

  const generateVisionImage = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to generate your vision image",
      });
      return;
    }

    if (user.tokens < 10) {
      toast({
        title: "Not enough tokens",
        description: "You need 10 tokens to generate a vision image",
        variant: "destructive"
      });
      return;
    }

    // Check if all parameters are filled
    if (Object.values(parameters).some(param => !param.trim())) {
      toast({
        title: "Incomplete vision",
        description: "Please fill in all four vision parameters first",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsGenerating(true);

      // Generate a combined vision description
      const visionSummary = `A person who loves ${parameters.passion}, aims to ${parameters.mission}, excels at ${parameters.profession}, and creates value through ${parameters.vocation}.`;
      
      // In a real app, we would call an image generation API here
      // For now, let's use a placeholder image based on a gradient
      const gradients = [
        "linear-gradient(to right, #ff9a9e, #fad0c4)",
        "linear-gradient(to right, #a1c4fd, #c2e9fb)",
        "linear-gradient(to right, #d4fc79, #96e6a1)",
        "linear-gradient(to right, #f6d365, #fda085)",
        "linear-gradient(to right, #fbc2eb, #a6c1ee)"
      ];
      
      // Select a random gradient
      const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
      
      // Create a canvas to generate the image
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, 800, 600);
        gradient.addColorStop(0, randomGradient.split(', ')[1].slice(0, -1));
        gradient.addColorStop(1, randomGradient.split(', ')[2].slice(0, -1));
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);
        
        // Add some artistic elements
        ctx.beginPath();
        ctx.arc(400, 300, 200, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 15;
        ctx.stroke();
        
        // Add text
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('YOUR VISION', 400, 150);
        
        // Convert to data URL
        const visionImageUrl = canvas.toDataURL('image/png');
        
        // Save the image URL and summary to localStorage
        const visionImageData = {
          imageUrl: visionImageUrl,
          summary: visionSummary,
          createdAt: new Date(),
        };
        
        localStorage.setItem(`vision-image-${user.id}`, JSON.stringify(visionImageData));
        
        // Update user tokens
        const updatedUser = {
          ...user,
          tokens: user.tokens - 10
        };
        
        updateUser(updatedUser);
        
        toast({
          title: "Vision image created",
          description: "Your vision has been transformed into an inspiring image",
        });
        
        // Force a re-render of the VisionBoard
        window.dispatchEvent(new Event('visionImageCreated'));
      }
    } catch (error) {
      console.error("Error generating vision image:", error);
      toast({
        title: "Generation failed",
        description: "There was a problem creating your vision image",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const parameterConfig = [
    {
      type: "passion" as const,
      label: "What You Love",
      icon: Heart,
      placeholder: "What activities make you lose track of time?",
    },
    {
      type: "mission" as const,
      label: "What the World Needs",
      icon: Compass,
      placeholder: "What problems do you want to solve?",
    },
    {
      type: "profession" as const,
      label: "What You're Good At",
      icon: Target,
      placeholder: "What are your natural talents and skills?",
    },
    {
      type: "vocation" as const,
      label: "What You Can Be Valued For",
      icon: Lightbulb,
      placeholder: "How can you create value for others?",
    },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid gap-6">
          {parameterConfig.map(({ type, label, icon: Icon, placeholder }) => (
            <div key={type} className="space-y-2">
              <div className="flex items-center gap-2 text-lg font-medium">
                <Icon className="h-5 w-5 text-primary" />
                {label}
              </div>
              <Textarea
                value={parameters[type]}
                onChange={handleChange(type)}
                placeholder={placeholder}
                className="resize-none"
                rows={3}
              />
            </div>
          ))}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleSave} className="flex-1">
              Save Vision
            </Button>
            <Button 
              onClick={generateVisionImage} 
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              disabled={isGenerating || !user}
            >
              {isGenerating ? (
                <>Generating<span className="animate-pulse">...</span></>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-1" />
                  Generate Image (10 Tokens)
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
