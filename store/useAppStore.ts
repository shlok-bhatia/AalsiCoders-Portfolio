'use client';

import { create } from 'zustand';

export type Phase = 'loading' | 'cinematic' | 'transition' | 'room';

export type ObjectId =
  | 'monitor'
  | 'coffee'
  | 'keyboard'
  | 'phone'
  | 'notebook'
  | 'mouse'
  | 'wallDisplay';

export type CursorVariant = 'default' | 'hover' | 'drag' | 'click';

interface AppState {
  phase: Phase;
  focusedObject: ObjectId | null;
  videoReady: boolean;
  scrollProgress: number;
  cursorVariant: CursorVariant;
  cursorPos: { x: number; y: number };
  roomLoaded: boolean;

  setPhase: (p: Phase) => void;
  setFocusedObject: (id: ObjectId | null) => void;
  setVideoReady: (v: boolean) => void;
  setScrollProgress: (p: number) => void;
  setCursorVariant: (v: CursorVariant) => void;
  setCursorPos: (pos: { x: number; y: number }) => void;
  setRoomLoaded: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  phase: 'loading',
  focusedObject: null,
  videoReady: false,
  scrollProgress: 0,
  cursorVariant: 'default',
  cursorPos: { x: 0, y: 0 },
  roomLoaded: false,

  setPhase: (phase) => set({ phase }),
  setFocusedObject: (focusedObject) => set({ focusedObject }),
  setVideoReady: (videoReady) => set({ videoReady }),
  setScrollProgress: (scrollProgress) => set({ scrollProgress }),
  setCursorVariant: (cursorVariant) => set({ cursorVariant }),
  setCursorPos: (cursorPos) => set({ cursorPos }),
  setRoomLoaded: (roomLoaded) => set({ roomLoaded }),
}));
