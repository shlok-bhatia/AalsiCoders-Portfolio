'use client';

import { useAppStore } from '@/store/useAppStore';
import { OBJECTS, OBJECT_IDS } from '@/lib/objectData';
import type { ObjectId } from '@/store/useAppStore';

export default function RoomHUD() {
  const { focusedObject, setFocusedObject, setCursorVariant } = useAppStore();

  return (
    <>
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-[150] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(2,4,8,0.9) 0%, transparent 100%)',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div className="font-mono text-xs tracking-[0.3em]" style={{ color: '#00aaff' }}>
          AALSI<span style={{ color: '#00ff41' }}>CODERS</span>
          <span className="ml-3 text-gray-600">// HQ v1.0</span>
        </div>
        <div className="font-mono text-xs text-gray-600 tracking-widest">
          INTERACTIVE MODE
        </div>
      </div>

      {/* Object legend — bottom left */}
      {!focusedObject && (
        <div
          className="fixed bottom-6 left-6 z-[150] pointer-events-auto"
          style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
        >
          {OBJECT_IDS.map((id) => {
            const obj = OBJECTS[id as ObjectId];
            return (
              <button
                key={id}
                onClick={() => setFocusedObject(id as ObjectId)}
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
                className="flex items-center gap-2 text-xs font-mono text-left transition-all duration-200"
                style={{
                  color: 'rgba(255,255,255,0.35)',
                  padding: '3px 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'none',
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = obj.color;
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.35)';
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block flex-shrink-0"
                  style={{ background: obj.color, boxShadow: `0 0 4px ${obj.color}` }}
                />
                {obj.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Hint — bottom right */}
      {!focusedObject && (
        <div className="fixed bottom-6 right-6 z-[150] pointer-events-none">
          <div className="text-xs text-gray-700 font-mono text-right leading-relaxed">
            <div>DRAG to orbit</div>
            <div>SCROLL to zoom</div>
            <div>CLICK objects to explore</div>
          </div>
        </div>
      )}

      {/* Back button when focused */}
      {focusedObject && (
        <div className="fixed bottom-6 left-1/2 z-[150] pointer-events-auto"
          style={{ transform: 'translateX(-50%)' }}
        >
          <button
            onClick={() => setFocusedObject(null)}
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
            className="text-xs font-mono tracking-widest px-6 py-2 rounded transition-all duration-200"
            style={{
              background: 'rgba(2,4,8,0.8)',
              border: '1px solid rgba(0,170,255,0.3)',
              color: '#00aaff',
              backdropFilter: 'blur(10px)',
              cursor: 'none',
            }}
          >
            ← BACK TO ROOM
          </button>
        </div>
      )}
    </>
  );
}
