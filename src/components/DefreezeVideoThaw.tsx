'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Snowflake, Zap, Sparkles } from 'lucide-react';

interface DefreezeVideoThawProps {
  onEnded?: () => void;
  onProgress?: (percent: number) => void;
  autoPlay?: boolean;
  loop?: boolean;
  initialMuted?: boolean;
  showControls?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'responsive';
}

export default function DefreezeVideoThaw({
  onEnded,
  onProgress,
  autoPlay = true,
  loop = false,
  initialMuted = true,
  showControls = true,
  className = '',
  size = 'md',
}: DefreezeVideoThawProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [progress, setProgress] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const [hasInteractedSound, setHasInteractedSound] = useState(false);

  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;

  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;

    if (autoPlay) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Autoplay blocked or waiting for user interaction:', err);
            setIsPlaying(false);
          });
      }
    }
  }, [autoPlay, isMuted]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !isMuted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    setHasInteractedSound(true);

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    }
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.play();
    setIsPlaying(true);
    setIsEnded(false);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const currentPercent = Math.round((video.currentTime / video.duration) * 100);
    setProgress(currentPercent);

    if (onProgressRef.current) {
      onProgressRef.current(currentPercent);
    }

    // Trigger onEnded when at least 90% played
    if (currentPercent >= 90 && !isEnded && !loop) {
      setIsEnded(true);
      if (onEndedRef.current) {
        onEndedRef.current();
      }
    }
  };

  const handleVideoEnded = () => {
    setIsEnded(true);
    setIsPlaying(false);
    if (!loop && onEndedRef.current) {
      onEndedRef.current();
    }
  };

  const sizeClasses = {
    sm: 'w-64 h-64',
    md: 'w-80 h-80 sm:w-96 sm:h-96',
    lg: 'w-96 h-96 sm:w-[450px] sm:h-[450px]',
    responsive: 'w-full aspect-square max-w-[460px]',
  }[size];

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Outer Cyan Ice Glow Halo */}
      <div
        className="absolute rounded-full transition-all duration-700 pointer-events-none blur-3xl"
        style={{
          width: '110%',
          height: '110%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, rgba(37, 99, 235, 0.15) 60%, transparent 80%)',
          transform: `scale(${1 + (progress / 100) * 0.1})`,
        }}
      />

      {/* Main Video Container */}
      <div
        onClick={togglePlay}
        className={`relative ${sizeClasses} rounded-3xl overflow-hidden ice-glass-glow border border-cyan-400/40 transition-all duration-500 shadow-2xl group flex items-center justify-center cursor-pointer bg-slate-950`}
      >
        <video
          ref={videoRef}
          src="/videos/defrosting-face-thaw.mp4"
          playsInline
          autoPlay={autoPlay}
          loop={loop}
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Ambient Overlay Frost Gradient (melts away as progress increases) */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 bg-gradient-to-t from-[#060913]/80 via-transparent to-transparent"
          style={{ opacity: Math.max(0, 1 - progress / 100) }}
        />

        {/* Unmute / Mute Audio Pill with SFX note */}
        <button
          onClick={toggleMute}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/85 hover:bg-slate-900 border border-cyan-400/50 text-cyan-300 text-xs font-mono font-bold shadow-lg transition-all hover:scale-105 cursor-pointer backdrop-blur-md"
          title={isMuted ? 'Click to enable Defrosting SFX sound' : 'Mute audio'}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>SFX Off (Click for Sound)</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300">SFX Audio On</span>
            </>
          )}
        </button>

        {/* Center Play Overlay Icon when paused */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-opacity z-10">
            <div className="w-16 h-16 rounded-full bg-cyan-500/90 hover:bg-cyan-400 flex items-center justify-center text-slate-950 shadow-xl shadow-cyan-500/50 hover:scale-110 transition-all">
              <Play className="w-8 h-8 fill-current translate-x-0.5" />
            </div>
          </div>
        )}

        {/* Bottom Badge Info Bar */}
        <div className="absolute bottom-3 inset-x-3 z-20 py-1.5 px-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 flex items-center justify-between text-[11px] font-mono">
          <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
            {!isEnded ? (
              <>
                <Snowflake className="w-3.5 h-3.5 animate-spin text-cyan-400" style={{ animationDuration: '4s' }} />
                <span>Defrosting Mind • 1080p SFX</span>
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

      {/* Bottom Controls & Status */}
      {showControls && (
        <div className="mt-4 flex flex-col items-center gap-2 w-full max-w-xs">
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-cyan-500/30">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReplay}
              className="text-[11px] font-mono text-cyan-400/80 hover:text-cyan-300 underline underline-offset-4 cursor-pointer mt-1 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Replay Video ⟲</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
