import React from 'react';
import { AbsoluteFill, Series, staticFile, Audio } from 'remotion';
import {
  CHAPTERS,
  ChapterScene,
  SRIKAKULAM_FPS,
  SRIKAKULAM_TOTAL_FRAMES,
  fontAnek,
} from './SrikakulamVideo';

const BG_MUSIC = 'Youtube Free Musics/Beat Your Competition - Vibe Tracks.mp3';

const ACT_VO_KEYS = [
  'act1_hook',
  'act2_history',
  'act3_shankar',
  'act4_numbers',
  'act5_reasons',
  'act6_verdict',
];

export const ActPreview: React.FC<{ actNumber: number }> = ({ actNumber }) => {
  const actChapters = CHAPTERS.filter((c) => c.act === actNumber);
  const actVo = `audio/srikakulam/${ACT_VO_KEYS[actNumber - 1]}.wav`;

  // Calculate starts and frames within the full timeline for HUD progress accuracy
  const fullFrames = CHAPTERS.map((c) => Math.max(30, Math.round(c.sec * SRIKAKULAM_FPS)));
  const fullStarts: number[] = [];
  let acc = 0;
  fullFrames.forEach((f) => {
    fullStarts.push(acc);
    acc += f;
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#F8FAFC', fontFamily: `${fontAnek}, 'Anek Telugu', sans-serif` }}>
      <Audio src={staticFile(actVo)} volume={1} />
      {BG_MUSIC ? <Audio src={staticFile(BG_MUSIC)} volume={0.12} loop /> : null}
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
                total={SRIKAKULAM_TOTAL_FRAMES}
              />
            </Series.Sequence>
          );
        })}
      </Series>
    </AbsoluteFill>
  );
};
