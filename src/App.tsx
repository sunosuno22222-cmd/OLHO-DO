import React, { useState, useRef, useCallback } from 'react';
import { HellCanvas } from './components/HellCanvas';
import { HellSceneManager } from './scene/HellSceneManager';
import { DemonicEyeCanvas } from './components/DemonicEyeCanvas';
import { IpScannerPanel } from './components/IpScannerPanel';

type AppState = 'portal' | 'diving' | 'eye';

export default function App() {
  const [appState, setAppState] = useState<AppState>('portal');
  const [blackOverlayOpacity, setBlackOverlayOpacity] = useState<number>(0);
  const sceneManagerRef = useRef<HellSceneManager | null>(null);

  // Called per frame during the 3D dive animation into the inferno portal
  const handleDiveProgress = useCallback((progress: number) => {
    // Instantly darkens as progress passes through the portal model
    const blackness = Math.min(1.0, progress * 1.5);
    setBlackOverlayOpacity(blackness);
  }, []);

  // Called the exact moment the camera enters the portal singularity
  const handleDiveComplete = useCallback(() => {
    setAppState('eye');
  }, []);

  // "Entrar" button click: triggers camera dive into inferno portal
  const handleEnter = useCallback(() => {
    if (appState !== 'portal') return;
    setAppState('diving');

    if (sceneManagerRef.current) {
      sceneManagerRef.current.triggerEnterDive();
    } else {
      // Fallback in case 3D ref is initializing
      let p = 0;
      const interval = setInterval(() => {
        p += 0.05;
        handleDiveProgress(p);
        if (p >= 1) {
          clearInterval(interval);
          handleDiveComplete();
        }
      }, 40);
    }
  }, [appState, handleDiveProgress, handleDiveComplete]);

  // Double click / tap to return to the inferno portal screen
  const handleReset = useCallback(() => {
    setAppState('portal');
    setBlackOverlayOpacity(0);
    sceneManagerRef.current?.resetDive();
  }, []);

  return (
    <div
      onDoubleClick={handleReset}
      className="relative w-full h-[100dvh] overflow-hidden bg-black select-none font-sans"
    >
      {/* SCREEN 1: 3D Inferno Portal Scene (active during 'portal' and 'diving') */}
      {appState !== 'eye' && (
        <>
          <HellCanvas
            onDiveProgress={handleDiveProgress}
            onDiveComplete={handleDiveComplete}
            sceneManagerRef={sceneManagerRef}
          />

          {/* Pitch Black Fade Overlay ("ficando tudo preto" during dive) */}
          <div
            className="absolute inset-0 z-30 pointer-events-none transition-opacity duration-75"
            style={{
              backgroundColor: '#000000',
              opacity: blackOverlayOpacity,
            }}
          />

          {/* Screen 1 Mobile UI: Title and compact orange glowing button (NO BLUR on portal) */}
          <div
            className={`absolute inset-0 z-40 flex flex-col justify-between items-center p-6 sm:p-10 pointer-events-none transition-opacity duration-500 ${
              appState === 'diving' ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {/* Title: OLHOS DO DIABO (fixed, solid, impactful gothic font) */}
            <div className="relative mt-8 sm:mt-12 flex flex-col items-center pointer-events-auto">
              {/* Fiery ambient aura */}
              <div className="absolute -inset-8 bg-gradient-to-r from-red-700/20 via-orange-600/25 to-amber-600/15 blur-2xl -z-10 rounded-full" />

              <h1
                className="font-['Cinzel_Decorative',serif] text-3xl sm:text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-orange-500 to-red-600 drop-shadow-[0_0_25px_rgba(255,80,0,0.85)] text-center uppercase select-none"
                style={{
                  letterSpacing: '0.14em',
                  textShadow: '0 0 35px rgba(255, 60, 0, 0.4)',
                }}
              >
                OLHOS DO DIABO
              </h1>
            </div>

            {/* Bottom Button: Entrar (compact, directly clickable with touch/click handlers) */}
            <div className="mb-8 sm:mb-10 flex flex-col items-center pointer-events-auto z-50">
              <button
                type="button"
                onClick={handleEnter}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  handleEnter();
                }}
                className="group relative w-auto min-w-[160px] max-w-[200px] py-2.5 px-6 rounded-lg font-['Cinzel',serif] tracking-widest text-xs sm:text-sm font-bold uppercase transition-all duration-300 cursor-pointer active:scale-95 bg-black/85 text-amber-100 border border-orange-500 shadow-[0_0_16px_rgba(255,110,0,0.5),inset_0_0_10px_rgba(255,80,0,0.2)] hover:border-amber-400 hover:shadow-[0_0_24px_rgba(255,140,0,0.8),inset_0_0_16px_rgba(255,100,0,0.35)] pointer-events-auto select-none touch-manipulation"
              >
                {/* Glowing corner bracket accents */}
                <span className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-amber-300 group-hover:border-white transition-colors pointer-events-none" />
                <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-amber-300 group-hover:border-white transition-colors pointer-events-none" />

                {/* Inner orange subtle glow sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/0 via-orange-500/15 to-orange-600/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />

                <span className="relative z-10 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] pointer-events-none">
                  Entrar
                </span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* SCREEN 2: IP Scanner Interface with 3D Demonic Eye Emblem Logo */}
      {appState === 'eye' && (
        <div className="absolute inset-0 z-40 w-full h-full bg-gradient-to-b from-neutral-950 via-black to-neutral-950">
          <IpScannerPanel onReturnToPortal={handleReset} />
        </div>
      )}
    </div>
  );
}
