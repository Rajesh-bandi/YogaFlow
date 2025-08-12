import Navigation from "@/components/ui/navigation";
import PoseCard from "@/components/ui/pose-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";

interface YogaPose {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  goal_category: 'Mindfulness' | 'Weight Loss' | 'Posture' | 'Stress Relief' | 'Strength' | 'Flexibility';
  name: string;
  sanskrit_name: string;
  min_age: number;
  max_age: number;
  benefits: string;
  duration_sec: number;
}

export default function Poses() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  // Fetch real yoga poses from the dataset
  const { data: yogaPoses = [], isLoading } = useQuery<YogaPose[]>({
    queryKey: ["/api/poses"],
  });

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "mindfulness", name: "Mindfulness" },
    { id: "weight loss", name: "Weight Loss" },
    { id: "posture", name: "Posture" },
    { id: "stress relief", name: "Stress Relief" },
    { id: "strength", name: "Strength" },
    { id: "flexibility", name: "Flexibility" }
  ];

  const difficulties = [
    { id: "all", name: "All Levels" },
    { id: "beginner", name: "Beginner" },
    { id: "intermediate", name: "Intermediate" },
    { id: "advanced", name: "Advanced" }
  ];

  // Filter poses based on selected category and difficulty
  const filteredPoses = yogaPoses.filter(pose => {
    const matchesCategory = selectedCategory === "all" || 
      pose.goal_category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesDifficulty = selectedDifficulty === "all" || 
      pose.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    return matchesCategory && matchesDifficulty;
  });

  // Convert yoga poses to the format expected by PoseCard
  const displayPoses = filteredPoses.map((pose, index) => ({
    id: index.toString(),
    name: pose.name,
    sanskrit_name: pose.sanskrit_name,
    description: pose.benefits,
    difficulty: pose.difficulty,
    category: pose.goal_category.toLowerCase().replace(' ', '-'),
    duration: pose.duration_sec,
    image: `https://images.unsplash.com/photo-${1599901860904 + (index % 10)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200`
  }));

  return (
    <div className="min-h-screen bg-wellness-50">
      <Navigation />
      
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="font-poppins font-bold text-4xl lg:text-5xl mb-6">
              Pose <span className="gradient-text">Library</span>
            </h1>
            <p className="text-xl text-wellness-600 max-w-2xl mx-auto mb-4">
              Explore our comprehensive library of yoga poses with detailed instructions and benefits
            </p>
            <p className="text-lg text-wellness-500">
              {isLoading ? 'Loading...' : `${yogaPoses.length} authentic yoga poses from our real dataset`}
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-4 text-center">Filter by Category</h3>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id 
                    ? "gradient-bg text-white" 
                    : "bg-wellness-100 text-wellness-600 hover:bg-primary-50"
                  }
                >
                  {category.name}
                </Button>
              ))}
            </div>
            
            <h3 className="font-semibold text-lg mb-4 text-center">Filter by Difficulty</h3>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {difficulties.map((difficulty) => (
                <Button
                  key={difficulty.id}
                  variant={selectedDifficulty === difficulty.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDifficulty(difficulty.id)}
                  className={selectedDifficulty === difficulty.id 
                    ? "bg-secondary-500 text-white hover:bg-secondary-600" 
                    : "bg-wellness-100 text-wellness-600 hover:bg-secondary-50"
                  }
                >
                  {difficulty.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div className="text-center mb-8">
            <p className="text-wellness-600">
              Showing {filteredPoses.length} poses
              {selectedCategory !== "all" && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
              {selectedDifficulty !== "all" && ` for ${difficulties.find(d => d.id === selectedDifficulty)?.name}`}
            </p>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Poses grid */}
          {!isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayPoses.map((pose) => (
                <PoseCard key={pose.id} pose={pose} />
              ))}
            </div>
          )}

          {/* No results */}
          {!isLoading && filteredPoses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-wellness-600 mb-4">No poses found for the selected filters</p>
              <Button 
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedDifficulty("all");
                }}
                className="gradient-bg text-white"
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Call to action */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="font-poppins font-bold text-2xl mb-4">
                Ready to start your yoga journey?
              </h3>
              <p className="text-wellness-600 mb-6">
                Take our personalized assessment to get custom routines with poses that match your goals and experience level.
              </p>
              <Button 
                onClick={() => setLocation("/assessment")}
                className="gradient-bg text-white px-8 py-3 text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all"
              >
                Take Assessment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}