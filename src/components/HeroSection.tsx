'use client';

import React from 'react';
import DefreezeVideoThaw from './DefreezeVideoThaw';
import { ArrowDown, Sparkles, Users, Calendar, MapPin, Zap } from 'lucide-react';

interface HeroSectionProps {
  remainingSpots: number;
  totalSpots: number;
  onReserveClick: () => void;
}

export default function HeroSection({ remainingSpots, totalSpots, onReserveClick }: HeroSectionProps) {
  const percentTaken = Math.round(((totalSpots - remainingSpots) / totalSpots) * 100);

  return (
    <section className="relative min-h-[92vh] pt-28 pb-16 flex items-center justify-center overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-700/15 rounded-full blur-[140px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Copy & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ice-glass border border-cyan-400/30 text-cyan-300 text-xs font-mono font-semibold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>25 SPOTS • PHYSICAL GAME EXPERIENCE • NOVEMBER 2026</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tighter text-white uppercase leading-[1.05]">
            BREAK FREE. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 ice-glow-text">
              BECOME.
            </span>
          </h1>

          {/* Subheading from DEFREEZE brief */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
            What if you&apos;re not stuck because you lack potential? What if fear, overthinking, comparison, or simply not knowing where to start has been keeping you frozen?
          </p>

          <p className="text-sm font-medium text-cyan-200/90 italic">
            &ldquo;You don&apos;t need to have it all together here. Come as you are, leave a little lighter.&rdquo;
          </p>

          {/* Live Spot Countdown Card */}
          <div className="p-4 rounded-2xl ice-glass border border-cyan-500/30 max-w-lg mx-auto lg:mx-0 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                Capacity Status
              </span>
              <span className="font-bold text-cyan-300">
                {remainingSpots} spots remaining of {totalSpots}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/20">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                style={{ width: `${percentTaken}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{percentTaken}% claimed</span>
              <span className="text-emerald-400 font-semibold">Strictly capped at {totalSpots} humans</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
            <button
              onClick={onReserveClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Reserve My Spot Now</span>
            </button>

            <a
              href="#about"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl ice-glass text-slate-200 hover:text-white hover:border-cyan-400/50 text-sm font-semibold transition-all"
            >
              <span>Read The Story</span>
              <ArrowDown className="w-4 h-4" />
            </a>
          </div>

          {/* Quick Info Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
            <div className="text-left">
              <span className="block text-[10px] text-slate-500 font-mono uppercase">Format</span>
              <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
                <Zap className="w-3 h-3 text-cyan-400" /> Physical Games
              </span>
            </div>
            <div className="text-left">
              <span className="block text-[10px] text-slate-500 font-mono uppercase">When</span>
              <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3 text-cyan-400" /> Nov 2026
              </span>
            </div>
            <div className="text-left">
              <span className="block text-[10px] text-slate-500 font-mono uppercase">Location</span>
              <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-cyan-400" /> Curated Venue
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: 1080p Defrosting Video */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <DefreezeVideoThaw
            videoSrc="/videos/breakfree-hero-thaw.mp4"
            size="responsive"
            autoPlay={true}
            loop={true}
            initialMuted={true}
            showControls={false}
          />
        </div>
      </div>
    </section>
  );
}
