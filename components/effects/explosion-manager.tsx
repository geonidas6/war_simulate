'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '@/lib/audio';

import Lottie from 'lottie-react';
import explosionData from './explosion.json';

interface ExplosionManagerProps {
    triggerText: string;
}

function Explosion({ x, y }: { x: number; y: number }) {
    return (
        <div
            className="absolute z-[100] pointer-events-none w-64 h-64 -translate-x-1/2 -translate-y-1/2"
            style={{ left: x, top: y }}
        >
            <Lottie
                animationData={explosionData}
                loop={false}
                autoPlay={true}
            />
        </div>
    );
}

function AlertMessage({ message }: { message: string }) {
    return (
        <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-24 left-0 right-0 z-[200] flex justify-center pointer-events-none"
        >
            <div className="bg-red-600 text-white px-6 py-2 rounded shadow-[0_0_20px_red] font-bold uppercase tracking-widest animate-pulse border border-white">
                ⚠ {message} ⚠
            </div>
        </motion.div>
    )
}

export function ExplosionManager({ triggerText }: ExplosionManagerProps) {
    const [explosions, setExplosions] = useState<{ id: number, x: number, y: number }[]>([]);
    const [activeAlert, setActiveAlert] = useState<string | null>(null);

    useEffect(() => {
        if (!triggerText) return;

        // Check for Explosion Tag
        if (triggerText.includes('[##EXPLOSION##]')) {
            // Trigger sporadic explosions roughly in the middle
            const count = 3;
            for (let i = 0; i < count; i++) {
                setTimeout(() => {
                    const x = window.innerWidth / 2 + (Math.random() * 400 - 200);
                    const y = window.innerHeight / 2 + (Math.random() * 400 - 200);
                    setExplosions(prev => [...prev, { id: Date.now() + Math.random(), x, y }]);
                    audioManager.playGlitch(); // Should use specific explosion sound if available
                }, i * 300);
            }
        }

        // Check for Alert Tag
        if (triggerText.includes('[##ALERT##]')) {
            setActiveAlert("CRITICAL THREAT DETECTED");
            audioManager.playAlarm();
            setTimeout(() => setActiveAlert(null), 3000);
        }

        // Check for Glitch/Cyber Tag
        if (triggerText.includes('[##GLITCH##]')) {
            setActiveAlert("SYSTEM COMPROMISED // CYBER ATTACK");
            audioManager.playGlitch();
            setTimeout(() => setActiveAlert(null), 2000);
        }

        // Check for Static Tag
        if (triggerText.includes('[##STATIC##]')) {
            // Maybe just play audio or visual fuzz
            audioManager.playGlitch();
        }

    }, [triggerText]);

    return (
        <>
            {explosions.map(ex => (
                <Explosion key={ex.id} x={ex.x} y={ex.y} />
            ))}

            <AnimatePresence>
                {activeAlert && <AlertMessage message={activeAlert} />}
            </AnimatePresence>
        </>
    );
}
