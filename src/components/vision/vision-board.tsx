
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Lightbulb, Target, Compass } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import type { VisionParameter } from "@/types";

export const VisionBoard = () => {
  const { user } = useAuth();
  const [visionParams, setVisionParams] = useState<VisionParameter[]>([]);

  useEffect(() => {
    const loadVision = () => {
      if (user) {
        const savedVision = localStorage.getItem(`vision-${user.id}`);
        if (savedVision) {
          setVisionParams(JSON.parse(savedVision));
        }
      }
    };

    loadVision();
    window.addEventListener('visionUpdated', loadVision);
    return () => window.removeEventListener('visionUpdated', loadVision);
  }, [user]);

  const getVisionText = (type: string) => {
    const param = visionParams.find(p => p.type === type);
    return param?.description || "No vision defined yet";
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
      <CardContent className="relative p-6">
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              label: "What You Love",
              icon: Heart,
              color: "text-red-500",
              type: "passion",
              gradient: "bg-gradient-to-br from-red-100 to-pink-100",
              image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
            },
            {
              label: "What the World Needs",
              icon: Compass,
              color: "text-blue-500",
              type: "mission",
              gradient: "bg-gradient-to-br from-blue-100 to-cyan-100",
              image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
            },
            {
              label: "What You're Good At",
              icon: Target,
              color: "text-purple-500",
              type: "profession",
              gradient: "bg-gradient-to-br from-purple-100 to-indigo-100",
              image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f"
            },
            {
              label: "What You Can Be Valued For",
              icon: Lightbulb,
              color: "text-green-500",
              type: "vocation",
              gradient: "bg-gradient-to-br from-green-100 to-emerald-100",
              image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b"
            },
          ].map(({ label, icon: Icon, color, type, gradient, image }) => (
            <div
              key={type}
              className={`${gradient} p-4 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden relative min-h-[200px]`}
            >
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                <img
                  src={image}
                  alt={label}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`h-5 w-5 ${color}`} />
                  <h3 className="font-medium">{label}</h3>
                </div>
                <p className={`text-sm ${getVisionText(type) === "No vision defined yet" ? "text-muted-foreground" : "text-foreground font-medium"}`}>
                  {getVisionText(type)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
