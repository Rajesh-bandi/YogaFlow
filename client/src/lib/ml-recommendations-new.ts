import { yogaDataset, type YogaPose } from '../../../server/yoga-dataset';

export interface RecommendationInput {
  ageGroup: string;
  experience: string;
  goals: string[];
  timeAvailable: string;
  healthConditions?: string[];
}

export interface GeneratedRoutine {
  name: string;
  description: string;
  duration: number;
  difficulty: string;
  poses: YogaPose[];
  category: string;
  score: number;
  matchReasons: string[];
}

interface RoutineTemplate {
  name: string;
  description: string;
  targetDuration: number;
  requiredGoals: string[];
  warmupCount: number;
  mainCount: number;
  cooldownCount: number;
}

const routineTemplates: RoutineTemplate[] = [
  {
    name: "Morning Energy Flow",
    description: "Start your day with energizing poses and sun salutations",
    targetDuration: 15,
    requiredGoals: ["Weight Loss", "Strength"],
    warmupCount: 2,
    mainCount: 4,
    cooldownCount: 2
  },
  {
    name: "Strength Builder",
    description: "Build muscle tone and core strength with challenging poses",
    targetDuration: 20,
    requiredGoals: ["Strength"],
    warmupCount: 2,
    mainCount: 6,
    cooldownCount: 2
  },
  {
    name: "Stress Relief & Relaxation",
    description: "Calm your mind and release tension with gentle poses",
    targetDuration: 25,
    requiredGoals: ["Stress Relief", "Mindfulness"],
    warmupCount: 1,
    mainCount: 4,
    cooldownCount: 3
  },
  {
    name: "Flexibility & Mobility",
    description: "Improve flexibility and range of motion with deep stretches",
    targetDuration: 18,
    requiredGoals: ["Flexibility"],
    warmupCount: 2,
    mainCount: 5,
    cooldownCount: 2
  },
  {
    name: "Posture Perfect",
    description: "Correct imbalances and strengthen your core for better posture",
    targetDuration: 22,
    requiredGoals: ["Posture"],
    warmupCount: 2,
    mainCount: 6,
    cooldownCount: 1
  },
  {
    name: "Mindful Meditation Flow",
    description: "Enhance focus and inner peace with meditative poses",
    targetDuration: 30,
    requiredGoals: ["Mindfulness"],
    warmupCount: 1,
    mainCount: 3,
    cooldownCount: 4
  },
  {
    name: "Fat Burning Power",
    description: "High-intensity yoga to boost metabolism and burn calories",
    targetDuration: 25,
    requiredGoals: ["Weight Loss"],
    warmupCount: 2,
    mainCount: 7,
    cooldownCount: 1
  },
  {
    name: "Gentle Beginner Flow",
    description: "Perfect introduction to yoga with foundational poses",
    targetDuration: 20,
    requiredGoals: ["Mindfulness", "Flexibility"],
    warmupCount: 3,
    mainCount: 4,
    cooldownCount: 3
  }
];

export class MLRecommendationEngine {
  // Utility to shuffle an array
  private shuffleArray<T>(array: T[]): T[] {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }
  private timeMapping: { [key: string]: number } = {
    "10-15 min": 15,
    "15-30 min": 30,
    "30-45 min": 45,
    "45+ min": 60
  };

  private goalMapping: { [key: string]: string[] } = {
    'flexibility': ['Flexibility'],
    'strength': ['Strength'],
    'stress-relief': ['Stress Relief', 'Mindfulness'],
    'weight-loss': ['Weight Loss'],
    'posture': ['Posture'],
    'mindfulness': ['Mindfulness'],
    'balance': ['Mindfulness', 'Strength']
  };

  private getAgeFromGroup(ageGroup: string): number {
    const ageMap: { [key: string]: number } = {
      "18-25": 22,
      "26-35": 30, 
      "36-45": 40,
      "46-55": 50,
      "55+": 60
    };
    return ageMap[ageGroup] || 30;
  }

  private calculatePoseScore(pose: YogaPose, input: RecommendationInput): number {
    let score = 0;
    const userAge = this.getAgeFromGroup(input.ageGroup);
    
    // Age compatibility (40% weight)
  const ageInRange = userAge >= (pose.min_age ?? 0) && userAge <= (pose.max_age ?? 100);
    score += ageInRange ? 0.4 : 0.1;
    
    if (userAge < 25) {
      if (pose.difficulty === 'intermediate' || pose.difficulty === 'advanced') score += 0.1;
    } else if (userAge > 50) {
      if (pose.difficulty === 'beginner') score += 0.15;
      if (pose.goal_category === 'Stress Relief' || pose.goal_category === 'Flexibility') score += 0.1;
    }
    
    // Experience level compatibility (30% weight)
    const experienceMap: Record<string, string> = {
      'beginner': 'beginner',
      'intermediate': 'intermediate', 
      'advanced': 'advanced'
    };
    
    if (experienceMap[input.experience] === pose.difficulty) {
      score += 0.3;
    } else if (input.experience === 'intermediate' && pose.difficulty === 'beginner') {
      score += 0.2;
    } else if (input.experience === 'advanced' && pose.difficulty !== 'advanced') {
      score += 0.15;
    }
    
    // Goal alignment (25% weight)
    const goalMatch = input.goals.some(goal => {
      return this.goalMapping[goal]?.includes(pose.goal_category);
    });
    
    if (goalMatch) score += 0.25;
    
    // Duration preference (5% weight)
    const targetTime = this.timeMapping[input.timeAvailable] || 20;
    const idealPoseDuration = (targetTime * 60) / 8;
    const durationDiff = Math.abs(pose.duration_sec - idealPoseDuration);
    const durationScore = Math.max(0, 0.05 - (durationDiff / 300));
    score += durationScore;
    
    return Math.min(score, 1);
  }

  private selectPosesForRoutine(
    poses: YogaPose[], 
    count: number, 
    input: RecommendationInput,
    preferredCategories?: string[]
  ): YogaPose[] {
    let filteredPoses = poses;
    if (preferredCategories && preferredCategories.length > 0) {
      filteredPoses = poses.filter(pose => preferredCategories.includes(pose.goal_category));
    }
    const scoredPoses = filteredPoses
      .map(pose => ({
        ...pose,
        score: this.calculatePoseScore(pose, input)
      }))
      .sort((a, b) => (b.score || 0) - (a.score || 0));
    // Shuffle scored poses to add randomness
    const shuffledPoses = this.shuffleArray(scoredPoses);
    const selectedPoses: YogaPose[] = [];
    const usedNames = new Set<string>();
    const usedCategories = new Set<string>();
    for (const pose of shuffledPoses) {
      if (selectedPoses.length >= count) break;
      if (
        pose.name !== undefined &&
        !usedNames.has(pose.name) &&
        pose.goal_category !== undefined &&
        (!usedCategories.has(pose.goal_category) || selectedPoses.length > count * 0.6)
      ) {
        selectedPoses.push(pose);
        usedNames.add(pose.name);
        usedCategories.add(pose.goal_category);
      }
    }
    // Fill up with remaining unique poses if needed
    if (selectedPoses.length < count) {
      const remainingPoses = shuffledPoses.filter(
        p => p.name !== undefined && !usedNames.has(p.name)
      );
      for (const pose of remainingPoses) {
        if (selectedPoses.length >= count) break;
        selectedPoses.push(pose);
        usedNames.add(pose.name!);
      }
    }
    return selectedPoses;
  }

  private calculateRoutineScore(poses: YogaPose[], input: RecommendationInput): number {
    if (poses.length === 0) return 0;
    
    const avgPoseScore = poses.reduce((sum, pose) => 
      sum + this.calculatePoseScore(pose, input), 0
    ) / poses.length;
    
    const uniqueCategories = new Set(poses.map(p => p.goal_category)).size;
    const varietyBonus = Math.min(uniqueCategories / 3, 0.2);
    
    const totalDuration = poses.reduce((sum, pose) => sum + pose.duration_sec, 0) / 60;
    const targetDuration = this.timeMapping[input.timeAvailable] || 20;
    const durationScore = Math.max(0, 0.1 - Math.abs(totalDuration - targetDuration) / 20);
    
    return Math.min(avgPoseScore + varietyBonus + durationScore, 1);
  }

  private generateMatchReasons(routine: GeneratedRoutine, input: RecommendationInput): string[] {
    const reasons: string[] = [];
    
    if (routine.difficulty === input.experience) {
      reasons.push(`Perfect for ${input.experience} level`);
    }
    
    const goalCategories = new Set(routine.poses.map(p => p.goal_category));
    input.goals.forEach(goal => {
      const mappedCategories = this.goalMapping[goal] || [];
      if (mappedCategories.some(cat => goalCategories.has(cat as YogaPose['goal_category']))) {
        reasons.push(`Great for ${goal.replace('-', ' ')}`);
      }
    });
    
    const totalDuration = routine.duration;
    const targetDuration = this.timeMapping[input.timeAvailable] || 20;
    if (Math.abs(totalDuration - targetDuration) <= 5) {
      reasons.push("Perfect timing for your schedule");
    }
    
    if (input.ageGroup === "55+" && routine.poses.some(p => p.goal_category === 'Stress Relief')) {
      reasons.push("Gentle approach suitable for your age");
    }
    
    const uniqueCategories = new Set(routine.poses.map(p => p.goal_category)).size;
    if (uniqueCategories >= 3) {
      reasons.push("Well-rounded routine");
    }
    
    return reasons.slice(0, 3);
  }

  generateRecommendations(input: RecommendationInput): GeneratedRoutine[] {
    const userAge = this.getAgeFromGroup(input.ageGroup);
    const userDifficultyLevel = input.experience;
    
    let availablePoses = yogaDataset.filter(pose => {
      // Relax age filter: allow +/- 5 years
      if (userAge < (pose.min_age ?? 0) - 5 || userAge > (pose.max_age ?? 100) + 5) return false;
      // Relax difficulty filter: allow some advanced for beginners
      if (userDifficultyLevel === 'beginner' && pose.difficulty === 'advanced') return Math.random() < 0.5 ? false : true;
      if (userDifficultyLevel === 'intermediate' && pose.difficulty === 'advanced' && Math.random() < 0.5) return false;
      return true;
    });

    // Always return at least 5 top poses if possible
    if (availablePoses.length < 5) {
      availablePoses = yogaDataset
        .map(pose => ({ ...pose, score: this.calculatePoseScore(pose, input) }))
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
        .slice(0, 5);
    }
    
    const recommendations: GeneratedRoutine[] = [];
    
    for (const template of routineTemplates.slice(0, 6)) {
      const goalMatch = input.goals.some(goal => {
        return template.requiredGoals.some(tGoal => 
          this.goalMapping[goal]?.includes(tGoal)
        );
      });
      
      if (input.goals.length > 0 && !goalMatch) continue;
      
      const warmupPoses = this.selectPosesForRoutine(
        availablePoses.filter(p => p.difficulty === 'beginner'), 
        template.warmupCount, 
        input,
        ['Mindfulness', 'Flexibility']
      );
      
      const mainPoses = this.selectPosesForRoutine(
        availablePoses, 
        template.mainCount, 
        input,
        template.requiredGoals
      );
      
      const cooldownPoses = this.selectPosesForRoutine(
        availablePoses.filter(p => p.goal_category === 'Stress Relief' || p.goal_category === 'Flexibility'), 
        template.cooldownCount, 
        input
      );
      
      const allPoses = [...warmupPoses, ...mainPoses, ...cooldownPoses];
      const totalDuration = Math.round(allPoses.reduce((sum, pose) => sum + pose.duration_sec, 0) / 60);
      
      if (allPoses.length >= 3) {
        const routine: GeneratedRoutine = {
          name: template.name,
          description: template.description,
          duration: totalDuration,
          difficulty: userDifficultyLevel,
          poses: allPoses,
          category: template.requiredGoals[0] || 'General',
          score: this.calculateRoutineScore(allPoses, input),
          matchReasons: []
        };
        
        routine.matchReasons = this.generateMatchReasons(routine, input);
        recommendations.push(routine);
      }
    }
    
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }

  generatePersonalizedPlan(
    input: RecommendationInput,
    routines: GeneratedRoutine[]
  ): {
    weeklyPlan: { day: string; routine: GeneratedRoutine | null }[];
    recommendations: string[];
  } {
    const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const weeklyPlan = weekDays.map(day => ({ day, routine: null as GeneratedRoutine | null }));

    const maxTimePerDay = this.timeMapping[input.timeAvailable] || 30;
    const targetSessionsPerWeek = Math.min(Math.floor((maxTimePerDay * 7) / 20), 6);

    let routineIndex = 0;
    for (let i = 0; i < targetSessionsPerWeek && i < weeklyPlan.length && routineIndex < routines.length; i++) {
      if (input.experience === "beginner" && i === 6) continue;
      
      weeklyPlan[i].routine = routines[routineIndex % routines.length];
      routineIndex++;
    }

    const recommendations = this.generatePersonalizedTips(input, routines);
    return { weeklyPlan, recommendations };
  }

  private generatePersonalizedTips(input: RecommendationInput, routines: GeneratedRoutine[]): string[] {
    const tips: string[] = [];

    if (input.experience === "beginner") {
      tips.push("Start with 2-3 sessions per week and gradually increase frequency");
      tips.push("Focus on proper form over advanced poses");
    }

    if (input.goals.includes("flexibility")) {
      tips.push("Hold poses for at least 30 seconds to improve flexibility");
    }

    if (input.goals.includes("stress-relief")) {
      tips.push("Practice deep breathing throughout your sessions");
      tips.push("End each session with 5 minutes of meditation");
    }

    if (input.ageGroup === "55+") {
      tips.push("Listen to your body and modify poses as needed");
      tips.push("Warm up thoroughly before each session");
    }

    const hasStrengthFocus = routines.some(r => r.category === "Strength");
    if (hasStrengthFocus) {
      tips.push("Stay hydrated and take rest days between strength sessions");
    }

    return tips.slice(0, 4);
  }
}

export const mlEngine = new MLRecommendationEngine();