import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import WastelandScene from './components/WastelandScene';
import LoadingScreen from './components/LoadingScreen';
import WalkthroughLoadingScreen from './components/WalkthroughLoadingScreen';
import type { BuildingDef } from './engine/types';
import type { VisualizationSequenceId } from './data/visualizationSequences';

const InteriorPanel = lazy(() => import('./components/InteriorPanel'));
const VisualizationSequence = lazy(() => import('./components/visualization/VisualizationSequence'));

const IS_TOUCH = window.matchMedia('(pointer: coarse)').matches;

interface ActiveVisualization {
  sequenceId: VisualizationSequenceId;
  stepId?: string;
}

function App() {
  const [focusedBuilding, setFocusedBuilding] = useState<BuildingDef | null>(null);
  const [activeVisualization, setActiveVisualization] = useState<ActiveVisualization | null>(null);
  const [walkthroughLoading, setWalkthroughLoading] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const launchTimerRef = useRef<number | null>(null);
  const settleTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setHintVisible(false), 7000);
    return () => window.clearTimeout(timer);
  }, []);

  // Prefetch lazy chunks once the scene has settled so the first building
  // click doesn't stall on downloading/parsing them mid-interaction
  useEffect(() => {
    const timer = window.setTimeout(() => {
      import('./components/InteriorPanel');
      import('./components/visualization/VisualizationSequence');
    }, 3000);
    return () => window.clearTimeout(timer);
  }, []);

  const handleBuildingClick = useCallback((b: BuildingDef) => {
    if (b.decorative) return;
    setFocusedBuilding(b);
  }, []);

  const handleUnfocus = useCallback(() => {
    setFocusedBuilding(null);
  }, []);

  const handleOpenVisualization = useCallback((sequenceId: VisualizationSequenceId, stepId?: string) => {
    if (launchTimerRef.current) window.clearTimeout(launchTimerRef.current);
    if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current);

    setWalkthroughLoading(true);
    launchTimerRef.current = window.setTimeout(() => {
      setActiveVisualization({ sequenceId, stepId });
    }, 220);
    settleTimerRef.current = window.setTimeout(() => {
      setWalkthroughLoading(false);
    }, 480);
  }, []);

  useEffect(() => {
    return () => {
      if (launchTimerRef.current) window.clearTimeout(launchTimerRef.current);
      if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current);
    };
  }, []);

  return (
    <>
      <LoadingScreen />
      <WastelandScene
        focusedBuilding={focusedBuilding}
        onBuildingClick={handleBuildingClick}
        onUnfocus={handleUnfocus}
      />
      <Suspense fallback={null}>
        {focusedBuilding && (
          <InteriorPanel
            key={focusedBuilding.id}
            buildingId={focusedBuilding.id}
            onClose={handleUnfocus}
            onOpenVisualization={handleOpenVisualization}
          />
        )}
      </Suspense>
      <Suspense fallback={<WalkthroughLoadingScreen />}> 
        {activeVisualization && (
          <VisualizationSequence
            key={`${activeVisualization.sequenceId}:${activeVisualization.stepId ?? 'start'}`}
            sequenceId={activeVisualization.sequenceId}
            initialStepId={activeVisualization.stepId}
            onClose={() => setActiveVisualization(null)}
          />
        )}
      </Suspense>
      {walkthroughLoading && <WalkthroughLoadingScreen />}
      {/* Help hint */}
      <div style={{
        position: 'fixed',
        bottom: 'calc(16px + env(safe-area-inset-bottom))',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'max-content',
        maxWidth: 'calc(100vw - 24px)',
        textAlign: 'center',
        fontFamily: "'Times New Roman', Times, serif",
        fontSize: IS_TOUCH ? 13 : 16,
        color: 'rgba(236, 231, 223, 0.82)',
        letterSpacing: 2,
        pointerEvents: 'none',
        zIndex: 5,
        userSelect: 'none',
        padding: '6px 12px',
        background: 'rgba(0, 0, 0, 0.45)',
        border: '1px solid rgba(86, 101, 93, 0.28)',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.75)',
        opacity: hintVisible ? 1 : 0,
        transition: 'opacity 1.2s ease',
      }}>
        {IS_TOUCH
          ? 'DRAG TO ROTATE • PINCH TO ZOOM • TAP LOCATIONS TO EXPLORE'
          : 'DRAG TO ROTATE • SCROLL TO ZOOM • CLICK LOCATIONS TO EXPLORE'}
      </div>
    </>
  );
}

export default App;
