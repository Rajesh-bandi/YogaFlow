import Navigation from "@/components/ui/navigation";
import HeroSection from "@/components/ui/hero-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useLocation } from "wouter";
import { Star, Clock, Users, Trophy, Target, Zap } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const scrollRef = useScrollAnimation();

  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Personalized Routines",
      description: "AI-powered recommendations based on your goals and experience level"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Guidance",
      description: "Step-by-step instructions with proper form demonstrations"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Progress Tracking",
      description: "Monitor your improvement with detailed analytics and achievements"
    }
  ];

  const stats = [
    { label: "Active Users", value: "10K+" },
    { label: "Yoga Poses", value: "500+" },
    { label: "Satisfaction", value: "95%" }
  ];

  return (
    <div className="min-h-screen bg-wellness-50">
      <Navigation />
      
      <HeroSection />
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div ref={scrollRef} className="text-center mb-16 opacity-0 translate-y-12">
            <h2 className="font-poppins font-bold text-4xl lg:text-5xl mb-6">
              Why Choose <span className="gradient-text">YogaFlow?</span>
            </h2>
            <p className="text-xl text-wellness-600 max-w-2xl mx-auto">
              Experience the perfect blend of ancient wisdom and modern technology
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-wellness-50 border-none hover:shadow-lg transition-all transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6 text-white">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-xl mb-4">{feature.title}</h3>
                  <p className="text-wellness-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 gradient-bg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center text-white">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-poppins font-bold text-4xl lg:text-5xl mb-6">
            Ready to Start Your <span className="gradient-text">Yoga Journey?</span>
          </h2>
          <p className="text-xl text-wellness-600 mb-8 max-w-2xl mx-auto">
            Take our personalized assessment and receive custom yoga routines designed just for you
          </p>
          <Button 
            onClick={() => setLocation("/assessment")}
            className="gradient-bg text-white px-12 py-6 text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all"
          >
            Start Your Assessment
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-wellness-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center">
                  <span className="text-lg">🧘</span>
                </div>
                <span className="font-poppins font-bold text-xl">YogaFlow</span>
              </div>
              <p className="text-gray-300 mb-6">
                Discover your perfect yoga journey with AI-powered personalized routines designed for every level and goal.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Features</h4>
              <ul className="space-y-3 text-gray-300">
                <li>Personalized Routines</li>
                <li>AI Recommendations</li>
                <li>Progress Tracking</li>
                <li>Pose Library</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Support</h4>
              <ul className="space-y-3 text-gray-300">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Community</li>
                <li>FAQ</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Newsletter</h4>
              <p className="text-gray-300 mb-6">Get weekly yoga tips and new routine updates</p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full px-4 py-3 rounded-xl bg-wellness-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button className="w-full gradient-bg text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-wellness-600 pt-8 flex flex-col lg:flex-row justify-between items-center">
            <div className="text-gray-300 text-sm mb-4 lg:mb-0">
              © 2024 YogaFlow. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-300">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
