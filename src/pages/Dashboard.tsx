
import { useState } from "react";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/ui/image-upload";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { missions } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import TokenPurchase from "@/components/tokens/token-purchase";
import { Loader2, Zap } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageSelected = (imageUrl: string) => {
    setUploadedImage(imageUrl);
  };

  const handleGenerateMission = async () => {
    if (!uploadedImage) return;
    
    try {
      setIsGenerating(true);
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to generate missions",
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }
      
      if (user.tokens <= 0) {
        toast({
          title: "No tokens available",
          description: "Please subscribe to get more tokens",
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }
      
      // Generate mission with mockup data
      const mission = await missions.generateMission(uploadedImage);
      
      toast({
        title: "Mission generated!",
        description: "Your personalized mission is ready",
      });
      
      // Navigate to the mission page
      navigate(`/mission/${mission.id}`);
    } catch (error: any) {
      console.error("Mission generation error:", error);
      toast({
        title: "Mission generation failed",
        description: error.message || "There was a problem generating your mission",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Upload an image to generate your personalized mission
                </p>
              </div>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <ImageUpload onImageSelected={handleImageSelected} />
                  
                  <AnimatePresence mode="wait">
                    {uploadedImage && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Button
                          onClick={handleGenerateMission}
                          disabled={isGenerating || !user || user.tokens <= 0}
                          className="w-full mt-4"
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating mission...
                            </>
                          ) : (
                            <>
                              <Zap className="mr-2 h-4 w-4" />
                              Generate mission ({user?.tokens || 0} tokens left)
                            </>
                          )}
                        </Button>
                        
                        {user && user.tokens <= 0 && (
                          <p className="text-sm text-destructive mt-2 text-center">
                            You need tokens to generate missions
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          <div className="w-full md:w-80">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <TokenPurchase />
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
