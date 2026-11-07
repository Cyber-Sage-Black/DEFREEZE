'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserCheck, Shield } from 'lucide-react';

interface NavbarProps {
  remainingSpots: number;
  totalSpots: number;
  onReserveClick: () => void;
}

export default function Navbar({ remainingSpots, totalSpots, onReserveClick }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 ice-glass border-b border-cyan-500/20 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand with Official Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 relative rounded-full overflow-hidden border-2 border-cyan-400/60 shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
            <Image
              src="/images/defreeze-logo.png"
              alt="DEFREEZE Official Logo"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <span className="text-xl font-black tracking-tighter text-white uppercase flex items-center gap-1">
              DE<span className="text-cyan-400 ice-glow-text">FREEZE</span>
            </span>
            <span className="hidden sm:block text-[10px] text-cyan-300 font-medium tracking-wider -mt-1">
              It&apos;s okay to thaw.
            </span>
          </div>
        </Link>

        {/* Center / Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold tracking-wider uppercase text-slate-300">
          <Link href="/#about" className="hover:text-cyan-400 transition-colors">
            Manifesto
          </Link>
          <Link href="/#experience" className="hover:text-cyan-400 transition-colors">
            The Conversation
          </Link>
          <Link href="/#pillars" className="hover:text-cyan-400 transition-colors">
            Pillars
          </Link>
          <Link href="/info" className="hover:text-cyan-400 transition-colors text-cyan-300 flex items-center gap-1">
            <span>More Info</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-700/60 text-cyan-300">New Tab</span>
          </Link>
        </nav>

        {/* Right CTA & Spots Left Badge */}
        <div className="flex items-center gap-3">
          {/* Spots Counter Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/70 border border-cyan-400/30 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300">
              Spots:{' '}
              <strong className="text-cyan-300 font-bold">
                {remainingSpots} / {totalSpots}
              </strong>
            </span>
          </div>

          {/* Reserve CTA */}
          <button
            onClick={onReserveClick}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Reserve Spot</span>
          </button>

          {/* Admin Link */}
          <Link
            href="/admin"
            title="Admin Review Portal"
            className="p-2 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-slate-800/40 transition-colors"
          >
            <Shield className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
