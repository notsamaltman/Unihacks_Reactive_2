import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

const router = express.Router();

// Configure Multer for file uploads
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../lib/cloudinary.js';


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'rizzlab',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // Keeping this but ensuring spacing is standard
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

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

// Debug logging
router.post('/', verifyToken, (req, res, next) => {
    next();
}, upload.array('photos', 6), async (req, res) => {


    try {
        const { bio, name, age, gender, datingIntent, prompts, hobbies, reviewerPreferences } = req.body;
        const userId = req.user.userId;

        // Parse JSON fields from Form-Data (strings)
        let parsedPrompts = [];
        let parsedHobbies = [];
        let parsedPreferences = null;

        try {
            parsedPrompts = typeof prompts === 'string' ? JSON.parse(prompts) : (prompts || []);
            parsedHobbies = typeof hobbies === 'string' ? JSON.parse(hobbies) : (hobbies || []);
            parsedPreferences = typeof reviewerPreferences === 'string' ? JSON.parse(reviewerPreferences) : (reviewerPreferences || null);
        } catch (e) {
            console.error('Error parsing JSON fields:', e);
        }

        console.log('Creating profile in database...');

        // Create ProfileVersion
        const profile = await prisma.profileVersion.create({
            data: {
                userId: userId,
                bio: bio || '',
                prompts: parsedPrompts,
                hobbies: parsedHobbies,
                photos: {
                    create: req.files.map(file => ({
                        url: file.path
                    }))
                }
            },
            include: {
                photos: true
            }
        });

        console.log('Profile created:', profile.id);

        // Update User's latest profile and other details
        await prisma.user.update({
            where: { id: userId },
            data: {
                latestProfileId: profile.id,
                name: name,
                age: age ? parseInt(age) : null,
                gender: gender || undefined,
                datingIntent: datingIntent || undefined
            }
        });

        // Handle Reviewer Preferences if provided
        if (parsedPreferences) {
            const { gender, intent, vibes, preferredAgeMin, preferredAgeMax, preferredDescription } = parsedPreferences;

            const preference = await prisma.reviewerPreference.upsert({
                where: { userId: userId },
                update: {
                    preferredGenders: gender === 'EVERYONE' ? ['MALE', 'FEMALE', 'NON_BINARY'] : [gender],
                    preferredIntent: intent,
                    preferredAgeMin: preferredAgeMin ? parseInt(preferredAgeMin) : null,
                    preferredAgeMax: preferredAgeMax ? parseInt(preferredAgeMax) : null,
                    preferredDescription: preferredDescription || null,
                    tasteTags: vibes,
                    profileVersionId: profile.id
                },
                create: {
                    userId: userId,
                    profileVersionId: profile.id,
                    preferredGenders: gender === 'EVERYONE' ? ['MALE', 'FEMALE', 'NON_BINARY'] : [gender],
                    preferredIntent: intent,
                    preferredAgeMin: preferredAgeMin ? parseInt(preferredAgeMin) : null,
                    preferredAgeMax: preferredAgeMax ? parseInt(preferredAgeMax) : null,
                    preferredDescription: preferredDescription || null,
                    tasteTags: vibes
                }
            });

            await prisma.user.update({
                where: { id: userId },
                data: { preferenceId: preference.id }
            });
        }

        res.status(201).json({ message: 'Profile created successfully', profile });
    } catch (error) {
        console.error('CRITICAL ERROR in profile creation:');
        console.error(error); // This prints the stack trace nicely in Node
        if (error instanceof Error) {
            console.error('Message:', error.message);
            console.error('Stack:', error.stack);
        }
        res.status(500).json({ error: 'Failed to create profile', details: error.message });
    }
});

// Get all profile versions for the user
router.get('/history', verifyToken, async (req, res) => {
    console.log('GET /api/profile/history hit for user:', req.user.userId);
    try {
        const profiles = await prisma.profileVersion.findMany({
            where: { userId: req.user.userId },
            orderBy: { createdAt: 'desc' },
            include: {
                photos: true,
                user: {
                    select: { name: true }
                }
            }
        });
        res.json(profiles);
    } catch (error) {
        console.error('Error fetching profile history:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// Get a specific profile version
router.get('/:id', verifyToken, async (req, res) => {
    console.log('GET /api/profile/:id hit with ID:', req.params.id);
    try {
        const profile = await prisma.profileVersion.findUnique({
            where: { id: req.params.id },
            include: { photos: true }
        });

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        // Ensure the user owns this profile (optional, but good for privacy)
        if (profile.userId !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

export default router;
