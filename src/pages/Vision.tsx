
import { useState, useEffect } from "react";
import Layout from "@/components/layout/layout";
import { VisionForm } from "@/components/vision/vision-form";
import { VisionBoard } from "@/components/vision/vision-board";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";

const Vision = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(true);
  const [hasVisionImage, setHasVisionImage] = useState(false);

  useEffect(() => {
    const checkVisionImage = () => {
      if (user) {
        const savedVisionImage = localStorage.getItem(`vision-image-${user.id}`);
        setHasVisionImage(!!savedVisionImage);
        
        // If user already has a vision image, show it instead of the form
        if (!!savedVisionImage) {
          setShowForm(false);
        }
      }
    };

    checkVisionImage();
    window.addEventListener('visionImageCreated', checkVisionImage);
    
    return () => {
      window.removeEventListener('visionImageCreated', checkVisionImage);
    };
  }, [user]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mi Visión</h1>
            <p className="text-muted-foreground mt-1">
              Define tu visión a través de estas cuatro áreas clave
            </p>
          </div>

          <div className="grid gap-6">
            {showForm && <VisionForm onVisionGenerated={() => setShowForm(false)} />}
            {!showForm && <VisionBoard />}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Vision;
