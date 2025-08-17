import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Popover } from "@/components/ui/popover";

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  // Add state for dropdown menu
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Example: check localStorage for login status
    setLoggedIn(!!localStorage.getItem("user"));
  }, [location]);

  const navItems = [
  { href: "/", label: "Home" },
  { href: "/assessment", label: "Assessment" },
  { href: "/routines", label: "Routines" },
  { href: "/poses", label: "Poses" },
  { href: "live-detection", label: "Live Detection" },
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
              {navItems.map((item) => (
                item.label === "Live Detection" ? (
                  <button
                    key={item.href}
                    onClick={() => setLocation("/live-detection")}
                    className="font-medium transition-colors text-wellness-600 hover:text-primary-500"
                  >
                    {item.label}
                  </button>
                ) : (
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
                )
              ))}
            </div>
            <div className="flex items-center space-x-3">
              {!loggedIn ? (
                <>
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
                </>
              ) : (
                <div className="relative">
                  <button
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center font-bold text-white text-lg hover:shadow-lg transition-all"
                    style={{ minWidth: 40, minHeight: 40 }}
                    onClick={() => setShowDropdown((v) => !v)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  >
                    {(() => {
                      try {
                        const user = JSON.parse(localStorage.getItem("user") || "{}");
                        return user.username ? user.username.charAt(0).toUpperCase() : "U";
                      } catch {
                        return "U";
                      }
                    })()}
                  </button>
                  {showDropdown && (
                    <div
                      className="absolute right-0 mt-1 bg-white border rounded shadow z-50 min-w-[100px] py-1 text-sm"
                      style={{ top: '100%' }}
                    >
                      <button
                        className="w-full px-3 py-1 text-left hover:bg-gray-100 rounded"
                        onMouseDown={() => setLocation("/profile")}
                      >
                        Profile
                      </button>
                      <button
                        className="w-full px-3 py-1 text-left hover:bg-gray-100 text-red-600 rounded"
                        onMouseDown={() => {
                          localStorage.removeItem("user");
                          setLocation("/login");
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
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
              {navItems.map((item) => (
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
                {!loggedIn ? (
                  <>
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
                  </>
                ) : (
                  <div className="relative">
                    <button
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center font-bold text-white text-lg hover:shadow-lg transition-all"
                      style={{ minWidth: 40, minHeight: 40 }}
                      onClick={() => setShowDropdown((v) => !v)}
                      onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                    >
                      {(() => {
                        try {
                          const user = JSON.parse(localStorage.getItem("user") || "{}");
                          return user.username ? user.username.charAt(0).toUpperCase() : "U";
                        } catch {
                          return "U";
                        }
                      })()}
                    </button>
                    {showDropdown && (
                      <div
                        className="absolute left-0 w-full mt-2 bg-white border rounded shadow z-50 min-w-[100px] py-1 text-sm"
                        style={{ top: '100%' }}
                      >
                        <button
                          className="w-full px-3 py-1 text-left hover:bg-gray-100 rounded"
                          onMouseDown={() => {
                            setLocation("/profile");
                            setIsMenuOpen(false);
                          }}
                        >
                          Profile
                        </button>
                        <button
                          className="w-full px-3 py-1 text-left hover:bg-gray-100 text-red-600 rounded"
                          onMouseDown={() => {
                            localStorage.removeItem("user");
                            setLocation("/login");
                            setIsMenuOpen(false);
                          }}
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
