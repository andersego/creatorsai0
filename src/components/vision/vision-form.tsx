import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Heart, Lightbulb, Target, Compass } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import type { VisionParameter } from "@/types";

export const VisionForm = () => {
  const { user } = useAuth();
  const [parameters, setParameters] = useState({
    passion: "",
    mission: "",
    profession: "",
    vocation: ""
  });

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
          <Button onClick={handleSave} className="w-full">
            Save Vision
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
