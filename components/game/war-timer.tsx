'use client';

import { motion } from 'framer-motion';

interface WarTimerProps {
    label: string; // "Day 1", "Day 12", etc.
}

export function WarTimer({ label }: WarTimerProps) {
    return (
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-center z-50 pointer-events-none">
            <div className="bg-black/80 backdrop-blur border-b-2 border-red-600 px-8 py-3 rounded-b-lg shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                <div className="text-xs text-red-500 uppercase tracking-[0.2em] text-center mb-1">Conflict Timeline</div>
                <motion.div
                    key={label}
                    className="text-3xl font-mono text-red-500 font-bold tracking-widest uppercase"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    {label}
                </motion.div>
            </div>
        </div>
    );
}
