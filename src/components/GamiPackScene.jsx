import { Canvas, useFrame } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  Float,
  PresentationControls,
  RoundedBox,
  Text,
} from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import GummyCandy from './GummyCandy.jsx';

const candyPalette = ['#f45b69', '#ffd166', '#53d6a3', '#7a6ff0', '#ff8fab'];

function PackShell({ hover, trigger }) {
  const pack = useRef();
  const bounceStart = useRef(-10);

  useFrame(() => {
    if (!pack.current) return;

    const elapsed = performance.now() / 1000 - bounceStart.current;
    const pulse = elapsed < 1.15 ? Math.sin(elapsed * Math.PI * 3.2) * Math.exp(-elapsed * 2.25) : 0;
    const targetScale = hover ? 1.035 : 1;
    const targetY = hover ? 0.08 : 0;

    pack.current.scale.lerp(new THREE.Vector3(targetScale + pulse * 0.035, targetScale + pulse * 0.045, targetScale), 0.1);
    pack.current.position.y = THREE.MathUtils.lerp(pack.current.position.y, targetY + Math.abs(pulse) * 0.18, 0.12);
    pack.current.rotation.z = THREE.MathUtils.lerp(pack.current.rotation.z, (hover ? -0.035 : 0) + pulse * 0.09, 0.1);
    pack.current.rotation.x = THREE.MathUtils.lerp(pack.current.rotation.x, (hover ? 0.04 : 0) + pulse * 0.045, 0.1);
  });

  useEffect(() => {
    bounceStart.current = performance.now() / 1000;
  }, [trigger]);

  return (
    <group ref={pack}>
      <RoundedBox args={[2.55, 3.25, 0.42]} radius={0.16} smoothness={8} position={[0, 0, -0.08]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#ffeff5" roughness={0.42} metalness={0.02} clearcoat={0.45} clearcoatRoughness={0.22} />
      </RoundedBox>

      <RoundedBox args={[2.72, 0.38, 0.5]} radius={0.12} smoothness={8} position={[0, 1.75, 0]} castShadow>
        <meshPhysicalMaterial color="#ff4f7f" roughness={0.36} clearcoat={0.4} />
      </RoundedBox>
      <RoundedBox args={[2.72, 0.34, 0.5]} radius={0.12} smoothness={8} position={[0, -1.75, 0]} castShadow>
        <meshPhysicalMaterial color="#41c9a9" roughness={0.36} clearcoat={0.4} />
      </RoundedBox>

      <RoundedBox args={[2.24, 1.72, 0.09]} radius={0.24} smoothness={12} position={[0, -0.24, 0.18]}>
        <meshPhysicalMaterial
          color="#fff5fb"
          roughness={0.03}
          transmission={0.25}
          transparent
          opacity={0.36}
          thickness={0.35}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </RoundedBox>

      <RoundedBox args={[1.98, 0.72, 0.12]} radius={0.14} smoothness={10} position={[0, 0.86, 0.23]} castShadow>
        <meshPhysicalMaterial color="#ffffff" roughness={0.28} clearcoat={0.5} />
      </RoundedBox>
      <Text
        position={[0, 0.95, 0.32]}
        fontSize={0.28}
        color="#db2f65"
        anchorX="center"
        anchorY="middle"
        fontWeight={700}
      >
        Gami
      </Text>
      <Text position={[0, 0.62, 0.32]} fontSize={0.13} color="#1a8e7b" anchorX="center" anchorY="middle">
        gomitas brillantes
      </Text>

      <mesh position={[-1.18, 0, 0.2]}>
        <cylinderGeometry args={[0.035, 0.035, 2.64, 18]} />
        <meshStandardMaterial color="#ffd166" roughness={0.38} />
      </mesh>
      <mesh position={[1.18, 0, 0.2]}>
        <cylinderGeometry args={[0.035, 0.035, 2.64, 18]} />
        <meshStandardMaterial color="#7a6ff0" roughness={0.38} />
      </mesh>
    </group>
  );
}

function PackContents({ trigger }) {
  const candies = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        id: index,
        color: candyPalette[index % candyPalette.length],
        position: [
          -0.82 + (index % 6) * 0.33,
          -0.98 + Math.floor(index / 6) * 0.38,
          0.25 + (index % 3) * 0.04,
        ],
        rotation: [Math.random() * 0.4, Math.random() * 0.5, Math.random() * Math.PI],
        size: 0.18 + (index % 4) * 0.018,
        shape: index % 3,
      })),
    [],
  );

  return (
    <group>
      {candies.map((candy) => (
        <GummyCandy key={candy.id} {...candy} trigger={trigger} />
      ))}
    </group>
  );
}

function GamiPackModel() {
  const [hover, setHover] = useState(false);
  const [trigger, setTrigger] = useState(0);

  return (
    <Float speed={1.45} rotationIntensity={0.08} floatIntensity={0.18}>
      <group
        scale={0.94}
        rotation={[0.08, -0.28, 0]}
        position={[0, 0.08, 0]}
        onClick={(event) => {
          event.stopPropagation();
          setTrigger((value) => value + 1);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHover(true);
        }}
        onPointerOut={() => setHover(false)}
      >
        <PackContents trigger={trigger} />
        <PackShell hover={hover} trigger={trigger} />
      </group>
    </Float>
  );
}

export default function GamiPackScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.18, 6.1], fov: 38 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
    >
      <color attach="background" args={['#fff8fb']} />
      <ambientLight intensity={0.7} />
      <spotLight position={[2.8, 4.4, 3.8]} angle={0.34} penumbra={0.65} intensity={1.55} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-3.2, 1.6, 3.2]} intensity={0.75} color="#ff87ad" />
      <pointLight position={[3, -1, 2]} intensity={0.38} color="#55e4bf" />
      <Suspense fallback={null}>
        <PresentationControls
          global
          snap={{ mass: 1.1, tension: 140 }}
          rotation={[0, 0, 0]}
          polar={[-0.12, 0.18]}
          azimuth={[-0.24, 0.24]}
        >
          <GamiPackModel />
        </PresentationControls>
        <ContactShadows position={[0, -2.08, 0]} opacity={0.28} scale={5.5} blur={2.7} far={4.5} />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
