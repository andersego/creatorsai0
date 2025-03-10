
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Mission } from "@/types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MissionCardProps {
  mission: Mission;
  onComplete?: (missionId: string) => void;
  className?: string;
}

const MissionCard = ({ mission, onComplete, className }: MissionCardProps) => {
  const formattedDate = new Date(mission.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Card className={cn("overflow-hidden transition-all duration-300", className)}>
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={mission.imageUrl}
          alt="Mission"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{mission.title}</CardTitle>
            <CardDescription>{formattedDate}</CardDescription>
          </div>
          {mission.completed && (
            <div className="flex items-center text-green-500 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Completed
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{mission.description}</p>
      </CardContent>
      {onComplete && !mission.completed && (
        <CardFooter>
          <Button
            className="w-full"
            variant="default"
            onClick={() => onComplete(mission.id)}
          >
            Mark as Completed
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default MissionCard;
