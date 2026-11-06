'use client';

import React, { useState } from 'react';
import ThreeDefreezeMind from './ThreeDefreezeMind';
import { Sparkles, ArrowRight, Snowflake } from 'lucide-react';

interface SplashModalProps {
  isOpen: boolean;
  onEnter: () => void;
}

export default function SplashModal({ isOpen, onEnter }: SplashModalProps) {
  const [canEnter, setCanEnter] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#040711]/95 backdrop-blur-2xl transition-all duration-700">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-600/15 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[140px]" />
        
        {/* Subtle Diagonal Tape Ribbon like the flyer */}
        <div className="absolute top-12 -left-20 -right-20 py-1.5 -rotate-3 bg-blue-700/80 text-white font-black tracking-widest text-xs uppercase flex justify-around select-none opacity-40">
          <span>ANTICIPATE</span>
          <span>•</span>
          <span>BREAK FREE</span>
          <span>•</span>
          <span>ANTICIPATE</span>
          <span>•</span>
          <span>BECOME</span>
          <span>•</span>
          <span>ANTICIPATE</span>
        </div>
      </div>

      <div className="relative w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center justify-center text-center z-10">
        {/* Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full ice-glass border border-cyan-400/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3 animate-pulse">
          <Snowflake className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          <span>It&apos;s okay to thaw</span>
        </div>

        {/* Brand Headline */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase drop-shadow-2xl">
          DE<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 ice-glow-text">FREEZE</span>
        </h1>

        <p className="mt-2 text-sm md:text-base font-medium text-slate-300 max-w-md">
          You don&apos;t need to have it all together here. <br />
          <span className="text-cyan-300 italic font-normal">Come as you are, leave a little lighter.</span>
        </p>

        {/* 3D Thawing Mind Canvas Container */}
        <div className="w-full max-w-md h-72 md:h-80 my-2 relative">
          <ThreeDefreezeMind
            interactive={true}
            autoThaw={true}
            showControls={true}
            onThawed={() => setCanEnter(true)}
          />
        </div>

        {/* Enter Button (reveals upon thawing, or immediately accessible for impatient users) */}
        <div className="mt-4 flex flex-col items-center gap-2 min-h-[64px]">
          {canEnter ? (
            <button
              onClick={onEnter}
              className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-xl font-bold text-white text-base bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/45 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 text-cyan-200 group-hover:rotate-12 transition-transform" />
              <span>Enter DEFREEZE</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-slate-400 tracking-wider uppercase animate-pulse">
                Thawing mental freeze...
              </span>
              <button
                onClick={() => {
                  setCanEnter(true);
                  onEnter();
                }}
                className="text-xs text-cyan-400/80 hover:text-cyan-300 underline underline-offset-4 transition-colors"
              >
                Skip animation &amp; enter
              </button>
            </div>
          )}
        </div>

        <p className="mt-6 text-[11px] text-slate-500 tracking-wide uppercase">
          Exclusive Physical Game Experience • Lagos • November 2026
        </p>
      </div>
    </div>
  );
}
