'use client';

import { useState } from 'react';
import { SetupScreen } from '@/components/game/setup-screen';
import { SplitScreen } from '@/components/ui/split-screen';
import { NarrativeBlock } from '@/components/game/narrative-block';
import { WarTimer } from '@/components/game/war-timer';
import { NewsClipping } from '@/components/game/news-clipping';
import { AnimatedGlitchText } from '@/components/effects/glitch-text';
import { LoadingOverlay } from '@/components/effects/loading-overlay';
import { GlobeVis } from '@/components/ui/globe-vis';
import { ExplosionManager } from '@/components/effects/explosion-manager';
import { audioManager } from '@/lib/audio';
import { motion, AnimatePresence } from 'framer-motion';
import { COUNTRY_COORDINATES } from '@/lib/coordinates';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { Typewriter } from '@/components/ui/typewriter';

export default function Home() {
  const [view, setView] = useState<'setup' | 'news' | 'timeline' | 'result'>('setup');
  const [simulation, setSimulation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [timelineIndex, setTimelineIndex] = useState(0);

  const startSimulation = async (countryA: string, countryB: string, language: string) => {
    setLoading(true);

    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ countryA, countryB, language }),
      });
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      setSimulation(data);
      audioManager.playBackground();
      audioManager.playAlarm();
      setView('news');

    } catch (error) {
      console.error(error);
      alert("Simulation failed. API Error.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewsAck = () => {
    setView('timeline');
    setTimelineIndex(0);
  };

  const nextStep = () => {
    if (!simulation?.timeline) return;
    if (timelineIndex < simulation.timeline.length - 1) {
      setTimelineIndex(prev => prev + 1);
      audioManager.playGlitch();
    } else {
      setView('result');
    }
  };

  const prevStep = () => {
    if (timelineIndex > 0) {
      setTimelineIndex(prev => prev - 1);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden font-mono selection:bg-red-900 selection:text-white relative">
      <AnimatePresence>
        {loading && <LoadingOverlay />}
      </AnimatePresence>

      {/* 1. Setup Phase */}
      {view === 'setup' && (
        <SetupScreen onStart={startSimulation} loading={loading} />
      )}

      {/* 2. News Phase */}
      {view === 'news' && simulation?.inciting_event && (
        <NewsClipping
          date={simulation.inciting_event.date}
          headline={simulation.inciting_event.headline}
          content={simulation.inciting_event.content}
          onAck={handleNewsAck}
        />
      )}

      {/* 3. Timeline Phase */}
      {view === 'timeline' && simulation?.timeline?.[timelineIndex] && (
        <>
          {/* Background Globe */}
          <div className="absolute inset-0 flex items-center justify-center opacity-40 mix-blend-screen pointer-events-none">
            <GlobeVis
              autoRotate={true}
              markers={[
                simulation?.defender_name && COUNTRY_COORDINATES[simulation.defender_name] ? { location: COUNTRY_COORDINATES[simulation.defender_name], size: 0.15 } : null,
                simulation?.aggressor_name && COUNTRY_COORDINATES[simulation.aggressor_name] ? { location: COUNTRY_COORDINATES[simulation.aggressor_name], size: 0.15 } : null,
              ].filter(Boolean) as any[]}
              focusOn={
                (simulation?.defender_name && COUNTRY_COORDINATES[simulation.defender_name]) ||
                (simulation?.aggressor_name && COUNTRY_COORDINATES[simulation.aggressor_name]) ||
                undefined
              }
            />
          </div>

          {/* Dynamic Timer */}
          <WarTimer label={simulation.timeline[timelineIndex].day} />

          {/* Explosion & Effects Manager */}
          <ExplosionManager
            triggerText={simulation.timeline[timelineIndex].aggressor_text + simulation.timeline[timelineIndex].defender_text}
          />

          {/* Split Interface */}
          <SplitScreen
            className="relative z-10 bg-transparent/50"
            leftContent={
              <div className="flex flex-col h-full">
                <AnimatedGlitchText text={`DEFENDER: ${simulation?.defender_name || 'Blue Side'}`} color="blue" />
                <NarrativeBlock side="left" text={simulation.timeline[timelineIndex].defender_text} />
              </div>
            }
            rightContent={
              <div className="flex flex-col h-full">
                <AnimatedGlitchText text={`AGGRESSOR: ${simulation?.aggressor_name || 'Orange Side'}`} color="orange" />
                <NarrativeBlock side="right" text={simulation.timeline[timelineIndex].aggressor_text} />
              </div>
            }
          />

          {/* Navigation */}
          <div className="absolute bottom-8 left-0 right-0 z-50 flex justify-center gap-4 pointer-events-none">
            <button
              onClick={prevStep}
              disabled={timelineIndex === 0}
              className="pointer-events-auto bg-black/50 backdrop-blur border border-white/20 text-white p-4 rounded-full hover:bg-white/10 disabled:opacity-30 transition-all"
            >
              <ArrowLeft />
            </button>

            <button
              onClick={nextStep}
              className="pointer-events-auto bg-red-600 text-white px-8 py-3 font-bold uppercase tracking-widest hover:bg-red-700 transition-colors shadow-lg shadow-red-900/50 flex items-center gap-2"
            >
              {timelineIndex === simulation.timeline.length - 1 ? 'View Global Impact' : 'Next Phase'}
              <ArrowRight size={18} />
            </button>
          </div>
        </>
      )}

      {/* 4. Result Phase */}
      {view === 'result' && (
        <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center overflow-y-auto py-10">
          <div className="max-w-4xl w-full space-y-8 p-10">

            {/* Result Block */}
            <div className="border-y-2 border-red-600 bg-red-900/10 backdrop-blur-3xl p-8 animate-fadeIn text-center space-y-6">
              <h1 className="text-4xl text-red-500 font-black uppercase tracking-widest mb-4">Simulation Concluded</h1>
              <div className="text-xl md:text-2xl font-serif leading-relaxed min-h-[100px]">
                <Typewriter text={simulation?.bilan_mondial} speed={30} />
              </div>

              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => setView('timeline')}
                  className="bg-white/10 border border-white/30 px-6 py-2 hover:bg-white/20 transition flex items-center gap-2"
                >
                  <ArrowLeft size={16} /> PREVIOUS
                </button>
                <button
                  onClick={() => setView('setup')}
                  className="bg-red-600/80 border border-red-500 px-6 py-2 hover:bg-red-600 transition font-bold"
                >
                  RESET SIMULATION
                </button>
              </div>
            </div>

            {/* Support Block */}
            <div className="border border-white/10 bg-black/50 backdrop-blur-md p-8 rounded-lg text-sm text-gray-300 space-y-4">
              <h3 className="text-xl font-bold text-white uppercase tracking-wider text-center border-b border-white/10 pb-4">Soutenir cette initiative & son créateur</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p className="font-semibold text-white">Virement Bancaire</p>
                  <div className="space-y-1 font-mono text-xs">
                    <p><span className="text-gray-500">Compte:</span> Akotse Patrice</p>
                    <p><span className="text-gray-500">Banque:</span> Ecobank Togo</p>
                    <p><span className="text-gray-500">Numéro:</span> 140893314001</p>
                    <p><span className="text-gray-500">Swift:</span> ECOCTGTG</p>
                    <p><span className="text-gray-500">IBAN:</span> TG3205501720140893314001</p>
                    <p><span className="text-gray-500">RIB CLE:</span> 01</p>
                    <p><span className="text-gray-500">Adresse:</span> 20 Avenue Sylvanus Olympio</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-white">Contact & Projets</p>
                  <p className="text-xs">Pour tout don ou proposition de projet, contactez-moi :</p>
                  <div className="space-y-1 font-mono text-xs pt-2">
                    <p>
                      <span className="text-gray-500">Email:</span>{' '}
                      <a href="mailto:patriceakotse61@gmail.com" className="text-blue-400 hover:underline">patriceakotse61@gmail.com</a>
                    </p>
                    <p>
                      <span className="text-gray-500">WhatsApp:</span>{' '}
                      <a href="https://wa.me/+22890787599" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
                        +228 90 78 75 99
                      </a>
                    </p>
                    <p>
                      <span className="text-gray-500">Portfolio:</span>{' '}
                      <a href="https://sefapanel.com/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                        sefapanel.com
                      </a>
                    </p>
                    <p>
                      <span className="text-gray-500">Codeur.com:</span>{' '}
                      <a href="https://www.codeur.com/-patriceatcu1" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">
                        Profil Codeur
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}
