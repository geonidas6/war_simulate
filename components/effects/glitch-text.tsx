'use client';

import { motion } from 'framer-motion';

interface GlitchTextProps {
    text: string;
    className?: string;
}

export function GlitchText({ text, className }: GlitchTextProps) {
    return (
        <div className={`relative inline-block group ${className}`}>
            <span className="relative z-10">{text}</span>
            <span className="absolute top-0 left-0 -ml-[2px] text-red-500 opacity-0 group-hover:opacity-70 animate-glitch-1">
                {text}
            </span>
            <span className="absolute top-0 left-0 -ml-[1px] text-blue-500 opacity-0 group-hover:opacity-70 animate-glitch-2">
                {text}
            </span>

            {/* CSS Animation defined in globals.css hopefully, or we can use motion for more control */}
        </div>
    );
}

// Simple framer motion version if preferred
export function AnimatedGlitchText({ text, color = "blue" }: { text: string, color?: "blue" | "orange" }) {
    const shadowColor = color === "blue" ? "rgba(59, 130, 246, 0.5)" : "rgba(249, 115, 22, 0.5)";

    return (
        <motion.h2
            className={`text-4xl font-bold uppercase tracking-widest ${color === "blue" ? "text-blue-100" : "text-orange-100"}`}
            initial={{ textShadow: `0 0 0px ${shadowColor}` }}
            animate={{
                textShadow: [
                    `2px 0 1px ${shadowColor}`,
                    `-2px 0 1px ${shadowColor}`,
                    `0 0 0px ${shadowColor}`
                ],
                x: [0, -2, 2, 0]
            }}
            transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 0.2,
                repeatDelay: Math.random() * 5
            }}
        >
            {text}
        </motion.h2>
    )
}
