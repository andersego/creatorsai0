
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Lightbulb, Target, Compass } from "lucide-react";

export const VisionBoard = () => {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
      <CardContent className="relative p-6">
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "What You Love", icon: Heart, color: "text-red-500" },
            { label: "What the World Needs", icon: Compass, color: "text-blue-500" },
            { label: "What You're Good At", icon: Target, color: "text-purple-500" },
            { label: "What You Can Be Valued For", icon: Lightbulb, color: "text-green-500" },
          ].map(({ label, icon: Icon, color }) => (
            <div
              key={label}
              className="bg-card p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-5 w-5 ${color}`} />
                <h3 className="font-medium">{label}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                No vision defined yet
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
