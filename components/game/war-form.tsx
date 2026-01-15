'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface WarInputProps {
    side: 'left' | 'right';
    onCountrySelect: (country: string) => void;
    disabled?: boolean;
}

export function WarInput({ side, onCountrySelect, disabled }: WarInputProps) {
    const [value, setValue] = useState('');
    const borderColor = side === 'left' ? 'border-blue-500' : 'border-orange-500';
    const focusColor = side === 'left' ? 'focus:ring-blue-500' : 'focus:ring-orange-500';

    return (
        <div className="flex flex-col gap-4 mt-10">
            <label className="text-sm uppercase tracking-widest opacity-70">
                {side === 'left' ? 'Defense Protocol' : 'Aggressor Protocol'}
            </label>
            <input
                type="text"
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    onCountrySelect(e.target.value);
                }}
                disabled={disabled}
                placeholder="ENTER NATION NAME"
                className={`bg-transparent border-b-2 ${borderColor} py-2 text-2xl font-mono outline-none ${focusColor} transition-all uppercase placeholder:opacity-30`}
            />
        </div>
    );
}
