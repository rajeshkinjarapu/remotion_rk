import React from "react";
import { AbsoluteFill, Video, staticFile } from "remotion";

export const SARPANCH_FRAMES = 2031; // 67.7s @ 30fps

export const SarpanchDubbedVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Video
        src={staticFile("InShot_20261114_145301392_dubbed.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </AbsoluteFill>
  );
};

