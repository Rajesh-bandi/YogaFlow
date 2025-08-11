import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/ui/navigation";
import { Play, Pause, SkipForward, RotateCcw, Clock, Target } from "lucide-react";

interface Pose {
  name: string;
  description: string;
  duration: number;
  instructions: string[];
  benefits: string[];
}

interface Routine {
  name: string;
  description: string;
  duration: number;
  difficulty: string;
  poses: Pose[];
}

const sampleRoutine: Routine = {
  name: "Morning Flow",
  description: "Start your day with energizing poses",
  duration: 15,
  difficulty: "Beginner",
  poses: [
    {
      name: "Mountain Pose",
      description: "Foundation standing pose for balance and grounding",
      duration: 60,
      instructions: [
        "Stand tall with feet hip-width apart",
        "Ground through all four corners of your feet",
        "Lengthen your spine toward the sky",
        "Relax your shoulders away from your ears",
        "Breathe deeply and find your center"
      ],
      benefits: ["Improves posture", "Builds balance", "Reduces stress"]
    },
    {
      name: "Downward Dog",
      description: "Classic inversion pose that strengthens and stretches",
      duration: 90,
      instructions: [
        "Start in tabletop position",
        "Tuck your toes and lift your hips up",
        "Straighten your legs as much as comfortable",
        "Press through your palms",
        "Create an inverted V-shape with your body"
      ],
      benefits: ["Strengthens arms", "Stretches hamstrings", "Energizes body"]
    },
    {
      name: "Warrior I",
      description: "Powerful standing pose that builds strength and focus",
      duration: 75,
      instructions: [
        "Step your left foot back 3-4 feet",
        "Turn your left foot out 45 degrees",
        "Bend your right knee over your ankle",
        "Raise your arms overhead",
        "Hold and breathe, then switch sides"
      ],
      benefits: ["Builds leg strength", "Opens hips", "Improves focus"]
    },
    {
      name: "Child's Pose",
      description: "Restorative pose for rest and reflection",
      duration: 120,
      instructions: [
        "Kneel on the mat with big toes touching",
        "Sit back on your heels",
        "Fold forward, extending arms in front",
        "Rest your forehead on the mat",
        "Breathe deeply and relax"
      ],
      benefits: ["Calms the mind", "Stretches back", "Reduces anxiety"]
    }
  ]
};

export default function StartRoutine() {
  const [location, setLocation] = useLocation();
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(sampleRoutine.poses[0]?.duration || 60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentPose = sampleRoutine.poses[currentPoseIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && timeRemaining > 0 && !isCompleted) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Move to next pose
            if (currentPoseIndex < sampleRoutine.poses.length - 1) {
              setCurrentPoseIndex(currentPoseIndex + 1);
              return sampleRoutine.poses[currentPoseIndex + 1].duration;
            } else {
              // Routine completed
              setIsCompleted(true);
              setIsPlaying(false);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining, currentPoseIndex, isCompleted]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentPoseIndex < sampleRoutine.poses.length - 1) {
      setCurrentPoseIndex(currentPoseIndex + 1);
      setTimeRemaining(sampleRoutine.poses[currentPoseIndex + 1].duration);
    }
  };

  const handleRestart = () => {
    setCurrentPoseIndex(0);
    setTimeRemaining(sampleRoutine.poses[0].duration);
    setIsPlaying(false);
    setIsCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wellness-50 to-white">
        <Navigation />
        
        <motion.div
          className="pt-24 pb-12 px-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              className="w-24 h-24 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center mx-auto mb-8"
              animate={{ rotate: 360 }}
              transition={{ duration: 2 }}
            >
              <span className="text-3xl">🧘‍♀️</span>
            </motion.div>
            
            <h1 className="font-poppins font-bold text-4xl mb-6 gradient-text">
              Routine Complete!
            </h1>
            <p className="text-xl text-wellness-600 mb-8">
              Congratulations on completing your {sampleRoutine.name} routine. 
              You've taken an important step in your wellness journey.
            </p>
            
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                onClick={handleRestart}
                className="gradient-bg text-white px-8 py-3"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Do Again
              </Button>
              <Button
                onClick={() => setLocation("/routines")}
                variant="outline"
                className="px-8 py-3"
              >
                Browse Routines
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wellness-50 to-white">
      <Navigation />
      
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Pose Visualization */}
            <motion.div
              className="sticky top-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white shadow-xl border-none overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-96 bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                    <motion.div
                      className="text-white text-8xl"
                      key={currentPose.name}
                      initial={{ scale: 0.5, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.8, type: "spring" }}
                    >
                      🧘‍♀️
                    </motion.div>
                    
                    {/* Progress ring */}
                    <motion.div
                      className="absolute inset-8 border-4 border-white/30 rounded-full"
                      style={{
                        background: `conic-gradient(white ${((currentPose.duration - timeRemaining) / currentPose.duration) * 360}deg, transparent 0deg)`
                      }}
                    />
                    
                    {/* Timer */}
                    <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                      <div className="text-white text-2xl font-bold">
                        {formatTime(timeRemaining)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-center mb-6">
                      <div className="flex gap-2">
                        <Button
                          onClick={handlePlayPause}
                          className="gradient-bg text-white w-16 h-16 rounded-full"
                        >
                          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                        </Button>
                        <Button
                          onClick={handleNext}
                          disabled={currentPoseIndex >= sampleRoutine.poses.length - 1}
                          variant="outline"
                          className="w-16 h-16 rounded-full"
                        >
                          <SkipForward className="w-6 h-6" />
                        </Button>
                        <Button
                          onClick={handleRestart}
                          variant="outline"
                          className="w-16 h-16 rounded-full"
                        >
                          <RotateCcw className="w-6 h-6" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-wellness-100 rounded-full h-2 mb-4">
                      <motion.div
                        className="gradient-bg h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${((currentPoseIndex + 1) / sampleRoutine.poses.length) * 100}%` 
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-center text-wellness-600">
                      Pose {currentPoseIndex + 1} of {sampleRoutine.poses.length}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pose Details */}
            <motion.div
              key={currentPose.name}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-6">
                <div>
                  <h1 className="font-poppins font-bold text-4xl mb-4 gradient-text">
                    {currentPose.name}
                  </h1>
                  <p className="text-xl text-wellness-600 mb-6">
                    {currentPose.description}
                  </p>
                </div>

                <Card className="bg-white shadow-lg border-none">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-primary-500" />
                      Instructions
                    </h3>
                    <ul className="space-y-2">
                      {currentPose.instructions.map((instruction, index) => (
                        <motion.li
                          key={index}
                          className="flex items-start"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <span className="w-6 h-6 bg-gradient-to-r from-primary-400 to-secondary-400 text-white rounded-full flex items-center justify-center text-sm mr-3 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-wellness-700">{instruction}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-lg border-none">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-4 flex items-center">
                      <span className="text-primary-500 mr-2">✨</span>
                      Benefits
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {currentPose.benefits.map((benefit, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="w-2 h-2 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full mr-3" />
                          <span className="text-wellness-700">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}