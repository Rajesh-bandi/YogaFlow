import Navigation from "@/components/ui/navigation";
import RoutineCard from "@/components/ui/routine-card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { Routine } from "@shared/schema";

export default function Routines() {
  const { data: routines, isLoading } = useQuery<Routine[]>({
    queryKey: ['/api/routines'],
  });

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

          {isLoading ? (
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
            <div className="grid lg:grid-cols-3 gap-8">
              {routines?.map((routine) => (
                <RoutineCard key={routine.id} routine={routine} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
