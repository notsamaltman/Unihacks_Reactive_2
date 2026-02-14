import express from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * @route GET /api/ai/chad
 * @desc Get AI Rizz analysis from "Chad"
 */
router.get('/chad', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        // 1. Get latest profile version
        const latestProfile = await prisma.profileVersion.findFirst({
            where: { userId: userId },
            include: {
                photos: true,
                reviews: {
                    include: {
                        feedback: true,
                        reviewer: { select: { name: true, gender: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        if (!latestProfile) {
            return res.status(404).json({ error: 'No profile found. Please submit a profile first.' });
        }

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "REPLACE_WITH_YOUR_GEMINI_API_KEY") {
            return res.status(500).json({ error: 'AI features are currently unavailable. Admin needs to configure Gemini API Key.' });
        }

        // 2. Prepare data for Prompt
        const profileData = {
            bio: latestProfile.bio,
            hobbies: latestProfile.hobbies,
            pickupLines: latestProfile.pickupLines,
            prompts: latestProfile.prompts.map(p => ({ q: p.question, a: p.answer })),
            reviews: latestProfile.reviews.map(r => ({
                score: r.ratings,
                vibe: r.feedback?.vibeCheck,
                works: r.feedback?.whatWorks,
                doesntWork: r.feedback?.whatDoesntWork,
                reviewerGender: r.reviewer?.gender
            }))
        };

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
            You are "Chad", a hyper-confident, ultra-smooth AI Rizz consultant. 
            Your job is to analyze this dating profile and reviews, then give a "Chad Rizz Score" (0-100) and actionable, high-alpha feedback.
            
            Profile Data:
            - Bio: ${profileData.bio}
            - Hobbies: ${profileData.hobbies.join(', ')}
            - Pickup Lines: ${profileData.pickupLines.join(', ')}
            - Prompts: ${JSON.stringify(profileData.prompts)}
            
            Community Reviews:
            ${JSON.stringify(profileData.reviews)}
            
            Instructions:
            1. Act like Chad. Use terms like "bro", "king", "alpha", "rizz", and "game". Be encouraging but brutally honest.
            2. Provide a "Chad Rizz Score" (0-100).
            3. Identify "Instant Red Flags" (if any).
            4. Give "Actionable Insights" to 10x their energy.
            5. Return the response in RAW JSON format with these exact keys:
               {
                 "score": number, 
                 "analysis": string, 
                 "redFlags": string[], 
                 "actionPlan": string[],
                 "chadQuote": string
               }
            
            Only return the JSON. No markdown backticks.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up the response in case it has markdown backticks
        const cleanJson = text.replace(/```json|```/g, '').trim();
        const chadAnalysis = JSON.parse(cleanJson);

        res.json({
            profile: latestProfile,
            analysis: chadAnalysis
        });
    } catch (error) {
        console.error('Chad AI Error:', error);
        res.status(500).json({ error: 'Chad is busy hitting the gym. Try again later!' });
    }
});

export default router;
