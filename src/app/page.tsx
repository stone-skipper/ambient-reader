"use client"; // This is a client component 👈🏽

import Image from "next/image";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { SoftShadows, CameraControls } from "@react-three/drei";
// import { useControls } from "leva";
import { useSpring } from "@react-spring/core";
import { a } from "@react-spring/three";
import { motion } from "framer-motion";
import Toolbar from "../component/toolbar";
import Contact from "../component/contact";
import { IBM_Plex_Mono } from "next/font/google";
import { InstagramLogo, TwitterLogo, Globe, Note } from "phosphor-react";

const ibm = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "700"] });

let iconSize = 14;

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
      <sphereGeometry args={[7, 6, 6, 0.1, 0.1, 0.1, 1]} />
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
const transition = { duration: 0.7 };
export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [darkModeAnim, setDarkModeAnim] = useState(0);
  const [ambience, setAmbience] = useState(false);
  const [windowShadow, setWindowShadow] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const [threeLoading, setThreeLoading] = useState(false);
  // const { enabled, ...config } = useControls({
  //   enabled: true,
  //   size: { value: 25, min: 0, max: 100 },
  //   focus: { value: 0.6, min: 0, max: 2 },
  //   samples: { value: 10, min: 1, max: 20, step: 1 },
  // });
  const cameraControlRef = useRef<CameraControls | null>(null);
  const lightAudioRef = useRef(null);
  const nightAudioRef = useRef(null);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setAmbience(true);
  //   }, 4000);
  // }, []);
  useEffect(() => {
    if (!!lightAudioRef.current) {
      // @ts-ignore
      lightAudioRef.current.volume = 0.5;
    }
    if (!!nightAudioRef.current) {
      // @ts-ignore
      nightAudioRef.current.volume = 0.5;
    }
  }, [lightAudioRef, nightAudioRef]);

  useEffect(() => {
    cameraControlRef.current?.rotatePolarTo(0);
    cameraControlRef.current?.rotateAzimuthTo(0);
    cameraControlRef.current?.setLookAt(-20, 20, -30, -8, -10, -28);
    if (darkMode === true && ambience === true && threeLoading === true) {
      setDarkModeAnim(Number(!darkModeAnim));

      // @ts-ignore
      nightAudioRef.current?.play();
      // @ts-ignore
      lightAudioRef.current?.pause();
      setColor("#232737");
    } else if (
      darkMode === false &&
      ambience === true &&
      threeLoading === true
    ) {
      setDarkModeAnim(0);
      // cameraControlRef.current?.rotatePolarTo(0);
      // cameraControlRef.current?.rotateAzimuthTo(0);
      // cameraControlRef.current?.setLookAt(-20, 20, -30, -8, -10, -28);
      // @ts-ignore
      lightAudioRef.current?.play();
      // @ts-ignore
      nightAudioRef.current?.pause();
      setColor("#F3F3F3");
    } else if (darkMode === true && ambience === false) {
      // cameraControlRef.current?.rotatePolarTo(0);
      // cameraControlRef.current?.rotateAzimuthTo(0);
      // cameraControlRef.current?.setLookAt(-20, 20, -30, -8, -10, -28);
      // @ts-ignore
      lightAudioRef.current?.pause();
      // @ts-ignore
      nightAudioRef.current?.pause();
      setColor("#000000");
    } else {
      console.log("!");
      // cameraControlRef.current?.rotatePolarTo(0);
      // cameraControlRef.current?.rotateAzimuthTo(0);
      // cameraControlRef.current?.setLookAt(-20, 20, -30, -8, -10, -28);
      // @ts-ignore
      lightAudioRef.current?.pause();
      // @ts-ignore
      nightAudioRef.current?.pause();
      setColor("#ffffff");
    }
  }, [darkMode, ambience, threeLoading]);

  const { spring } = useSpring({
    spring: darkModeAnim,
    config: { mass: 5, tension: 400, friction: 200, precision: 0.0001 },
  });

  const rotation_x = spring.to([0, 1], [0, Math.PI]);
  const rotation_y = spring.to([0, 1], [Math.PI * 0.1, Math.PI * 0.14]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100%",
        background: color,
        color: darkMode === false ? "black" : "white",
      }}
    >
      <Contact darkMode={darkMode} />

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
          // display: ambience === true ? "block" : "none",
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
          <a.group
            rotation-z={rotation_x}
            // rotation-x={rotation_x}
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
              <shadowMaterial
                transparent
                opacity={darkMode === true ? 1 : 0.4}
              />
            </mesh>
            <Spheres position={[5, 10, 8]} number={200} />
            <Plants position={[5, 11, 8]} number={300} />
            <Spheres position={[-6, 8, 3]} number={200} />
            <Plants position={[-6, 10, 3]} number={300} />

            {windowShadow === true && <Window position={[0, 4, 3]} />}
          </group>
          {/* <Perf position="top-left" /> */}
        </Canvas>
      </motion.div>
      <motion.div
        style={{
          width: "100vw",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          mixBlendMode: "multiply",
          // transform: "rotate(90deg)",
        }}
        animate={{
          opacity: ambience === true && threeLoading === true ? 1 : 0,
        }}
        transition={transition}
      >
        <Image
          src="https://img.freepik.com/free-photo/paper-texture_1194-6010.jpg"
          alt="texture"
          fill={true}
          objectFit="cover"
        />
      </motion.div>

      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            paddingTop: "15vh",
            width: "50%",
            display: "flex",
            gap: 20,
            // background: "rgba(0,0,0,0.1)",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <div style={{ position: "fixed", zIndex: 100, top: 20, left: 0 }}>
            <audio
              controls
              ref={lightAudioRef}
              style={{ opacity: 0, pointerEvents: "none" }}
              loop={true}
            >
              <source src="whitenoise.mp3" type="audio/mpeg" />
            </audio>
            <audio
              controls
              ref={nightAudioRef}
              style={{ opacity: 0, pointerEvents: "none" }}
              loop={true}
            >
              <source src="nightnoise.mp3" type="audio/mpeg" />
            </audio>
          </div>
          <Toolbar
            onClick={() => {
              setDarkMode(!darkMode);
            }}
            left={darkMode}
            darkMode={darkMode}
            ambience={ambience}
            onAmbienceClick={() => {
              setAmbience(!ambience);
            }}
            color={color}
          />
          <div
            style={{
              width: "100%",
              display: "flex",
              gap: 20,
              // background: "rgba(0,0,0,0.1)",
              flexDirection: "column",
              position: "relative",
              overflow: "scroll",
              height: "100%",
            }}
          >
            <h1 style={{ fontSize: 48 }}>
              Dark and Light mode, <br /> reimagined
            </h1>
            <h2 style={{ fontSize: 24, opacity: 0.4 }}>
              Bringing the ambience into our screen
              <br /> <br />
            </h2>

            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                height: "fit-content",
                padding: "20px 0",
                borderTop:
                  darkMode === true
                    ? "1px solid rgba(255,255,255,0.1)"
                    : "1px solid rgba(0,0,0,0.1)",
                borderBottom:
                  darkMode === true
                    ? "1px solid rgba(255,255,255,0.1)"
                    : "1px solid rgba(0,0,0,0.1)",
              }}
              className={ibm.className}
            >
              <motion.h3
                style={{ fontSize: 12, cursor: "pointer", opacity: 0.4 }}
                onClick={() => {
                  navigator.clipboard.writeText(
                    "https://ambient-reader.vercel.app"
                  );
                }}
                whileHover={{ opacity: 1 }}
              >
                Copy URL
              </motion.h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                  width: "fit-content",
                  height: "fit-content",
                  alignItems: "center",
                }}
              >
                <h3 style={{ fontSize: 12, opacity: 0.4 }}>
                  Created by Seungmee Lee
                </h3>

                <motion.div
                  style={{ opacity: 0.4 }}
                  whileHover={{ opacity: 1 }}
                >
                  <Globe
                    color={darkMode === true ? "white" : "black"}
                    weight="bold"
                    size={iconSize}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open("https://seungmee-lee.com", "_blank");
                    }}
                  />
                </motion.div>
                <motion.div
                  style={{ opacity: 0.4 }}
                  whileHover={{ opacity: 1 }}
                >
                  <Note
                    color={darkMode === true ? "white" : "black"}
                    weight="bold"
                    size={iconSize}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open("https://posts.cv/seungmee_lee", "_blank");
                    }}
                  />
                </motion.div>
                <motion.div
                  style={{ opacity: 0.4 }}
                  whileHover={{ opacity: 1 }}
                >
                  <InstagramLogo
                    color={darkMode === true ? "white" : "black"}
                    weight="bold"
                    size={iconSize}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open(
                        "https://instagram.com/@stone.skipper",
                        "_blank"
                      );
                    }}
                  />
                </motion.div>
                <motion.div
                  style={{ opacity: 0.4 }}
                  whileHover={{ opacity: 1 }}
                >
                  <TwitterLogo
                    color={darkMode === true ? "white" : "black"}
                    weight="bold"
                    size={iconSize}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open("https://twitter.com/@smee_leee", "_blank");
                    }}
                  />
                </motion.div>
              </div>
            </div>

            <p
              style={{
                paddingTop: 30,
                lineHeight: 1.8,
                whiteSpace: "pre-line",
                paddingBottom: "20vh",
              }}
            >
              {`This is a quick prototype of an idea, inspired by a bright sunny weekend in Singapore.
            
            Since I've relocated to Singapore, I've learned the beauty of spending my time outside, for walks, reading, or just to listen to a music without doing anything. You might wonder if it's hot outside, but actually, with a nice breeze under the shades of trees, and sometimes sounds of water from pools nearby, it's a perfect weather to chill.
            
            When I want to stay away from phones and works, I grab a light paper book that I borrowed from a library, and go out. Sometimes I go to a park nearby, and find an empty chair under trees, or go to a beach bed near a swimming pool. 
            
            This prototype was also inspired when I was out for quick reading outside. When I was enjoying the moment, I started to imagine bringing this nice ambience to somewhere I spend time more often - to screens and website. 

            How does it feel for you to have this ambience? Do you think it's going to help you feel better when you're reading boring articles or documents on a screen? 

            When we build something, it's always about the priority. We focus on MVP, minimal viable product, and designers focus on user experience but mostly about usability, readability, accessibility and many more to ensure it's usable for most of users. These are 'must-to-have'

            But this prototype made me question to myself, whether there's a room for these type of 'nice-to-have', things that make users... just feel good. Especially as building an app or website getting easier and more dynamic with different librarys like THREE.js, shaders, and many more, I feel like we're at a good phase to experiment and build these niche interactions and products. It might not be highly profitable or appropriate for large audience, but there'll be niche users who appreciate for these little nice touches.
            `}
              {/* We, as a designer, think lots about a good user experience and how to achieve it. We consider the experience in many different angles - from usability, readability, affordance, accessibility, sustainability... and many more. These are critical ones to ensure what we design succeeds to achive practical value. These are 'must-to-have'.

But there're lots of 'nice-to-have' that  */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
