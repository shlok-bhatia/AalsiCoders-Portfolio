'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';

// Scene timestamp config (seconds into the video)
const SCENES = [
  { start: 0,    label: 'Helicopter Approach' },
  { start: 0.22, label: 'Team Jump' },
  { start: 0.48, label: 'Landing' },
  { start: 0.72, label: 'Entering HQ' },
];

export default function ScrollVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const lastSeekRef = useRef<number>(0);

  const {
    phase,
    setPhase,
    setVideoReady,
    setScrollProgress,
    videoReady,
  } = useAppStore();

  // RAF-throttled seek — prevents hammering the decoder
  const seekVideo = useCallback((progress: number) => {
    const now = performance.now();
    if (now - lastSeekRef.current < 14) return; // ~60fps throttle
    lastSeekRef.current = now;

    const video = videoRef.current;
    if (!video || !video.duration) return;
    const target = progress * video.duration;
    if (Math.abs(video.currentTime - target) > 0.04) {
      video.currentTime = target;
    }
  }, []);

  // Scroll handler
  useEffect(() => {
    if (phase !== 'cinematic') return;

    const onScroll = () => {
      rafRef.current = requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;

        const scrollTop = window.scrollY;
        const maxScroll = container.scrollHeight - window.innerHeight;
        
        // Only calculate progress if container is actually scrollable
        if (maxScroll <= 0) return;
        
        const progress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);

        setScrollProgress(progress);
        seekVideo(progress);

        // Trigger transition when scroll hits 98% (and user has actually scrolled)
        if (progress >= 0.98 && scrollTop > 100) {
          setPhase('transition');
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [phase, seekVideo, setScrollProgress, setPhase]);

  // Video ready handler
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let timedOut = false;

    const bypassCinematic = () => {
      console.warn("Cinematic video failed to load or timed out. Bypassing cinematic phase.");
      setVideoReady(true);
      setPhase('transition');
    };

    const onCanPlay = () => {
      if (timedOut) return;
      setVideoReady(true);
      setPhase('cinematic');
    };

    const onLoadedData = () => {
      if (timedOut) return;
      video.currentTime = 0;
    };

    const onError = () => {
      bypassCinematic();
    };

    // 10s safety timeout for slow networks or 404s (increased for large video files)
    const timeoutId = setTimeout(() => {
      timedOut = true;
      bypassCinematic();
    }, 10000);

    video.addEventListener('canplaythrough', onCanPlay);
    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('error', onError);
    
    // Also listen to source elements for errors
    const sources = video.querySelectorAll('source');
    sources.forEach(src => {
      src.addEventListener('error', onError);
    });

    video.load();

    return () => {
      clearTimeout(timeoutId);
      video.removeEventListener('canplaythrough', onCanPlay);
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('error', onError);
      sources.forEach(src => {
        src.removeEventListener('error', onError);
      });
    };
  }, [setVideoReady, setPhase]);

  // Current scene label from scroll progress
  const { scrollProgress } = useAppStore();
  const currentScene = SCENES.reduce((acc, scene) => {
    return scrollProgress >= scene.start ? scene : acc;
  }, SCENES[0]);

  const isVisible = phase === 'cinematic' || phase === 'loading';
  if (!isVisible) return null;

  return (
    <>
      {/* Cinematic letterbox */}
      <div className="letterbox-top" style={{ opacity: videoReady ? 1 : 0 }} />
      <div className="letterbox-bottom" style={{ opacity: videoReady ? 1 : 0 }} />

      {/* Scroll progress bar */}
      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      {/* Scene label */}
      {videoReady && (
        <div
          className="fixed bottom-20 left-1/2 z-50 pointer-events-none"
          style={{
            transform: 'translateX(-50%)',
            opacity: 0.6,
            transition: 'opacity 0.5s',
          }}
        >
          <div
            className="text-xs tracking-[0.3em] uppercase font-mono"
            style={{ color: '#00aaff' }}
          >
            {currentScene.label}
          </div>
        </div>
      )}

      {/* Scroll hint */}
      {videoReady && scrollProgress < 0.02 && (
        <div
          className="fixed bottom-12 left-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none"
          style={{ transform: 'translateX(-50%)' }}
        >
          <div className="text-xs text-gray-500 tracking-widest font-mono">
            SCROLL TO CONTINUE
          </div>
          <div
            className="w-px h-8"
            style={{
              background: 'linear-gradient(to bottom, #00aaff, transparent)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
        </div>
      )}

      {/* Scroll container */}
      <div
        ref={containerRef}
        id="scroll-container"
        style={{ height: '600vh', position: 'relative' }}
      >
        {/* Sticky video wrapper */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <video
            ref={videoRef}
            id="cinematic-video"
            preload="auto"
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              opacity: videoReady ? 1 : 0,
              transition: 'opacity 0.8s ease',
            }}
          >
            {/* Video file from /public/videos/ */}
            <source src="/videos/cinematic.mp4" type="video/mp4" />
          </video>

          {/* Subtle vignette overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse at center, transparent 50%, rgba(2,4,8,0.6) 100%),
                linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.5) 100%)
              `,
            }}
          />
        </div>
      </div>
    </>
  );
}
