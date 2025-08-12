import Navigation from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, Users, AlertTriangle, Settings, Heart } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface YogaPose {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  goal_category: 'Mindfulness' | 'Weight Loss' | 'Posture' | 'Stress Relief' | 'Strength' | 'Flexibility';
  name: string;
  sanskrit_name: string;
  min_age: number;
  max_age: number;
  benefits: string;
  duration_sec: number;
  instructions?: string;
  precautions?: string;
  modifications?: string;
  image?: string;
}

const difficultyColors: { [key: string]: string } = {
  "beginner": "bg-secondary-400",
  "intermediate": "bg-orange-500", 
  "advanced": "bg-red-500",
};

export default function PoseDetails() {
  const [, setLocation] = useLocation();
  const { slug } = useParams<{ slug: string }>();
  
  // Fetch all poses and find the matching one
  const { data: yogaPoses = [], isLoading } = useQuery<YogaPose[]>({
    queryKey: ["/api/poses"],
  });

  // Find pose by converting name to slug format
  const pose = yogaPoses.find(p => {
    const poseSlug = p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return poseSlug === slug;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-wellness-50">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-4xl mx-auto px-6">
            <Skeleton className="h-8 w-32 mb-6" />
            <div className="grid md:grid-cols-2 gap-8">
              <Skeleton className="h-96 w-full rounded-2xl" />
              <div className="space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pose) {
    return (
      <div className="min-h-screen bg-wellness-50">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-2xl font-bold text-wellness-800 mb-4">Pose Not Found</h1>
            <Button onClick={() => setLocation("/poses")} className="gradient-bg text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Poses
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
  };

  return (
    <div className="min-h-screen bg-wellness-50">
      <Navigation />
      
      <div className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/poses")} 
            className="mb-6 text-wellness-600 hover:text-primary-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Poses
          </Button>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {/* Image Section */}
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                <img 
                  src={pose.image || `https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400`}
                  alt={pose.name}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className={`${difficultyColors[pose.difficulty]} text-white shadow-lg`}>
                    {pose.difficulty}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <div>
                <h1 className="font-poppins font-bold text-4xl text-wellness-800 mb-2">
                  {pose.name}
                </h1>
                <p className="text-primary-600 text-lg italic mb-4">{pose.sanskrit_name}</p>
                <p className="text-wellness-600 text-lg leading-relaxed">{pose.benefits}</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-white border-none shadow-sm">
                  <CardContent className="p-4 text-center">
                    <Clock className="w-5 h-5 text-primary-500 mx-auto mb-2" />
                    <p className="text-sm text-wellness-600">Duration</p>
                    <p className="font-semibold text-wellness-800">{formatDuration(pose.duration_sec)}</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-none shadow-sm">
                  <CardContent className="p-4 text-center">
                    <Users className="w-5 h-5 text-primary-500 mx-auto mb-2" />
                    <p className="text-sm text-wellness-600">Age Range</p>
                    <p className="font-semibold text-wellness-800">{pose.min_age}-{pose.max_age}</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-none shadow-sm">
                  <CardContent className="p-4 text-center">
                    <Heart className="w-5 h-5 text-primary-500 mx-auto mb-2" />
                    <p className="text-sm text-wellness-600">Category</p>
                    <p className="font-semibold text-wellness-800">{pose.goal_category}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Detailed Information Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Instructions */}
            {pose.instructions && (
              <Card className="bg-white border-none shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                      <Settings className="w-4 h-4 text-primary-600" />
                    </div>
                    <h3 className="font-semibold text-lg text-wellness-800">Instructions</h3>
                  </div>
                  <p className="text-wellness-600 leading-relaxed">{pose.instructions}</p>
                </CardContent>
              </Card>
            )}

            {/* Precautions */}
            {pose.precautions && (
              <Card className="bg-white border-none shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-lg text-wellness-800">Precautions</h3>
                  </div>
                  <p className="text-wellness-600 leading-relaxed">{pose.precautions}</p>
                </CardContent>
              </Card>
            )}

            {/* Modifications */}
            {pose.modifications && (
              <Card className="bg-white border-none shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center mr-3">
                      <Settings className="w-4 h-4 text-secondary-600" />
                    </div>
                    <h3 className="font-semibold text-lg text-wellness-800">Modifications</h3>
                  </div>
                  <p className="text-wellness-600 leading-relaxed">{pose.modifications}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="font-poppins font-bold text-2xl mb-4">
                Ready to practice this pose?
              </h3>
              <p className="text-wellness-600 mb-6">
                Get personalized routines that include poses perfect for your level and goals.
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => setLocation("/assessment")}
                  className="gradient-bg text-white px-6 py-3 font-semibold hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  Start Assessment
                </Button>
                <Button 
                  onClick={() => setLocation("/poses")}
                  variant="outline"
                  className="px-6 py-3 border-primary-500 text-primary-600 hover:bg-primary-50"
                >
                  Browse More Poses
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}