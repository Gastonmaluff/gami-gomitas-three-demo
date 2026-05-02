import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

export default function GummyCandy({ color, position, rotation, size, shape, trigger }) {
  const mesh = useRef();
  const startTime = useRef(-10);
  const basePosition = useMemo(() => new THREE.Vector3(...position), [position]);
  const baseRotation = useMemo(() => new THREE.Euler(...rotation), [rotation]);
  const jitter = useMemo(
    () => ({
      phase: Math.random() * Math.PI * 2,
      strength: 0.45 + Math.random() * 0.35,
      x: (Math.random() - 0.5) * 0.55,
      y: 0.38 + Math.random() * 0.38,
      z: (Math.random() - 0.5) * 0.12,
    }),
    [],
  );

  useEffect(() => {
    startTime.current = performance.now() / 1000;
  }, [trigger]);

  useFrame(() => {
    if (!mesh.current) return;

    const elapsed = performance.now() / 1000 - startTime.current;
    const active = elapsed < 1.45;
    const decay = active ? Math.exp(-elapsed * 1.75) : 0;
    const bounce = active ? Math.abs(Math.sin(elapsed * 11 + jitter.phase)) * decay : 0;
    const wiggle = active ? Math.sin(elapsed * 16 + jitter.phase) * decay : 0;

    mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, basePosition.x + jitter.x * wiggle, 0.18);
    mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, basePosition.y + jitter.y * bounce * jitter.strength, 0.2);
    mesh.current.position.z = THREE.MathUtils.lerp(mesh.current.position.z, basePosition.z + jitter.z * wiggle, 0.18);
    mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, baseRotation.x + wiggle * 1.2, 0.16);
    mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, baseRotation.y + bounce * 0.65, 0.16);
    mesh.current.rotation.z = THREE.MathUtils.lerp(mesh.current.rotation.z, baseRotation.z + wiggle * 1.4, 0.16);
  });

  return (
    <mesh ref={mesh} position={position} rotation={rotation} castShadow receiveShadow>
      {shape === 0 ? (
        <capsuleGeometry args={[size * 0.48, size * 0.72, 8, 22]} />
      ) : shape === 1 ? (
        <torusGeometry args={[size * 0.58, size * 0.2, 14, 28]} />
      ) : (
        <sphereGeometry args={[size * 0.58, 24, 16]} />
      )}
      <meshPhysicalMaterial
        color={color}
        roughness={0.12}
        metalness={0}
        transmission={0.35}
        transparent
        opacity={0.78}
        thickness={0.42}
        clearcoat={1}
        clearcoatRoughness={0.06}
        ior={1.38}
      />
    </mesh>
  );
}
