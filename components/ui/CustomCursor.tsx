'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const { cursorVariant, setCursorPos } = useAppStore();

  useEffect(() => {
    let rafId: number;
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setCursorPos({ x: mouseX, y: mouseY });

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
      }
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - 16}px, ${ringY - 16}px)`;
      }
      rafId = requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafId = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [setCursorPos]);

  const isHover = cursorVariant === 'hover';
  const isClick = cursorVariant === 'click';

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999]"
        style={{
          background: isHover ? '#00ff41' : isClick ? '#ffd700' : '#00aaff',
          boxShadow: `0 0 ${isHover ? '12px' : '6px'} ${isHover ? '#00ff41' : '#00aaff'}`,
          transition: 'background 0.2s, box-shadow 0.2s, width 0.2s, height 0.2s',
          willChange: 'transform',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9998]"
        style={{
          border: `1px solid ${isHover ? 'rgba(0,255,65,0.6)' : 'rgba(0,170,255,0.4)'}`,
          transform: isHover ? 'scale(1.5)' : 'scale(1)',
          transition: 'border-color 0.2s, opacity 0.2s',
          willChange: 'transform',
        }}
      />
    </>
  );
}
