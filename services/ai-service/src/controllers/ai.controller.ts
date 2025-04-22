// src/controllers/ai.controller.ts
import { Router, Request, Response, NextFunction } from "express";
import { gigaChat } from "../services/gigachat.service";
import asyncHandler from "express-async-handler";
import config from "../config";
import { redis } from "../services/redis.service";

const router = Router();

interface AIRequest {
  inputs: string;
  context?: {
    currentStep?: number;
    framework?: string;
    features?: string[];
    template?: string;
  };
}

const validateAIRequest = (body: any): body is AIRequest => {
  if (!body?.inputs || typeof body.inputs !== "string") return false;
  if (body.inputs.length > 500 || body.inputs.trim().length === 0) return false;
  return true;
};

router.get("/test", (req, res) => {
  res.json({ message: "AI Router is working!" });
});

const handleQuery = async (
  req: Request<{}, {}, AIRequest>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!validateAIRequest(req.body)) {
    res.status(400).json({
      error: "Invalid request format",
      required: "inputs (string, 1-500 characters)",
      received: req.body
    });
    return;
  }

  try {
    const { inputs: message, context } = req.body;

    const cacheKey = `ai:${message}:${context?.currentStep}:${context?.framework}`;
    const cachedResponse = await redis.getCached(cacheKey);
    if (cachedResponse) {
      res.json(cachedResponse);
      return;
    }

    const response = await gigaChat.generateText(message);

    const result = {
      suggestion: response.trim(),
      details: {
        model: "GigaChat",
        provider: "Sberbank"
      }
    };

    await redis.cacheResponse(cacheKey, result);
    res.json(result);
  } catch (error) {
    console.error("GigaChat Error:", error);
    res.status(500).json({
      error: "AI service unavailable",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

router.post("/query", asyncHandler(handleQuery));

export default router;