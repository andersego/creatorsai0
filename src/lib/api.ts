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
  lastGeneratedMission: null as Mission | null,
  
  // Use mockup data instead of simulating an API call
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
    
    // Generate mockup mission data immediately
    const missionTitles = [
      "Explore Your Surroundings",
      "Capture a New Perspective",
      "Connect with Nature",
      "Rediscover Your Neighborhood",
      "Find Hidden Beauty"
    ];
    
    const missionDescriptions = [
      "Based on your image, I notice you're in an environment with potential for discovery. Your mission today is to spend 30 minutes exploring a part of your surroundings you've never paid attention to before. Document at least one interesting discovery.",
      "Your environment has fascinating angles and perspectives. Your mission is to take 3 photos of the same subject from completely different angles, revealing something new each time.",
      "I see elements of nature in your image. Your mission is to find and document 5 different living things within 100 meters of where you are right now.",
      "The setting in your image suggests a familiar place. Your mission is to walk a new route through your neighborhood and discover at least one place you've never noticed before.",
      "There's beauty hidden in plain sight. Your mission is to find and photograph 3 things most people would walk past without noticing their unique qualities."
    ];
    
    // Randomly select a title and description
    const randomIndex = Math.floor(Math.random() * missionTitles.length);
    
    const mission: Mission = {
      id: "mission-" + Math.random().toString(36).substring(2, 9),
      userId: auth.currentUser!.id,
      title: missionTitles[randomIndex],
      description: missionDescriptions[randomIndex],
      imageUrl: imageUrl,
      completed: false,
      createdAt: new Date()
    };
    
    // Store the mission in memory cache in case localStorage fails
    missions.lastGeneratedMission = mission;
    
    try {
      // Store mission in localStorage with quota management
      const storedMissions = localStorage.getItem("missions");
      let missionsList = storedMissions ? JSON.parse(storedMissions) : [];
      
      // Keep only the most recent 20 missions to prevent storage overflow
      if (missionsList.length >= 20) {
        missionsList = missionsList.slice(-19); // Keep only the last 19 to add new one
      }
      
      missionsList.push(mission);
      localStorage.setItem("missions", JSON.stringify(missionsList));
    } catch (error) {
      console.warn("Unable to save mission to localStorage, continuing without saving", error);
      // Still return the mission even if we can't save it
    }
    
    return mission;
  },
  
  // Mark mission as completed
  completeMission: async (missionId: string): Promise<User> => {
    if (!auth.currentUser) throw new Error("User not authenticated");
    
    // Update mission
    const storedMissions = localStorage.getItem("missions");
    let missions = [];
    let missionFound = false;
    
    if (storedMissions) {
      missions = JSON.parse(storedMissions);
      const missionIndex = missions.findIndex((m: Mission) => m.id === missionId);
      
      if (missionIndex !== -1) {
        missions[missionIndex].completed = true;
        missionFound = true;
        localStorage.setItem("missions", JSON.stringify(missions));
      }
    }
    
    // If not found in localStorage, check the last generated mission in memory
    if (!missionFound && missions.lastGeneratedMission && missions.lastGeneratedMission.id === missionId) {
      missions.lastGeneratedMission.completed = true;
    }
    
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
    let allMissions = storedMissions ? JSON.parse(storedMissions) : [];
    
    // Filter by user ID
    const userMissions = allMissions.filter((m: Mission) => m.userId === auth.currentUser!.id);
    
    // Add last generated mission if it exists and isn't already in the list
    if (missions.lastGeneratedMission && 
        missions.lastGeneratedMission.userId === auth.currentUser.id && 
        !userMissions.some((m: Mission) => m.id === missions.lastGeneratedMission!.id)) {
      userMissions.push(missions.lastGeneratedMission);
    }
    
    return userMissions;
  },
  
  // Get specific mission
  getMission: (missionId: string): Mission | null => {
    // First check in-memory cache for the last generated mission
    if (missions.lastGeneratedMission && missions.lastGeneratedMission.id === missionId) {
      return missions.lastGeneratedMission;
    }
    
    // Then check localStorage
    const storedMissions = localStorage.getItem("missions");
    if (!storedMissions) return null;
    
    const missionsList = JSON.parse(storedMissions);
    return missionsList.find((m: Mission) => m.id === missionId) || null;
  }
};
