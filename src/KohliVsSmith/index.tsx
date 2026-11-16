import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Series,
  staticFile,
} from 'remotion';
import timings from './timings.json';
import { Scene1Intro } from './scenes/Scene1Intro';
import { Scene2OverallStats } from './scenes/Scene2OverallStats';
import { Scene3SenaMap } from './scenes/Scene3SenaMap';
import { Scene4ImpactStyle } from './scenes/Scene4ImpactStyle';
import { Scene5VerdictOutro } from './scenes/Scene5VerdictOutro';
import { ViratVsSmithSingleScene, TOTAL_SINGLE_SCENE_FRAMES } from './ViratVsSmithSingleScene';
import { ViratVsSmithCyberDark, TOTAL_CYBER_DARK_FRAMES } from './ViratVsSmithCyberDark';

export const TOTAL_KOHLI_VS_SMITH_FRAMES = TOTAL_SINGLE_SCENE_FRAMES;

export const ViratVsSmithVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#FFFFFF' }}>
      {/* 1. SINGLE UNIFIED MASTER CONTINUOUS AUDIO TRACK (0 to 8448 frames) */}
      <Audio
        src={staticFile('audio/kohli_vs_smith/master_complete_audio.wav')}
        volume={1}
      />

      {/* 2. Background Ambience / Beat Music (ducked under dialogue) */}
      <Audio
        src={staticFile('Youtube Free Musics/Beat Your Competition - Vibe Tracks.mp3')}
        volume={0.12}
        loop
      />

      {/* Sequential Scenes (No choppy audio cuts, audio plays continuously) */}
      <Series>
        {/* Scene 1: Intro (The Modern Day Greats) */}
        <Series.Sequence durationInFrames={timings.scene1_intro.durationFrames}>
          <Scene1Intro hasAudio={false} />
        </Series.Sequence>

        {/* Scene 2: Round 1 (Overall Test Stats & Centuries) */}
        <Series.Sequence durationInFrames={timings.scene2_overall_stats.durationFrames}>
          <Scene2OverallStats hasAudio={false} />
        </Series.Sequence>

        {/* Scene 3: Round 2 (SENA Records & Redemption) */}
        <Series.Sequence durationInFrames={timings.scene3_sena_records.durationFrames}>
          <Scene3SenaMap hasAudio={false} />
        </Series.Sequence>

        {/* Scene 4: Round 3 (Playing Style & Bowler Frustration) */}
        <Series.Sequence durationInFrames={timings.scene4_playing_style.durationFrames}>
          <Scene4ImpactStyle hasAudio={false} />
        </Series.Sequence>

        {/* Scene 5: Outro (The Verdict & CTA) */}
        <Series.Sequence durationInFrames={timings.scene5_verdict_outro.durationFrames}>
          <Scene5VerdictOutro hasAudio={false} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

export {
  ViratVsSmithSingleScene,
  ViratVsSmithCyberDark,
  Scene1Intro,
  Scene2OverallStats,
  Scene3SenaMap,
  Scene4ImpactStyle,
  Scene5VerdictOutro,
};
