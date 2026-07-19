import { Suspense, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { VisualizationAssetDef } from '../../data/visualizationSequences';

interface Props {
  asset: VisualizationAssetDef;
  active?: boolean;
}

/** Convert a MeshStandardMaterial to a cheaper MeshLambertMaterial */
function toLambertMaterial(mat: THREE.Material): THREE.Material {
  if (!(mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
    return mat.clone();
  }
  const std = mat as THREE.MeshStandardMaterial;
  return new THREE.MeshLambertMaterial({
    color: std.color,
    map: std.map,
    emissive: std.emissive,
    emissiveIntensity: std.emissiveIntensity,
    emissiveMap: std.emissiveMap,
    transparent: std.transparent,
    opacity: std.opacity,
    side: std.side,
    alphaMap: std.alphaMap,
    alphaTest: std.alphaTest,
  });
}

function normalizeModelNodeName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function findModelNode(root: THREE.Object3D, targetName: string) {
  const exact = root.getObjectByName(targetName);
  if (exact) return exact;

  const normalizedTarget = normalizeModelNodeName(targetName);
  let fuzzyMatch: THREE.Object3D | null = null;

  root.traverse((child) => {
    if (!fuzzyMatch && normalizeModelNodeName(child.name) === normalizedTarget) {
      fuzzyMatch = child;
    }
  });

  return fuzzyMatch;
}

function ProceduralAsset({ asset, active = false }: Props) {
  const color = asset.color || '#74828a';
  const emissive = active ? 0.3 : 0.12;
  const size = asset.targetSize || 5;
  const height = asset.height || size * 0.7;
  const metalProps = { color, emissive: color, emissiveIntensity: emissive, roughness: 0.55, metalness: 0.35 };

  switch (asset.shape) {
    case 'terminal':
      return (
        <group>
          <mesh position={[0, height * 0.45, 0]}>
            <boxGeometry args={[size * 0.8, height, size * 0.5]} />
            <meshStandardMaterial {...metalProps} />
          </mesh>
          <mesh position={[0, height * 0.72, size * 0.28]} rotation={[-0.35, 0, 0]}>
            <boxGeometry args={[size * 0.62, height * 0.36, size * 0.06]} />
            <meshStandardMaterial color="#90b7c5" emissive="#90b7c5" emissiveIntensity={active ? 1.3 : 0.5} />
          </mesh>
        </group>
      );
    case 'archive':
      return (
        <group>
          {[0, 0.42, 0.84].map((offset, index) => (
            <mesh key={offset} position={[0, height * 0.2 + offset, index * 0.08]}>
              <boxGeometry args={[size * 0.75, height * 0.34, size * 0.55]} />
              <meshStandardMaterial {...metalProps} />
            </mesh>
          ))}
        </group>
      );
    case 'dish':
      return (
        <group>
          <mesh position={[0, height * 0.4, 0]}>
            <cylinderGeometry args={[size * 0.1, size * 0.14, height * 0.8, 10]} />
            <meshStandardMaterial {...metalProps} />
          </mesh>
          <mesh position={[0, height * 0.86, 0]} rotation={[-0.65, 0.6, 0]}>
            <sphereGeometry args={[size * 0.36, 18, 12, 0, Math.PI]} />
            <meshStandardMaterial {...metalProps} />
          </mesh>
        </group>
      );
    case 'frame':
      return (
        <group>
          <mesh position={[0, height * 0.55, 0]}>
            <boxGeometry args={[size * 0.9, height * 1.1, size * 0.08]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={emissive} roughness={0.8} metalness={0.1} />
          </mesh>
          <mesh position={[0, height * 0.55, size * 0.05]}>
            <planeGeometry args={[size * 0.68, height * 0.88]} />
            <meshStandardMaterial color="#9bb9c8" emissive="#9bb9c8" emissiveIntensity={active ? 0.9 : 0.3} />
          </mesh>
        </group>
      );
    case 'capsule':
      return (
        <mesh position={[0, height * 0.5, 0]}>
          <capsuleGeometry args={[size * 0.22, height * 0.72, 8, 16]} />
          <meshStandardMaterial {...metalProps} />
        </mesh>
      );
    case 'stack':
      return (
        <group>
          {[0, 0.38, 0.76].map((offset, index) => (
            <mesh key={offset} position={[0, height * 0.2 + offset, index % 2 === 0 ? 0.12 : -0.12]}>
              <boxGeometry args={[size * 0.82, height * 0.28, size * 0.48]} />
              <meshStandardMaterial {...metalProps} />
            </mesh>
          ))}
        </group>
      );
    case 'sensorRig':
      return (
        <group>
          <mesh position={[0, height * 0.35, 0]}>
            <cylinderGeometry args={[size * 0.08, size * 0.1, height * 0.7, 8]} />
            <meshStandardMaterial {...metalProps} />
          </mesh>
          {[-0.42, 0, 0.42].map((offset) => (
            <mesh key={offset} position={[offset, height * 0.78, 0]}>
              <boxGeometry args={[size * 0.22, height * 0.14, size * 0.22]} />
              <meshStandardMaterial color="#9db9c3" emissive="#9db9c3" emissiveIntensity={active ? 0.9 : 0.3} />
            </mesh>
          ))}
        </group>
      );
    case 'weatherTower':
      return (
        <group>
          {[[-0.22, 0, -0.22], [0.22, 0, -0.22], [-0.22, 0, 0.22], [0.22, 0, 0.22]].map((pos, index) => (
            <mesh key={index} position={[pos[0], height * 0.42, pos[2]]}>
              <boxGeometry args={[size * 0.06, height * 0.84, size * 0.06]} />
              <meshStandardMaterial {...metalProps} />
            </mesh>
          ))}
          <mesh position={[0, height * 0.92, 0]}>
            <boxGeometry args={[size * 0.6, height * 0.08, size * 0.6]} />
            <meshStandardMaterial {...metalProps} />
          </mesh>
        </group>
      );
    case 'buoy':
      return (
        <group>
          <mesh position={[0, height * 0.26, 0]}>
            <cylinderGeometry args={[size * 0.28, size * 0.36, height * 0.52, 12]} />
            <meshStandardMaterial {...metalProps} />
          </mesh>
          <mesh position={[0, height * 0.66, 0]}>
            <cylinderGeometry args={[size * 0.08, size * 0.1, height * 0.42, 8]} />
            <meshStandardMaterial {...metalProps} />
          </mesh>
        </group>
      );
    case 'scoreboard':
      return (
        <group>
          <mesh position={[0, height * 0.6, 0]}>
            <boxGeometry args={[size, height * 0.76, size * 0.12]} />
            <meshStandardMaterial {...metalProps} />
          </mesh>
          <mesh position={[0, height * 0.62, size * 0.08]}>
            <planeGeometry args={[size * 0.82, height * 0.56]} />
            <meshStandardMaterial color="#91b7c6" emissive="#91b7c6" emissiveIntensity={active ? 1.1 : 0.35} />
          </mesh>
        </group>
      );
    case 'mapTable':
      return (
        <group>
          <mesh position={[0, height * 0.44, 0]}>
            <boxGeometry args={[size * 0.92, height * 0.14, size * 0.64]} />
            <meshStandardMaterial {...metalProps} />
          </mesh>
          <mesh position={[0, height * 0.52, 0]} rotation={[-0.12, 0, 0]}>
            <planeGeometry args={[size * 0.78, size * 0.48]} />
            <meshStandardMaterial color="#a3c0cb" emissive="#a3c0cb" emissiveIntensity={active ? 0.7 : 0.2} />
          </mesh>
        </group>
      );
    case 'monolith':
    default:
      return (
        <mesh position={[0, height * 0.5, 0]}>
          <boxGeometry args={[size * 0.55, height, size * 0.42]} />
          <meshStandardMaterial {...metalProps} />
        </mesh>
      );
  }
}

function LoadedAsset({ asset }: Props) {
  const path = `/models/${asset.modelFile}`;
  const { scene } = useGLTF(path, false, true);

  const cloned = useMemo(() => {
    const c = scene.clone(true);
    let root: THREE.Object3D = c;

    if (asset.modelNodeName) {
      const selectedNode = findModelNode(c, asset.modelNodeName);
      if (selectedNode) {
        const isolated = selectedNode.clone(true);
        root = new THREE.Group();
        root.add(isolated);
      }
    }

    root.traverse((child) => {
      if (child === root) return; // skip root — R3F applies scale/position props
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material = mesh.material.map((mat) => toLambertMaterial(mat));
          } else {
            mesh.material = toLambertMaterial(mesh.material);
          }
        }
      }
      // Freeze internal children whose transforms are baked from the GLB
      child.matrixAutoUpdate = false;
      child.updateMatrix();
    });

    return root;
  }, [scene, asset.modelNodeName]);

  const { scale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const targetSize = asset.targetSize || 6;
    const s = targetSize / maxDim;

    return {
      scale: s,
      offset: new THREE.Vector3(-center.x * s, -box.min.y * s, -center.z * s),
    };
  }, [cloned, asset.targetSize]);

  return <primitive object={cloned} scale={[scale, scale, scale]} position={[offset.x, offset.y, offset.z]} />;
}

export default function SceneAsset({ asset, active = false }: Props) {
  if (asset.kind === 'glb' && asset.modelFile) {
    return (
      <Suspense fallback={<ProceduralAsset asset={{ kind: 'shape', shape: 'monolith', color: asset.color || '#738088', targetSize: asset.targetSize, height: asset.height }} active={active} />}>
        <LoadedAsset asset={asset} />
      </Suspense>
    );
  }

  return <ProceduralAsset asset={asset} active={active} />;
}
