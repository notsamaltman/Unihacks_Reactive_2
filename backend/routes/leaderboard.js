import express from 'express';
import prisma from '../lib/prisma.js';

const router = express.Router();

/**
 * @route GET /api/leaderboard
 * @desc Get top 5 rizzlers of the week (highest avg community rating)
 */
router.get('/', async (req, res) => {
    try {
        // Calculate date for "of the week"
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // Fetch all profiles with their reviews
        const profiles = await prisma.profileVersion.findMany({
            include: {
                user: {
                    select: { name: true, age: true }
                },
                photos: {
                    take: 1
                },
                reviews: {
                    where: {
                        createdAt: { gte: oneWeekAgo }
                    },
                    select: { ratings: true }
                }
            }
        });

        // Calculate average scores and filter those with reviews
        const leaderboard = profiles
            .map(profile => {
                const ratings = profile.reviews.map(r => r.ratings).filter(r => r !== null);
                const avgScore = ratings.length > 0
                    ? parseFloat((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1))
                    : 0;

                return {
                    id: profile.id,
                    name: profile.user?.name || "Anonymous",
                    age: profile.user?.age,
                    bio: profile.bio,
                    hobbies: profile.hobbies,
                    photo: profile.photos[0]?.url,
                    avgScore,
                    reviewCount: ratings.length
                };
            })
            .filter(item => item.reviewCount > 0) // Only show those who have been reviewed this week
            .sort((a, b) => b.avgScore - a.avgScore)
            .slice(0, 5);

        res.json(leaderboard);
    } catch (error) {
        console.error('Leaderboard error:', error);
        res.status(500).json({ error: 'Failed to fetch the elite rizzlers.' });
    }
});

export default router;
