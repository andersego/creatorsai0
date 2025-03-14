
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
      
      // En lugar de generar una imagen, usamos una imagen de muestra predefinida
      const sampleImageUrl = "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80";
      
      // Save the image URL and summary to localStorage
      const visionImageData = {
        imageUrl: sampleImageUrl,
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
