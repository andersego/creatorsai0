
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Heart, Lightbulb, Target, Compass, SparklesIcon } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { motion } from "framer-motion";
import type { VisionParameter } from "@/types";
import { Button } from "@/components/ui/button";

interface VisionImageData {
  imageUrl: string;
  summary: string;
  createdAt: Date;
}

export const VisionBoard = () => {
  const { user } = useAuth();
  const [visionParams, setVisionParams] = useState<VisionParameter[]>([]);
  const [visionImage, setVisionImage] = useState<VisionImageData | null>(null);

  useEffect(() => {
    const loadVision = () => {
      if (user) {
        const savedVision = localStorage.getItem(`vision-${user.id}`);
        if (savedVision) {
          setVisionParams(JSON.parse(savedVision));
        }
        
        // Load vision image if it exists
        const savedVisionImage = localStorage.getItem(`vision-image-${user.id}`);
        if (savedVisionImage) {
          setVisionImage(JSON.parse(savedVisionImage));
        }
      }
    };

    loadVision();
    window.addEventListener('visionUpdated', loadVision);
    window.addEventListener('visionImageCreated', loadVision);
    
    return () => {
      window.removeEventListener('visionUpdated', loadVision);
      window.removeEventListener('visionImageCreated', loadVision);
    };
  }, [user]);

  const getVisionText = (type: string) => {
    const param = visionParams.find(p => p.type === type);
    return param?.description || "No vision defined yet";
  };

  // Display the beautiful vision with the image
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white pb-10">
          <CardTitle className="text-center text-3xl font-bold">Tu Visión</CardTitle>
          <CardDescription className="text-center text-white/90 text-lg mt-2">
            {visionImage && new Date(visionImage.createdAt).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </CardDescription>
        </CardHeader>
        
        <div className="relative -mt-6 mx-auto max-w-3xl px-4">
          <div className="rounded-xl overflow-hidden shadow-2xl">
            <img 
              src={visionImage?.imageUrl} 
              alt="Tu Visión"
              className="w-full object-cover aspect-video" 
            />
          </div>
        </div>
        
        <CardContent className="pt-10 pb-8 px-8">
          <div className="text-center mb-8">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-xl md:text-2xl font-medium text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600"
            >
              {visionImage?.summary}
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {[
              {
                label: "Lo que amas",
                icon: Heart,
                color: "text-red-500",
                type: "passion",
                emoji: "🔹",
                gradient: "bg-gradient-to-br from-red-50 to-pink-50 border-red-100",
              },
              {
                label: "Lo que el mundo necesita",
                icon: Compass,
                color: "text-blue-500",
                type: "mission",
                emoji: "🔹",
                gradient: "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100",
              },
              {
                label: "En lo que eres bueno",
                icon: Target,
                color: "text-purple-500",
                type: "profession",
                emoji: "🔹",
                gradient: "bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100",
              },
              {
                label: "Por lo que puedes ser recompensado",
                icon: Lightbulb,
                color: "text-green-500",
                type: "vocation",
                emoji: "🔹",
                gradient: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-100",
              },
            ].map(({ label, icon: Icon, color, type, emoji, gradient }) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + parseInt(type === "passion" ? "0" : type === "mission" ? "1" : type === "profession" ? "2" : "3") * 0.1, duration: 0.4 }}
                className={`${gradient} p-5 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-lg">{emoji}</span>
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${color}`} />
                      {label}
                    </h3>
                    <p className="text-sm mt-1">
                      {getVisionText(type)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-8 text-center"
          >
            <div className="max-w-xl mx-auto p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
              <div className="flex items-center gap-2 mb-2 justify-center">
                <SparklesIcon className="h-5 w-5 text-indigo-500" />
                <h3 className="font-medium text-indigo-700">Tu Ikigai</h3>
              </div>
              <p className="text-sm text-indigo-800">
                No solo {getVisionText("passion").split(" ").slice(0, 3).join(" ")}, 
                creas un puente entre {getVisionText("mission").split(" ").slice(0, 3).join(" ")}, 
                inspirando a otros a valorar lo que haces con tu talento para {getVisionText("profession").split(" ").slice(0, 2).join(" ")}. 🌍💚
              </p>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
