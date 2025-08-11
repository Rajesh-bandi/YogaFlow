import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useLocation } from "wouter";

interface Pose {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  category: string;
  image: string;
}

interface PoseCardProps {
  pose: Pose;
}

const difficultyColors: { [key: string]: string } = {
  "beginner": "bg-secondary-400",
  "intermediate": "bg-orange-500", 
  "advanced": "bg-red-500",
  "all levels": "bg-green-500",
};

export default function PoseCard({ pose }: PoseCardProps) {
  const [, setLocation] = useLocation();
  
  const handleViewDetails = () => {
    console.log("View details for:", pose.name);
    // Convert pose name to URL-friendly slug
    const poseSlug = pose.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setLocation(`/pose/${poseSlug}`);
  };

  return (
    <Card className="bg-wellness-50 border-none rounded-2xl hover:shadow-lg transition-all transform hover:-translate-y-1">
      <CardContent className="p-6">
        <img 
          src={pose.image} 
          alt={pose.name}
          className="w-full h-40 object-cover rounded-xl mb-4" 
        />
        <h3 className="font-bold text-lg mb-2">{pose.name}</h3>
        <p className="text-wellness-600 text-sm mb-4">{pose.description}</p>
        <div className="flex items-center justify-between">
          <Badge className={`${difficultyColors[pose.difficulty]} text-white text-xs`}>
            {pose.difficulty}
          </Badge>
          <Button 
            variant="ghost"
            size="sm"
            onClick={handleViewDetails}
            className="text-primary-500 hover:text-primary-600 transition-colors p-2"
          >
            <Info className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
