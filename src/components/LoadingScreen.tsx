import { useEffect, useMemo, useState } from 'react';
import './LoadingScreen.css';

const DISPLAY_MS = 1600;
const FADE_MS = 400;

const TIPS = [
  'Drag to rotate the camera around the wasteland',
  'Scroll to zoom in and out',
  'Click on any building to explore that section',
  'Press ESC to close any open panel',
  'Each building represents a different part of my portfolio',
];

function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const CHUNK_COUNT = 18;

function generateChunks() {
  const rand = seededRand(42);
  return Array.from({ length: CHUNK_COUNT }, (_, i) => {
    const r = rand();
    return {
      delay: (i / CHUNK_COUNT) * 2.4 + rand() * 0.18,
      heightPct: 55 + rand() * 45,
      color: ['#6B5B4F', '#5A4A3E', '#7D6D5F', '#4A4540', '#635347', '#8A7A6C'][i % 6],
      offsetY: Math.floor(rand() * 3),
      hasPebble: r > 0.6,
      pebbleColor: r > 0.8 ? '#3E3630' : '#4A4540',
    };
  });
}

export default function LoadingScreen() {
  const [ending, setEnding] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [tipIndex] = useState(() => Math.floor(Math.random() * TIPS.length));
  const chunks = useMemo(() => generateChunks(), []);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setEnding(true), DISPLAY_MS);
    const hideTimer = window.setTimeout(() => setHidden(true), DISPLAY_MS + FADE_MS);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (hidden) return null;

  return (
    <div className={`loading-screen ${ending ? 'ending' : ''}`} aria-hidden>
      <div className="loading-screen__content">
        <div className="loading-screen__subtitle">
          An interactive 3D portfolio built in the ruins
        </div>

        {/* 90s-style chunky loading bar */}
        <div className="loading-bar">
          <div className="loading-bar__inset">
            <div className="loading-bar__track">
              {chunks.map((chunk, i) => (
                <div
                  key={i}
                  className="loading-bar__chunk"
                  style={{
                    animationDelay: `${chunk.delay}s`,
                    height: `${chunk.heightPct}%`,
                    backgroundColor: chunk.color,
                    marginTop: `${chunk.offsetY}px`,
                  }}
                >
                  {chunk.hasPebble && (
                    <span
                      className="loading-bar__pebble"
                      style={{ backgroundColor: chunk.pebbleColor }}
                    />
                  )}
                </div>
              ))}
            </div>
            {/* Crack overlays */}
            <div className="loading-bar__crack loading-bar__crack--1" />
            <div className="loading-bar__crack loading-bar__crack--2" />
          </div>
        </div>

        <div className="loading-screen__tip">{TIPS[tipIndex]}</div>
        <div className="loading-screen__label">Initializing ...</div>
      </div>
    </div>
  );
}
