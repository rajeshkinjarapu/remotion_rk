import React from "react";
import { AbsoluteFill, Audio, Series, staticFile } from "remotion";
import { COLORS, sec } from "./theme";
import {
  Scene1Hook,
  Scene2Mechanics,
  Scene3Stats,
  Scene4MI,
  Scene5PBKS,
  Scene6Verdict,
} from "./scenes";

// Durations follow the script timings (mm:ss)
export const SCENES = [
  { dur: sec(50), audio: "vo/scene1.mp3", Component: Scene1Hook },      // 0:00 - 0:50
  { dur: sec(60), audio: "vo/scene2.mp3", Component: Scene2Mechanics }, // 0:50 - 1:50
  { dur: sec(85), audio: "vo/scene3.mp3", Component: Scene3Stats },     // 1:50 - 3:15
  { dur: sec(80), audio: "vo/scene4.mp3", Component: Scene4MI },        // 3:15 - 4:35
  { dur: sec(70), audio: "vo/scene5.mp3", Component: Scene5PBKS },      // 4:35 - 5:45
  { dur: sec(45), audio: "vo/scene6.mp3", Component: Scene6Verdict },   // 5:45 - 6:30
];

export const TOTAL_FRAMES = SCENES.reduce((acc, s) => acc + s.dur, 0);

export const CricketVideo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
    <Series>
      {SCENES.map((s, i) => (
        <Series.Sequence key={i} durationInFrames={s.dur}>
          <s.Component />
          <Audio src={staticFile(s.audio)} />
        </Series.Sequence>
      ))}
    </Series>
    {/* Background music: comment out if you don't have a track */}
    <Audio src={staticFile("music/bg.mp3")} volume={0.12} loop />
  </AbsoluteFill>
);

