'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { OBJECTS } from '@/lib/objectData';
import type { ObjectId } from '@/store/useAppStore';

export default function ContentPanel() {
  const { focusedObject, setFocusedObject, setCursorVariant } = useAppStore();
  const panelRef = useRef<HTMLDivElement>(null);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  // Reset form when panel is closed or changed
  useEffect(() => {
    setFormName('');
    setFormEmail('');
    setFormMessage('');
    setFormStatus('idle');
  }, [focusedObject]);

  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.style.opacity = focusedObject ? '1' : '0';
      panelRef.current.style.transform = focusedObject
        ? 'translateY(0) scale(1)'
        : 'translateY(20px) scale(0.97)';
    }
  }, [focusedObject]);

  if (!focusedObject) return null;
  const obj = OBJECTS[focusedObject as ObjectId];
  if (!obj) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-end pointer-events-none"
      style={{ padding: '2rem' }}
    >
      {/* Backdrop click to close */}
      <div
        className="absolute inset-0 pointer-events-auto"
        onClick={() => setFocusedObject(null)}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative pointer-events-auto w-full max-w-sm"
        style={{
          opacity: 0,
          transform: 'translateY(20px) scale(0.97)',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Glass panel */}
        <div
          className="glass-panel p-6 overflow-y-auto"
          style={{
            maxHeight: 'calc(100vh - 4rem)',
            borderColor: `${obj.glowColor}30`,
            boxShadow: `0 0 30px ${obj.glowColor}15, inset 0 0 30px rgba(0,0,0,0.3)`,
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <div
                className="text-xs font-mono tracking-[0.25em] uppercase mb-1"
                style={{ color: obj.color }}
              >
                {obj.label}
              </div>
              <h2
                className="text-xl font-bold text-white"
                style={{ textShadow: `0 0 20px ${obj.glowColor}40` }}
              >
                {obj.content.title}
              </h2>
              {obj.content.subtitle && (
                <p className="text-sm text-gray-400 mt-1">{obj.content.subtitle}</p>
              )}
            </div>
            <button
              onClick={() => setFocusedObject(null)}
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
              className="w-7 h-7 rounded flex items-center justify-center text-gray-500 hover:text-white transition-colors flex-shrink-0"
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                marginLeft: '1rem',
              }}
            >
              ✕
            </button>
          </div>

          {/* Divider */}
          <div
            className="h-px mb-5"
            style={{ background: `linear-gradient(90deg, ${obj.color}40, transparent)` }}
          />

          {/* Body text */}
          {obj.content.body && (
            <p className="text-sm text-gray-300 leading-relaxed mb-5">
              {obj.content.body}
            </p>
          )}

          {/* Tags */}
          {obj.content.tags && (
            <div className="flex flex-wrap gap-2 mb-5">
              {obj.content.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded font-mono"
                  style={{
                    background: `${obj.color}15`,
                    border: `1px solid ${obj.color}30`,
                    color: obj.color,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Items */}
          {obj.content.items && (
            <div className="space-y-3">
              {obj.content.items.map((item, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <div
                    className="text-xs font-mono font-medium mb-1"
                    style={{ color: obj.color }}
                  >
                    {item.label}
                  </div>
                  <div className="text-xs text-gray-400 leading-relaxed">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Links */}
          {obj.content.links && (
            <div className="flex flex-col gap-2 mt-5">
              {obj.content.links.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setCursorVariant('hover')}
                  onMouseLeave={() => setCursorVariant('default')}
                  className="block text-center py-2 px-4 rounded text-sm font-medium transition-all duration-200"
                  style={{
                    background: i === 0 ? obj.color : 'transparent',
                    color: i === 0 ? '#000' : obj.color,
                    border: `1px solid ${obj.color}`,
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {/* Secure Contact Form */}
          {focusedObject === 'phone' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!formName || !formEmail || !formMessage) return;
                setFormStatus('sending');
                setTimeout(() => {
                  setFormStatus('success');
                }, 1500);
              }}
              className="mt-6 space-y-4"
            >
              <div className="h-px bg-white/5 my-4" />
              <div className="text-[10px] font-mono tracking-widest text-gray-500 uppercase mb-2">
                SECURE TRANSMISSION PROTOCOL
              </div>

              {formStatus === 'success' ? (
                <div
                  className="p-4 rounded-lg text-center"
                  style={{
                    background: 'rgba(0, 255, 65, 0.05)',
                    border: '1px solid rgba(0, 255, 65, 0.3)',
                    boxShadow: '0 0 15px rgba(0, 255, 65, 0.1)',
                  }}
                >
                  <div className="text-xs font-mono text-[#00ff41] font-bold uppercase mb-1">
                    TRANSMISSION SUCCESSFUL
                  </div>
                  <div className="text-[11px] text-gray-400 font-mono">
                    Message encrypted and routed. We will respond within 24 hours.
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      disabled={formStatus === 'sending'}
                      placeholder="Ident: Agent / Guest"
                      className="w-full text-xs p-2.5 rounded-lg border bg-black/40 text-white placeholder-gray-600 focus:outline-none transition-all duration-200"
                      style={{
                        borderColor: 'rgba(0, 229, 255, 0.2)',
                        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#00e5ff';
                        e.target.style.boxShadow = '0 0 10px rgba(0, 229, 255, 0.2), inset 0 0 10px rgba(0,0,0,0.5)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(0, 229, 255, 0.2)';
                        e.target.style.boxShadow = 'inset 0 0 10px rgba(0,0,0,0.5)';
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      disabled={formStatus === 'sending'}
                      placeholder="communication@channel.com"
                      className="w-full text-xs p-2.5 rounded-lg border bg-black/40 text-white placeholder-gray-600 focus:outline-none transition-all duration-200"
                      style={{
                        borderColor: 'rgba(0, 229, 255, 0.2)',
                        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#00e5ff';
                        e.target.style.boxShadow = '0 0 10px rgba(0, 229, 255, 0.2), inset 0 0 10px rgba(0,0,0,0.5)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(0, 229, 255, 0.2)';
                        e.target.style.boxShadow = 'inset 0 0 10px rgba(0,0,0,0.5)';
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      disabled={formStatus === 'sending'}
                      placeholder="Details of your operation / project..."
                      className="w-full text-xs p-2.5 rounded-lg border bg-black/40 text-white placeholder-gray-600 focus:outline-none transition-all duration-200 resize-none"
                      style={{
                        borderColor: 'rgba(0, 229, 255, 0.2)',
                        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#00e5ff';
                        e.target.style.boxShadow = '0 0 10px rgba(0, 229, 255, 0.2), inset 0 0 10px rgba(0,0,0,0.5)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(0, 229, 255, 0.2)';
                        e.target.style.boxShadow = 'inset 0 0 10px rgba(0,0,0,0.5)';
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus === 'sending'}
                    className="w-full py-2.5 rounded text-xs font-mono font-bold tracking-widest transition-all duration-300"
                    style={{
                      background: 'rgba(0, 229, 255, 0.1)',
                      border: '1px solid #00e5ff',
                      color: '#00e5ff',
                      boxShadow: '0 0 15px rgba(0, 229, 255, 0.1)',
                      cursor: formStatus === 'sending' ? 'not-allowed' : 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      if (formStatus !== 'sending') {
                        e.currentTarget.style.background = '#00e5ff';
                        e.currentTarget.style.color = '#000';
                        e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 229, 255, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formStatus !== 'sending') {
                        e.currentTarget.style.background = 'rgba(0, 229, 255, 0.1)';
                        e.currentTarget.style.color = '#00e5ff';
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 229, 255, 0.1)';
                      }
                    }}
                  >
                    {formStatus === 'sending' ? 'SENDING TRANSMISSION...' : 'DISPATCH MESSAGE'}
                  </button>
                </>
              )}
            </form>
          )}

          {/* Footer */}
          <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="text-xs text-gray-600 font-mono">AALSICODERS.IN</div>
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: obj.color, boxShadow: `0 0 6px ${obj.color}` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
