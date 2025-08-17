import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
// @ts-ignore
// Remove direct import; will fetch at runtime
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useLocation } from "wouter";

interface Pose {
  id: string;
  name: string;
  sanskrit_name?: string;
  description: string;
  difficulty: string;
  category: string;
  image: string;
  duration?: number;
  instructions?: string;
  precautions?: string;
  modifications?: string;
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
  const [imgSrc, setImgSrc] = useState(pose.image);
  React.useEffect(() => {
    fetch("/pose-images.json")
      .then(res => res.json())
      .then((mapping) => {
        if (mapping[pose.name]) {
          setImgSrc(mapping[pose.name]);
        }
      });
  }, [pose.name]);

  const handleViewDetails = () => {
    if (!pose.name) return;
    console.log("View details for:", pose.name);
    // Convert pose name to URL-friendly slug
    const poseSlug = pose.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setLocation(`/pose/${poseSlug}`);
  };

  return (
    <Card className="bg-wellness-50 border-none rounded-2xl hover:shadow-lg transition-all transform hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="relative overflow-hidden rounded-xl mb-4">
          <img
            src={imgSrc}
            alt={pose.name}
            className="w-full h-48 object-cover transition-transform hover:scale-105"
            onError={() => setImgSrc("https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&w=400&h=300")}
          />
          <div className="absolute top-2 right-2">
            <Badge className={`${difficultyColors[pose.difficulty]} text-white text-xs shadow-md`}>
              {pose.difficulty}
            </Badge>
          </div>
          {pose.duration && (
            <div className="absolute bottom-2 left-2">
              <Badge className="bg-black/70 text-white text-xs">
                {Math.floor(pose.duration / 60)}:{(pose.duration % 60).toString().padStart(2, '0')}
              </Badge>
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <h3 className="font-bold text-lg text-wellness-800 mb-1">{pose.name}</h3>
          {pose.sanskrit_name && (
            <p className="text-primary-600 text-sm italic mb-2">{pose.sanskrit_name}</p>
          )}
          <p className="text-wellness-600 text-sm line-clamp-2">{pose.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs border-wellness-300">
              {pose.category ? pose.category.replace('-', ' ') : ''}
            </Badge>
          </div>
          <Button 
            variant="ghost"
            size="sm"
            onClick={handleViewDetails}
            className="text-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-all p-2 rounded-full"
          >
            <Info className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
