import express from "express";
import aiController from "../controllers/ai_controller";
import { authMiddleware } from "../controllers/auth_controller";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AiDescription:
 *       type: string
 */

/**
 * @swagger
 * /ai:
 *   get:
 *     summary: Get AI-generated description
 *     tags: [AI]
 *     responses:
 *       200:
 *         description: AI-generated description for the organization
 *         content:
 *           application/json:
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get("/", authMiddleware, aiController.getAiDescription);

export default router;
