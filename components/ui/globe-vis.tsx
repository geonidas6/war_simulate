'use client';

import createGlobe from 'cobe';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface GlobeVisProps {
    className?: string;
    focusOn?: [number, number]; // [lat, lon]
    markers?: { location: [number, number]; size: number }[];
    autoRotate?: boolean;
}

export function GlobeVis({ className, focusOn, markers = [], autoRotate = false }: GlobeVisProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const focusRef = useRef([0, 0]);

    const locationToAngles = (lat: number, long: number) => {
        return [Math.PI - ((long * Math.PI) / 180 - Math.PI / 2), (lat * Math.PI) / 180];
    };

    useEffect(() => {
        if (focusOn) {
            focusRef.current = locationToAngles(focusOn[0], focusOn[1]);
        }
    }, [focusOn]);

    useEffect(() => {
        let width = 0;
        let currentPhi = 0;
        let currentTheta = 0;
        const doublePi = Math.PI * 2;

        if (!canvasRef.current) return;

        const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth);
        window.addEventListener('resize', onResize);
        onResize();

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: width * 2,
            height: width * 2,
            phi: 0,
            theta: 0.3,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.3, 0.3, 0.3],
            markerColor: [1, 0.2, 0.2], // Brighter red
            glowColor: [0.8, 0, 0],
            markers: markers,
            onRender: (state) => {
                if (autoRotate) {
                    // Simple auto rotation
                    currentPhi += 0.003;
                    state.phi = currentPhi;
                    state.theta = 0.3;
                } else {
                    // Smooth rotation logic
                    const [focusPhi, focusTheta] = focusRef.current;
                    const distPositive = (focusPhi - currentPhi + doublePi) % doublePi;
                    const distNegative = (currentPhi - focusPhi + doublePi) % doublePi;

                    // Control the speed
                    if (distPositive < distNegative) {
                        currentPhi += distPositive * 0.08;
                    } else {
                        currentPhi -= distNegative * 0.08;
                    }
                    currentTheta = currentTheta * 0.92 + focusTheta * 0.08;

                    state.phi = currentPhi;
                    state.theta = currentTheta;
                }

                state.width = width * 2;
                state.height = width * 2;
            },
        });

        setTimeout(() => {
            if (canvasRef.current) canvasRef.current.style.opacity = '1';
        });

        return () => {
            globe.destroy();
            window.removeEventListener('resize', onResize);
        };
    }, [focusOn, markers, autoRotate]);

    return (
        <div className={cn("relative z-0 pointer-events-none opacity-80 mix-blend-screen w-full h-full flex items-center justify-center", className)}>
            <canvas
                ref={canvasRef}
                style={{
                    width: '100%',
                    height: '100%',
                    maxWidth: '65vh',
                    maxHeight: '65vh',
                    aspectRatio: 1,
                    opacity: 0,
                    transition: 'opacity 1s ease'
                }}
            />
        </div>
    );
}
