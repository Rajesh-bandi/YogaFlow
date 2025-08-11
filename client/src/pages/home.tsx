import Navigation from "@/components/ui/navigation";
import HeroSection from "@/components/ui/hero-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useLocation } from "wouter";
import { Star, Clock, Users, Trophy, Target, Zap } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Home() {
  const [, setLocation] = useLocation();
  const scrollRef = useScrollAnimation();
  const featuresRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: featuresRef,
    offset: ["start end", "end start"]
  });
  
  const featuresY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

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
      <motion.section 
        ref={featuresRef}
        className="py-20 bg-white relative overflow-hidden"
        style={{ y: featuresY }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary-300 rounded-full opacity-20"
              animate={{
                y: [0, -50, 0],
                x: [0, Math.random() * 30 - 15, 0],
                scale: [0.5, 1.5, 0.5],
                opacity: [0.1, 0.4, 0.1]
              }}
              transition={{
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            ref={scrollRef} 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h2 
              className="font-poppins font-bold text-4xl lg:text-5xl mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Why Choose <span className="gradient-text">YogaFlow?</span>
            </motion.h2>
            <motion.p 
              className="text-xl text-wellness-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Experience the perfect blend of ancient wisdom and modern technology
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  y: -10,
                  rotateY: 5,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
              >
                <Card className="bg-wellness-50 border-none shadow-lg hover:shadow-xl transition-all h-full relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary-400/5 to-secondary-400/5 opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <CardContent className="p-8 text-center relative z-10">
                    <motion.div 
                      className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6 text-white relative"
                      whileHover={{ 
                        scale: 1.1,
                        rotate: [0, -10, 10, 0],
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {feature.icon}
                      <motion.div
                        className="absolute inset-0 bg-white/20 rounded-full"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0, 0.5, 0] 
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.7
                        }}
                      />
                    </motion.div>
                    <motion.h3 
                      className="font-bold text-xl mb-4"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.1 + index * 0.2 }}
                    >
                      {feature.title}
                    </motion.h3>
                    <motion.p 
                      className="text-wellness-600"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.2 }}
                    >
                      {feature.description}
                    </motion.p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="py-20 gradient-bg relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 border border-white/10 rounded-full"
              style={{
                left: `${10 + (i * 15)}%`,
                top: `${20 + ((i % 3) * 20)}%`
              }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 8 + (i * 2),
                repeat: Infinity,
                delay: i * 0.5
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-3 gap-8 text-center text-white">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: 0.8,
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.1,
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="group cursor-pointer"
              >
                <motion.div 
                  className="text-4xl font-bold mb-2 relative"
                  animate={{ 
                    textShadow: [
                      "0 0 10px rgba(255,255,255,0.3)",
                      "0 0 20px rgba(255,255,255,0.6)",
                      "0 0 10px rgba(255,255,255,0.3)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.7
                  }}
                >
                  {stat.value}
                  <motion.div
                    className="absolute -inset-2 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0.8 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
                <motion.div 
                  className="text-lg opacity-90"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.9 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {stat.label}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 bg-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Floating Elements */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-8 h-8 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 50 - 25, 0],
                rotate: [0, 360],
                scale: [0.5, 1.2, 0.5]
              }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.h2 
            className="font-poppins font-bold text-4xl lg:text-5xl mb-6"
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.8,
              type: "spring",
              stiffness: 100 
            }}
            viewport={{ once: true }}
          >
            Ready to Start Your{" "}
            <motion.span 
              className="gradient-text relative"
              initial={{ opacity: 0, rotateX: -90 }}
              whileInView={{ opacity: 1, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Yoga Journey?
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-primary-400/20 to-secondary-400/20 rounded-lg -z-10"
                initial={{ scale: 0, rotate: -5 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              />
            </motion.span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-wellness-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Take our personalized assessment and receive custom yoga routines designed just for you
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.6,
              delay: 0.6,
              type: "spring",
              stiffness: 150
            }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => setLocation("/assessment")}
              className="gradient-bg text-white px-12 py-6 text-lg font-semibold hover:shadow-xl transition-all relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10">Start Your Assessment</span>
              <motion.div
                className="ml-2 inline-block"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ✨
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </motion.section>

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
