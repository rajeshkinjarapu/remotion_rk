import React from 'react';
import { AbsoluteFill, Series, staticFile, Audio } from 'remotion';
import {
  CHAPTERS,
  ChapterScene,
  NARASANNAPETA_FPS,
  NARASANNAPETA_TOTAL_FRAMES,
  fontAnek,
} from './NarasannapetaVideo';

const BG_MUSIC = 'Youtube Free Musics/Beat Your Competition - Vibe Tracks.mp3';

const ACT_VO_KEYS = [
  'act1_hook',
  'act2_history',
  'act3_trilogy',
  'act4_ground',
  'act5_leaders',
  'act6_verdict',
];

export const ActPreview: React.FC<{ actNumber: number }> = ({ actNumber }) => {
  const actChapters = CHAPTERS.filter((c) => c.act === actNumber);
  const actVo = `audio/narasannapeta/${ACT_VO_KEYS[actNumber - 1]}.wav`;

  // Calculate starts and frames within the full timeline for HUD progress accuracy
  const fullFrames = CHAPTERS.map((c) => Math.max(30, Math.round(c.sec * NARASANNAPETA_FPS)));
  const fullStarts: number[] = [];
  let acc = 0;
  fullFrames.forEach((f) => {
    fullStarts.push(acc);
    acc += f;
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#F8FAFC', fontFamily: `${fontAnek}, 'Anek Telugu', sans-serif` }}>
      <Audio src={staticFile(actVo)} volume={1} />
      <Audio src={staticFile(BG_MUSIC)} volume={0.12} loop />
      <Series>
        {actChapters.map((ch) => {
          const globalIdx = CHAPTERS.findIndex((c) => c.id === ch.id);
          const dur = fullFrames[globalIdx];
          const start = fullStarts[globalIdx];
          return (
            <Series.Sequence key={ch.id} durationInFrames={dur}>
              <ChapterScene
                ch={ch}
                idx={globalIdx}
                start={start}
                dur={dur}
                total={NARASANNAPETA_TOTAL_FRAMES}
              />
            </Series.Sequence>
          );
        })}
      </Series>
    </AbsoluteFill>
  );
};
