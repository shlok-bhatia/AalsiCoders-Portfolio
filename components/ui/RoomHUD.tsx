
'use client';

import { useAppStore } from '@/store/useAppStore';
import { OBJECTS, OBJECT_IDS } from '@/lib/objectData';
import type { ObjectId } from '@/store/useAppStore';
import { useEffect, useRef, useState } from 'react';

export default function RoomHUD() {
  const { focusedObject, setFocusedObject, setCursorVariant } = useAppStore();
  const [coords, setCoords] = useState({ x: 0.000, y: 1.800, z: 4.800 });
  const [stats, setStats] = useState({ cpu: 73, gpu: 88, mem: 41 });
  const tRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      tRef.current += 0.05;
      const t = tRef.current;
      setCoords({
        x: parseFloat((Math.sin(t) * 0.12).toFixed(3)),
        y: parseFloat((1.8 + Math.sin(t * 0.7) * 0.03).toFixed(3)),
        z: parseFloat((4.8 + Math.cos(t * 0.5) * 0.05).toFixed(3)),
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        cpu: Math.max(10, Math.min(99, prev.cpu + (Math.random() - 0.5) * 8)),
        gpu: Math.max(10, Math.min(99, prev.gpu + (Math.random() - 0.5) * 8)),
        mem: Math.max(10, Math.min(99, prev.mem + (Math.random() - 0.5) * 4)),
      }));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Scan line */}
      <div className="fixed inset-0 z-[140] pointer-events-none overflow-hidden">
        <div style={{
          position: 'absolute', left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(0,170,255,0.15), rgba(0,170,255,0.4), rgba(0,170,255,0.15), transparent)',
          animation: 'scanline 6s linear infinite',
        }} />
      </div>

      {/* Corner brackets */}
      {[
        { top: 8, left: 8, borderTop: '1px solid rgba(0,170,255,0.5)', borderLeft: '1px solid rgba(0,170,255,0.5)' },
        { top: 8, right: 8, borderTop: '1px solid rgba(0,170,255,0.5)', borderRight: '1px solid rgba(0,170,255,0.5)' },
        { bottom: 8, left: 8, borderBottom: '1px solid rgba(0,170,255,0.5)', borderLeft: '1px solid rgba(0,170,255,0.5)' },
        { bottom: 8, right: 8, borderBottom: '1px solid rgba(0,170,255,0.5)', borderRight: '1px solid rgba(0,170,255,0.5)' },
      ].map((s, i) => (
        <div key={i} className="fixed z-[145] pointer-events-none w-5 h-5" style={s} />
      ))}

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-[150] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(2,4,8,0.95) 0%, transparent 100%)',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div className="font-mono text-[13px] tracking-[0.25em] flex items-center gap-2" style={{ color: '#00aaff' }}>
          AALSI<span style={{ color: '#00ff41' }}>CODERS</span>
          <span style={{ color: '#ffffff10', margin: '0 4px' }}>//</span>
          <span style={{ color: '#ffffff20', fontSize: '10px', letterSpacing: '0.2em' }}>HQ v1.0</span>
        </div>

        <div className="flex items-center gap-4">
          {[
            { color: '#00ff41', label: 'SYSTEMS ONLINE' },
            { color: '#00aaff', label: '3D RENDER ACTIVE' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: color, boxShadow: `0 0 6px ${color}`,
                animation: 'hudpulse 2s ease-in-out infinite',
              }} />
              <span className="font-mono text-[9px] tracking-[0.2em]" style={{ color: '#ffffff25' }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="font-mono text-[9px] tracking-[0.25em]" style={{ color: '#ffffff20' }}>
          <span style={{ color: '#00ff41', marginRight: 8, animation: 'hudpulse 1.5s ease-in-out infinite', display: 'inline-block' }}>■</span>
          INTERACTIVE MODE
        </div>
      </div>

      {/* System stats — top left */}
      {!focusedObject && (
        <div className="fixed z-[150] pointer-events-none" style={{ top: 56, left: 20, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[
            { label: 'CPU', val: stats.cpu, color: '#00aaff' },
            { label: 'GPU', val: stats.gpu, color: '#b040ff' },
            { label: 'MEM', val: stats.mem, color: '#00ff41' },
          ].map(({ label, val, color }) => (
            <div key={label} className="flex items-center gap-2 font-mono" style={{ fontSize: 8, letterSpacing: '0.15em', color: '#ffffff20' }}>
              <span style={{ width: 24 }}>{label}</span>
              <div style={{ width: 48, height: 2, background: '#ffffff08', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${Math.round(val)}%`, background: color, transition: 'width 0.8s ease' }} />
              </div>
              <span style={{ minWidth: 28, textAlign: 'right' }}>{Math.round(val)}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Mini radar — top right */}
      {!focusedObject && (
        <div className="fixed z-[150] pointer-events-none" style={{ top: 56, right: 20, width: 72, height: 72, border: '1px solid rgba(0,170,255,0.12)', background: 'rgba(0,10,20,0.7)', overflow: 'hidden' }}>
          <span className="font-mono" style={{ position: 'absolute', top: 3, left: 4, fontSize: 7, letterSpacing: '0.2em', color: 'rgba(0,170,255,0.25)' }}>MAP</span>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            width: 60, height: 60, marginLeft: -30, marginTop: -30,
            borderRadius: '50%', borderTop: '1px solid rgba(0,170,255,0.3)',
            animation: 'radarsweep 3s linear infinite',
          }} />
          {[
            { top: '35%', left: '48%', color: '#00ff41' },
            { top: '55%', left: '30%', color: '#00aaff' },
            { top: '50%', left: '65%', color: '#b040ff' },
          ].map((d, i) => (
            <div key={i} style={{
              position: 'absolute', width: 4, height: 4, borderRadius: '50%',
              top: d.top, left: d.left,
              background: d.color, boxShadow: `0 0 4px ${d.color}`,
              animation: `hudpulse 2s ease-in-out infinite`,
              animationDelay: `${i * 0.6}s`,
            }} />
          ))}
        </div>
      )}

      {/* Left nav — object legend */}
      {!focusedObject && (
        <div className="fixed bottom-6 left-5 z-[150] pointer-events-auto flex flex-col gap-1">
          <div className="font-mono mb-1" style={{ fontSize: 8, letterSpacing: '0.3em', color: '#ffffff15' }}>— NODES —</div>
          {OBJECT_IDS.map((id) => {
            const obj = OBJECTS[id as ObjectId];
            return (
              <button
                key={id}
                onClick={() => setFocusedObject(id as ObjectId)}
                onMouseEnter={(e) => {
                  setCursorVariant('hover');
                  (e.currentTarget as HTMLElement).style.color = obj.color;
                  const line = e.currentTarget.querySelector('.nav-line') as HTMLElement;
                  if (line) { line.style.width = '20px'; line.style.opacity = '1'; }
                }}
                onMouseLeave={(e) => {
                  setCursorVariant('default');
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.22)';
                  const line = e.currentTarget.querySelector('.nav-line') as HTMLElement;
                  if (line) { line.style.width = '0'; line.style.opacity = '0'; }
                }}
                className="flex items-center gap-2 font-mono text-left"
                style={{
                  fontSize: 11, letterSpacing: '0.15em',
                  color: 'rgba(255,255,255,0.22)',
                  background: 'none', border: 'none',
                  cursor: 'none', padding: '3px 0',
                  textTransform: 'uppercase',
                  transition: 'color 0.2s',
                }}
              >
                <span style={{
                  width: 5, height: 5, borderRadius: '50%', display: 'inline-block', flexShrink: 0,
                  background: obj.color, boxShadow: `0 0 4px ${obj.color}`,
                }} />
                <span className="nav-line" style={{ height: 1, width: 0, background: obj.color, opacity: 0, transition: 'all 0.25s ease', marginLeft: -6, flexShrink: 0 }} />
                {obj.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Bottom right hints */}
      {!focusedObject && (
        <div className="fixed bottom-6 right-5 z-[150] pointer-events-none text-right">
          {[
            { key: 'DRAG', label: 'to orbit' },
            { key: 'SCROLL', label: 'to zoom' },
            { key: 'CLICK', label: 'explore node' },
          ].map(({ key, label }) => (
            <div key={key} className="font-mono mb-1" style={{ fontSize: 9, letterSpacing: '0.18em', color: '#ffffff15' }}>
              <span style={{ display: 'inline-block', padding: '1px 5px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, fontSize: 8, color: 'rgba(255,255,255,0.2)', marginRight: 6 }}>{key}</span>
              {label}
            </div>
          ))}
        </div>
      )}

      {/* Bottom center coords */}
      {!focusedObject && (
        <div className="fixed bottom-6 left-1/2 z-[150] pointer-events-none font-mono" style={{ transform: 'translateX(-50%)', fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.12)' }}>
          X <span style={{ color: 'rgba(0,170,255,0.35)' }}>{coords.x.toFixed(3)}</span>
          &nbsp;&nbsp;Y <span style={{ color: 'rgba(0,170,255,0.35)' }}>{coords.y.toFixed(3)}</span>
          &nbsp;&nbsp;Z <span style={{ color: 'rgba(0,170,255,0.35)' }}>{coords.z.toFixed(3)}</span>
        </div>
      )}

      {/* Back button */}
      {focusedObject && (
        <div className="fixed bottom-6 left-1/2 z-[150] pointer-events-auto" style={{ transform: 'translateX(-50%)' }}>
          <button
            onClick={() => setFocusedObject(null)}
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
            className="font-mono text-xs tracking-widest px-6 py-2 rounded"
            style={{
              background: 'rgba(2,4,8,0.85)',
              border: '1px solid rgba(0,170,255,0.3)',
              color: '#00aaff',
              backdropFilter: 'blur(10px)',
              cursor: 'none',
              letterSpacing: '0.2em',
            }}
          >
            ← BACK TO ROOM
          </button>
        </div>
      )}

      {/* Global keyframe styles */}
      <style>{`
        @keyframes scanline { 0% { top: 0 } 100% { top: 100% } }
        @keyframes hudpulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
        @keyframes radarsweep { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
      `}</style>
    </>
  );
}