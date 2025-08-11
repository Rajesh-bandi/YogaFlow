import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/ui/navigation";
import { Play, Pause, SkipForward, RotateCcw, Clock, Target } from "lucide-react";
import { type YogaPose } from "../../../server/yoga-dataset";
import { type GeneratedRoutine } from "../lib/ml-recommendations-new";
import { useQuery } from "@tanstack/react-query";

interface ExtendedPose extends YogaPose {
  instructions?: string[];
}

interface RoutineWithExtendedPoses extends Omit<GeneratedRoutine, 'poses'> {
  poses: ExtendedPose[];
}

// Extended instructions for common yoga poses 
const poseInstructions: { [key: string]: string[] } = {
  "Mountain Pose": [
    "Stand tall with feet hip-width apart",
    "Ground through all four corners of your feet", 
    "Lengthen your spine toward the sky",
    "Relax your shoulders away from your ears",
    "Breathe deeply and find your center"
  ],
  "Child's Pose": [
    "Kneel on the mat with big toes touching",
    "Sit back on your heels",
    "Fold forward and rest your forehead on the mat",
    "Extend your arms forward or by your sides",
    "Breathe deeply and relax"
  ],
  "Downward Dog": [
    "Start in tabletop position",
    "Tuck your toes and lift your hips up",
    "Straighten your legs as much as comfortable", 
    "Press through your palms",
    "Create an inverted V-shape with your body"
  ],
  "Warrior I": [
    "Step your left foot back 3-4 feet",
    "Turn your left foot out 45 degrees",
    "Bend your right knee over your ankle",
    "Raise your arms overhead",
    "Hold and breathe, then switch sides"
  ],
  "Warrior II": [
    "From Warrior I, open your hips and torso to the side",
    "Extend your arms parallel to the floor",
    "Gaze over your front hand",
    "Keep your front knee tracking over your ankle",
    "Hold and breathe steadily"
  ],
  "Tree Pose": [
    "Stand tall in Mountain Pose",
    "Shift weight to your left foot",
    "Place right foot on inner left thigh or calf",
    "Press hands together at heart center",
    "Find a focal point and breathe"
  ],
  "Bridge Pose": [
    "Lie on your back with knees bent",
    "Place feet hip-width apart",
    "Press into your feet and lift your hips",
    "Interlace fingers under your back",
    "Keep knees parallel and breathe"
  ],
  "Cobra Pose": [
    "Lie face down with palms under shoulders",
    "Press palms down and lift your chest",
    "Keep shoulders away from ears",
    "Engage your back muscles",
    "Breathe and avoid straining your neck"
  ],
  "Plank": [
    "Start in tabletop position",
    "Step feet back into straight line",
    "Keep shoulders over wrists",
    "Engage your core muscles",
    "Maintain straight line from head to heels"
  ],
  "Corpse Pose": [
    "Lie flat on your back",
    "Let arms rest at your sides",
    "Close your eyes gently",
    "Breathe naturally and deeply",
    "Release all tension from your body"
  ]
};

const sampleRoutine: RoutineWithExtendedPoses = {
  name: "Morning Flow",
  description: "Start your day with energizing poses",
  duration: 15,
  difficulty: "beginner" as const,
  category: "Mindfulness",
  score: 0.9,
  matchReasons: ["Perfect for beginners", "Great morning routine"],
  poses: [
    {
      difficulty: "beginner" as const,
      goal_category: "Mindfulness" as const,
      name: "Mountain Pose",
      sanskrit_name: "Tadasana",
      min_age: 10,
      max_age: 80,
      benefits: "Improves focus, grounding, posture",
      duration_sec: 60,
      instructions: poseInstructions["Mountain Pose"]
    },
    {
      difficulty: "beginner" as const,
      goal_category: "Strength" as const,
      name: "Downward Dog",
      sanskrit_name: "Adho Mukha Svanasana",
      min_age: 14,
      max_age: 70,
      benefits: "Arm/leg strength",
      duration_sec: 90,
      instructions: poseInstructions["Downward Dog"]
    },
    {
      difficulty: "beginner" as const,
      goal_category: "Strength" as const,
      name: "Warrior I",
      sanskrit_name: "Virabhadrasana I", 
      min_age: 16,
      max_age: 65,
      benefits: "Builds leg/core strength",
      duration_sec: 75,
      instructions: poseInstructions["Warrior I"]
    },
    {
      difficulty: "beginner" as const,
      goal_category: "Mindfulness" as const,
      name: "Child's Pose",
      sanskrit_name: "Balasana",
      min_age: 8,
      max_age: 85,
      benefits: "Calms mind, reduces anxiety",
      duration_sec: 120,
      instructions: poseInstructions["Child's Pose"]
    }
  ]
};

export default function StartRoutine() {
  const [location, setLocation] = useLocation();
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(sampleRoutine.poses[0]?.duration_sec || 60);
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
              return sampleRoutine.poses[currentPoseIndex + 1].duration_sec;
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
      setTimeRemaining(sampleRoutine.poses[currentPoseIndex + 1].duration_sec);
    }
  };

  const handleRestart = () => {
    setCurrentPoseIndex(0);
    setTimeRemaining(sampleRoutine.poses[0].duration_sec);
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
                        background: `conic-gradient(white ${((currentPose.duration_sec - timeRemaining) / currentPose.duration_sec) * 360}deg, transparent 0deg)`
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
                    {currentPose.sanskrit_name} - {currentPose.benefits}
                  </p>
                </div>

                <Card className="bg-white shadow-lg border-none">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-primary-500" />
                      Instructions
                    </h3>
                    <ul className="space-y-2">
                      {currentPose.instructions?.map((instruction: string, index: number) => (
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
                      {currentPose.benefits.split(', ').map((benefit: string, index: number) => (
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