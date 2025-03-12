
import { useState } from "react";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Camera, Loader2, Star, TargetIcon, Zap } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import ImageUpload from "@/components/ui/image-upload";
import { Card, CardContent } from "@/components/ui/card";
import { missions } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [missionType, setMissionType] = useState<"random" | "creator">("random");

  const handleImageSelected = (imageUrl: string) => {
    setUploadedImage(imageUrl);
  };

  const handleGenerateMission = async () => {
    if (!uploadedImage) return;
    
    try {
      setIsGenerating(true);
      
      // Generate mission with mockup data
      const mission = await missions.generateMission(uploadedImage, missionType);
      
      toast({
        title: "Mission generated!",
        description: "Your personalized mission is ready",
      });
      
      // Ensure the mission exists before navigating
      if (mission && mission.id) {
        // Navigate to the mission page
        navigate(`/mission/${mission.id}`);
      } else {
        throw new Error("Failed to generate mission");
      }
    } catch (error: any) {
      console.error("Mission generation error:", error);
      toast({
        title: "Mission generation failed",
        description: error.message || "There was a problem generating your mission",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center text-center mt-12 mb-16 md:mt-20 md:mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <div className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
            Discover your next mission
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4 md:text-5xl lg:text-6xl">
            Turn your photos into<br /> personalized <span className="text-gradient">missions</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Upload photos of your surroundings and receive AI-generated missions
            that inspire you to explore, create, and grow every day.
          </p>

          <div className="max-w-xl mx-auto mb-10">
            <Card>
              <CardContent className="p-6 space-y-4">
                <ImageUpload onImageSelected={handleImageSelected} />
                
                {uploadedImage && (
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium">Mission Type</label>
                      <Select
                        value={missionType}
                        onValueChange={(value) => setMissionType(value as "random" | "creator")}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select mission type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="random">Random</SelectItem>
                          <SelectItem value="creator">Creator Growth</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        {missionType === "random" 
                          ? "Generate a random mission based on your surroundings"
                          : "Get a mission to help grow your creator skills"}
                      </p>
                    </div>
                    
                    <Button
                      onClick={handleGenerateMission}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating mission...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-4 w-4" />
                          Generate mission
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="group">
              <Link to={user ? "/dashboard" : "/login"}>
                Go to Dashboard
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/missions">
                View Example Missions
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl mt-16 rounded-xl overflow-hidden shadow-xl"
        >
          <div className="aspect-[16/9] bg-gradient-to-b from-primary/5 to-primary/10 rounded-xl overflow-hidden">
            <div className="p-8 md:p-12 flex flex-col items-center justify-center h-full">
              <img 
                src="https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80" 
                alt="Application Preview" 
                className="rounded-lg shadow-lg border max-w-full h-auto"
              />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <Feature 
            icon={<Camera className="w-6 h-6" />}
            title="Upload Photos"
            description="Upload photos from your surroundings to provide context for your personalized missions."
            delay={0.2}
          />
          <Feature 
            icon={<TargetIcon className="w-6 h-6" />}
            title="Get Missions"
            description="Receive AI-generated missions that inspire you to explore and engage with your environment."
            delay={0.3}
          />
          <Feature 
            icon={<Star className="w-6 h-6" />}
            title="Build Streaks"
            description="Track your progress and build daily streaks as you complete missions and grow."
            delay={0.4}
          />
        </div>
      </div>
    </Layout>
  );
};

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const Feature = ({ icon, title, description, delay }: FeatureProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center text-center"
    >
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
};

export default Home;
