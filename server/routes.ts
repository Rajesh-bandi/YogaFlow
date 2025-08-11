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

  // ML Recommendations route using real yoga dataset
  app.post("/api/recommendations", async (req, res) => {
    try {
      const { mlEngine } = await import("../client/src/lib/ml-recommendations-new");
      const input = req.body;
      
      // Generate intelligent recommendations using real yoga dataset
      const recommendations = mlEngine.generateRecommendations(input);
      
      res.json(recommendations);
    } catch (error) {
      console.error("ML Recommendation error:", error);
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
