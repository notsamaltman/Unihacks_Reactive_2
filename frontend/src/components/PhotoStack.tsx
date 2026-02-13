import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '../lib/utils';

export interface Photo {
    id: string | number;
    url: string;
    caption?: string;
    rotation?: number; // Optional initial rotation for randomness
}

interface PhotoStackProps {
    photos: Photo[];
    className?: string;
}

const PhotoStack: React.FC<PhotoStackProps> = ({ photos, className }) => {
    // Manage z-index order locally
    const [orderedPhotos, setOrderedPhotos] = useState(photos);

    const bringToFront = (id: string | number) => {
        setOrderedPhotos((prev) => {
            const others = prev.filter((p) => p.id !== id);
            const target = prev.find((p) => p.id === id);
            return target ? [...others, target] : prev;
        });
    };

    return (
        <div className={cn("relative w-full h-96 flex items-center justify-center", className)}>
            {orderedPhotos.map((photo, index) => {
                // Calculate random rotation if not provided, seeded by index or id roughly
                // Ideally rotation should be stable. We can rely on index in the *original* array if we wanted strict stability,
                // but here we just use the photo's own ID or properties for "randomness" if not provided.
                // For simplicity in this demo, we'll assume the passed photos have rotation or we default.
                const rotationStub = typeof photo.id === 'number' ? photo.id : photo.url.length;
                const rotateVal = photo.rotation ?? ((rotationStub % 10) - 5) * 2; // -10 to 10 deg

                return (
                    <DraggablePhoto
                        key={photo.id}
                        photo={photo}
                        index={index}
                        total={orderedPhotos.length}
                        rotate={rotateVal}
                        onInteract={() => bringToFront(photo.id)}
                    />
                );
            })}
        </div>
    );
};

interface DraggablePhotoProps {
    photo: Photo;
    index: number; // visual index in the stack (0 = bottom, length-1 = top)
    total: number;
    rotate: number;
    onInteract: () => void;
}

const DraggablePhoto: React.FC<DraggablePhotoProps> = ({ photo, index, total, rotate, onInteract }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Subtle parallax or scale effect on drag
    const scale = useTransform(x, [-200, 200], [1, 1]); // Keep 1 for now, or 1.1 on hover

    return (
        <motion.div
            drag
            dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
            whileHover={{ scale: 1.05, rotate: rotate + 2, zIndex: 100 }} // Temporary z-index boost on hover
            whileDrag={{ scale: 1.1, zIndex: 101, cursor: 'grabbing' }}
            onMouseDown={onInteract}
            style={{
                x,
                y,
                scale,
                rotate: rotate,
                zIndex: index, // Stack order based on array position
                position: 'absolute',
            }}
            className="w-64 bg-white p-3 pb-8 shadow-xl rounded-sm border-[1px] border-stone-200 cursor-grab"
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <div className="w-full aspect-[4/5] bg-stone-100 overflow-hidden relative mb-2">
                <img
                    src={photo.url}
                    alt={photo.caption || "User photo"}
                    className="w-full h-full object-cover pointer-events-none"
                    draggable={false}
                />
            </div>
            {photo.caption && (
                <p className="text-center font-handwriting text-vintage-text/80 text-sm font-semibold truncate px-2 font-serif">
                    {photo.caption}
                </p>
            )}
        </motion.div>
    );
};

export default PhotoStack;
