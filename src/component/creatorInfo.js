import { motion } from "framer-motion";
import { IBM_Plex_Mono } from "next/font/google";
import { InstagramLogo, TwitterLogo, Globe, Note } from "phosphor-react";

const ibm = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "700"] });

export default function CreatorInfo({ darkMode = true }) {
  const iconSize = 14;
  return (
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
          navigator.clipboard.writeText("https://ambient-reader.vercel.app");
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
        <h3 style={{ fontSize: 12, opacity: 0.4 }}>Created by Seungmee Lee</h3>

        <motion.div style={{ opacity: 0.4 }} whileHover={{ opacity: 1 }}>
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
        <motion.div style={{ opacity: 0.4 }} whileHover={{ opacity: 1 }}>
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
        <motion.div style={{ opacity: 0.4 }} whileHover={{ opacity: 1 }}>
          <InstagramLogo
            color={darkMode === true ? "white" : "black"}
            weight="bold"
            size={iconSize}
            style={{ cursor: "pointer" }}
            onClick={() => {
              window.open("https://instagram.com/@stone.skipper", "_blank");
            }}
          />
        </motion.div>
        <motion.div style={{ opacity: 0.4 }} whileHover={{ opacity: 1 }}>
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
  );
}
