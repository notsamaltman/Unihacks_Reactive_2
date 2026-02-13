import express from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

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

router.post('/', verifyToken, async (req, res) => {
    try {
        const { gender, intent, vibes, profileVersionId } = req.body;
        const userId = req.user.userId;

        // Ensure we have a profileVersionId, usually passed from the previous step or fetched
        // For simplicity, we might assume the user has a latestProfileId, but adhering to schema logic:

        // Find user's latest profile if not provided
        let targetProfileId = profileVersionId;
        if (!targetProfileId) {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { latestProfileId: true }
            });
            targetProfileId = user?.latestProfileId;
        }

        if (!targetProfileId) {
            return res.status(400).json({ error: 'No profile found to attach preferences to.' });
        }

        // Upsert preferences (create or update)
        // Note: Schema has ReviewerPreference.profileVersionId as unique, and userId as separate unique. 
        // Logic might need adjustment if 1-1 with User. Let's assume 1-1 with User for now based on previous edits.

        const preference = await prisma.reviewerPreference.upsert({
            where: {
                userId: userId
            },
            update: {
                preferredGenders: gender === 'EVERYONE' ? ['MALE', 'FEMALE', 'NON_BINARY'] : [gender],
                preferredIntent: intent,
                tasteTags: vibes,
                profileVersionId: targetProfileId // Link to specific profile version
            },
            create: {
                userId: userId,
                profileVersionId: targetProfileId,
                preferredGenders: gender === 'EVERYONE' ? ['MALE', 'FEMALE', 'NON_BINARY'] : [gender],
                preferredIntent: intent,
                tasteTags: vibes
            }
        });

        // Update User to link this preference
        await prisma.user.update({
            where: { id: userId },
            data: { preferenceId: preference.id }
        });

        res.status(200).json({ message: 'Preferences updated successfully', preference });
    } catch (error) {
        console.error('Error updating preferences:', error);
        res.status(500).json({ error: 'Failed to update preferences' });
    }
});

export default router;
