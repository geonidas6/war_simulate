'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { COUNTRIES, LANGUAGES } from '@/lib/constants';

interface SetupScreenProps {
    onStart: (countryA: string, countryB: string, language: string) => void;
    loading: boolean;
}

export function SetupScreen({ onStart, loading }: SetupScreenProps) {
    const [countryA, setCountryA] = useState('');
    const [countryB, setCountryB] = useState('');
    const [language, setLanguage] = useState('fr'); // Default to French as requested by user context implies FR

    return (
        <div className="min-h-screen bg-white text-black flex items-center justify-center p-4 font-sans">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl w-full flex flex-col gap-8"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tighter uppercase">WORLD WAR SIMULATOR</h1>
                    <p className="text-gray-500 text-sm">Select protocols to initiate conflict scenario analysis.</p>
                </div>

                <div className="flex flex-col gap-6">

                    {/* Language Selection */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Simulation Language</label>
                        <div className="relative">
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg text-lg appearance-none cursor-pointer focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                            >
                                {LANGUAGES.map(lang => (
                                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">↓</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Country A */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Nation Alpha</label>
                            <div className="relative">
                                <select
                                    value={countryA}
                                    onChange={(e) => setCountryA(e.target.value)}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none cursor-pointer focus:border-black outline-none"
                                >
                                    <option value="">Select Nation...</option>
                                    {COUNTRIES.map(c => (
                                        <option key={`a-${c}`} value={c}>{c}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">↓</div>
                            </div>
                        </div>

                        {/* Country B */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Nation Omega</label>
                            <div className="relative">
                                <select
                                    value={countryB}
                                    onChange={(e) => setCountryB(e.target.value)}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none cursor-pointer focus:border-black outline-none"
                                >
                                    <option value="">Select Nation...</option>
                                    {COUNTRIES.map(c => (
                                        <option key={`b-${c}`} value={c}>{c}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">↓</div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => onStart(countryA, countryB, language)}
                        disabled={!countryA || !countryB || countryA === countryB || loading}
                        className="group mt-4 bg-black text-white p-5 rounded-lg text-lg font-bold uppercase tracking-widest hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden"
                    >
                        {loading ? (
                            <span className="animate-pulse">Analyzing Geopolitics...</span>
                        ) : (
                            <>
                                <span className="relative z-10">Initialize Simulation</span>
                                <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
                            </>
                        )}
                    </button>

                    {countryA === countryB && countryA !== '' && (
                        <p className="text-center text-red-500 text-xs">Self-conflict is not supported. Please select unique nations.</p>
                    )}

                </div>
            </motion.div>
        </div>
    );
}
