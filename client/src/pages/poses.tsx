import Navigation from "@/components/ui/navigation";
import PoseCard from "@/components/ui/pose-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Poses() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Poses" },
    { id: "standing", name: "Standing" },
    { id: "seated", name: "Seated" },
    { id: "backbends", name: "Backbends" },
    { id: "twists", name: "Twists" },
    { id: "inversions", name: "Inversions" }
  ];

  const poses = [
    {
      id: "1",
      name: "Downward Dog",
      description: "Strengthens arms and legs while stretching the spine",
      difficulty: "beginner",
      category: "standing",
      image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
    },
    {
      id: "2",
      name: "Warrior I",
      description: "Builds strength and stability in legs and core",
      difficulty: "intermediate",
      category: "standing",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
    },
    {
      id: "3",
      name: "Child's Pose",
      description: "Gentle resting pose that calms the nervous system",
      difficulty: "beginner",
      category: "seated",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
    },
    {
      id: "4",
      name: "Tree Pose",
      description: "Improves balance and strengthens standing leg",
      difficulty: "beginner",
      category: "standing",
      image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
    },
    {
      id: "5",
      name: "Triangle Pose",
      description: "Opens hips and stretches the side body",
      difficulty: "intermediate",
      category: "standing",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
    },
    {
      id: "6",
      name: "Cat-Cow",
      description: "Increases spinal flexibility and releases tension",
      difficulty: "beginner",
      category: "backbends",
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
    },
    {
      id: "7",
      name: "Warrior III",
      description: "Advanced balancing pose that builds core strength",
      difficulty: "advanced",
      category: "standing",
      image: "https://images.unsplash.com/photo-1593164842264-854604db2260?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
    },
    {
      id: "8",
      name: "Savasana",
      description: "Final relaxation pose for deep rest and integration",
      difficulty: "beginner",
      category: "seated",
      image: "https://images.unsplash.com/photo-1562771379-eafdca7a02f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
    }
  ];

  const filteredPoses = selectedCategory === "all" 
    ? poses 
    : poses.filter(pose => pose.category === selectedCategory);

  return (
    <div className="min-h-screen bg-wellness-50">
      <Navigation />
      
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="font-poppins font-bold text-4xl lg:text-5xl mb-6">
              Pose <span className="gradient-text">Library</span>
            </h1>
            <p className="text-xl text-wellness-600 max-w-2xl mx-auto">
              Explore our comprehensive library of yoga poses with detailed instructions and benefits
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPoses.map((pose) => (
              <PoseCard key={pose.id} pose={pose} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button className="gradient-bg text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all">
              View All 500+ Poses
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
