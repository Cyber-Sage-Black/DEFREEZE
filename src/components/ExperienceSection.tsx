'use client';

import React from 'react';
import Image from 'next/image';
import { MessagesSquare, Users, HeartHandshake, Sparkles, Target, Zap, Calendar, MapPin, ArrowDown } from 'lucide-react';

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
  const percentTaken = Math.round(((totalSpots - remainingSpots) / totalSpots) * 100);

  return (
    <section id="experience" className="relative pt-32 sm:pt-40 pb-20 bg-[#070b18] overflow-hidden">
      {/* Background Ambience Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-cyan-600/10 rounded-full blur-[170px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-700/15 rounded-full blur-[140px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Opening Header */}
        <div className="text-center max-w-4xl mx-auto space-y-5 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ice-glass border border-cyan-400/35 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-wider shadow-md shadow-cyan-500/10">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <MessagesSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>The November 2026 Edition</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[1.1]">
            An Exclusive Physical <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 ice-glow-text">
              Conversation Experience
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            We&apos;re bringing together strictly <span className="text-cyan-400 font-bold">{totalSpots} people</span>. Not just to have conversations, but to connect, challenge ourselves, and take a step towards becoming more intentional.
          </p>

          <p className="text-sm font-medium text-cyan-200/90 italic">
            &ldquo;You don&apos;t need to have it all together here. Come as you are, leave a little lighter.&rdquo;
          </p>

          {/* Quick CTA Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onReserveClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Reserve My Spot (25 Max)</span>
            </button>

            <a
              href="#reserve"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl ice-glass text-slate-200 hover:text-white border border-cyan-500/25 hover:border-cyan-400/50 text-xs font-semibold uppercase tracking-wider transition-all"
            >
              <span>View Live Capacity</span>
              <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
            </a>
          </div>

          {/* Quick Meta Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> Physical Conversations
            </span>
            <span className="flex items-center gap-1.5 text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" /> November 2026
            </span>
            <span className="flex items-center gap-1.5 text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Curated Lagos Venue
            </span>
            <span className="flex items-center gap-1.5 text-cyan-300 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-cyan-500/30">
              <Users className="w-3.5 h-3.5 text-cyan-400" /> {remainingSpots} / {totalSpots} Remaining
            </span>
          </div>
        </div>

        {/* Feature Grid with Flyer on Left, Details on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-10">
          {/* Left Column: Friends Flyer (Breaking the silence) */}
          <div className="lg:col-span-5 relative group order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden ice-glass-glow border border-cyan-500/40 p-3 shadow-2xl">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <Image
                  src="/images/defreeze-flyer-friends.jpg"
                  alt="DEFREEZE - Breaking The Silence"
                  fill
                  priority
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
            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                Think Real Conversations, New Connections &amp; Meaningful Impact
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Most social events feel superficial. DEFREEZE is engineered from the ground up to strip away awkward small talk, dissolve barriers, and ignite authentic brotherhood and sisterhood through structured, immersive real-world conversations.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl ice-glass border border-cyan-500/20 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 mt-1 flex-shrink-0">
                  <MessagesSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">Curated Interactive Conversations</h4>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-relaxed">
                    Dynamic group challenges designed to test decision-making, stimulate strategic thinking, and provoke laughter and teamwork.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl ice-glass border border-cyan-500/20 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300 mt-1 flex-shrink-0">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">No-Judgment Honest Conversations</h4>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-relaxed">
                    Facilitated prompts that allow you to express fears, articulate ambitions, and realize that you are never as alone as you thought.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl ice-glass border border-cyan-500/20 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 mt-1 flex-shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">Accountability That Lasts</h4>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-relaxed">
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
                <span className="text-base sm:text-lg font-black text-white">
                  Only {remainingSpots} of {totalSpots} spots left ({percentTaken}% claimed)
                </span>
              </div>

              <button
                onClick={onReserveClick}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
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
