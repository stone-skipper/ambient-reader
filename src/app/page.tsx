"use client"; // This is a client component 👈🏽

import { useRef, useState, useEffect } from "react";
import Toolbar from "../component/toolbar";
import ShadowCanvas from "../component/shadowCanvas";
import CreatorInfo from "../component/creatorInfo";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [darkModeAnim, setDarkModeAnim] = useState(0);
  const [ambience, setAmbience] = useState(false);
  const [color, setColor] = useState("#ffffff");

  const lightAudioRef = useRef(null);
  const nightAudioRef = useRef(null);

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
    if (darkMode === true && ambience === true) {
      // when it's dark mode + ambience on
      setDarkModeAnim(Number(!darkModeAnim));
      // @ts-ignore
      nightAudioRef.current?.play();
      // @ts-ignore
      lightAudioRef.current?.pause();
      setColor("#232737");
    } else if (darkMode === false && ambience === true) {
      // when it's light mode + ambience on
      setDarkModeAnim(0);
      // @ts-ignore
      lightAudioRef.current?.play();
      // @ts-ignore
      nightAudioRef.current?.pause();
      setColor("#F3F3F3");
    } else if (darkMode === true && ambience === false) {
      // when it's dark mode + ambience off
      // @ts-ignore
      lightAudioRef.current?.pause();
      // @ts-ignore
      nightAudioRef.current?.pause();
      setColor("#000000");
    } else {
      // when it's light mode + ambience off
      // @ts-ignore
      lightAudioRef.current?.pause();
      // @ts-ignore
      nightAudioRef.current?.pause();
      setColor("#ffffff");
    }
  }, [darkMode, ambience]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100%",
        background: color,
        color: darkMode === false ? "black" : "white",
      }}
    >
      <ShadowCanvas
        ambience={ambience}
        darkMode={darkMode}
        darkModeAnim={darkModeAnim}
      />

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
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* hidden audio component */}
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
          {/* article content */}
          <div
            style={{
              width: "100%",
              display: "flex",
              gap: 20,
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

            <CreatorInfo darkMode={darkMode} />
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
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
