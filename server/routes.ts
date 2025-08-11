import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAssessmentSchema, insertUserProgressSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Assessment routes
  app.post("/api/assessment", async (req, res) => {
    try {
      const assessment = insertAssessmentSchema.parse(req.body);
      const newAssessment = await storage.createAssessment(assessment);
      res.json(newAssessment);
    } catch (error) {
      res.status(400).json({ message: "Invalid assessment data", error });
    }
  });

  app.get("/api/assessment/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const assessment = await storage.getAssessmentByUserId(userId);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      res.json(assessment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assessment", error });
    }
  });

  // Routine routes
  app.get("/api/routines", async (req, res) => {
    try {
      const routines = await storage.getRoutines();
      res.json(routines);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch routines", error });
    }
  });

  app.get("/api/routines/difficulty/:difficulty", async (req, res) => {
    try {
      const { difficulty } = req.params;
      const routines = await storage.getRoutinesByDifficulty(difficulty);
      res.json(routines);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch routines by difficulty", error });
    }
  });

  app.get("/api/routines/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const routine = await storage.getRoutineById(id);
      if (!routine) {
        return res.status(404).json({ message: "Routine not found" });
      }
      res.json(routine);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch routine", error });
    }
  });

  // ML Recommendations route
  app.post("/api/recommendations", async (req, res) => {
    try {
      const { ageGroup, experience, goals, timeAvailable } = req.body;
      
      // Simple ML-like algorithm for recommendations
      const allRoutines = await storage.getRoutines();
      let recommendations = [...allRoutines];

      // Filter by experience level
      if (experience === "beginner") {
        recommendations = recommendations.filter(r => 
          r.difficulty === "beginner" || r.difficulty === "all levels"
        );
      } else if (experience === "intermediate") {
        recommendations = recommendations.filter(r => 
          r.difficulty === "intermediate" || r.difficulty === "all levels"
        );
      } else if (experience === "advanced") {
        recommendations = recommendations.filter(r => 
          r.difficulty === "advanced" || r.difficulty === "intermediate"
        );
      }

      // Filter by time availability
      const timeMap: { [key: string]: number } = {
        "10-15 min": 15,
        "15-30 min": 30,
        "30-45 min": 45,
        "45+ min": 60
      };
      
      const maxTime = timeMap[timeAvailable] || 30;
      recommendations = recommendations.filter(r => r.duration <= maxTime);

      // Score based on goals
      recommendations = recommendations.map(routine => {
        let score = 0;
        if (goals.includes("flexibility") && routine.category === "morning") score += 2;
        if (goals.includes("strength") && routine.category === "strength") score += 3;
        if (goals.includes("stress relief") && routine.category === "evening") score += 2;
        if (goals.includes("balance") && routine.category === "strength") score += 1;
        if (goals.includes("meditation") && routine.category === "evening") score += 2;
        
        return { ...routine, score };
      });

      // Sort by score and return top recommendations
      recommendations.sort((a, b) => (b as any).score - (a as any).score);
      
      res.json(recommendations.slice(0, 6));
    } catch (error) {
      res.status(500).json({ message: "Failed to generate recommendations", error });
    }
  });

  // Progress tracking routes
  app.post("/api/progress", async (req, res) => {
    try {
      const progress = insertUserProgressSchema.parse(req.body);
      const newProgress = await storage.createUserProgress(progress);
      res.json(newProgress);
    } catch (error) {
      res.status(400).json({ message: "Invalid progress data", error });
    }
  });

  app.get("/api/progress/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
