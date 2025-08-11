import type { Assessment, Routine } from "@shared/schema";

export interface RecommendationInput {
  ageGroup: string;
  experience: string;
  goals: string[];
  timeAvailable: string;
  healthConditions?: string[];
}

export interface ScoredRoutine extends Routine {
  score: number;
  matchReasons: string[];
}

export class MLRecommendationEngine {
  private difficultyMapping: { [key: string]: string[] } = {
    beginner: ["beginner", "all levels"],
    intermediate: ["intermediate", "all levels", "beginner"],
    advanced: ["advanced", "intermediate"]
  };

  private timeMapping: { [key: string]: number } = {
    "10-15 min": 15,
    "15-30 min": 30,
    "30-45 min": 45,
    "45+ min": 60
  };

  private goalCategoryMapping: { [key: string]: string[] } = {
    flexibility: ["morning", "evening"],
    strength: ["strength"],
    "stress relief": ["evening"],
    balance: ["strength", "morning"],
    meditation: ["evening"],
    "weight loss": ["strength", "morning"]
  };

  generateRecommendations(
    input: RecommendationInput, 
    availableRoutines: Routine[]
  ): ScoredRoutine[] {
    // Filter routines by experience level
    const experienceFilteredRoutines = availableRoutines.filter(routine => 
      this.difficultyMapping[input.experience]?.includes(routine.difficulty)
    );

    // Filter by time availability
    const maxTime = this.timeMapping[input.timeAvailable] || 30;
    const timeFilteredRoutines = experienceFilteredRoutines.filter(routine => 
      routine.duration <= maxTime
    );

    // Score routines based on goals
    const scoredRoutines: ScoredRoutine[] = timeFilteredRoutines.map(routine => {
      let score = 0;
      const matchReasons: string[] = [];

      // Base score for experience match
      if (routine.difficulty === input.experience) {
        score += 3;
        matchReasons.push(`Perfect for ${input.experience} level`);
      } else if (this.difficultyMapping[input.experience]?.includes(routine.difficulty)) {
        score += 1;
        matchReasons.push(`Suitable for your experience level`);
      }

      // Score based on goals
      input.goals.forEach(goal => {
        const relevantCategories = this.goalCategoryMapping[goal] || [];
        if (relevantCategories.includes(routine.category)) {
          score += 2;
          matchReasons.push(`Great for ${goal}`);
        }
      });

      // Bonus for time efficiency
      const timeUtilization = routine.duration / maxTime;
      if (timeUtilization >= 0.8) {
        score += 1;
        matchReasons.push("Maximizes your available time");
      } else if (timeUtilization >= 0.5) {
        score += 0.5;
        matchReasons.push("Good fit for your schedule");
      }

      // Age group considerations
      if (input.ageGroup === "50+" && routine.category === "evening") {
        score += 1;
        matchReasons.push("Gentle approach suitable for your age");
      } else if ((input.ageGroup === "18-25" || input.ageGroup === "26-35") && routine.category === "strength") {
        score += 1;
        matchReasons.push("High energy routine for your age group");
      }

      return {
        ...routine,
        score,
        matchReasons: matchReasons.slice(0, 3) // Limit to top 3 reasons
      };
    });

    // Sort by score and return top recommendations
    return scoredRoutines
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }

  generatePersonalizedPlan(
    input: RecommendationInput,
    scoredRoutines: ScoredRoutine[]
  ): {
    weeklyPlan: { day: string; routine: ScoredRoutine | null }[];
    recommendations: string[];
  } {
    const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const weeklyPlan = weekDays.map(day => ({ day, routine: null as ScoredRoutine | null }));

    // Distribute routines across the week based on goals and preferences
    const maxTimePerDay = this.timeMapping[input.timeAvailable] || 30;
    const targetSessionsPerWeek = Math.min(Math.floor((maxTimePerDay * 7) / 20), 6); // Reasonable frequency

    let routineIndex = 0;
    for (let i = 0; i < targetSessionsPerWeek && i < weeklyPlan.length && routineIndex < scoredRoutines.length; i++) {
      // Skip Sunday for beginners, prefer rest day
      if (input.experience === "beginner" && i === 6) continue;
      
      weeklyPlan[i].routine = scoredRoutines[routineIndex % scoredRoutines.length];
      routineIndex++;
    }

    // Generate personalized recommendations
    const recommendations = this.generatePersonalizedTips(input, scoredRoutines);

    return { weeklyPlan, recommendations };
  }

  private generatePersonalizedTips(
    input: RecommendationInput,
    routines: ScoredRoutine[]
  ): string[] {
    const tips: string[] = [];

    if (input.experience === "beginner") {
      tips.push("Start with 2-3 sessions per week and gradually increase frequency");
      tips.push("Focus on proper form over advanced poses");
    }

    if (input.goals.includes("flexibility")) {
      tips.push("Hold poses for at least 30 seconds to improve flexibility");
    }

    if (input.goals.includes("stress relief")) {
      tips.push("Practice deep breathing throughout your sessions");
      tips.push("End each session with 5 minutes of meditation");
    }

    if (input.ageGroup === "50+") {
      tips.push("Listen to your body and modify poses as needed");
      tips.push("Warm up thoroughly before each session");
    }

    const hasStrengthFocus = routines.some(r => r.category === "strength");
    if (hasStrengthFocus) {
      tips.push("Stay hydrated and take rest days between strength sessions");
    }

    return tips.slice(0, 4); // Limit to 4 most relevant tips
  }
}

export const mlEngine = new MLRecommendationEngine();
