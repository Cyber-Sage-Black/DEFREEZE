'use client';

import React, { useState, useEffect } from 'react';
import DefreezeVideoThaw from './DefreezeVideoThaw';
import Image from 'next/image';
import { Sparkles, ArrowRight, Snowflake } from 'lucide-react';

interface SplashModalProps {
  isOpen: boolean;
  onEnter: () => void;
  onDirectEnter?: () => void;
}

export default function SplashModal({ isOpen, onEnter, onDirectEnter }: SplashModalProps) {
  const [canEnter, setCanEnter] = useState(false);
  const [rememberChoice, setRememberChoice] = useState(false);

  const handleThawed = React.useCallback(() => {
    setCanEnter(true);
  }, []);

  const handleEnterClick = () => {
    if (rememberChoice && typeof window !== 'undefined') {
      localStorage.setItem('defreeze_skip_popups', 'true');
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('defreeze_unmute_audio'));
    }
    onEnter();
  };

  const handleDirectSkip = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('defreeze_skip_popups', 'true');
      localStorage.setItem('defreeze_questionnaire_completed', 'true');
      window.dispatchEvent(new Event('defreeze_unmute_audio'));
    }
    if (onDirectEnter) {
      onDirectEnter();
    } else {
      onEnter();
    }
  };

  useEffect(() => {
    // Failsafe timer so visitors on strict media devices can always proceed after a few seconds
    const timer = setTimeout(() => {
      setCanEnter(true);
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#040711]/95 backdrop-blur-2xl transition-all duration-700 overflow-y-auto py-8">
      {/* Top Right Quick Skip Button for repeat users */}
      <button
        onClick={handleDirectSkip}
        className="absolute top-4 right-4 z-30 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-cyan-400/30 text-cyan-300 hover:text-white text-xs font-mono font-medium transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
        title="Directly enter website (skips intro & questionnaire)"
      >
        <span>Skip Directly to Website</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-600/15 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[140px]" />
        
        {/* Diagonal Tape Ribbon from flyer */}
        <div className="absolute top-10 -left-20 -right-20 py-2 -rotate-2 bg-blue-800/80 text-white font-black tracking-widest text-xs uppercase flex justify-around select-none opacity-50 shadow-md">
          <span>ANTICIPATE</span>
          <span>•</span>
          <span>BREAK FREE</span>
          <span>•</span>
          <span>IT&apos;S OKAY TO THAW</span>
          <span>•</span>
          <span>BECOME</span>
          <span>•</span>
          <span>ANTICIPATE</span>
        </div>
      </div>

      <div className="relative w-full max-w-4xl mx-auto px-4 flex flex-col items-center justify-center text-center z-10 my-auto">
        {/* Brand Tagline Badge with Logo */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full ice-glass border border-cyan-400/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3 animate-pulse">
          <div className="w-5 h-5 relative rounded-full overflow-hidden border border-cyan-400/60">
            <Image src="/images/defreeze-logo.png" alt="DEFREEZE Logo" fill className="object-cover" />
          </div>
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

        {/* Entrance Video: 1080p Defrosting Face with SFX */}
        <div className="my-4 relative">
          <DefreezeVideoThaw
            size="md"
            autoPlay={true}
            loop={false}
            initialMuted={false}
            showControls={true}
            onEnded={handleThawed}
          />
        </div>

        {/* Enter Button */}
        <div className="mt-2 flex flex-col items-center gap-2 min-h-[58px]">
          {canEnter ? (
            <button
              onClick={handleEnterClick}
              className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-xl font-black text-white text-base bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-cyan-200 group-hover:rotate-12 transition-transform" />
              <span>Enter DEFREEZE</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-xs text-slate-400 tracking-wider uppercase animate-pulse flex items-center gap-1.5">
                <Snowflake className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                Thawing mental freeze...
              </span>
              <button
                onClick={() => {
                  setCanEnter(true);
                  handleEnterClick();
                }}
                className="text-xs text-cyan-400/80 hover:text-cyan-300 underline underline-offset-4 transition-colors cursor-pointer"
              >
                Skip animation &amp; enter
              </button>
            </div>
          )}
        </div>

        {/* Repeat User Preferences & Direct Skip Link */}
        <div className="mt-3 flex flex-col items-center gap-2">
          <label className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberChoice}
              onChange={(e) => setRememberChoice(e.target.checked)}
              className="w-3.5 h-3.5 rounded accent-cyan-400 bg-slate-800 border-slate-700 cursor-pointer"
            />
            <span>Remember this device • Don&apos;t show intro on return visits</span>
          </label>

          <button
            type="button"
            onClick={handleDirectSkip}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-4 cursor-pointer transition-colors"
          >
            Already visited? Skip directly to website &rarr;
          </button>
        </div>

        <p className="mt-4 text-[11px] text-slate-500 tracking-wide uppercase">
          Exclusive Physical Conversation Experience • 25 Spots • November 2026
        </p>
      </div>
    </div>
  );
}
