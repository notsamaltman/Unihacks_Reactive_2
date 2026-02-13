import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for merging classes
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    children,
    ...props
}) => {
    const variants = {
        primary: "bg-gradient-to-r from-neon-pink to-neon-purple text-white shadow-[0_0_20px_rgba(255,46,147,0.4)] hover:shadow-[0_0_30px_rgba(255,46,147,0.6)] hover:scale-[1.02] border border-white/10",
        secondary: "bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:border-white/20 shadow-lg",
        outline: "border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 shadow-[0_0_10px_rgba(0,255,209,0.2)]",
        ghost: "text-gray-400 hover:text-white hover:bg-white/5"
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "rounded-full font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? "Loading..." : children}
        </motion.button>
    );
};

export default Button;
