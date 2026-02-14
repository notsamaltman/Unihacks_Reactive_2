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

/**
 * @route GET /api/reviews/matching
 * @desc Get profiles that match current user as a reviewer
 */
router.get('/matching', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user || !user.gender || !user.age) {
            return res.status(400).json({ error: 'Please complete your own profile first (gender and age required)' });
        }

        // Matching Logic:
        // 1. Profile is not the user's own
        // 2. Profile owner's ReviewerPreference includes user's gender
        // 3. User's age is within owner's preferred range
        // 4. User hasn't already reviewed this profile version

        const matchingProfiles = await prisma.profileVersion.findMany({
            where: {
                userId: { not: userId },
                // Check against the User's latest preferences, or just profiles that have reviewer preferences
                // For simplicity, we match against profiles that have a related ReviewerPreference record
                // that matches the current reviewer (user).
                NOT: {
                    reviews: {
                        some: { reviewerId: userId }
                    }
                }
            },
            include: {
                photos: true,
                user: {
                    select: {
                        name: true,
                        age: true,
                        gender: true
                    }
                }
            },
            take: 10
        });

        // Since Prisma's complex filtering on includes/relations can be tricky,
        // we'll filter them more precisely here or use a more advanced query.
        // Let's grab the ReviewerPreferences separately or use a better where clause.

        const profilesWithPrefs = await prisma.profileVersion.findMany({
            where: {
                userId: { not: userId },
                // Join with ReviewerPreference (which is 1-1 with ProfileVersion in our current schema)
            },
            include: {
                photos: true,
                user: { select: { name: true, age: true } }
            }
        });

        // Filter valid matches
        const filteredMatches = [];
        for (const profile of profilesWithPrefs) {
            // Get the preference for this profile version
            const pref = await prisma.reviewerPreference.findUnique({
                where: { profileVersionId: profile.id }
            });

            if (!pref) continue;

            // Check gender match
            if (pref.preferredGenders.length > 0 && !pref.preferredGenders.includes(user.gender)) continue;

            // Check age match
            if (pref.preferredAgeMin && user.age < pref.preferredAgeMin) continue;
            if (pref.preferredAgeMax && user.age > pref.preferredAgeMax) continue;

            // Check if already reviewed
            const alreadyReviewed = await prisma.review.findFirst({
                where: { profileVersionId: profile.id, reviewerId: userId }
            });

            if (alreadyReviewed) continue;

            filteredMatches.push({
                ...profile,
                ReviewerPreference: pref
            });
        }

        res.json(filteredMatches.slice(0, 10));
    } catch (error) {
        console.error('Error fetching matches:', error);
        res.status(500).json({ error: 'Failed to fetch matches' });
    }
});

/**
 * @route GET /api/reviews/my-reviews
 * @desc Get reviews for the current user's profiles
 */
router.get('/my-reviews', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const reviews = await prisma.review.findMany({
            where: {
                profileVersion: {
                    userId: userId
                }
            },
            include: {
                reviewer: {
                    select: { name: true, gender: true }
                },
                feedback: true,
                profileVersion: {
                    select: { id: true, createdAt: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

/**
 * @route GET /api/reviews/given
 * @desc Get reviews provided by the current user to others
 */
router.get('/given', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const reviews = await prisma.review.findMany({
            where: {
                reviewerId: userId
            },
            include: {
                profileVersion: {
                    include: {
                        user: {
                            select: { name: true, gender: true, age: true }
                        },
                        photos: { take: 1 }
                    }
                },
                feedback: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(reviews);
    } catch (error) {
        console.error('Error fetching given reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

/**
 * @route PATCH /api/reviews/:id/read
 * @desc Mark a review as read
 */
router.patch('/:id/read', verifyToken, async (req, res) => {
    try {
        const review = await prisma.review.update({
            where: { id: req.params.id },
            data: { isRead: true }
        });
        res.json(review);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update review' });
    }
});

/**
 * @route POST /api/reviews
 * @desc Submit a new review
 */
router.post('/', verifyToken, async (req, res) => {
    try {
        const { profileVersionId, ratings, vibeCheck, whatWorks, whatDoesntWork, PhotoNotes, bioNotes, redFlags, suggestions } = req.body;
        const userId = req.user.userId;

        const user = await prisma.user.findUnique({ where: { id: userId } });

        const review = await prisma.review.create({
            data: {
                profileVersionId,
                reviewerId: userId,
                reviewerGender: user.gender,
                reviewerIntent: user.datingIntent,
                ratings: parseInt(ratings),
                feedback: {
                    create: {
                        vibeCheck,
                        whatWorks,
                        whatDoesntWork,
                        photoNotes: PhotoNotes,
                        bioNotes,
                        redFlags: redFlags || [],
                        suggestions: suggestions || []
                    }
                }
            },
            include: {
                feedback: true
            }
        });

        res.status(201).json(review);
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ error: 'Failed to submit review' });
    }
});

export default router;
