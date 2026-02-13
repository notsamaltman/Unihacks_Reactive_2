import React from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({ className, label, error, ...props }) => {
    return (
        <div className="w-full space-y-2">
            {label && (
                <label className="block text-sm font-medium text-gray-400 ml-1 font-sans">
                    {label}
                </label>
            )}
            <input
                className={cn(
                    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all text-white placeholder:text-gray-600 font-sans",
                    error && "border-red-500 focus:border-red-500",
                    className
                )}
                {...props}
            />
            {error && (
                <p className="text-red-500 text-xs ml-1">{error}</p>
            )}
        </div>
    );
};

export default Input;
