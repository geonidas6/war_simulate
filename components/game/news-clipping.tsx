'use client';

import { motion } from 'framer-motion';

interface NewsClippingProps {
    date: string;
    headline: string;
    content: string;
    onAck: () => void;
}

export function NewsClipping({ date, headline, content, onAck }: NewsClippingProps) {
    const cleanContent = content ? content.replace(/\[##.*?##\]/g, '') : '';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <motion.div
                initial={{ opacity: 0, y: 50, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="bg-[#f0e6d2] text-black max-w-2xl w-full p-8 shadow-2xl transform rotate-1 relative"
            >
                {/* Paper texture overlay could go here */}

                <div className="border-b-4 border-black pb-4 mb-4 flex justify-between items-end">
                    <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">Global Daily</h1>
                    <span className="font-serif italic text-lg">{date}</span>
                </div>

                <div className="space-y-6">
                    <h2 className="text-3xl font-serif font-bold leading-tight">{headline}</h2>
                    <div className="columns-1 md:columns-2 gap-6 text-justify text-sm font-serif leading-relaxed border-b border-black pb-4">
                        {cleanContent}
                    </div>

                    <div className="flex justify-center pt-4">
                        <button
                            onClick={onAck}
                            className="bg-red-600 text-white px-8 py-3 font-bold uppercase tracking-widest hover:bg-red-700 transition-colors"
                        >
                            Read Full Report
                        </button>
                    </div>
                </div>

            </motion.div>
        </div>
    );
}
