import { motion } from "framer-motion";
import Toggle from "./toggle";
import { useState } from "react";
import { IBM_Plex_Mono } from "next/font/google";
const ibm = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "700"] });

export default function Toolbar({
  left = true,
  onClick,
  darkMode = true,
  ambience,
  onAmbienceClick,
}) {
  const [hover, setHover] = useState(false);
  return (
    <>
      <div
        style={{
          width: "100%",
          height: "18vh",
          top: 0,
          left: 0,
          position: "fixed",
          paddingTop: 10,
          zIndex: 1,
          display: "flex",
          justifyContent: "center",
          background: "blue",
          background:
            darkMode === true
              ? "linear-gradient(rgba(35,39,55,1), rgba(35,39,55,1), rgba(35,39,55,0))"
              : "linear-gradient(rgba(255,255,255,1), rgba(255,255,255,1), rgba(255,255,255,0))",
        }}
      ></div>
      <div
        style={{
          display: "flex",
          position: "fixed",
          width: "50%",
          height: "fit-content",
          padding: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 100,
          zIndex: 100,
          top: 15,
          left: "25%",
          background:
            darkMode === true ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
        }}
        className={ibm.className}
        onMouseOver={() => {
          setHover(true);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
      >
        {/* <motion.input
      placeholder="paste a link to Medium article"
      style={{
        background: "transparent",
        width: "100%",
        paddingLeft: 20,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: hover === true ? 1 : 0 }}
    ></motion.input> */}
        <motion.p style={{ paddingLeft: 15 }} onClick={onAmbienceClick}>
          ambience {ambience === true ? "on" : "off"}
        </motion.p>
        <Toggle onClick={onClick} left={darkMode} darkMode={darkMode} />
      </div>
    </>
  );
}