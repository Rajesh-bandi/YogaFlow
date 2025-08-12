import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAssessmentSchema, insertUserProgressSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password } = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await storage.createUser({ username, password: hashedPassword });
      
      // Don't return password in response
      const { password: _, ...userResponse } = user;
      res.status(201).json(userResponse);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      // Find user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Don't return password in response
      const { password: _, ...userResponse } = user;
      res.json({ message: "Login successful", user: userResponse });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Login failed" });
    }
  });

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

  // Poses routes - serve real yoga dataset
  app.get("/api/poses", async (req, res) => {
    try {
      const { yogaDataset } = await import("./yoga-dataset");
      res.json(yogaDataset);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch poses", error });
    }
  });

  app.get("/api/poses/:id", async (req, res) => {
    try {
      const { yogaDataset } = await import("./yoga-dataset");
      const { id } = req.params;
      const pose = yogaDataset[parseInt(id)];
      if (!pose) {
        return res.status(404).json({ message: "Pose not found" });
      }
      res.json({ ...pose, id: parseInt(id) });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pose", error });
    }
  });

  app.get("/api/poses/category/:category", async (req, res) => {
    try {
      const { yogaDataset } = await import("./yoga-dataset");
      const { category } = req.params;
      const poses = yogaDataset.filter(pose => 
        pose.goal_category.toLowerCase() === category.toLowerCase()
      );
      res.json(poses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch poses by category", error });
    }
  });

  app.get("/api/poses/difficulty/:difficulty", async (req, res) => {
    try {
      const { yogaDataset } = await import("./yoga-dataset");
      const { difficulty } = req.params;
      const poses = yogaDataset.filter(pose => 
        pose.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
      res.json(poses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch poses by difficulty", error });
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
