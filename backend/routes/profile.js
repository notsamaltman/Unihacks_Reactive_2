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
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    consttoken = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

router.post('/', verifyToken, upload.array('photos', 6), async (req, res) => {
    try {
        const { bio, name, age, gender, datingIntent, prompts } = req.body;
        const userId = req.user.userId;

        // Parse prompts from JSON string if needed (FormData sends strings)
        let parsedPrompts = [];
        try {
            parsedPrompts = typeof prompts === 'string' ? JSON.parse(prompts) : prompts;
        } catch (e) {
            console.error('Error parsing prompts:', e);
            parsedPrompts = [];
        }

        // Create ProfileVersion
        const profile = await prisma.profileVersion.create({
            data: {
                userId: userId,
                bio: bio || '',
                prompts: parsedPrompts,
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

        res.status(201).json({ message: 'Profile created successfully', profile });
    } catch (error) {
        console.error('Error creating profile:', error);
        res.status(500).json({ error: 'Failed to create profile' });
    }
});

export default router;
