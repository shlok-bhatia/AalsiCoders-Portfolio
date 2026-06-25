
'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

const SCENES = [
  { start: 0,    label: 'Helicopter Approach' },
  { start: 0.22, label: 'Team Jump' },
  { start: 0.48, label: 'Landing' },
  { start: 0.72, label: 'Entering HQ' },
];

export default function ScrollVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const transitionTriggeredRef = useRef(false);

  // ── Fast-path refs (no React re-renders) ──────────────────────────
  const progressRef = useRef(0);        // raw scroll progress 0-1
  const maxScrollRef = useRef(1);       // cached scrollHeight - innerHeight
  const rafRunning = useRef(false);     // is the RAF loop alive?
  const endZoomRef = useRef(0);         // zoom factor for the last 15%
  const zoomDivRef = useRef<HTMLDivElement>(null);
  const darkOverlayRef = useRef<HTMLDivElement>(null);

  const [localProgress, setLocalProgress] = useState(0);
  const [endZoom, setEndZoom] = useState(0);

  const { phase, setPhase, setVideoReady, setScrollProgress, videoReady } = useAppStore();

  // ── Cache maxScroll on mount + resize (avoids layout thrash) ──────
  const recalcMaxScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    maxScrollRef.current = Math.max(container.scrollHeight - window.innerHeight, 1);
  }, []);

  // ── Dedicated RAF loop: ONLY seeks the video ─────────────────────
  const tick = useCallback(() => {
    if (!rafRunning.current) return;

    const video = videoRef.current;
    if (video && video.duration) {
      const target = progressRef.current * video.duration;
      // Only seek if the delta is meaningful (>1 frame at 30fps)
      if (Math.abs(video.currentTime - target) > 0.03) {
        video.currentTime = target;
      }
    }

    // Direct DOM writes for zoom (bypass React entirely)
    const zoom = endZoomRef.current;
    if (zoomDivRef.current) {
      zoomDivRef.current.style.transform = `scale(${1 + zoom * 0.08})`;
    }
    if (darkOverlayRef.current) {
      darkOverlayRef.current.style.opacity = `${zoom}`;
    }

    requestAnimationFrame(tick);
  }, []);

  // ── Scroll handler: lightweight, no RAF wrapping ──────────────────
  useEffect(() => {
    if (phase !== 'cinematic') return;

    // Start the RAF loop
    rafRunning.current = true;
    recalcMaxScroll();
    requestAnimationFrame(tick);

    // Throttled store update (~10fps) for UI elements (progress bar, scene label)
    let storeTimerId: ReturnType<typeof setInterval> | null = null;
    storeTimerId = setInterval(() => {
      const p = progressRef.current;
      setScrollProgress(p);
      setLocalProgress(p);
      setEndZoom(endZoomRef.current);
    }, 100);

    const onScroll = () => {
      // Fast reads — scrollY is always cheap; maxScroll is pre-cached
      const progress = Math.min(Math.max(window.scrollY / maxScrollRef.current, 0), 1);
      progressRef.current = progress;

      // Compute zoom (pure math, no DOM)
      endZoomRef.current = progress >= 0.85
        ? Math.min((progress - 0.85) / 0.12, 1)
        : 0;

      // Transition trigger (one-shot)
      if (progress >= 0.99 && window.scrollY > 100 && !transitionTriggeredRef.current) {
        transitionTriggeredRef.current = true;
        document.body.style.overflow = 'hidden';

        const video = videoRef.current;
        if (video) {
          video.onended = () => setPhase('transition');
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => setPhase('transition'));
          }
          setTimeout(() => setPhase('transition'), 3000);
        } else {
          setPhase('transition');
        }
      }
    };

    const onResize = () => recalcMaxScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      rafRunning.current = false;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (storeTimerId) clearInterval(storeTimerId);
    };
  }, [phase, tick, recalcMaxScroll, setScrollProgress, setPhase]);

  // ── Video ready handler (unchanged) ───────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let timedOut = false;
    let timeoutId: NodeJS.Timeout;

    const bypassCinematic = () => {
      console.warn('[ScrollVideo] Video failed or timed out. Bypassing.');
      clearTimeout(timeoutId);
      setVideoReady(true);
      setPhase('transition');
    };

    const onCanPlay = () => {
      if (timedOut) return;
      clearTimeout(timeoutId);
      setVideoReady(true);
      setPhase('cinematic');
    };

    const onLoadedData = () => {
      if (timedOut) return;
      video.currentTime = 0;
    };

    const onError = () => bypassCinematic();

    timeoutId = setTimeout(() => {
      timedOut = true;
      bypassCinematic();
    }, 10000);

    video.addEventListener('canplaythrough', onCanPlay);
    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('error', onError);

    const sources = video.querySelectorAll('source');
    sources.forEach(src => src.addEventListener('error', onError));

    video.load();

    return () => {
      clearTimeout(timeoutId);
      video.removeEventListener('canplaythrough', onCanPlay);
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('error', onError);
      sources.forEach(src => src.removeEventListener('error', onError));
    };
  }, [setVideoReady, setPhase]);

  // ── Derived UI state (reads from throttled localProgress) ─────────
  const currentScene = SCENES.reduce((acc, scene) => {
    return localProgress >= scene.start ? scene : acc;
  }, SCENES[0]);

  const isVisible = phase === 'cinematic' || phase === 'loading' || phase === 'transition';
  if (!isVisible) return null;

  return (
    <>
      <div className="letterbox-top" style={{ opacity: videoReady ? 1 : 0 }} />
      <div className="letterbox-bottom" style={{ opacity: videoReady ? 1 : 0 }} />

      <div className="scroll-progress" style={{ width: `${localProgress * 100}%` }} />

      {videoReady && (
        <div
          className="fixed bottom-20 left-1/2 z-50 pointer-events-none"
          style={{ transform: 'translateX(-50%)', opacity: 0.6, transition: 'opacity 0.5s' }}
        >
          <div className="text-xs tracking-[0.3em] uppercase font-mono" style={{ color: '#00aaff' }}>
            {currentScene.label}
          </div>
        </div>
      )}

      {videoReady && localProgress < 0.02 && (
        <div
          className="fixed bottom-12 left-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none"
          style={{ transform: 'translateX(-50%)' }}
        >
          <div className="text-xs text-gray-500 tracking-widest font-mono">SCROLL TO CONTINUE</div>
          <div
            className="w-px h-8"
            style={{ background: 'linear-gradient(to bottom, #00aaff, transparent)', animation: 'pulse 2s ease-in-out infinite' }}
          />
        </div>
      )}

      <div ref={containerRef} id="scroll-container" style={{ height: '400vh', position: 'relative' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden' }}>
          <div
            ref={zoomDivRef}
            style={{
              width: '100%',
              height: '100%',
              willChange: 'transform',
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
              <source src="/assets/video/cinematic.mp4" type="video/mp4" />
            </video>
          </div>

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse at center, transparent 50%, rgba(2,4,8,0.6) 100%),
                linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.5) 100%)
              `,
            }}
          />

          <div
            ref={darkOverlayRef}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(2,4,8,0.3) 0%, rgba(2,4,8,0.8) 100%)',
              opacity: 0,
            }}
          />
        </div>
      </div>
    </>
  );
}
