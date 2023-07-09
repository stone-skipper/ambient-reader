"use client"; // This is a client component 👈🏽

import Image from "next/image";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { SoftShadows, CameraControls } from "@react-three/drei";
import { useControls } from "leva";
import { useSpring } from "@react-spring/core";
import { a } from "@react-spring/three";
import { motion } from "framer-motion";

const easeInOutCubic = (t: any) =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
const deg2rad = (degrees: any) => degrees * (Math.PI / 180);

function Sphere({ position = [0, 0, 0], ...props }) {
  const ref = useRef();
  const factor = useMemo(() => 0.5 + Math.random(), []);
  useFrame((state) => {
    const t = easeInOutCubic(
      (1 + Math.sin(state.clock.getElapsedTime() * factor)) / 2
    );
    // @ts-ignore
    ref.current.position.y = position[1] + t * 1;
    // @ts-ignore
    // ref.current.scale.y = 1 + t * 3;
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
    // @ts-ignore
    // ref.current.scale.y = 1 + t * 3;
  });
  return (
    <mesh ref={ref} position={position} {...props} castShadow receiveShadow>
      <sphereGeometry args={[5, 6, 6, 0.1, 0.1, 0.1, 1]} />
      <meshLambertMaterial color="white" roughness={0} metalness={0.1} />
    </mesh>
  );
}

function WindowPillar({ position = [0, 0, 0], axis = "x", ...props }) {
  const ref = useRef();

  return (
    <mesh
      ref={ref}
      position={position}
      {...props}
      castShadow
      receiveShadow
      rotation={axis === "x" ? [0, 0, 0] : [0, 0, -Math.PI / 2]}
    >
      <boxGeometry args={[0.2, props.size, 0.2]} />
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
    () => [...new Array(number)].map((info, index) => [0, index * 0.1, 0]),
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
  // useFrame(
  //   (state) =>
  //     // @ts-ignore
  //     (ref.current.rotation.y =
  //       Math.sin(state.clock.getElapsedTime() / 10) * Math.PI)
  // );
  return (
    <group ref={ref} position={position}>
      {rotations.map((rot, index) => (
        <Plant key={index} rotation={rot} position={positions[index]} />
      ))}
    </group>
  );
}
function Window({ xPillar = 4, yPillar = 4, position = [0, 0, 0] }) {
  const ref = useRef();
  const width = 15;
  const Xpositions = useMemo(
    () =>
      [...new Array(xPillar)].map((info, index) => [
        (width / xPillar + 1) * index - width / 2 - index * 0.2, //0.1 is for the half of the pillar width
        width / 2 - 0.1,
        0,
      ]),
    []
  );
  const Ypositions = useMemo(
    () =>
      [...new Array(yPillar)].map((info, index) => [
        0,
        (width / yPillar + 1) * index - index * 0.2,
        0,
      ]),
    []
  );

  return (
    <group ref={ref} position={position}>
      {Xpositions.map((pos, index) => (
        <WindowPillar key={index} position={pos} axis="x" size={width} />
      ))}
      {Ypositions.map((pos, index) => (
        <WindowPillar key={index} position={pos} axis="y" size={width} />
      ))}
    </group>
  );
}

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [darkModeAnim, setDarkModeAnim] = useState(0);
  const [ambience, setAmbience] = useState(true);
  const [window, setWindow] = useState(true);
  const { enabled, ...config } = useControls({
    enabled: true,
    size: { value: 25, min: 0, max: 100 },
    focus: { value: 0.6, min: 0, max: 2 },
    samples: { value: 10, min: 1, max: 20, step: 1 },
  });
  const cameraControlRef = useRef<CameraControls | null>(null);

  useEffect(() => {
    if (darkMode === true) {
      setDarkModeAnim(Number(!darkModeAnim));
    } else {
      setDarkModeAnim(0);
    }
  }, [darkMode]);

  const { spring } = useSpring({
    spring: darkModeAnim,
    config: { mass: 5, tension: 400, friction: 50, precision: 0.0001 },
  });

  const rotation_x = spring.to([0, 1], [0, Math.PI * 2]);
  const rotation_y = spring.to([0, 1], [Math.PI * 0.1, Math.PI * -0.1]);

  // useThree(({ camera }) => {
  //   camera.rotation.set(deg2rad(30), 0, 0);
  //   camera.position.set(-10, 30, 10);
  // });
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: darkMode === false ? "white" : "#19213D",
        color: darkMode === false ? "black" : "white",
      }}
    >
      {ambience === true && (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            position: "absolute",
            top: 0,
            left: 0,
            mixBlendMode: "multiply",
            // transform: "rotate(90deg)",
          }}
        >
          <Image
            src="https://img.freepik.com/free-photo/paper-texture_1194-6010.jpg"
            alt="texture"
            fill={true}
            objectFit="cover"
          />
        </div>
      )}
      <div
        style={{
          width: "100%",
          overflow: "scroll",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            paddingTop: "20vh",
            width: "50%",
            display: "flex",
            gap: 20,
            // background: "rgba(0,0,0,0.1)",
            flexDirection: "column",
          }}
        >
          <div
            onClick={() => {
              setDarkMode(!darkMode);
            }}
            style={{ position: "fixed", zIndex: 10, top: 0, left: 0 }}
          >
            toggle darkmode
          </div>
          <div
            onClick={() => {
              setAmbience(!ambience);
            }}
            style={{ position: "fixed", zIndex: 10, top: 30, left: 0 }}
          >
            toggle ambience
          </div>
          {cameraControlRef.current?.getPosition(true)}

          <h1>Ambient Reader</h1>
          <h2>What if we bring the natural lights from a weekend blah blah</h2>
          <p>
            This is inspired on a bright sunny day in Singapore. <br />
            No one likes to read{" "}
          </p>
        </div>
      </div>

      <Canvas
        shadows
        camera={{
          position: [-10, 30, 10],
          fov: 45,
          rotation: [30, 0, 30],
        }}
        style={{
          width: "100vw",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          opacity: ambience === true ? 1 : 0,
          mixBlendMode: "multiply",
        }}
      >
        <CameraControls ref={cameraControlRef} />

        {enabled && <SoftShadows {...config} />}
        <fog attach="fog" args={["black", 0, 40]} />
        <ambientLight intensity={1} color="blue" />
        {/* @ts-ignore */}
        <a.group
          rotation-x={rotation_x}
          rotation-y={rotation_y}
          // ref={lightGroup}
          // rotation={
          //   darkMode === true ? [0, Math.PI / 2, Math.PI / 3] : [0, 0, 0]
          // }
        >
          <directionalLight
            castShadow
            position={[2.5, 10, 20]}
            intensity={3}
            shadow-mapSize={1024}
            color="yellow"
          >
            <orthographicCamera
              attach="shadow-camera"
              args={[-30, 30, -30, 50, 0.5, 80]}
            />
          </directionalLight>
          <directionalLight
            castShadow
            position={[-2.5, -10, 20]}
            intensity={2}
            shadow-mapSize={1024}
            color="yellow"
          >
            <orthographicCamera
              attach="shadow-camera"
              args={[-10, 10, -10, 50, 0.1, 50]}
            />
          </directionalLight>
        </a.group>
        <pointLight position={[-10, 0, -20]} color={"white"} intensity={1} />
        <pointLight position={[0, -10, 0]} intensity={1} />
        <group position={[0, -3.5, 0]}>
          {/* <mesh receiveShadow castShadow>
              <boxGeometry args={[4, 1, 1]} />
              <meshLambertMaterial />
            </mesh> */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.5, 0]}
            receiveShadow
          >
            <planeGeometry args={[1000, 1000]} />
            <shadowMaterial transparent opacity={0.4} />
          </mesh>
          <Spheres position={[5, 10, 8]} number={200} />
          <Plants position={[5, 10, 8]} number={100} />

          {window === true && <Window position={[0, 4, 3]} />}
        </group>
        {/* <Perf position="top-left" /> */}
      </Canvas>
    </div>
  );
}
