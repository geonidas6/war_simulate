'use client';

import { Typewriter } from '@/components/ui/typewriter';

interface NarrativeBlockProps {
    text: string;
    side: 'left' | 'right';
}

export function NarrativeBlock({ text, side }: NarrativeBlockProps) {
    // Strip tags for display
    const cleanText = text ? text.replace(/\[##.*?##\]/g, '') : '';

    return (
        <div className={`font-mono text-sm leading-relaxed whitespace-pre-wrap mt-8 p-4 ${side === 'left' ? 'bg-blue-900/20 text-blue-100 border border-blue-500/30' : 'bg-orange-900/20 text-orange-100 border border-orange-500/30'}`}>
            <Typewriter text={cleanText} speed={20} className="block" />
        </div>
    );
}
