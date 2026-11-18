'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  UserCheck, 
  Menu, 
  X, 
  Sparkles, 
  BookOpen, 
  MessageSquare, 
  Layers, 
  Info,
  ChevronRight 
} from 'lucide-react';

interface NavbarProps {
  remainingSpots: number;
  totalSpots: number;
  onReserveClick: () => void;
}

export default function Navbar({ remainingSpots, totalSpots, onReserveClick }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
  };

  const handleMobileReserveClick = () => {
    setMobileMenuOpen(false);
    onReserveClick();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#050713]/95 backdrop-blur-xl border-b border-cyan-500/25 px-4 lg:px-8 py-3 transition-all shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand with Official Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group" onClick={handleMobileNavClick}>
          <div className="w-8 h-8 sm:w-9 sm:h-9 relative rounded-full overflow-hidden border-2 border-cyan-400/60 shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform flex-shrink-0">
            <Image
              src="/images/defreeze-logo.png"
              alt="DEFREEZE Official Logo"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <span className="text-lg sm:text-xl font-black tracking-tighter text-white uppercase flex items-center gap-1">
              DE<span className="text-cyan-400 ice-glow-text">FREEZE</span>
            </span>
            <span className="hidden sm:block text-[10px] text-cyan-300 font-medium tracking-wider -mt-1">
              It&apos;s okay to thaw.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold tracking-wider uppercase text-slate-300">
          <Link href="/#experience" className="hover:text-cyan-400 transition-colors">
            The Conversation
          </Link>
          <Link href="/#reserve" className="hover:text-cyan-400 transition-colors">
            Reserve Spot
          </Link>
          <Link href="/#about" className="hover:text-cyan-400 transition-colors">
            Manifesto
          </Link>
          <Link href="/info" className="hover:text-cyan-400 transition-colors">
            More Info
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Spots Counter Badge (Desktop / Tablet) */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/70 border border-cyan-400/30 text-xs font-mono flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300">
              Spots:{' '}
              <strong className="text-cyan-300 font-bold">
                {remainingSpots} / {totalSpots}
              </strong>
            </span>
          </div>

          {/* Reserve CTA Button */}
          <button
            onClick={onReserveClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer flex-shrink-0"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reserve Spot</span>
            <span className="sm:hidden">Reserve</span>
          </button>

          {/* Mobile Hamburger / Sandwich Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden items-center justify-center w-9 h-9 rounded-xl bg-slate-900/90 border border-cyan-400/50 text-cyan-300 hover:text-white hover:bg-slate-800 transition-all shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer flex-shrink-0"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-cyan-300" />
            ) : (
              <Menu className="w-5 h-5 text-cyan-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[57px] left-0 right-0 bg-[#050818]/98 backdrop-blur-2xl border-b border-cyan-500/30 shadow-2xl p-5 space-y-4 animate-in slide-in-from-top-3 duration-200 z-50">
          {/* Mobile Spots Status Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-blue-950/60 border border-cyan-500/20 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300">Live Capacity:</span>
            </div>
            <span className="text-cyan-300 font-bold">
              {remainingSpots} of {totalSpots} spots remaining
            </span>
          </div>

          {/* Mobile Links List */}
          <nav className="flex flex-col space-y-1 text-sm font-semibold text-slate-200">
            <Link
              href="/#experience"
              onClick={handleMobileNavClick}
              className="flex items-center justify-between px-3.5 py-3 rounded-xl hover:bg-cyan-500/10 hover:text-cyan-300 border border-transparent hover:border-cyan-500/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>The Conversation</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>

            <Link
              href="/#reserve"
              onClick={handleMobileNavClick}
              className="flex items-center justify-between px-3.5 py-3 rounded-xl hover:bg-cyan-500/10 hover:text-cyan-300 border border-transparent hover:border-cyan-500/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Claim Your Spot</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>

            <Link
              href="/#about"
              onClick={handleMobileNavClick}
              className="flex items-center justify-between px-3.5 py-3 rounded-xl hover:bg-cyan-500/10 hover:text-cyan-300 border border-transparent hover:border-cyan-500/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>The Manifesto</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>

            <Link
              href="/info"
              onClick={handleMobileNavClick}
              className="flex items-center justify-between px-3.5 py-3 rounded-xl hover:bg-cyan-500/10 hover:text-cyan-300 border border-transparent hover:border-cyan-500/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>Event Info &amp; Curators</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>
          </nav>

          {/* Full-width Mobile Reserve Button */}
          <button
            onClick={handleMobileReserveClick}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Claim Your Spot (Strictly 25)</span>
          </button>
        </div>
      )}
    </header>
  );
}
