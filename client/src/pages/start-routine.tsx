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

interface ExtendedPose extends Omit<YogaPose, 'instructions'> {
  instructions?: string[];
  precautions?: string;
  modifications?: string;
  image?: string;
  youtube_link?: string;
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

// Utility to get recommended poses from localStorage
// Ensure instructions is always an array
function getRoutineFromLocalStorage(): RoutineWithExtendedPoses {
  const stored = typeof window !== 'undefined' ? localStorage.getItem("routinePoses") : null;
  let poses: ExtendedPose[] = [];
  if (stored) {
    try {
      const raw = JSON.parse(stored);
      poses = raw.map((pose: any) => ({
        ...pose,
        instructions: Array.isArray(pose.instructions)
          ? pose.instructions
          : typeof pose.instructions === 'string'
            ? [pose.instructions]
            : poseInstructions[pose.name] || [],
        precautions: pose.precautions || "",
        modifications: pose.modifications || "",
        image: '', // will be set below
        youtube_link: pose.youtube_link || ""
      })).filter((pose: any) => pose && pose.name);
      // Fetch pose-images.json and update images
      if (typeof window !== 'undefined') {
        fetch('/pose-images.json')
          .then(res => res.json())
          .then((mapping) => {
            poses.forEach((pose) => {
              if (pose.name && mapping[pose.name]) {
                pose.image = mapping[pose.name];
              }
            });
          });
      }
    } catch {}
  }
  return {
    name: "Personalized Routine",
    description: "Your recommended yoga sequence",
    duration: poses.reduce((sum, p) => sum + (p.duration_sec || 0), 0),
    difficulty: poses[0]?.difficulty || "beginner",
    category: poses[0]?.goal_category || "Mindfulness",
    score: 1,
    matchReasons: [],
    poses
  };
}

export default function StartRoutine() {
  const [location, setLocation] = useLocation();
  const [routine, setRoutine] = useState<RoutineWithExtendedPoses>(getRoutineFromLocalStorage());
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(routine.poses[0]?.duration_sec || 60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  useEffect(() => {
    if (isCompleted && routine && routine.poses.length > 0) {
      const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("user") || "{}") : {};
      const userId: string | undefined = user?.id || user?.userId || user?.username;
      const totalDuration = routine.poses.reduce((sum, p) => sum + (p.duration_sec || 0), 0);
      const completedPoses = routine.poses.map((p) => p.name);
      if (userId) {
  const apiUrl = import.meta.env.VITE_API_URL;
  fetch(`${apiUrl}/progress`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            routineId: routine.name,
            duration: totalDuration,
            rating: null,
            completedPoses
          })
        }).catch(() => {});
      }
    }
  }, [isCompleted, routine]);

  const currentPose = routine.poses[currentPoseIndex];

  useEffect(() => {
    setRoutine(getRoutineFromLocalStorage());
    setCurrentPoseIndex(0);
    setTimeRemaining(routine.poses[0]?.duration_sec || 60);
    setIsCompleted(false);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timeRemaining > 0 && !isCompleted) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            if (currentPoseIndex < routine.poses.length - 1) {
              setCurrentPoseIndex(currentPoseIndex + 1);
              return routine.poses[currentPoseIndex + 1].duration_sec;
            } else {
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
  }, [isPlaying, timeRemaining, currentPoseIndex, isCompleted, routine.poses]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    if (currentPoseIndex < routine.poses.length - 1) {
      setCurrentPoseIndex(currentPoseIndex + 1);
      setTimeRemaining(routine.poses[currentPoseIndex + 1].duration_sec);
    }
  };

  const handleRestart = () => {
    setCurrentPoseIndex(0);
    setTimeRemaining(routine.poses[0].duration_sec);
    setIsPlaying(false);
    setIsCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isCompleted) {
    // Streak logic
    const today = new Date().toISOString().slice(0, 10);
    const lastStreakDate = typeof window !== 'undefined' ? localStorage.getItem("lastStreakDate") : null;
    let streak = typeof window !== 'undefined' ? parseInt(localStorage.getItem("streak") || "0", 10) : 0;
    if (lastStreakDate !== today) {
      if (
        lastStreakDate &&
        new Date(today).getTime() - new Date(lastStreakDate).getTime() <= 86400000
      ) {
        streak += 1;
      } else {
        streak = 1;
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem("streak", streak.toString());
        localStorage.setItem("lastStreakDate", today);
      }
    }
    // Check if today is the first routine completion of the month
    const monthKey = `routineMonth_${today.slice(0,7)}`;
    let isFirstOfMonth = false;
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem(monthKey)) {
        isFirstOfMonth = true;
        localStorage.setItem(monthKey, "done");
      }
    }
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
            <div className="mb-8">
              <span className={`inline-block rounded-full px-6 py-3 font-semibold text-xl shadow ${isFirstOfMonth ? 'bg-green-100 text-green-700' : 'bg-primary-100 text-primary-700'}`}>
                🔥 Streak: {streak} day{streak === 1 ? "" : "s"}!
                {isFirstOfMonth && <span className="ml-2">🟢 First routine of the month!</span>}
              </span>
            </div>
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
                  <div className="relative w-full max-w-md mx-auto flex items-center justify-center aspect-square sm:aspect-square md:aspect-square lg:aspect-square" style={{ maxHeight: '340px' }}>
                    {/* Border Timer */}
                    <div className="absolute inset-0 w-full h-full z-20 overflow-hidden">
                      <motion.div
                        className="absolute inset-0 border-[6px] border-primary-500 rounded-xl"
                        style={{ 
                          clipPath: `polygon(
                            0 0, 100% 0, 100% 100%, 0 100%, 
                            0 0, 6px 6px, 6px calc(100% - 6px), calc(100% - 6px) calc(100% - 6px), 
                            calc(100% - 6px) 6px, 6px 6px
                          )`,
                        }}
                        animate={{
                          clipPath: [
                            `polygon(
                              0 0, 100% 0, 100% 100%, 0 100%, 
                              0 0, 6px 6px, 6px calc(100% - 6px), calc(100% - 6px) calc(100% - 6px), 
                              calc(100% - 6px) 6px, 6px 6px
                            )`,
                            `polygon(
                              0 0, 100% 0, 100% 100%, 0 100%, 
                              0 0, 100% 0, 100% 100%, 0 100%, 
                              0 0, 6px 6px
                            )`,
                          ],
                        }}
                        transition={{
                          duration: currentPose.duration_sec,
                          ease: "linear"
                        }}
                      />
                    </div>
                    {/* Pose Image */}
                    <motion.div
                      key={currentPose.name}
                      initial={{ scale: 0.5, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.8, type: "spring" }}
                      className="absolute inset-0 w-full h-full z-10 flex items-center justify-center"
                    >
                      {currentPose.image ? (
                        <img
                          src={currentPose.image}
                          alt={currentPose.name}
                          className="w-full h-full object-cover rounded-xl"
                          style={{ background: "transparent", maxHeight: '340px' }}
                        />
                      ) : (
                        <span className="text-white text-6xl sm:text-8xl">🧘‍♀️</span>
                      )}
                    </motion.div>
                    {/* Timer at bottom left */}
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 z-30 flex items-center">
                      <svg className="w-6 h-6 mr-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                      </svg>
                      <div className="text-white text-xl font-bold">
                        {formatTime(timeRemaining)}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
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
                          disabled={currentPoseIndex >= routine.poses.length - 1}
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
                          width: `${((currentPoseIndex + 1) / routine.poses.length) * 100}%` 
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-center text-wellness-600">
                      Pose {currentPoseIndex + 1} of {routine.poses.length}
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
                    <div className="flex justify-center mt-4">
                      <Button
                        onClick={() => {
                          if (isSpeaking) {
                            window.speechSynthesis.cancel();
                            setIsSpeaking(false);
                          } else {
                            window.speechSynthesis.cancel();
                            if (Array.isArray(currentPose.instructions) && currentPose.instructions.length > 0) {
                              let idx = 0;
                              setIsSpeaking(true);
                              const speakNext = () => {
                                if (!Array.isArray(currentPose.instructions) || idx >= currentPose.instructions.length) {
                                  setIsSpeaking(false);
                                  return;
                                }
                                const utterance = new window.SpeechSynthesisUtterance(currentPose.instructions[idx]);
                                utterance.rate = 0.8;
                                utterance.onend = () => {
                                  setTimeout(() => {
                                    idx++;
                                    speakNext();
                                  }, 700);
                                };
                                utterance.onerror = () => {
                                  setIsSpeaking(false);
                                };
                                window.speechSynthesis.speak(utterance);
                              };
                              speakNext();
                            }
                          }
                        }}
                        variant="outline"
                        className="px-6 py-2"
                      >
                        {isSpeaking ? "Stop" : "Read Instructions Aloud"}
                      </Button>
                    </div>
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

                {/* Precautions and Modifications */}
                <Card className="bg-white shadow-lg border-none">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-4 flex items-center">
                      <span className="text-red-500 mr-2">⚠️</span>
                      Precautions
                    </h3>
                    <div className="text-wellness-700">
                      {currentPose.precautions || "No specific precautions."}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-lg border-none">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-4 flex items-center">
                      <span className="text-yellow-500 mr-2">⚙️</span>
                      Modifications
                    </h3>
                    <div className="text-wellness-700">
                      {currentPose.modifications || "No specific modifications."}
                    </div>
                  </CardContent>
                </Card>

                {/* Media */}
                {(currentPose.image || currentPose.youtube_link) && (
                  <Card className="bg-white shadow-lg border-none">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-xl mb-4 flex items-center">
                        <span className="text-primary-500 mr-2">📹</span>
                        Media
                      </h3>
                      <div className="flex gap-4">
                        {currentPose.image && (
                          <img 
                            src={currentPose.image} 
                            alt={currentPose.name} 
                            className="w-full h-auto rounded-lg shadow-md"
                          />
                        )}
                        {currentPose.youtube_link && (
                          <a 
                            href={currentPose.youtube_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 bg-primary-500 text-white rounded-lg shadow-md px-4 py-2 flex items-center justify-center gap-2"
                          >
                            <span>Watch on YouTube</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A4.125 4.125 0 119 14.625M15.75 9.75l-3.375 3.375L15.75 16.5M21 12H3" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}