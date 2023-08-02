"use client"; // This is a client component 👈🏽

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { SoftShadows, CameraControls } from "@react-three/drei";
import { useSpring } from "@react-spring/core";
import { a } from "@react-spring/three";
import { motion } from "framer-motion";

const easeInOutCubic = (t: any) =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

function Sphere({ position = [0, 0, 0], ...props }) {
  const ref = useRef();
  const factor = useMemo(() => 0.5 + Math.random(), []);
  useFrame((state) => {
    const t = easeInOutCubic(
      (1 + Math.sin(state.clock.getElapsedTime() * factor)) / 2
    );
    // @ts-ignore
    ref.current.position.y = position[1] + t * 1;
  });
  return (
    <mesh ref={ref} position={position} {...props} castShadow receiveShadow>
      <sphereGeometry args={[0.2, 6, 6]} />
      <meshLambertMaterial color="white" roughness={0} metalness={0.1} />
    </mesh>
  );
}

function Plant({ position = [0, 0, 0], ...props }) {
  const ref = useRef();
  const factor = useMemo(() => 0.5 + Math.random(), []);
  useFrame((state) => {
    const t = easeInOutCubic(
      (1 + Math.sin(state.clock.getElapsedTime() * factor)) / 2
    );
    // @ts-ignore
    ref.current.position.y = position[1] + t * 2;
  });
  return (
    <mesh ref={ref} position={position} {...props} castShadow receiveShadow>
      <sphereGeometry args={[7, 6, 6, 0.1, 0.1, 0.1, 1]} />
      <meshLambertMaterial color="white" roughness={0} metalness={0.1} />
    </mesh>
  );
}

function Spheres({ number = 20, position = [0, 0, 0] }) {
  const ref = useRef();
  const positions = useMemo(
    () =>
      [...new Array(number)].map(() => [
        3 - Math.random() * 6,
        Math.random() * 4,
        3 - Math.random() * 6,
      ]),
    []
  );
  useFrame(
    (state) =>
      // @ts-ignore
      (ref.current.rotation.y =
        Math.sin(state.clock.getElapsedTime() / 10) * Math.PI)
  );
  return (
    <group ref={ref} position={position}>
      {positions.map((pos, index) => (
        <Sphere key={index} position={pos} />
      ))}
    </group>
  );
}

function Plants({ number = 20, position = [0, 0, 0] }) {
  const ref = useRef();
  const positions = useMemo(
    () => [...new Array(number)].map((info, index) => [0, index * 0.01, 0]),
    []
  );
  const rotations = useMemo(
    () =>
      [...new Array(number)].map((info, index) => [
        0.3,
        ((Math.PI * 2) / number) * 2 * index,
        Math.PI / 2,
      ]),
    []
  );

  return (
    <group ref={ref} position={position}>
      {rotations.map((rot, index) => (
        <Plant key={index} rotation={rot} position={positions[index]} />
      ))}
    </group>
  );
}

export default function ShadowCanvas({
  ambience = false,
  darkMode = false,
  darkModeAnim = 0,
}) {
  const [threeLoading, setThreeLoading] = useState(false);

  const cameraControlRef = useRef<CameraControls | null>(null);
  const { spring } = useSpring({
    spring: darkModeAnim,
    config: { mass: 5, tension: 400, friction: 200, precision: 0.0001 },
  });

  const rotation_x = spring.to([0, 1], [0, Math.PI]);
  const rotation_y = spring.to([0, 1], [Math.PI * 0.1, Math.PI * 0.14]);

  useEffect(() => {
    cameraControlRef.current?.rotatePolarTo(0);
    cameraControlRef.current?.rotateAzimuthTo(0);
    cameraControlRef.current?.setLookAt(-20, 20, -30, -8, -10, -28);
  }, [threeLoading]);

  return (
    <motion.div
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 2,
        mixBlendMode: "multiply",
        pointerEvents: "none",
      }}
      animate={{
        opacity: ambience === true && threeLoading === true ? 1 : 0,
      }}
    >
      <Canvas
        shadows
        camera={{
          fov: 45,
          position: [-20, 20, -30],
        }}
        style={{
          pointerEvents: "none",
          width: "100vw",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 2,
        }}
        onCreated={() => {
          setThreeLoading(true);
        }}
      >
        <CameraControls ref={cameraControlRef} makeDefault={true} />

        <SoftShadows size={25} focus={0.6} samples={10} />

        <fog attach="fog" args={["black", 0, 40]} />
        <ambientLight intensity={1} color="blue" />
        {/* @ts-ignore */}
        <a.group rotation-z={rotation_x} rotation-y={rotation_y}>
          <directionalLight
            castShadow
            position={[2.5, 10, 20]}
            intensity={3}
            shadow-mapSize={1024}
            color="yellow"
          >
            <orthographicCamera
              attach="shadow-camera"
              args={[-30, 30, -30, 100, 0.5, 80]}
            />
          </directionalLight>
          <directionalLight
            castShadow
            position={[-2.5, -10, 20]}
            intensity={6}
            shadow-mapSize={1024}
            color="yellow"
          >
            <orthographicCamera
              attach="shadow-camera"
              args={[-10, 10, -10, 100, 0.5, 80]}
            />
          </directionalLight>
        </a.group>
        <pointLight position={[-10, 0, -20]} color={"white"} intensity={1} />
        <pointLight position={[0, -10, 0]} intensity={1} />
        <group position={[0, -3.5, 0]}>
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.5, 0]}
            receiveShadow
          >
            <planeGeometry args={[1000, 1000]} />
            <shadowMaterial transparent opacity={darkMode === true ? 1 : 0.4} />
          </mesh>
          <Spheres position={[5, 10, 8]} number={200} />
          <Plants position={[5, 11, 8]} number={300} />
          <Spheres position={[-6, 8, 3]} number={200} />
          <Plants position={[-6, 10, 3]} number={300} />
        </group>
      </Canvas>
    </motion.div>
  );
}
