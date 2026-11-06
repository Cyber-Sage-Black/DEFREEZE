'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Sparkles, Flame, Snowflake, Zap } from 'lucide-react';

interface DefreezeHumanThawProps {
  onThawed?: () => void;
  autoThaw?: boolean;
  interactive?: boolean;
  showControls?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function DefreezeHumanThaw({
  onThawed,
  autoThaw = true,
  interactive = true,
  showControls = true,
  className = '',
  size = 'md',
}: DefreezeHumanThawProps) {
  const [progress, setProgress] = useState(0);
  const [isThawed, setIsThawed] = useState(false);
  const progressRef = useRef(0);
  const onThawedRef = useRef(onThawed);
  onThawedRef.current = onThawed;

  useEffect(() => {
    if (!autoThaw) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + 2);
        progressRef.current = next;
        if (next >= 100 && !isThawed) {
          setIsThawed(true);
          if (onThawedRef.current) {
            onThawedRef.current();
          }
        }
        return next;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [autoThaw, isThawed]);

  const handleManualThaw = () => {
    setProgress(100);
    progressRef.current = 100;
    setIsThawed(true);
    if (onThawed) onThawed();
  };

  // Dimensions based on size
  const sizeClasses = {
    sm: 'w-64 h-64',
    md: 'w-80 h-80 sm:w-96 sm:h-96',
    lg: 'w-96 h-96 sm:w-[450px] sm:h-[450px]',
  }[size];

  const thawFactor = progress / 100; // 0 to 1

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Outer Glow Halo */}
      <div
        className="absolute rounded-full transition-all duration-700 pointer-events-none blur-3xl"
        style={{
          width: '110%',
          height: '110%',
          background: `radial-gradient(circle, rgba(56, 189, 248, ${0.15 + thawFactor * 0.45}) 0%, rgba(37, 99, 235, ${0.1 + thawFactor * 0.3}) 60%, transparent 80%)`,
          transform: `scale(${1 + thawFactor * 0.15})`,
        }}
      />

      {/* Main Frozen Human Display Container */}
      <div
        className={`relative ${sizeClasses} rounded-3xl overflow-hidden ice-glass-glow border transition-all duration-500 shadow-2xl group flex items-center justify-center`}
        style={{
          borderColor: `rgba(56, 189, 248, ${0.3 + thawFactor * 0.5})`,
          boxShadow: `0 0 ${20 + thawFactor * 40}px rgba(56, 189, 248, ${0.2 + thawFactor * 0.4})`,
        }}
      >
        {/* Base Image of Frozen Human with Dynamic Thaw Filters */}
        <div className="relative w-full h-full">
          <Image
            src="/images/defreeze-frozen-human.jpg"
            alt="Human Thawing and Breaking Free from Ice"
            fill
            priority
            className="object-cover transition-all duration-300"
            style={{
              // Deep frozen icy look when progress is low -> vibrant, warm, crystal clear as it thaws
              filter: `brightness(${0.75 + thawFactor * 0.45}) contrast(${1.2 - thawFactor * 0.15}) saturate(${0.7 + thawFactor * 0.6})`,
              transform: `scale(${1.02 + Math.sin(thawFactor * Math.PI) * 0.05})`,
            }}
          />

          {/* Frost / Ice Crust Overlay (fades out as it melts) */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500 bg-gradient-to-t from-[#060913]/90 via-[#0a1b38]/40 to-transparent"
            style={{ opacity: Math.max(0, 1 - thawFactor * 1.2) }}
          />

          {/* Electric Thawing Light Aura radiating through the cracks */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-screen"
            style={{
              opacity: thawFactor * 0.85,
              background: `radial-gradient(circle at 45% 45%, rgba(56, 189, 248, ${thawFactor * 0.9}) 0%, rgba(99, 102, 241, ${thawFactor * 0.4}) 50%, transparent 75%)`,
            }}
          />

          {/* Floating Ice Shards Breaking Free (Visual Animation) */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const distance = 40 + thawFactor * 90;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            const sizePx = 6 + (i % 4) * 4;

            return (
              <div
                key={i}
                className="absolute pointer-events-none rounded-sm bg-gradient-to-br from-cyan-200 via-sky-300 to-transparent border border-cyan-300/80 shadow-sm shadow-cyan-400 transition-all duration-300"
                style={{
                  top: `calc(50% + ${y}px)`,
                  left: `calc(50% + ${x}px)`,
                  width: `${sizePx}px`,
                  height: `${sizePx * 1.5}px`,
                  transform: `translate(-50%, -50%) rotate(${i * 30 + thawFactor * 180}deg)`,
                  opacity: 0.3 + thawFactor * 0.7,
                }}
              />
            );
          })}

          {/* Inner Light Beams / Sunburst when thawing */}
          {thawFactor > 0.6 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-48 h-48 rounded-full bg-cyan-400/20 blur-xl animate-ping"
                style={{ animationDuration: '3s' }}
              />
            </div>
          )}

          {/* Bottom Badge Over Image */}
          <div className="absolute bottom-3 inset-x-3 z-10 py-1.5 px-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 flex items-center justify-between text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
              {progress < 100 ? (
                <>
                  <Snowflake className="w-3.5 h-3.5 animate-spin text-cyan-400" style={{ animationDuration: '4s' }} />
                  <span>Frozen Mind Thawing...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-yellow-400 animate-bounce" />
                  <span className="text-white font-black">THAWED • UNLOCKED</span>
                </>
              )}
            </span>
            <span className="text-cyan-400 font-bold">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Thaw Progress Controls */}
      {showControls && (
        <div className="mt-4 flex flex-col items-center gap-2 w-full max-w-xs">
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-cyan-500/30">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>

          {progress < 100 && (
            <button
              onClick={handleManualThaw}
              className="text-[11px] font-mono text-cyan-400/80 hover:text-cyan-300 underline underline-offset-4 cursor-pointer mt-1"
            >
              Skip thawing animation →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
