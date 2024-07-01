"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const feedBackController_1 = require("../controllers/feedBackController");
const router = express_1.default.Router();
/**
 * @swagger
 * /feedback:
 *   post:
 *     summary: Post a feedback
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: number
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: The feedback was successfully created
 *       400:
 *         description: Some parameters are missing or invalid
 */
router.post('/feedback', feedBackController_1.postFeedback);
/**
 * @swagger
 * /feedback/all:
 *   get:
 *     summary: Get all feedbacks
 *     tags: [Feedback]
 *     responses:
 *       200:
 *         description: A list of all feedbacks
 *       500:
 *         description: There was an error processing your request
 */
router.get('/feedback/all', feedBackController_1.getFeedbacks);
exports.default = router;
