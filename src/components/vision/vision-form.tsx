
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Heart, Lightbulb, Target, Compass, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import type { VisionParameter } from "@/types";

interface VisionFormProps {
  onVisionGenerated: () => void;
}

export const VisionForm = ({ onVisionGenerated }: VisionFormProps) => {
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

  const generateVision = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to generate your vision",
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
        title: "Visión incompleta",
        description: "Por favor completa los cuatro parámetros de tu visión",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsGenerating(true);

      // Create vision parameters objects
      const visionParams: VisionParameter[] = Object.entries(parameters).map(([type, description]) => ({
        id: crypto.randomUUID(),
        userId: user.id,
        type: type as "passion" | "mission" | "profession" | "vocation",
        description,
        updatedAt: new Date()
      }));

      // Save vision parameters to localStorage
      localStorage.setItem(`vision-${user.id}`, JSON.stringify(visionParams));

      // Generate a combined vision description
      const visionSummary = `✨ "${parameters.passion} a través de ${parameters.mission}, utilizando tu talento para ${parameters.profession} y creando valor mediante ${parameters.vocation}" ✨`;
      
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
        ctx.fillText('TU VISIÓN', 400, 150);
        
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
          title: "¡Visión generada!",
          description: "Tu visión ha sido transformada en una imagen inspiradora",
        });
        
        // Notify the parent component that vision has been generated
        onVisionGenerated();
        
        // Force a re-render of the VisionBoard
        window.dispatchEvent(new Event('visionImageCreated'));
      }
    } catch (error) {
      console.error("Error generating vision image:", error);
      toast({
        title: "Falló la generación",
        description: "Hubo un problema al crear tu imagen de visión",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const parameterConfig = [
    {
      type: "passion" as const,
      label: "Lo que amas",
      icon: Heart,
      placeholder: "¿Qué actividades te hacen perder la noción del tiempo?",
    },
    {
      type: "mission" as const,
      label: "Lo que el mundo necesita",
      icon: Compass,
      placeholder: "¿Qué problemas quieres resolver?",
    },
    {
      type: "profession" as const,
      label: "En lo que eres bueno",
      icon: Target,
      placeholder: "¿Cuáles son tus talentos y habilidades naturales?",
    },
    {
      type: "vocation" as const,
      label: "Por lo que puedes ser recompensado",
      icon: Lightbulb,
      placeholder: "¿Cómo puedes crear valor para los demás?",
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
          <Button 
            onClick={generateVision} 
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            disabled={isGenerating || !user}
            size="lg"
          >
            {isGenerating ? (
              <>Generando<span className="animate-pulse">...</span></>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-1" />
                Generar Visión (10 Tokens)
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
