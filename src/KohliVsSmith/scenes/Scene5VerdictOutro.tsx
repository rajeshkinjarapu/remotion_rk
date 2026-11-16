import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Video,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { THEME } from '../theme';
import { KineticTeluguTitle } from '../components/KineticTeluguTitle';
import { SpiderRadarChart } from '../components/SpiderRadarChart';

export const Scene5VerdictOutro: React.FC<{ hasAudio?: boolean }> = ({ hasAudio = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // CTA appears smoothly around frame 200
  const ctaSpr = spring({
    frame: Math.max(0, frame - 200),
    fps,
    config: { damping: 18, stiffness: 75, mass: 1.1 },
  });

  // Animated Poll Percentages (counting up)
  const kohliPct = Math.round(interpolate(frame, [300, 700], [0, 58], { extrapolateRight: 'clamp' }));
  const smithPct = Math.round(interpolate(frame, [300, 700], [0, 42], { extrapolateRight: 'clamp' }));

  // Pulsing Subscribe Button
  const bellPulse = 1 + Math.sin(frame * 0.1) * 0.04;

  return (
    <AbsoluteFill
      style={{
        background: THEME.bgGradient,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 40px',
        fontFamily: THEME.fontFamily,
      }}
    >
      {hasAudio && <Audio src={staticFile('audio/kohli_vs_smith/scene5_verdict_outro.wav')} volume={1} />}

      {/* Background Stadium Video Atmosphere */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.08,
          filter: 'blur(4px) grayscale(50%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <Video
          src={staticFile('cricket/videos/stadium_crowd_trimmed.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          muted
          loop
        />
      </div>

      {/* Bigger Bold Title */}
      <KineticTeluguTitle
        badge="THE FINAL VERDICT"
        badgeColor="#D97706"
        title="టెస్ట్ క్రికెట్ లో ఒరిజినల్ బాస్ ఎవరు?"
        subtitle="స్టాట్స్ పరంగా స్మిత్ ముందంజలో ఉన్నా... ఇంపాక్ట్ & లీడర్‌షిప్ లో కింగ్ కోహ్లీ అనూహ్యం!"
        titleSize={76}
        subtitleSize={28}
        delay={10}
      />

      {/* Center 5-Axis Spider Radar Chart & Summary Matrix */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: 1780,
          marginTop: 10,
          zIndex: 10,
        }}
      >
        {/* Left Side: Legend Card (Clean White, Large Box) */}
        <div
          style={{
            background: '#FFFFFF',
            padding: '36px 32px',
            borderRadius: 32,
            border: '2px solid rgba(15, 23, 42, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
            width: 420,
            boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.12)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#0284C7', boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)' }} />
            <div>
              <div style={{ color: THEME.textDark, fontWeight: 900, fontSize: 24 }}>విరాట్ కోహ్లీ (Blue)</div>
              <div style={{ color: '#0284C7', fontSize: 17, fontWeight: 800 }}>Aggression & Match Winning</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#D97706', boxShadow: '0 4px 14px rgba(217, 119, 6, 0.4)' }} />
            <div>
              <div style={{ color: THEME.textDark, fontWeight: 900, fontSize: 24 }}>స్టీవ్ స్మిత్ (Gold)</div>
              <div style={{ color: '#D97706', fontSize: 17, fontWeight: 800 }}>Numbers & SENA Consistency</div>
            </div>
          </div>

          <div style={{ borderTop: '2px solid #F1F5F9', paddingTop: 18, color: '#334155', fontSize: 20, lineHeight: 1.6, fontWeight: 800 }}>
            టెస్ట్ క్రికెట్ చరిత్రలో ఎప్పటికీ నిలిచిపోయే ఇద్దరు మోడ్రన్-డే గ్రేట్ లెజెండ్స్!
          </div>

          <div
            style={{
              background: '#F8FAFC',
              border: '1.5px solid #E2E8F0',
              borderRadius: 18,
              padding: '16px 20px',
              fontSize: 16,
              color: '#475569',
              fontWeight: 700,
              lineHeight: 1.5,
            }}
          >
            🔥 కోహ్లీ ఛేజింగ్ & అగ్రెషన్ ఒక అద్భుతం అయితే, స్మిత్ టెస్ట్ ఆవరేజ్ & సెంచరీల కన్సిస్టెన్సీ మరొక అద్భుతం!
          </div>
        </div>

        {/* Center: Spider Radar Chart (Large & Clear) */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <SpiderRadarChart delay={20} size={580} />
        </div>

        {/* Right Side: Interactive CTA Poll (Clean White, Large, Punchy Box) */}
        <div
          style={{
            background: '#FFFFFF',
            padding: '36px 32px',
            borderRadius: 32,
            border: '2px solid rgba(15, 23, 42, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: 440,
            boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.12)',
            transform: `scale(${interpolate(ctaSpr, [0, 1], [0.92, 1])})`,
            opacity: Math.min(1, ctaSpr * 1.5),
          }}
        >
          <div style={{ color: '#D97706', fontSize: 16, fontWeight: 900, letterSpacing: 2, marginBottom: 8 }}>
            💬 COMMENT YOUR CHOICE
          </div>
          <div style={{ color: THEME.textDark, fontSize: 28, fontWeight: 900, textAlign: 'center', marginBottom: 20 }}>
            మీ దృష్టిలో అసలైన బాస్ ఎవరు?
          </div>

          {/* Option A: Kohli with Live Voting Counter */}
          <div
            style={{
              width: '100%',
              background: '#F0F9FF',
              border: '2.5px solid #0284C7',
              borderRadius: 20,
              padding: '16px 20px',
              color: THEME.textDark,
              fontWeight: 900,
              fontSize: 22,
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 8px 20px rgba(2, 132, 199, 0.15)',
            }}
          >
            <span>👑 A: కింగ్ కోహ్లీ</span>
            <span style={{ color: '#0284C7', fontSize: 20, fontWeight: 900 }}>{kohliPct}%</span>
          </div>

          {/* Option B: Smith with Live Voting Counter */}
          <div
            style={{
              width: '100%',
              background: '#FFFBEB',
              border: '2.5px solid #D97706',
              borderRadius: 20,
              padding: '16px 20px',
              color: THEME.textDark,
              fontWeight: 900,
              fontSize: 22,
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 8px 20px rgba(217, 119, 6, 0.15)',
            }}
          >
            <span>🛡️ B: స్టీవ్ స్మిత్</span>
            <span style={{ color: '#D97706', fontSize: 20, fontWeight: 900 }}>{smithPct}%</span>
          </div>

          {/* Subscribe CTA with Pulse Effect */}
          <div
            style={{
              width: '100%',
              textAlign: 'center',
              padding: '16px 20px',
              background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
              color: '#FFFFFF',
              borderRadius: 20,
              fontSize: 19,
              fontWeight: 900,
              letterSpacing: 1,
              boxShadow: '0 10px 30px rgba(220, 38, 38, 0.35)',
              transform: `scale(${bellPulse})`,
              cursor: 'pointer',
            }}
          >
            🔔 SUBSCRIBE RK CRICKET TELUGU
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
