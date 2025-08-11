import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export default function HeroSection() {
  const [, setLocation] = useLocation();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  const [yogaPoseIndex, setYogaPoseIndex] = useState(0);

  const yogaPoses = [
    {
      name: "Tree Pose",
      image: "https://images.unsplash.com/photo-1588286840104-8957b019727f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      description: "Perfect balance and grounding"
    },
    {
      name: "Warrior Pose",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      description: "Build strength and confidence"
    },
    {
      name: "Lotus Position",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      description: "Find inner peace and calm"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setYogaPoseIndex((prev) => (prev + 1) % yogaPoses.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: "Active Users", value: "10K+" },
    { label: "Yoga Poses", value: "500+" },
    { label: "Satisfaction", value: "95%" }
  ];

  return (
    <section ref={ref} className="min-h-screen flex items-center relative overflow-hidden">
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0 gradient-bg opacity-5"
        style={{ y }}
      />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary-400 rounded-full opacity-30"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.h1 
              className="font-poppins font-bold text-5xl lg:text-7xl leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              Your Perfect
              <motion.span 
                className="gradient-text block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Yoga Journey
              </motion.span>
              Starts Here
            </motion.h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <p className="text-xl text-wellness-600 leading-relaxed">
              Discover personalized yoga routines powered by AI. Whether you're a beginner or advanced practitioner, our intelligent system creates the perfect practice for your goals, flexibility, and lifestyle.
            </p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => setLocation("/assessment")}
                className="gradient-bg text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
              >
                <span>Start Your Assessment</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline"
                className="border-2 border-primary-400 text-primary-500 px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary-50 transition-all flex items-center justify-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-3 gap-8 pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center"
                whileHover={{ scale: 1.1 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.6 + index * 0.1 }}
              >
                <motion.div 
                  className="text-3xl font-bold gradient-text"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    delay: 1.8 + index * 0.1 
                  }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-wellness-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        
        {/* Enhanced 3D Character Container */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ scale, rotateX }}
        >
          <motion.div 
            className="w-full h-96 lg:h-[500px] rounded-3xl glass-morphism relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Dynamic Yoga Pose Images */}
            {yogaPoses.map((pose, index) => (
              <motion.img
                key={index}
                src={pose.image}
                alt={pose.name}
                className="w-full h-full object-cover rounded-3xl absolute inset-0"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ 
                  opacity: index === yogaPoseIndex ? 1 : 0,
                  scale: index === yogaPoseIndex ? 1 : 1.1
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            ))}
            
            {/* Enhanced Overlay */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-primary-500/20 rounded-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            
            {/* Pose Description */}
            <motion.div
              className="absolute bottom-6 left-6 bg-white/90 rounded-2xl p-4 backdrop-blur-sm"
              key={yogaPoseIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="font-semibold text-wellness-800">{yogaPoses[yogaPoseIndex].name}</h3>
              <p className="text-sm text-wellness-600">{yogaPoses[yogaPoseIndex].description}</p>
            </motion.div>
          </motion.div>
          
          {/* Enhanced AI Badge */}
          <motion.div 
            className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-lg"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              delay: 1.5 
            }}
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <div className="flex items-center space-x-3">
              <motion.div 
                className="w-12 h-12 bg-secondary-400 rounded-full flex items-center justify-center"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 2 }}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <div className="font-semibold text-wellness-800">AI Powered</div>
                <div className="text-sm text-wellness-600">Personalized Routines</div>
              </div>
            </div>
          </motion.div>
          
          {/* Floating Orbs around character */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full blur-sm"
              style={{
                top: `${15 + (i * 20)}%`,
                right: `${5 + (i * 10)}%`
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 15, 0],
                scale: [0.8, 1.4, 0.8],
                opacity: [0.3, 0.9, 0.3]
              }}
              transition={{
                duration: 4 + (i * 0.8),
                repeat: Infinity,
                delay: i * 0.7,
                ease: "easeInOut"
              }}
            />
          ))}
          
          {/* Energy Lines */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-primary-400/50 to-transparent"
                style={{
                  top: `${30 + (i * 20)}%`,
                  left: 0
                }}
                animate={{
                  scaleX: [0, 1, 0],
                  opacity: [0, 0.7, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 1,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
