import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowRight, Play, Sparkles } from "lucide-react";

export default function HeroSection() {
  const [, setLocation] = useLocation();

  const stats = [
    { label: "Active Users", value: "10K+" },
    { label: "Yoga Poses", value: "500+" },
    { label: "Satisfaction", value: "95%" }
  ];

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden">
      <div className="parallax-bg absolute inset-0 gradient-bg opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-8">
          <div>
            <h1 className="font-poppins font-bold text-5xl lg:text-7xl leading-tight">
              Your Perfect
              <span className="gradient-text block">Yoga Journey</span>
              Starts Here
            </h1>
          </div>
          
          <div>
            <p className="text-xl text-wellness-600 leading-relaxed">
              Discover personalized yoga routines powered by AI. Whether you're a beginner or advanced practitioner, our intelligent system creates the perfect practice for your goals, flexibility, and lifestyle.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => setLocation("/assessment")}
              className="gradient-bg text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center space-x-2"
            >
              <span>Start Your Assessment</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
            
            <Button 
              variant="outline"
              className="border-2 border-primary-400 text-primary-500 px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary-50 transition-all flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Watch Demo</span>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-wellness-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 3D Character Container */}
        <div className="relative">
          <div className="w-full h-96 lg:h-[500px] rounded-3xl glass-morphism flex items-center justify-center relative overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1588286840104-8957b019727f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Yoga Tree Pose" 
              className="w-full h-full object-cover rounded-3xl floating" 
            />
            {/* Overlay for better text contrast */}
            <div className="absolute inset-0 bg-black/20 rounded-3xl"></div>
          </div>
          
          <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-secondary-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-wellness-800">AI Powered</div>
                <div className="text-sm text-wellness-600">Personalized Routines</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
