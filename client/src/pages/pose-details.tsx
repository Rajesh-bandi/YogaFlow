import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/ui/navigation";
import { ArrowLeft, Clock, Target, Star, Users, TrendingUp } from "lucide-react";

interface PoseDetail {
  name: string;
  description: string;
  difficulty: string;
  duration: string;
  category: string;
  instructions: string[];
  benefits: string[];
  modifications: string[];
  precautions: string[];
  muscles: string[];
}

const poseDatabase: Record<string, PoseDetail> = {
  "mountain-pose": {
    name: "Mountain Pose (Tadasana)",
    description: "The foundation of all standing poses, Mountain Pose teaches you to stand with majestic stability like a mountain.",
    difficulty: "Beginner",
    duration: "1-3 minutes",
    category: "Standing",
    instructions: [
      "Stand with your feet hip-width apart, parallel to each other",
      "Ground down through all four corners of your feet",
      "Engage your leg muscles and lengthen your tailbone down",
      "Lengthen your spine and reach the crown of your head toward the sky",
      "Relax your shoulders away from your ears",
      "Let your arms hang naturally at your sides",
      "Breathe deeply and hold the pose"
    ],
    benefits: [
      "Improves posture and body awareness",
      "Strengthens legs and core muscles",
      "Helps with balance and stability",
      "Reduces back pain",
      "Calms the mind and improves focus",
      "Creates a strong foundation for other poses"
    ],
    modifications: [
      "Stand against a wall for support",
      "Place a block between your thighs to engage inner legs",
      "Close your eyes to improve balance challenge",
      "Raise your arms overhead for added difficulty"
    ],
    precautions: [
      "Avoid if you have severe balance issues",
      "Be careful with low blood pressure (avoid sudden movements)",
      "If pregnant, stand with feet wider apart"
    ],
    muscles: ["Legs", "Core", "Back", "Glutes"]
  },
  "downward-dog": {
    name: "Downward-Facing Dog (Adho Mukha Svanasana)",
    description: "One of the most recognized yoga poses, Downward Dog is both an inversion and arm strengthener.",
    difficulty: "Beginner",
    duration: "1-3 minutes",
    category: "Inversion",
    instructions: [
      "Start in tabletop position on hands and knees",
      "Tuck your toes under and lift your hips up and back",
      "Straighten your legs as much as comfortable",
      "Press firmly through your palms and fingers",
      "Create an inverted V-shape with your body",
      "Keep your head between your arms, ears level with upper arms",
      "Breathe deeply and hold"
    ],
    benefits: [
      "Strengthens arms, shoulders, and legs",
      "Stretches hamstrings, calves, and spine",
      "Improves circulation and energizes the body",
      "Calms the nervous system",
      "Relieves stress and mild depression",
      "Helps with digestion"
    ],
    modifications: [
      "Place hands on blocks for wrist support",
      "Keep knees bent if hamstrings are tight",
      "Step feet wider for easier balance",
      "Use forearms instead of hands (Dolphin prep)"
    ],
    precautions: [
      "Avoid if you have wrist, shoulder, or neck injuries",
      "Skip if you have high blood pressure or detached retina",
      "Modify in late pregnancy"
    ],
    muscles: ["Arms", "Shoulders", "Core", "Legs", "Back"]
  },
  "warrior-i": {
    name: "Warrior I (Virabhadrasana I)",
    description: "A powerful standing pose that builds strength, stability, and confidence like a peaceful warrior.",
    difficulty: "Intermediate",
    duration: "30 seconds - 1 minute each side",
    category: "Standing",
    instructions: [
      "From Mountain Pose, step your left foot back 3-4 feet",
      "Turn your left foot out 45-60 degrees",
      "Keep your right foot pointing forward",
      "Bend your right knee directly over your ankle",
      "Square your hips toward the front",
      "Raise your arms overhead, palms facing each other",
      "Hold, then repeat on the other side"
    ],
    benefits: [
      "Strengthens legs, glutes, and core",
      "Stretches hip flexors and chest",
      "Improves balance and stability",
      "Builds focus and concentration",
      "Energizes the entire body",
      "Improves circulation in legs"
    ],
    modifications: [
      "Place hands on hips instead of overhead",
      "Use a block under your front thigh for support",
      "Narrow your stance for better balance",
      "Keep back heel lifted if hip flexibility is limited"
    ],
    precautions: [
      "Avoid if you have knee or hip injuries",
      "Be careful with high blood pressure",
      "Don't force the back heel down"
    ],
    muscles: ["Quadriceps", "Glutes", "Core", "Shoulders", "Hip flexors"]
  },
  "child-pose": {
    name: "Child's Pose (Balasana)",
    description: "A resting pose that provides a sense of calm, security, and grounding, like returning to childhood innocence.",
    difficulty: "Beginner",
    duration: "1-5 minutes",
    category: "Restorative",
    instructions: [
      "Kneel on the floor with knees hip-width apart",
      "Touch your big toes together behind you",
      "Sit back on your heels",
      "Fold forward, bringing your torso between your thighs",
      "Extend your arms in front of you or rest them by your sides",
      "Rest your forehead on the mat",
      "Breathe deeply and relax completely"
    ],
    benefits: [
      "Calms the brain and relieves stress",
      "Stretches hips, thighs, and ankles",
      "Relieves back and shoulder tension",
      "Helps with fatigue and anxiety",
      "Encourages introspection and mindfulness",
      "Aids digestion"
    ],
    modifications: [
      "Place a pillow or bolster under your torso",
      "Put a blanket over your back for warmth",
      "Place a pillow between your calves and thighs",
      "Widen your knees if pregnant or have tight hips"
    ],
    precautions: [
      "Avoid if you have knee injuries",
      "Skip if you have diarrhea",
      "Modify if pregnant (wide-knee variation)"
    ],
    muscles: ["Hips", "Back", "Shoulders", "Neck"]
  },
  "warrior-iii": {
    name: "Warrior III (Virabhadrasana III)",
    description: "An advanced balancing pose that challenges your strength, focus, and grace while building confidence.",
    difficulty: "Advanced",
    duration: "15-30 seconds each side",
    category: "Balancing",
    instructions: [
      "Start in Warrior I with right foot forward",
      "Shift weight onto your right foot",
      "Hinge forward at your hips",
      "Lift your left leg behind you parallel to the floor",
      "Extend your arms forward or keep them at your sides",
      "Create a straight line from fingertips to back heel",
      "Hold and breathe, then repeat on the other side"
    ],
    benefits: [
      "Strengthens legs, core, and back muscles",
      "Improves balance and coordination",
      "Enhances focus and concentration",
      "Tones the entire body",
      "Builds confidence and mental resilience",
      "Improves posture"
    ],
    modifications: [
      "Use a wall for support with your hands",
      "Keep hands on hips for easier balance",
      "Keep lifted leg lower if flexibility is limited",
      "Use a chair or blocks for hand support"
    ],
    precautions: [
      "Avoid if you have ankle or knee injuries",
      "Skip if you have balance disorders",
      "Be careful with low blood pressure"
    ],
    muscles: ["Standing leg", "Core", "Back", "Shoulders", "Glutes"]
  }
};

export default function PoseDetails() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/pose/:id");
  
  // Get pose from URL parameter or default to downward-dog
  const poseId = params?.id || "downward-dog";
  const pose = poseDatabase[poseId];

  if (!pose) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wellness-50 to-white">
        <Navigation />
        <div className="pt-24 px-6 text-center">
          <h1 className="text-2xl font-bold text-wellness-800">Pose not found</h1>
          <Button onClick={() => setLocation("/poses")} className="mt-4">
            Back to Poses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wellness-50 to-white">
      <Navigation />
      
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Button
              onClick={() => setLocation("/poses")}
              variant="outline"
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Poses
            </Button>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Pose Visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white shadow-xl border-none overflow-hidden sticky top-8">
                <CardContent className="p-0">
                  <div className="relative h-96 bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                    <motion.div
                      className="text-white text-8xl"
                      animate={{ 
                        rotateY: [0, 10, -10, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      🧘‍♀️
                    </motion.div>
                    
                    {/* Floating particles */}
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white rounded-full opacity-30"
                        style={{
                          left: `${20 + Math.random() * 60}%`,
                          top: `${20 + Math.random() * 60}%`
                        }}
                        animate={{
                          y: [0, -20, 0],
                          opacity: [0.3, 0.8, 0.3],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{
                          duration: 3 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 2
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm text-wellness-600">{pose.difficulty}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-primary-500 mr-1" />
                          <span className="text-sm text-wellness-600">{pose.duration}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-gradient-to-r from-primary-400 to-secondary-400 text-white text-xs rounded-full">
                        {pose.category}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {pose.muscles.map((muscle, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-wellness-100 text-wellness-700 text-xs rounded-full"
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pose Details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Header */}
              <div>
                <h1 className="font-poppins font-bold text-4xl mb-4 gradient-text">
                  {pose.name}
                </h1>
                <p className="text-xl text-wellness-600">
                  {pose.description}
                </p>
              </div>

              {/* Instructions */}
              <Card className="bg-white shadow-lg border-none">
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-primary-500" />
                    Step-by-Step Instructions
                  </h3>
                  <div className="space-y-3">
                    {pose.instructions.map((instruction, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <span className="w-6 h-6 bg-gradient-to-r from-primary-400 to-secondary-400 text-white rounded-full flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
                          {index + 1}
                        </span>
                        <p className="text-wellness-700">{instruction}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card className="bg-white shadow-lg border-none">
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-primary-500" />
                    Benefits
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {pose.benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="w-2 h-2 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                        <p className="text-wellness-700">{benefit}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Modifications */}
              <Card className="bg-white shadow-lg border-none">
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-primary-500" />
                    Modifications & Variations
                  </h3>
                  <div className="space-y-2">
                    {pose.modifications.map((modification, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <span className="text-secondary-400 mr-2">•</span>
                        <p className="text-wellness-700">{modification}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Precautions */}
              <Card className="bg-red-50 border border-red-100 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-4 flex items-center text-red-700">
                    ⚠️ Precautions
                  </h3>
                  <div className="space-y-2">
                    {pose.precautions.map((precaution, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <span className="text-red-400 mr-2">•</span>
                        <p className="text-red-700">{precaution}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={() => setLocation("/start-routine")}
                  className="gradient-bg text-white px-8 py-3 flex-1"
                >
                  Practice This Pose
                </Button>
                <Button 
                  onClick={() => setLocation("/routines")}
                  variant="outline"
                  className="px-8 py-3 flex-1"
                >
                  Find Routines
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}