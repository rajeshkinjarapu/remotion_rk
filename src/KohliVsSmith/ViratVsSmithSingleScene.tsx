import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Series,
  staticFile,
} from 'remotion';
import { THEME } from './theme';
import timings from './timings.json';
import { Scene1Intro } from './scenes/Scene1Intro';
import { Scene2OverallStats } from './scenes/Scene2OverallStats';
import { Scene3SenaMap } from './scenes/Scene3SenaMap';
import { Scene4ImpactStyle } from './scenes/Scene4ImpactStyle';
import { Scene5VerdictOutro } from './scenes/Scene5VerdictOutro';

// Total timeline duration: 8448 frames @ 30fps (4m 41s)
export const TOTAL_SINGLE_SCENE_FRAMES =
  timings.scene1_intro.durationFrames +
  timings.scene2_overall_stats.durationFrames +
  timings.scene3_sena_records.durationFrames +
  timings.scene4_playing_style.durationFrames +
  timings.scene5_verdict_outro.durationFrames; // 8448

export const ViratVsSmithSingleScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#FFFFFF', fontFamily: THEME.fontFamily }}>
      {/* 1. SINGLE CONTINUOUS MASTER VOICE-OVER AUDIO (0 to 8448 frames) */}
      <Audio
        src={staticFile('audio/kohli_vs_smith/master_complete_audio.wav')}
        volume={1}
      />

      {/* 2. Ambient Studio Beat Music (softly mixed underneath VO) */}
      <Audio
        src={staticFile('Youtube Free Musics/Beat Your Competition - Vibe Tracks.mp3')}
        volume={0.12}
        loop
      />

      {/* 3. DYNAMIC VISUAL STAGES IN ONE CONTINUOUS SINGLE TIMELINE */}
      <Series>
        {/* Stage 1: The Modern Day Greats Rivalry & Live Videos (0 - 1380) */}
        <Series.Sequence durationInFrames={timings.scene1_intro.durationFrames}>
          <Scene1Intro hasAudio={false} />
        </Series.Sequence>

        {/* Stage 2: Overall Test Stats & 57 Avg Shockwave (1380 - 3066) */}
        <Series.Sequence durationInFrames={timings.scene2_overall_stats.durationFrames}>
          <Scene2OverallStats hasAudio={false} />
        </Series.Sequence>

        {/* Stage 3: SENA Continents Realistic GeoJSON Map & Flight Arcs (3066 - 6079) */}
        <Series.Sequence durationInFrames={timings.scene3_sena_records.durationFrames}>
          <Scene3SenaMap hasAudio={false} />
        </Series.Sequence>

        {/* Stage 4: Playing Style & Dual Embedded Video Cards (6079 - 7164) */}
        <Series.Sequence durationInFrames={timings.scene4_playing_style.durationFrames}>
          <Scene4ImpactStyle hasAudio={false} />
        </Series.Sequence>

        {/* Stage 5: Verdict Radar & Live Fan Vote (7164 - 8448) */}
        <Series.Sequence durationInFrames={timings.scene5_verdict_outro.durationFrames}>
          <Scene5VerdictOutro hasAudio={false} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
