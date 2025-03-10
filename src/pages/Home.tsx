
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Camera, Star, TargetIcon } from "lucide-react";
import { useAuth } from "@/context/auth-context";

const Home = () => {
  const { user } = useAuth();

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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="group">
              <Link to={user ? "/dashboard" : "/login"}>
                Get Started
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
