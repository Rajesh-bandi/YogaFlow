import React from "react";
import Navigation from "@/components/ui/navigation";
import PoseCard from "@/components/ui/pose-card";
import { useQuery } from "@tanstack/react-query";
import { mlEngine, type RecommendationInput } from "../lib/ml-recommendations-new";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
// import type { Pose } from "@shared/schema";

function Routines() {
  const [location, setLocation] = useLocation();
  // Fetch recommended poses for the logged-in user
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("user") || "{}") : {};
  // Fetch recommended poses for the logged-in user from backend
  const { data: recommendedPoses, isLoading } = useQuery({
    queryKey: ["recommended-poses", user?.username],
    queryFn: async () => {
      if (!user?.username) return [];
  const apiUrl = import.meta.env.VITE_API_URL;
  const res = await fetch(`${apiUrl}/routines?username=${user.username}`);
      if (!res.ok) return [];
      return await res.json();
    },
  });


  // Fetch all yoga poses from the backend
  const apiUrl = import.meta.env.VITE_API_URL;
  const { data: allPoses = [], isLoading: isLoadingAllPoses } = useQuery<any[]>({
    queryKey: ["/api/poses"],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/poses`);
      if (!res.ok) return [];
      return await res.json();
    },
  });

  // Map recommended pose names to full pose objects
  const poses = (recommendedPoses ?? [])
    .map((poseName: string) => allPoses.find((p: any) => p.name === poseName))
    .filter(Boolean); // Remove any not found
  const hasRoutines = poses.length > 0;
  // Check if routine was completed today
  const today = new Date().toISOString().slice(0, 10);
  const lastStreakDate = typeof window !== 'undefined' ? localStorage.getItem("lastStreakDate") : null;
  const alreadyCompletedToday = lastStreakDate === today;

  // Save all generated routines to MongoDB
  async function saveRoutinesToMongo(routines: any[]) {
    for (const routine of routines) {
      try {
  const apiUrl = import.meta.env.VITE_API_URL;
  await fetch(`${apiUrl}/routines`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(routine),
        });
      } catch (e) {
        console.error("Failed to save routine to MongoDB", e);
      }
    }
  }

  // Save routines when they are generated
  React.useEffect(() => {
    if (hasRoutines) {
  // No longer needed: saving handled by backend
    }
  }, [hasRoutines, poses]);
  return (
    <div className="min-h-screen bg-wellness-50">
      <Navigation />
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="font-poppins font-bold text-4xl lg:text-5xl mb-6">
              Your <span className="gradient-text">Personalized</span> Routines
            </h1>
            <p className="text-xl text-wellness-600 max-w-2xl mx-auto">
              AI-generated yoga sequences designed specifically for your goals, experience level, and preferences
            </p>
          </div>
          {isLoading || isLoadingAllPoses ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-8 shadow-lg">
                  <Skeleton className="w-full h-48 rounded-xl mb-6" />
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-6" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid lg:grid-cols-3 gap-8">
                {hasRoutines ? (
                  poses.map((pose: any, idx: number) => (
                    <PoseCard key={pose.id || pose.name || idx} pose={pose} />
                  ))
                ) : (
                  <div className="col-span-3 text-center text-xl text-wellness-600 py-12">No recommended poses found. Please complete your assessment.</div>
                )}
              </div>
              {hasRoutines && (
                <div className="flex justify-center mt-12">
                  <Button
                    className="gradient-bg text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:scale-105 transition-all"
                    onClick={() => {
                      localStorage.setItem("routinePoses", JSON.stringify(poses));
                      setLocation("/start-routine");
                    }}
                  >
                    {alreadyCompletedToday ? "Do Again" : "Start Routine"}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Routines;
