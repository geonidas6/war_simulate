'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SplitScreenProps {
    leftContent: ReactNode;
    rightContent: ReactNode;
    className?: string;
}

export function SplitScreen({ leftContent, rightContent, className }: SplitScreenProps) {
    return (
        <div className={cn("flex w-full h-screen overflow-hidden gap-4 md:gap-48 justify-between", className)}>
            {/* Left Side (Blue - Order/Defense) */}
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex-1 h-full bg-slate-900/70 backdrop-blur-md border-r-2 border-blue-500/50 relative overflow-y-auto custom-scrollbar shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-[40%]"
            >
                <div className="absolute inset-0 bg-blue-900/10 pointer-events-none" />
                <div className="relative z-10 p-8 h-full flex flex-col">
                    {leftContent}
                </div>
            </motion.div>

            {/* Right Side (Orange - Revolt/Attack) */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="flex-1 h-full bg-stone-900/70 backdrop-blur-md border-l-2 border-orange-500/50 relative overflow-y-auto custom-scrollbar shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-[40%]"
            >
                <div className="absolute inset-0 bg-orange-900/10 pointer-events-none" />
                <div className="relative z-10 p-8 h-full flex flex-col">
                    {rightContent}
                </div>
            </motion.div>
        </div>
    );
}
