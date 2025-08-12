import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/assessment", label: "Assessment" },
    { href: "/routines", label: "Routines" },
    { href: "/poses", label: "Poses" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-wellness-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => setLocation("/")}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🧘</span>
            </div>
            <span className="font-poppins font-bold text-xl gradient-text">YogaFlow</span>
          </button>
          
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              {navItems.slice(0, -1).map((item) => (
                <button
                  key={item.href}
                  onClick={() => setLocation(item.href)}
                  className={`font-medium transition-colors ${
                    location === item.href 
                      ? "text-primary-500" 
                      : "text-wellness-600 hover:text-primary-500"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={() => window.open("https://youtu.be/dQw4w9WgXcQ", "_blank")}
                variant="outline"
                size="sm"
                className="px-4 py-2 border-primary-500 text-primary-600 hover:bg-primary-50 transition-colors"
              >
                Watch Demo
              </Button>
              <Button 
                onClick={() => setLocation("/login")}
                variant="ghost"
                size="sm"
                className="px-4 py-2 text-wellness-600 hover:bg-gray-100 transition-colors"
              >
                Log In
              </Button>
              <Button 
                onClick={() => setLocation("/signup")}
                size="sm"
                className="gradient-bg text-white px-4 py-2 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Sign Up
              </Button>
              <Button 
                onClick={() => setLocation("/assessment")}
                size="sm"
                className="bg-secondary-500 text-white px-4 py-2 rounded-full font-medium hover:bg-secondary-600 transform hover:scale-105 transition-all"
              >
                Get Started
              </Button>
            </div>
          </div>
          
          <button 
            className="md:hidden text-wellness-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-wellness-200 pt-4">
            <div className="flex flex-col space-y-4">
              {navItems.slice(0, -1).map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    setLocation(item.href);
                    setIsMenuOpen(false);
                  }}
                  className={`text-left font-medium transition-colors ${
                    location === item.href 
                      ? "text-primary-500" 
                      : "text-wellness-600 hover:text-primary-500"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="flex flex-col space-y-3 pt-2">
                <Button 
                  onClick={() => {
                    window.open("https://youtu.be/dQw4w9WgXcQ", "_blank");
                    setIsMenuOpen(false);
                  }}
                  variant="outline"
                  className="border-primary-500 text-primary-600 hover:bg-primary-50 w-fit"
                >
                  Watch Demo
                </Button>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      setLocation("/login");
                      setIsMenuOpen(false);
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-wellness-600 hover:bg-gray-100"
                  >
                    Log In
                  </Button>
                  <Button 
                    onClick={() => {
                      setLocation("/signup");
                      setIsMenuOpen(false);
                    }}
                    size="sm"
                    className="gradient-bg text-white px-4 py-2 rounded-full font-medium"
                  >
                    Sign Up
                  </Button>
                </div>
                <Button 
                  onClick={() => {
                    setLocation("/assessment");
                    setIsMenuOpen(false);
                  }}
                  className="bg-secondary-500 text-white px-6 py-2 rounded-full font-medium hover:bg-secondary-600 w-fit"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
