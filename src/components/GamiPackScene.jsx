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

const candyPalette = ['#f05a58', '#56d7bf', '#d8df4d', '#f48cae', '#49c6b4'];

function ZigZagSeal({ y, flip = 1 }) {
  return (
    <group position={[0, y, 0.2]}>
      {Array.from({ length: 25 }, (_, index) => (
        <mesh
          key={index}
          position={[-1.95 + index * 0.162, flip * 0.02, 0.07]}
          rotation={[0, 0, flip > 0 ? 0 : Math.PI]}
        >
          <coneGeometry args={[0.058, 0.12, 3]} />
          <meshStandardMaterial color="#14a873" roughness={0.5} metalness={0.02} />
        </mesh>
      ))}
    </group>
  );
}

function RibbedSeal({ y }) {
  return (
    <group position={[0, y, 0.25]}>
      {Array.from({ length: 7 }, (_, index) => (
        <mesh key={index} position={[0, -0.13 + index * 0.043, 0.055]}>
          <boxGeometry args={[3.9, 0.012, 0.035]} />
          <meshStandardMaterial color={index % 2 ? '#42c995' : '#0f9b68'} roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function TubeLine({ points, color = '#ffffff', radius = 0.018, opacity = 0.78 }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
    return new THREE.TubeGeometry(curve, 36, radius, 10, false);
  }, [points, radius]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.22} />
    </mesh>
  );
}

function Starburst() {
  const rays = [
    [[-0.12, 0.76, 0.31], [-1.55, 1.24, 0.33]],
    [[-0.02, 0.82, 0.31], [-0.92, 1.48, 0.33]],
    [[0.18, 0.84, 0.31], [0.45, 1.56, 0.33]],
    [[0.32, 0.78, 0.31], [1.35, 1.3, 0.33]],
    [[0.08, 0.56, 0.31], [-1.42, 0.48, 0.33]],
    [[0.38, 0.55, 0.31], [1.58, 0.44, 0.33]],
  ];

  return (
    <group>
      {rays.map((points, index) => (
        <TubeLine key={index} points={points} radius={0.014} opacity={0.38} />
      ))}
    </group>
  );
}

function MiniCowMascot() {
  return (
    <group position={[1.05, -0.16, 0.62]} rotation={[0, 0, -0.08]} scale={0.76}>
      <RoundedBox args={[0.52, 0.82, 0.09]} radius={0.18} smoothness={8} position={[0, -0.38, 0]} castShadow>
        <meshPhysicalMaterial color="#f5a0b6" roughness={0.3} clearcoat={0.35} />
      </RoundedBox>
      <mesh position={[0, 0.14, 0.08]} castShadow>
        <sphereGeometry args={[0.27, 28, 20]} />
        <meshStandardMaterial color="#fff7ee" roughness={0.32} />
      </mesh>
      <mesh position={[0.02, -0.02, 0.16]} castShadow>
        <sphereGeometry args={[0.2, 24, 16]} />
        <meshStandardMaterial color="#ffa37a" roughness={0.38} />
      </mesh>
      <mesh position={[-0.1, 0.21, 0.23]}>
        <sphereGeometry args={[0.04, 12, 10]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[0.11, 0.21, 0.23]}>
        <sphereGeometry args={[0.04, 12, 10]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[0.08, -0.02, 0.27]}>
        <torusGeometry args={[0.075, 0.014, 8, 18, Math.PI]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[-0.18, 0.12, 0.2]}>
        <sphereGeometry args={[0.06, 10, 8]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[0.22, 0.08, 0.2]}>
        <sphereGeometry args={[0.055, 10, 8]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[0.02, 0.43, 0.2]} rotation={[0, 0, -0.1]}>
        <sphereGeometry args={[0.35, 24, 10, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
        <meshStandardMaterial color="#6d5b37" roughness={0.52} />
      </mesh>
      <mesh position={[0.02, 0.6, 0.22]} rotation={[0, 0, -0.08]}>
        <cylinderGeometry args={[0.14, 0.22, 0.14, 18]} />
        <meshStandardMaterial color="#d9ba53" roughness={0.45} />
      </mesh>
      <TubeLine points={[[-0.32, -0.16, 0.13], [-0.58, 0.18, 0.16]]} color="#111111" radius={0.018} opacity={1} />
      <TubeLine points={[[0.32, -0.16, 0.13], [0.62, 0.15, 0.16]]} color="#111111" radius={0.018} opacity={1} />
      <mesh position={[-0.06, -0.39, 0.14]}>
        <boxGeometry args={[0.16, 0.19, 0.035]} />
        <meshStandardMaterial color="#db2f65" />
      </mesh>
    </group>
  );
}

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
      <RoundedBox args={[3.75, 3.15, 0.42]} radius={0.14} smoothness={8} position={[0, 0, -0.08]} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#16b87d"
          roughness={0.33}
          metalness={0.01}
          transparent
          opacity={0.86}
          clearcoat={0.72}
          clearcoatRoughness={0.16}
        />
      </RoundedBox>

      <RoundedBox args={[3.95, 0.42, 0.5]} radius={0.06} smoothness={6} position={[0, 1.55, 0]} castShadow>
        <meshPhysicalMaterial color="#0fb072" roughness={0.35} clearcoat={0.62} clearcoatRoughness={0.12} />
      </RoundedBox>
      <RoundedBox args={[3.95, 0.4, 0.5]} radius={0.06} smoothness={6} position={[0, -1.55, 0]} castShadow>
        <meshPhysicalMaterial color="#0ba367" roughness={0.35} clearcoat={0.62} clearcoatRoughness={0.12} />
      </RoundedBox>
      <ZigZagSeal y={1.72} flip={1} />
      <ZigZagSeal y={-1.72} flip={-1} />
      <RibbedSeal y={1.52} />
      <RibbedSeal y={-1.52} />

      <Starburst />
      <TubeLine points={[[-1.88, 0.42, 0.43], [-0.7, 0.18, 0.44], [0.65, 0.24, 0.44], [1.9, 0.58, 0.43]]} radius={0.026} opacity={0.95} />
      <TubeLine points={[[-1.82, -0.96, 0.44], [-0.45, -0.76, 0.46], [0.84, -0.86, 0.46], [1.86, -0.68, 0.44]]} radius={0.028} opacity={0.95} />

      <RoundedBox args={[3.42, 1.42, 0.08]} radius={0.18} smoothness={12} position={[-0.05, -0.42, 0.24]}>
        <meshPhysicalMaterial
          color="#bbfff0"
          roughness={0.03}
          transmission={0.38}
          transparent
          opacity={0.34}
          thickness={0.35}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </RoundedBox>

      <RoundedBox args={[1.6, 0.82, 0.13]} radius={0.18} smoothness={10} position={[-0.08, 0.88, 0.38]} castShadow>
        <meshPhysicalMaterial color="#086735" roughness={0.28} clearcoat={0.45} />
      </RoundedBox>
      <Text
        position={[-0.08, 1.0, 0.5]}
        fontSize={0.32}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontWeight={700}
      >
        GAMI
      </Text>
      <Text position={[-0.08, 0.7, 0.5]} fontSize={0.27} color="#ffffff" anchorX="center" anchorY="middle" fontWeight={700}>
        GOMITAS
      </Text>
      <Text position={[-0.06, 0.46, 0.49]} fontSize={0.16} color="#ffffff" anchorX="center" anchorY="middle" fontWeight={700}>
        GRANJERITOS
      </Text>

      <Text position={[-1.42, 1.06, 0.5]} rotation={[0, 0, -0.08]} fontSize={0.17} color="#132822" anchorX="center" anchorY="middle">
        LTE.M{'\n'}02.10.2026
      </Text>
      <Text position={[-1.18, -1.16, 0.5]} fontSize={0.14} color="#ffffff" anchorX="center" anchorY="middle" fontWeight={700}>
        CONTENIDO NETO 30g
      </Text>
      <Text position={[-1.02, -1.36, 0.5]} fontSize={0.075} color="#ffffff" anchorX="center" anchorY="middle">
        PASTILLAS DE GOMA FANTASIA SABOR TUTTI FRUTTI
      </Text>
      <RoundedBox args={[0.36, 0.48, 0.06]} radius={0.02} smoothness={2} position={[1.42, -1.16, 0.51]}>
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </RoundedBox>
      <Text position={[1.42, -1.19, 0.56]} fontSize={0.09} color="#101010" anchorX="center" anchorY="middle" fontWeight={700}>
        SIN{'\n'}GLUTEN
      </Text>
      <Text position={[1.11, -1.42, 0.52]} fontSize={0.1} color="#ffffff" anchorX="center" anchorY="middle" fontWeight={700}>
        INDUSTRIA PARAGUAYA
      </Text>
      <MiniCowMascot />

      <mesh position={[-0.55, 0.0, 0.55]} rotation={[0, 0, 0.55]}>
        <planeGeometry args={[0.16, 2.85]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.18} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.28, 0.04, 0.56]} rotation={[0, 0, -0.2]}>
        <planeGeometry args={[0.12, 2.72]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.14} side={THREE.DoubleSide} />
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
          -1.15 + (index % 6) * 0.43,
          -0.88 + Math.floor(index / 6) * 0.34,
          0.29 + (index % 3) * 0.045,
        ],
        rotation: [Math.random() * 0.4, Math.random() * 0.5, Math.random() * Math.PI],
        size: 0.21 + (index % 4) * 0.024,
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
        scale={0.86}
        rotation={[0.06, -0.18, 0]}
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
      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
