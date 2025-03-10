
import { Mission, User } from "@/types";

// Simulated API for auth
export const auth = {
  currentUser: null as User | null,
  
  // Simulate login with Google
  loginWithGoogle: async (): Promise<User> => {
    // In a real app, this would connect to Firebase/Supabase
    return new Promise((resolve) => {
      setTimeout(() => {
        const user: User = {
          id: "user-" + Math.random().toString(36).substring(2, 9),
          name: "Demo User",
          email: "demo@example.com",
          avatar: "https://ui-avatars.com/api/?name=Demo+User",
          tokens: 0,
          streak: 0
        };
        auth.currentUser = user;
        localStorage.setItem("user", JSON.stringify(user));
        resolve(user);
      }, 1000);
    });
  },

  // Check if user is logged in
  getUser: (): User | null => {
    if (auth.currentUser) return auth.currentUser;
    
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      auth.currentUser = JSON.parse(storedUser);
      return auth.currentUser;
    }
    
    return null;
  },

  // Logout
  logout: (): void => {
    auth.currentUser = null;
    localStorage.removeItem("user");
  }
};

// Simulated API for payment
export const payment = {
  // Simulate Stripe subscription
  subscribe: async (): Promise<User> => {
    // In a real app, this would redirect to Stripe payment
    return new Promise((resolve) => {
      setTimeout(() => {
        if (auth.currentUser) {
          const updatedUser = {
            ...auth.currentUser,
            tokens: auth.currentUser.tokens + 100
          };
          auth.currentUser = updatedUser;
          localStorage.setItem("user", JSON.stringify(updatedUser));
          resolve(updatedUser);
        } else {
          throw new Error("User not authenticated");
        }
      }, 1000);
    });
  }
};

// Simulated API for mission generation
export const missions = {
  // Simulate OpenAI call to generate mission
  generateMission: async (imageUrl: string): Promise<Mission> => {
    // Deduct tokens
    if (!auth.currentUser) throw new Error("User not authenticated");
    if (auth.currentUser.tokens <= 0) throw new Error("Not enough tokens");
    
    const updatedUser = {
      ...auth.currentUser,
      tokens: auth.currentUser.tokens - 1
    };
    auth.currentUser = updatedUser;
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    // In a real app, this would call OpenAI API
    return new Promise((resolve) => {
      setTimeout(() => {
        const mission: Mission = {
          id: "mission-" + Math.random().toString(36).substring(2, 9),
          userId: auth.currentUser!.id,
          title: "Explore New Horizons",
          description: "Based on your image, I notice you're in an environment with potential for discovery. Your mission today is to spend 30 minutes exploring a part of your surroundings you've never paid attention to before. Document at least one interesting discovery.",
          imageUrl: imageUrl,
          completed: false,
          createdAt: new Date()
        };
        
        // Store mission in localStorage
        const storedMissions = localStorage.getItem("missions");
        const missions = storedMissions ? JSON.parse(storedMissions) : [];
        missions.push(mission);
        localStorage.setItem("missions", JSON.stringify(missions));
        
        resolve(mission);
      }, 2000);
    });
  },
  
  // Mark mission as completed
  completeMission: async (missionId: string): Promise<User> => {
    if (!auth.currentUser) throw new Error("User not authenticated");
    
    // Update mission
    const storedMissions = localStorage.getItem("missions");
    if (!storedMissions) throw new Error("No missions found");
    
    const missions = JSON.parse(storedMissions);
    const missionIndex = missions.findIndex((m: Mission) => m.id === missionId);
    
    if (missionIndex === -1) throw new Error("Mission not found");
    
    missions[missionIndex].completed = true;
    localStorage.setItem("missions", JSON.stringify(missions));
    
    // Update user streak
    const today = new Date().toDateString();
    const lastMissionDate = auth.currentUser.lastMissionDate 
      ? new Date(auth.currentUser.lastMissionDate).toDateString() 
      : null;
    
    // Check if last mission was yesterday or this is first mission
    const isConsecutive = !lastMissionDate || 
      (new Date(today).getTime() - new Date(lastMissionDate).getTime()) <= 86400000;
    
    const updatedUser = {
      ...auth.currentUser,
      streak: isConsecutive ? auth.currentUser.streak + 1 : 1,
      lastMissionDate: new Date()
    };
    
    auth.currentUser = updatedUser;
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    return updatedUser;
  },
  
  // Get user's missions
  getUserMissions: (): Mission[] => {
    if (!auth.currentUser) return [];
    
    const storedMissions = localStorage.getItem("missions");
    if (!storedMissions) return [];
    
    const allMissions = JSON.parse(storedMissions);
    return allMissions.filter((m: Mission) => m.userId === auth.currentUser!.id);
  },
  
  // Get specific mission
  getMission: (missionId: string): Mission | null => {
    const storedMissions = localStorage.getItem("missions");
    if (!storedMissions) return null;
    
    const missions = JSON.parse(storedMissions);
    return missions.find((m: Mission) => m.id === missionId) || null;
  }
};
