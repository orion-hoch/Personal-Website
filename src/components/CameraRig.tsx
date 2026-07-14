import { useRef, useEffect, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { BuildingDef } from '../engine/types';
import { getBuildingAnchor, gridTo3D } from '../engine/gridUtils';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface Props {
  focusedBuilding: BuildingDef | null;
  onUnfocus: () => void;
}

export default function CameraRig({ focusedBuilding, onUnfocus }: Props) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const animating = useRef(false);
  const targetPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const orbitTarget = useMemo(() => new THREE.Vector3(0, 2, 0), []);

  // Save orbit state before focusing
  const savedOrbitPos = useRef(new THREE.Vector3());
  const savedOrbitTarget = useRef(new THREE.Vector3());

  // Handle ESC to unfocus
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && focusedBuilding) {
        onUnfocus();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [focusedBuilding, onUnfocus]);

  // Compute focus targets when building changes
  useEffect(() => {
    if (focusedBuilding) {
      // Save current orbit state
      savedOrbitPos.current.copy(camera.position);
      if (controlsRef.current) {
        savedOrbitTarget.current.copy(controlsRef.current.target);
      }

      const [centerCol, centerRow] = getBuildingAnchor(focusedBuilding);
      const [bx, , bz] = gridTo3D(centerCol, centerRow);
      const [ox, oy, oz] = focusedBuilding.focusOffset;

      targetPos.current.set(bx + ox, oy, bz + oz);
      targetLookAt.current.set(bx, focusedBuilding.boxSize[1] * 0.4, bz);
      animating.current = true;

      // Disable orbit controls during focus
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
      }
    } else {
      // Animate back to saved orbit position
      if (savedOrbitPos.current.lengthSq() > 0) {
        targetPos.current.copy(savedOrbitPos.current);
        targetLookAt.current.copy(savedOrbitTarget.current);
        animating.current = true;
      }
    }
  }, [focusedBuilding, camera]);

  // Smooth camera animation — skip when idle
  useFrame(() => {
    if (!animating.current) return;

    const speed = focusedBuilding ? 0.04 : 0.12;
    camera.position.lerp(targetPos.current, speed);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, speed);
    }

    const dist = camera.position.distanceTo(targetPos.current);
    if (dist < 0.05) {
      animating.current = false;
      camera.position.copy(targetPos.current);
      if (controlsRef.current) {
        controlsRef.current.target.copy(targetLookAt.current);
        if (!focusedBuilding) {
          controlsRef.current.enabled = true;
        }
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableDamping
      dampingFactor={0.05}
      minDistance={8}
      maxDistance={45}
      maxPolarAngle={Math.PI / 2.2}
      minPolarAngle={Math.PI / 6}
      target={orbitTarget}
    />
  );
}
