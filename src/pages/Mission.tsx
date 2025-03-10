
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { missions } from "@/lib/api";
import { Mission as MissionType } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const Mission = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [mission, setMission] = useState<MissionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const loadMission = () => {
      try {
        const missionData = missions.getMission(id);
        if (!missionData) {
          toast({
            title: "Mission not found",
            description: "The mission you're looking for doesn't exist",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }
        
        setMission(missionData);
      } catch (error) {
        console.error("Error loading mission:", error);
        toast({
          title: "Error loading mission",
          description: "There was a problem loading the mission",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadMission();
  }, [id, navigate]);

  const handleCompleteMission = async () => {
    if (!mission || !user) return;
    
    try {
      setCompleting(true);
      const updatedUser = await missions.completeMission(mission.id);
      updateUser(updatedUser);
      
      // Update local mission state
      setMission({ ...mission, completed: true });
      
      toast({
        title: "Mission completed!",
        description: `Great job! You're on a ${updatedUser.streak} day streak!`,
      });
    } catch (error) {
      console.error("Error completing mission:", error);
      toast({
        title: "Error completing mission",
        description: "There was a problem marking the mission as complete",
        variant: "destructive",
      });
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!mission) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Mission not found</h2>
          <p className="text-muted-foreground mb-6">
            The mission you're looking for doesn't exist
          </p>
          <Button asChild>
            <a href="/dashboard">Back to Dashboard</a>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-6" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="rounded-xl overflow-hidden">
            <img 
              src={mission.imageUrl} 
              alt="Mission" 
              className="w-full aspect-video object-cover"
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">{mission.title}</h1>
              {mission.completed && (
                <div className="flex items-center text-green-500 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Completed
                </div>
              )}
            </div>
            
            <p className="text-lg">
              {mission.description}
            </p>
            
            {!mission.completed && (
              <Button 
                onClick={handleCompleteMission} 
                disabled={completing} 
                className="mt-6"
                size="lg"
              >
                {completing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Completing...
                  </>
                ) : (
                  "Mark as Completed"
                )}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Mission;
