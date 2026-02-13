import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={cn(
                "glass-card", // Reverting to glassmorphism
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
