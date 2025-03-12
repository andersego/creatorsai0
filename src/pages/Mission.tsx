
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { missions } from "@/lib/api";
import { Mission as MissionType } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, CheckCircle, Loader2, LogIn } from "lucide-react";
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
        // Comprobamos si la misión está en cache o en localStorage
        const missionData = missions.getMission(id);
        if (!missionData) {
          toast({
            title: "Mission not found",
            description: "The mission you're looking for doesn't exist",
            variant: "destructive",
          });
          navigate("/");
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
    
    if (!mission) {
      const retryTimeout = setTimeout(() => {
        if (!mission) {
          loadMission();
        }
      }, 500);
      
      return () => clearTimeout(retryTimeout);
    }
  }, [id, navigate, mission]);

  const handleCompleteMission = async () => {
    if (!mission) return;
    
    // Verificamos si el usuario está logueado
    if (!user) {
      toast({
        title: "Login required",
        description: "You need to login to complete missions",
      });
      return;
    }
    
    try {
      setCompleting(true);
      const updatedUser = await missions.completeMission(mission.id);
      updateUser(updatedUser);
      
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
            <a href="/">Back to Home</a>
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
            <div className="flex flex-wrap justify-between items-center gap-2">
              <h1 className="text-3xl font-bold">{mission.title}</h1>
              {mission.completed && (
                <div className="flex items-center text-green-500 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Completed
                </div>
              )}
              {mission.missionType && (
                <div className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  {mission.missionType === "creator" ? "Creator Growth" : "Random"}
                </div>
              )}
            </div>
            
            <p className="text-lg">
              {mission.description}
            </p>
            
            {!mission.completed && (
              user ? (
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
              ) : (
                <div className="mt-6 space-y-2">
                  <Button 
                    asChild
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <Link to="/login">
                      <LogIn className="mr-2 h-4 w-4" />
                      Login to Complete Mission
                    </Link>
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    You need to be logged in to complete missions and track your progress
                  </p>
                </div>
              )
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Mission;
