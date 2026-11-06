'use client';

import React from 'react';
import Image from 'next/image';
import { Gamepad2, Users, HeartHandshake, Sparkles, Target, ShieldCheck } from 'lucide-react';

interface ExperienceSectionProps {
  remainingSpots: number;
  totalSpots: number;
  onReserveClick: () => void;
}

export default function ExperienceSection({
  remainingSpots,
  totalSpots,
  onReserveClick,
}: ExperienceSectionProps) {
  return (
    <section id="experience" className="relative py-24 border-t border-cyan-500/10 bg-[#070b18] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full ice-glass border border-cyan-400/30 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-wider">
            <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>The November 2026 Edition</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            An Exclusive Physical Game Experience
          </h2>

          <p className="text-slate-300 text-base sm:text-lg">
            We&apos;re bringing together strictly <span className="text-cyan-400 font-bold">{totalSpots} people</span>. Not just to play games, but to connect, challenge ourselves, and take a step towards becoming more intentional.
          </p>
        </div>

        {/* Feature Grid with Image on Left, Details on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          {/* Left Column: Friends Flyer (Breaking the silence) */}
          <div className="lg:col-span-5 relative group order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden ice-glass-glow border border-cyan-500/40 p-3 shadow-2xl">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <Image
                  src="/images/defreeze-flyer-friends.jpg"
                  alt="DEFREEZE - Breaking The Silence"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 text-center space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
                  Community • Real Connection
                </span>
                <p className="text-sm font-bold text-white">
                  &ldquo;Breaking the silence. Come as you are, leave a little lighter.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: What to Expect Breakdown */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                Think Games, New Connections &amp; Meaningful Impact
              </h3>
              <p className="text-slate-300 text-base leading-relaxed">
                Most social events feel superficial. DEFREEZE is engineered from the ground up to strip away awkward small talk, dissolve barriers, and ignite authentic brotherhood and sisterhood through structured, immersive real-world games.
              </p>
            </div>

            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl ice-glass border border-cyan-500/20 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 mt-1 flex-shrink-0">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Curated Interactive Games</h4>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                    Dynamic group challenges designed to test decision-making, stimulate strategic thinking, and provoke laughter and teamwork.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl ice-glass border border-cyan-500/20 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300 mt-1 flex-shrink-0">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">No-Judgment Honest Conversations</h4>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                    Facilitated prompts that allow you to express fears, articulate ambitions, and realize that you are never as alone as you thought.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl ice-glass border border-cyan-500/20 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 mt-1 flex-shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Accountability That Lasts</h4>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                    You leave with dedicated growth partners who will check in, push you, and celebrate your wins as you crush your frozen goals.
                  </p>
                </div>
              </div>
            </div>

            {/* Capacity callout */}
            <div className="p-5 rounded-2xl bg-cyan-950/40 border border-cyan-400/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
                  Limited Enrollment
                </span>
                <span className="text-lg font-black text-white">
                  Only {remainingSpots} of {totalSpots} spots left
                </span>
              </div>

              <button
                onClick={onReserveClick}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                Secure Spot
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
