'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function LoadingOverlay() {
    const [text, setText] = useState('INITIALIZING UPLINK...');

    useEffect(() => {
        const messages = [
            'INITIALIZING UPLINK...',
            'BYPASSING FIREWALLS...',
            'ACCESSING SATELLITE DATA...',
            'TRIANGULATING TARGETS...',
            'DECRYPTING MILITARY COMMS...',
            'SIMULATION MATRIX LOADED.'
        ];
        let i = 0;
        const interval = setInterval(() => {
            i++;
            if (i < messages.length) setText(messages[i]);
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-[100] bg-black text-green-500 font-mono flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-4">
                <div className="text-xs uppercase tracking-widest text-center animate-pulse">
                    System Access Request
                </div>

                <div className="border border-green-500/30 bg-green-500/5 p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-green-500/10 animate-scanline pointer-events-none" />
                    <h1 className="text-2xl font-bold text-center mb-4 text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">
                        {text}
                    </h1>

                    <div className="flex justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-2 h-8 bg-green-500"
                                animate={{ scaleY: [1, 2, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                            />
                        ))}
                    </div>
                </div>

                <div className="text-[10px] text-green-500/50 text-center">
                    WARNING: UNAUTHORIZED SIMULATION MAY VIOLATE INTERNATIONAL TREATIES.
                </div>
            </div>
        </div>
    );
}
