import { motion } from "framer-motion";
import { Sun, Moon } from "phosphor-react";

export default function Toggle({ left = true, onClick, darkMode = true }) {
  let iconSize = 18;
  let circleSize = 20;
  let paddingBetwenCircle = 4;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 10,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Sun
        color={darkMode === true ? "#999999" : "#111111"}
        weight="bold"
        size={iconSize}
      />
      <motion.div
        style={{
          borderRadius: 1000,
          width: circleSize * 2.5,
          position: "relative",
          height: circleSize + paddingBetwenCircle * 2,
        }}
        animate={{
          background: darkMode === true ? "#222222" : "#ececec",
        }}
        onClick={onClick}
      >
        <motion.div
          style={{
            width: circleSize,
            height: circleSize,
            margin: paddingBetwenCircle,
            borderRadius: 1000,
            position: "absolute",
          }}
          animate={{
            background: darkMode === true ? "black" : "white",
            left: darkMode === true ? "inherit" : 0,
            right: darkMode === true ? 0 : "inherit",
            top: 0,
          }}
        ></motion.div>
      </motion.div>
      <Moon
        color={darkMode === true ? "#999999" : "#111111"}
        weight="bold"
        size={iconSize}
      />
    </div>
  );
}
