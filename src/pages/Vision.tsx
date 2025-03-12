
import { useState, useEffect } from "react";
import Layout from "@/components/layout/layout";
import { VisionForm } from "@/components/vision/vision-form";
import { VisionBoard } from "@/components/vision/vision-board";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";

const Vision = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(true);
  const [hasVisionImage, setHasVisionImage] = useState(false);

  useEffect(() => {
    const checkVisionImage = () => {
      if (user) {
        const savedVisionImage = localStorage.getItem(`vision-image-${user.id}`);
        setHasVisionImage(!!savedVisionImage);
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Vision</h1>
              <p className="text-muted-foreground mt-1">
                Define your vision through these four key areas
              </p>
            </div>
            
            {hasVisionImage && (
              <Button 
                variant="outline" 
                onClick={() => setShowForm(!showForm)}
                className="self-start"
              >
                {showForm ? "View Vision Image" : "Edit Vision"}
              </Button>
            )}
          </div>

          <div className="grid gap-6">
            {(showForm || !hasVisionImage) && <VisionForm />}
            {(!showForm || !hasVisionImage) && <VisionBoard />}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Vision;
