
import { useEffect, useState } from "react";
import Layout from "@/components/layout/layout";
import { useAuth } from "@/context/auth-context";
import { missions } from "@/lib/api";
import { Mission } from "@/types";
import MissionCard from "@/components/mission/mission-card";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

const Missions = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [userMissions, setUserMissions] = useState<Mission[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      // Load the user's missions
      const loadedMissions = missions.getUserMissions();
      setUserMissions(loadedMissions);
    }
  }, [user]);

  const handleCompleteMission = async (missionId: string) => {
    try {
      const updatedUser = await missions.completeMission(missionId);
      updateUser(updatedUser);
      
      // Update missions list
      const loadedMissions = missions.getUserMissions();
      setUserMissions(loadedMissions);
      
      toast({
        title: "Mission completed!",
        description: `You're on a ${updatedUser.streak} day streak!`,
      });
    } catch (error) {
      console.error("Error completing mission:", error);
      toast({
        title: "Error",
        description: "There was a problem completing the mission",
        variant: "destructive",
      });
    }
  };

  // If no user-generated missions exist, show examples
  const exampleMissions: Mission[] = [
    {
      id: "example-1",
      userId: "example",
      title: "Urban Explorer",
      description: "Explore a neighborhood you've never visited. Document three interesting architectural features and one local business you'd like to try.",
      imageUrl: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      completed: false,
      createdAt: new Date()
    },
    {
      id: "example-2",
      userId: "example",
      title: "Nature Connection",
      description: "Find a natural space near you - a park, garden, or even a single tree. Spend 15 minutes observing the details, sounds, and sensations.",
      imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      completed: true,
      createdAt: new Date()
    },
    {
      id: "example-3",
      userId: "example",
      title: "Creative Challenge",
      description: "Using only objects in your immediate surroundings, create a small arrangement that represents how you're feeling today.",
      imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      completed: false,
      createdAt: new Date()
    }
  ];

  const displayMissions = userMissions.length > 0 ? userMissions : exampleMissions;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Missions</h1>
            <p className="text-muted-foreground">
              {userMissions.length > 0 
                ? `You have ${userMissions.filter(m => m.completed).length} completed missions`
                : "Example missions to inspire you"}
            </p>
          </div>
          {user && (
            <Link 
              to="/dashboard" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium"
            >
              Generate New Mission
            </Link>
          )}
        </div>

        {displayMissions.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No missions yet</h2>
            <p className="text-muted-foreground mb-6">
              Generate your first mission to get started
            </p>
            <Link 
              to="/dashboard" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium"
            >
              Generate Mission
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayMissions.map((mission, index) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <MissionCard 
                  mission={mission}
                  onComplete={userMissions.length > 0 ? handleCompleteMission : undefined}
                  className="h-full cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/mission/${mission.id}`)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Missions;
