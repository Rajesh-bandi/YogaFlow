import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Play } from "lucide-react";
import { useLocation } from "wouter";
import type { Routine } from "@shared/schema";

interface RoutineCardProps {
  routine: Routine;
}

const routineImages: { [key: string]: string } = {
  "morning": "https://images.unsplash.com/photo-1588286840104-8957b019727f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
  "strength": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
  "evening": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
};

const categoryIcons: { [key: string]: string } = {
  "morning": "☀️",
  "strength": "💪", 
  "evening": "🌙",
};

const difficultyColors: { [key: string]: string } = {
  "beginner": "bg-secondary-400",
  "intermediate": "bg-orange-500",
  "advanced": "bg-red-500",
  "all levels": "bg-green-500",
};

export default function RoutineCard({ routine }: RoutineCardProps) {
  const [, setLocation] = useLocation();
  
  const handleStartRoutine = () => {
    console.log("Starting routine:", routine.name);
    setLocation("/start-routine");
  };

  return (
    <Card className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-secondary-400 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">
                {categoryIcons[routine.category] || "🧘"}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-xl">{routine.name}</h3>
              <div className="flex items-center text-wellness-600">
                <Clock className="w-4 h-4 mr-1" />
                <span>{routine.duration} minutes</span>
              </div>
            </div>
          </div>
          <Badge className={`${difficultyColors[routine.difficulty]} text-white`}>
            {routine.difficulty}
          </Badge>
        </div>
        
        <img 
          src={routineImages[routine.category] || routineImages["morning"]} 
          alt={routine.name}
          className="w-full h-48 object-cover rounded-xl mb-6" 
        />
        
        <p className="text-wellness-600 mb-6">
          {routine.description}
        </p>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center text-white text-sm">
              {Array.isArray(routine.poses) ? routine.poses.length : 0}
            </div>
            <span className="text-wellness-600">poses</span>
          </div>
          <div className="flex items-center space-x-1 text-accent-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
        </div>
        
        <Button 
          onClick={handleStartRoutine}
          className="w-full gradient-bg text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
        >
          <Play className="w-5 h-5" />
          <span>Start Routine</span>
        </Button>
      </CardContent>
    </Card>
  );
}
