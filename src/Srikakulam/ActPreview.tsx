import React from 'react';
import { AbsoluteFill, Series, staticFile, Audio } from 'remotion';
import {
  CHAPTERS,
  ChapterScene,
  SRIKAKULAM_TOTAL_FRAMES,
  buildTimeline,
  fontAnek,
} from './SrikakulamVideo';

const BG_MUSIC = 'Youtube Free Musics/Beat Your Competition - Vibe Tracks.mp3';

export const ActPreview: React.FC<{ actNumber: number }> = ({ actNumber }) => {
  const actChapters = CHAPTERS.filter((c) => c.act === actNumber);
  const { frames: fullFrames, starts: fullStarts, total } = buildTimeline(1);

  return (
    <AbsoluteFill style={{ backgroundColor: '#F8FAFC', fontFamily: `${fontAnek}, 'Anek Telugu', sans-serif` }}>
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
                total={total || SRIKAKULAM_TOTAL_FRAMES}
              />
            </Series.Sequence>
          );
        })}
      </Series>
    </AbsoluteFill>
  );
};
