'use client';

import React from 'react';
import Image from 'next/image';
import { HelpCircle, CheckCircle, Flame, Snowflake, ShieldAlert } from 'lucide-react';

export default function ManifestoSection() {
  return (
    <section id="about" className="relative py-24 border-t border-cyan-500/10 bg-[#060913] overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full ice-glass border border-cyan-400/30 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-wider">
            <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
            <span>The DEFREEZE Manifesto</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            What If You&apos;re Not Stuck Because You Lack Potential?
          </h2>

          <p className="text-slate-400 text-base sm:text-lg">
            Having potential is one thing. Giving yourself the opportunity and the right environment to use it is another.
          </p>
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-20">
          {/* Left Column: Deep narrative */}
          <div className="lg:col-span-7 space-y-6 text-slate-300 text-base sm:text-lg leading-relaxed">
            <div className="p-6 rounded-2xl ice-glass border border-cyan-500/20 space-y-4">
              <p className="font-semibold text-white text-xl">
                You have dreams. Ideas. Plans.
              </p>
              <p>
                You know you&apos;re capable of more, but somehow, taking that first step isn&apos;t always easy.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-slate-300">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Afraid of failing or looking unprepared</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Comparing progress to everyone else on social media</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Overwhelmed by pressure to have life all figured out</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Simply stuck waiting for the &quot;perfect time&quot;</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pl-2 border-l-2 border-cyan-400/40">
              <p className="text-white font-medium text-lg italic">
                &ldquo;So you keep waiting. For the right time, the right opportunity, or the moment you finally feel ready.&rdquo;
              </p>
              <p className="text-slate-300">
                But what if you don&apos;t need to have everything figured out before you start moving? What if the first step isn&apos;t having all the answers, but being willing to ask better questions?
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 to-slate-900/80 border border-cyan-400/30">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm uppercase tracking-wider mb-2">
                <Flame className="w-4 h-4 text-cyan-400" />
                <span>That is where DEFREEZE comes in</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                DEFREEZE is an initiative for young people who want to break free from the fears, expectations, limiting beliefs, and habits that keep them stuck. It&apos;s a space to challenge your thinking, understand yourself better, explore new possibilities, and turn your potential into tangible action.
              </p>
            </div>
          </div>

          {/* Right Column: Visual Flyer Card 1 (Ice Head Flyer) */}
          <div className="lg:col-span-5 relative group">
            <div className="relative rounded-3xl overflow-hidden ice-glass-glow border border-cyan-500/40 p-3 shadow-2xl">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <Image
                  src="/images/defreeze-flyer-ice.jpg"
                  alt="DEFREEZE - It's okay to thaw"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 text-center space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
                  Official Visual • Concept Art
                </span>
                <p className="text-sm font-bold text-white">
                  &ldquo;You don&apos;t need to have it all together here.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Call-out Pillars of the DEFREEZE Mindset */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl ice-glass border border-cyan-500/20 hover:border-cyan-400/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">
              Thaw The Overthinking
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Action cures fear. You don&apos;t need to be the most confident person in the room—just willing to question where you are and take responsibility for where you&apos;re going.
            </p>
          </div>

          <div className="p-6 rounded-2xl ice-glass border border-cyan-500/20 hover:border-cyan-400/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">
              Growth Isn&apos;t A Lonely Journey
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Sometimes all you need is a different environment, a new perspective, and people who are just as intentional about growth as you want to be.
            </p>
          </div>

          <div className="p-6 rounded-2xl ice-glass border border-cyan-500/20 hover:border-cyan-400/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">
              Break Free. Become.
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              It&apos;s time to thaw out. It&apos;s time to move. It&apos;s time to become. Come ready to play, connect, think differently, and move.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
