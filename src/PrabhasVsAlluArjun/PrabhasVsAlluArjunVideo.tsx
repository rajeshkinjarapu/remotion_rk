import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Series,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { SCENES_60, TOTAL_PRABHAS_ALLU_FRAMES, SceneData } from './scenes_60';
import {
  TitleCard,
  SingleMovieCard,
  VsBarRace,
  MapHighlight,
  RoiGaugeMeter,
  ScoreboardUpdate,
  C,
} from './components';

const BG_MUSIC = 'Youtube Free Musics/Beat Your Competition - Vibe Tracks.mp3';

// ============================================================================
// TOP BROADCAST HUD HEADER & PROGRESS BAR
// ============================================================================
const HeaderHUD: React.FC<{ currentScene: SceneData; sceneIdx: number }> = ({ currentScene, sceneIdx }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = interpolate(frame, [0, durationInFrames], [0, 100]);

  const sec = Math.floor(frame / 30);
  const min = Math.floor(sec / 60);
  const remSec = sec % 60;
  const timeStr = `${String(min).padStart(2, '0')}:${String(remSec).padStart(2, '0')}`;

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 72,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 48px', zIndex: 100,
      background: 'linear-gradient(180deg, rgba(7, 11, 22, 0.95) 0%, rgba(7, 11, 22, 0.75) 80%, transparent 100%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    }}>
      {/* Left: Broadcast Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#EF4444', boxShadow: '0 0 12px #EF4444' }} />
        <span style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', letterSpacing: 1.5 }}>
          BOX OFFICE LAB · PRABHAS vs ALLU ARJUN
        </span>
        <span style={{
          background: 'rgba(255,255,255,0.1)', color: C.muted, padding: '3px 12px',
          borderRadius: 6, fontSize: 18, fontWeight: 800,
        }}>
          {timeStr}
        </span>
      </div>

      {/* Right: Chapter & Scene Counter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          background: 'linear-gradient(90deg, #F59E0B, #EF4444)',
          color: '#FFFFFF', fontWeight: 900, fontSize: 18, padding: '4px 14px', borderRadius: 999,
        }}>
          {String(sceneIdx + 1).padStart(2, '0')}/60
        </div>
        <span style={{ fontSize: 20, fontWeight: 800, color: C.white }}>
          CH {currentScene.chapter} · {currentScene.chapterTitle}
        </span>
      </div>

      {/* Bottom Thin Timeline Progress Line */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.1)' }}>
        <div style={{
          width: `${progress}%`, height: '100%',
          background: 'linear-gradient(90deg, #F59E0B, #EF4444, #10B981)',
          boxShadow: '0 0 10px #F59E0B',
        }} />
      </div>
    </div>
  );
};

// ============================================================================
// INDIVIDUAL SCENE DISPATCHER
// ============================================================================
export const SceneView: React.FC<{ scene: SceneData }> = ({ scene }) => {
  switch (scene.type) {
    case 'TITLE_CARD':
      return <TitleCard data={scene} />;
    case 'SINGLE_MOVIE_CARD':
      return <SingleMovieCard data={scene} />;
    case 'VS_BAR_RACE':
      return <VsBarRace data={scene} />;
    case 'MAP_HIGHLIGHT':
      return <MapHighlight data={scene} />;
    case 'ROI_GAUGE_METER':
      return <RoiGaugeMeter data={scene} />;
    case 'SCOREBOARD_UPDATE':
      return <ScoreboardUpdate data={scene} />;
    default:
      return <TitleCard data={scene} />;
  }
};

// ============================================================================
// MASTER VIDEO COMPONENT (8 MINUTES · 60 SCENES SERIES)
// ============================================================================
export const PrabhasVsAlluArjunVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // Find active scene index based on frame
  let accumulated = 0;
  let activeSceneIdx = 0;
  for (let i = 0; i < SCENES_60.length; i++) {
    const dur = SCENES_60[i].sec * 30;
    if (frame >= accumulated && frame < accumulated + dur) {
      activeSceneIdx = i;
      break;
    }
    accumulated += dur;
  }
  const currentScene = SCENES_60[activeSceneIdx] || SCENES_60[0];

  return (
    <AbsoluteFill style={{
      backgroundColor: C.bgDark,
      fontFamily: "'Anek Telugu', sans-serif",
      color: C.white,
    }}>
      {/* 1. Global HUD Header */}
      <HeaderHUD currentScene={currentScene} sceneIdx={activeSceneIdx} />

      {/* 2. Background Beat Audio */}
      <Audio src={staticFile(BG_MUSIC)} volume={0.12} loop />

      {/* 3. 60-Scene Automated Sequence */}
      <Series>
        {SCENES_60.map((scene) => (
          <Series.Sequence key={scene.id} durationInFrames={scene.sec * 30}>
            <AbsoluteFill style={{ paddingTop: 72 }}>
              <SceneView scene={scene} />
            </AbsoluteFill>
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
