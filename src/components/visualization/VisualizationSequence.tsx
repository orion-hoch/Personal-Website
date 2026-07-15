import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import * as THREE from 'three';
import Ground from '../Ground';
import SceneAsset from './SceneAsset';
import { visualizationSequences, type VisualizationDetail, type VisualizationLink, type VisualizationSequenceId, type VisualizationStep } from '../../data/visualizationSequences';
import './VisualizationSequence.css';

interface Props {
  sequenceId: VisualizationSequenceId;
  initialStepId?: string;
  onClose: () => void;
}

function openLink(link: VisualizationLink) {
  if (link.href.startsWith('mailto:')) {
    window.location.href = link.href;
    return;
  }

  if (link.external || link.href.startsWith('http') || link.href.startsWith('mailto:')) {
    window.open(link.href, '_blank', 'noopener');
    return;
  }

  window.location.href = link.href;
}

function StepCamera({ position, lookAt, distance, height, angle, moving }: { position: THREE.Vector3; lookAt: THREE.Vector3; distance: number; height: number; angle: number; moving: boolean }) {
  const { camera, pointer } = useThree();
  const posRef = useRef(new THREE.Vector3());
  const lookRef = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const pointerAngle = pointer.x * 0.16;
    const pointerLift = pointer.y * 0.8;
    const actualAngle = angle + pointerAngle;

    const desiredPos = new THREE.Vector3(
      position.x + Math.sin(actualAngle) * distance,
      position.y + height + Math.max(pointer.y * 0.7, -0.12),
      position.z + Math.cos(actualAngle) * distance,
    );

    const desiredLook = new THREE.Vector3(
      lookAt.x + pointer.x * 1.15,
      lookAt.y + pointerLift,
      lookAt.z,
    );

    const damp = moving ? 3.8 : 6;
    posRef.current.lerp(desiredPos, 1 - Math.exp(-damp * delta));
    lookRef.current.lerp(desiredLook, 1 - Math.exp(-damp * delta));
    camera.position.copy(posRef.current);
    camera.lookAt(lookRef.current);
  });

  return null;
}

function VisualizationStage({ steps, stepIndex, moving }: { steps: VisualizationStep[]; stepIndex: number; moving: boolean }) {
  const visibleIndices = steps.map((_, index) => index).filter((index) => Math.abs(index - stepIndex) <= 1);
  const spacing = 18;
  const positions = steps.map((_, index) => new THREE.Vector3(index * spacing, 0, Math.sin(index * 0.8) * 3.2));
  const activeStep = steps[stepIndex];
  const activePosition = positions[stepIndex];
  const assetHeight = activeStep.asset.height ?? (activeStep.asset.targetSize ?? 6) * 0.7;
  const lookAt = new THREE.Vector3(activePosition.x, Math.max(2.8, assetHeight * 0.55), activePosition.z);
  const distance = activeStep.cameraDistance ?? 13;
  const height = activeStep.cameraHeight ?? 5.8;
  const angle = activeStep.cameraAngle ?? 0.28;

  return (
    <>
      <StepCamera position={activePosition} lookAt={lookAt} distance={distance} height={height} angle={angle} moving={moving} />

      <ambientLight intensity={0.76} color="#ccb07a" />
      <hemisphereLight args={['#e4ca8e', '#21140f', 0.48]} position={[0, 15, 0]} />
      <directionalLight position={[12, 15, 6]} intensity={0.84} color="#f4d27d" />
      <directionalLight position={[-6, 8, -8]} intensity={0.12} color="#7d433e" />
      <pointLight position={[activePosition.x, 8, activePosition.z + 2]} intensity={4.4} color="#f5cc6c" decay={2} />
      <fog attach="fog" args={['#030506', 20, 68]} />

      <group position={[activePosition.x, 0, 0]}>
        <Ground />
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[activePosition.x, -0.02, 0]} receiveShadow>
        <planeGeometry args={[110, 36]} />
        <meshStandardMaterial color="#050607" roughness={1} metalness={0} transparent opacity={0.35} />
      </mesh>

      {steps.slice(0, -1).map((_, index) => {
        if (Math.abs(index - stepIndex) > 1) return null;
        const a = positions[index];
        const b = positions[index + 1];
        const midpoint = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
        const length = a.distanceTo(b);
        const direction = new THREE.Vector3().subVectors(b, a);
        const angleY = Math.atan2(direction.x, direction.z);

        return (
          <group key={`track-${index}`} position={midpoint} rotation={[0, angleY, 0]}>
            <mesh position={[0, 0.04, 0]}>
              <boxGeometry args={[1.1, 0.08, length]} />
              <meshStandardMaterial color="#1a0c0f" emissive="#61111D" emissiveIntensity={0.24} />
            </mesh>
            <mesh position={[0, 0.09, 0]}>
              <boxGeometry args={[0.22, 0.03, length * 0.96]} />
              <meshStandardMaterial color="#d2b06f" emissive="#d2b06f" emissiveIntensity={0.52} />
            </mesh>
          </group>
        );
      })}

      {visibleIndices.map((index) => {
        const step = steps[index];
        const position = positions[index];
        const active = index === stepIndex;
        const scale = active ? 1 : 0.84;

        return (
          <group key={step.id} position={position} scale={[scale, scale, scale]}>
            <SceneAsset asset={step.asset} active={active} />
          </group>
        );
      })}
    </>
  );
}

function DetailPopup({ title, detail, links, onClose }: { title: string; detail: VisualizationDetail; links?: VisualizationLink[]; onClose: () => void }) {
  return (
    <div className="visualization-detail-backdrop" onClick={onClose}>
      <div className="visualization-detail" onClick={(event) => event.stopPropagation()}>
        <div className="visualization-detail__top">
          <div>
            <div className="visualization-detail__eyebrow">Project Detail</div>
            <h3>{title}</h3>
          </div>
          <button className="visualization-button" onClick={onClose}>Close</button>
        </div>

        <div className="visualization-detail__image">
          {detail.image ? (
            <img src={detail.image} alt={detail.imageLabel} loading="lazy" decoding="async" />
          ) : (
            <div className="visualization-detail__placeholder">{detail.imageLabel}</div>
          )}
        </div>

        <div className="visualization-detail__sections">
          <section>
            <h4>Purpose</h4>
            <p>{detail.purpose}</p>
          </section>
          <section>
            <h4>Goals</h4>
            <p>{detail.goals}</p>
          </section>
          <section>
            <h4>Results</h4>
            <p>{detail.results}</p>
          </section>
          {links && links.length > 0 && (
            <section>
              <h4>Links</h4>
              <div className="visualization-detail__links">
                {links.map((link) => (
                  <button key={`${title}-${link.label}`} className="visualization-button" onClick={() => openLink(link)}>
                    {link.label}
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VisualizationSequence({ sequenceId, initialStepId, onClose }: Props) {
  const sequence = visualizationSequences[sequenceId];
  const initialIndex = Math.max(0, sequence.steps.findIndex((step) => step.id === initialStepId));
  const [stepIndex, setStepIndex] = useState(initialIndex);
  const [moving, setMoving] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const moveTimerRef = useRef<number | null>(null);
  const repeatRef = useRef<number | null>(null);

  const activeStep = sequence.steps[stepIndex];
  const canPrev = stepIndex > 0;
  const canNext = stepIndex < sequence.steps.length - 1;

  const move = useCallback((delta: -1 | 1) => {
    const nextIndex = stepIndex + delta;
    if (nextIndex < 0 || nextIndex >= sequence.steps.length) return;

    setDetailOpen(false);
    setStepIndex(nextIndex);
    setMoving(true);
    if (moveTimerRef.current) window.clearTimeout(moveTimerRef.current);
    moveTimerRef.current = window.setTimeout(() => setMoving(false), 520);
  }, [sequence.steps.length, stepIndex]);

  const startRepeat = useCallback((delta: -1 | 1) => {
    move(delta);
    if (repeatRef.current) window.clearInterval(repeatRef.current);
    repeatRef.current = window.setInterval(() => move(delta), 540);
  }, [move]);

  const stopRepeat = useCallback(() => {
    if (repeatRef.current) {
      window.clearInterval(repeatRef.current);
      repeatRef.current = null;
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (detailOpen) {
          setDetailOpen(false);
        } else {
          onClose();
        }
        return;
      }

      const key = event.key.toLowerCase();
      if (detailOpen) return;

      if (key === 'arrowright' || key === 'arrowdown' || key === 's') {
        event.preventDefault();
        startRepeat(1);
      }
      if (key === 'arrowleft' || key === 'arrowup' || key === 'w') {
        event.preventDefault();
        startRepeat(-1);
      }
      if (key === 'enter' && activeStep.detail) {
        event.preventDefault();
        setDetailOpen(true);
      }
    };

    const handleKeyUp = () => stopRepeat();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      stopRepeat();
      if (moveTimerRef.current) window.clearTimeout(moveTimerRef.current);
    };
  }, [activeStep.detail, detailOpen, onClose, startRepeat, stopRepeat]);

  return (
    <div className="visualization-overlay" style={{ '--visualization-accent': sequence.accent } as CSSProperties}>
      <Canvas camera={{ position: [0, 6, 13], fov: 42 }} gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }} dpr={[1, 1.25]}>
        <color attach="background" args={['#010203']} />
        <Suspense fallback={null}>
          <VisualizationStage steps={sequence.steps} stepIndex={stepIndex} moving={moving} />
        </Suspense>
      </Canvas>

      <div className="visualization-topbar">
        <button className="visualization-close" onClick={onClose}>Return To Catalog</button>
      </div>

      <aside className="visualization-hud">
        <div className="visualization-hud__eyebrow">{sequence.title}</div>
        <h3>{activeStep.title}</h3>
        {activeStep.subtitle && <div className="visualization-hud__subtitle">{activeStep.subtitle}</div>}
        <p>{activeStep.description}</p>
        {activeStep.tags && activeStep.tags.length > 0 && (
          <div className="visualization-hud__tags">
            {activeStep.tags.map((tag) => <span key={tag} className="visualization-hud__tag">{tag}</span>)}
          </div>
        )}
        {activeStep.detail && (
          <div className="visualization-hud__buttons">
            <button className="visualization-detail-trigger" onClick={() => setDetailOpen(true)}>Open Detail</button>
          </div>
        )}
      </aside>

      <div className="visualization-nav">
        <button className="visualization-button" disabled={!canPrev} onMouseDown={() => startRepeat(-1)} onMouseUp={stopRepeat} onMouseLeave={stopRepeat} onTouchStart={() => startRepeat(-1)} onTouchEnd={stopRepeat}>
          ‹
        </button>
        <button className="visualization-button" disabled={!canNext} onMouseDown={() => startRepeat(1)} onMouseUp={stopRepeat} onMouseLeave={stopRepeat} onTouchStart={() => startRepeat(1)} onTouchEnd={stopRepeat}>
          ›
        </button>
      </div>

      <div className="visualization-hint">W / S or Arrow Keys move through the walkthrough</div>

      {detailOpen && activeStep.detail && (
        <DetailPopup title={activeStep.title} detail={activeStep.detail} links={activeStep.links} onClose={() => setDetailOpen(false)} />
      )}
    </div>
  );
}
