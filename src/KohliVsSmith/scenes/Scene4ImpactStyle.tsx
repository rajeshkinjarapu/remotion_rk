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

export const Scene4ImpactStyle: React.FC<{ hasAudio?: boolean }> = ({ hasAudio = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 75, mass: 1.1 },
  });

  // Active focus phases:
  // 0 - 540 (0 - 18s): Kohli's Aggression & Leadership
  // 540 - 1085 (18 - 36s): Smith's Patience & Bowler Frustration
  const isKohliFocus = frame < 540;
  const isSmithFocus = frame >= 540;

  // Animated Bowler Frustration Meter
  const frustration = Math.min(99, Math.round(interpolate(frame, [540, 950], [20, 99])));

  return (
    <AbsoluteFill
      style={{
        background: THEME.bgGradient,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 36px 20px 36px',
        fontFamily: THEME.fontFamily,
      }}
    >
      {hasAudio && <Audio src={staticFile('audio/kohli_vs_smith/scene4_playing_style.wav')} volume={1} />}

      {/* Subtle Background Stadium Video */}
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
        badge="ROUND 3: CLASH OF PHILOSOPHIES"
        badgeColor="#DC2626"
        title="ఇంపాక్ట్ & ప్లేయింగ్ స్టైల్"
        subtitle="అగ్రెసివ్ కౌంటర్-ఎటాక్ vs అన్‌ఆర్థోడాక్స్ పేషెన్స్"
        titleSize={74}
        subtitleSize={26}
        delay={10}
      />

      {/* Full Screen Dual Impact Comparison Cards (Huge, Beautiful Boxes) */}
      <div
        style={{
          display: 'flex',
          width: '100%',
          maxWidth: 1840,
          flex: 1,
          gap: 24,
          alignItems: 'stretch',
          marginTop: 4,
          zIndex: 10,
        }}
      >
        {/* Left: Kohli Style Full-Screen Card */}
        <div
          style={{
            flex: 1,
            background: '#FFFFFF',
            borderRadius: 32,
            border: `3.5px solid ${isKohliFocus ? '#0284C7' : '#94A3B8'}`,
            boxShadow: isKohliFocus
              ? '0 25px 70px -10px rgba(2, 132, 199, 0.35), 0 0 25px rgba(2, 132, 199, 0.2)'
              : '0 20px 50px -15px rgba(15, 23, 42, 0.1)',
            padding: '24px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transform: `translateX(${(1 - spr) * -70}px) scale(${isKohliFocus ? 1.01 : 0.99})`,
            transition: 'border 0.3s, transform 0.3s, box-shadow 0.3s',
            opacity: Math.min(1, spr * 1.5),
            position: 'relative',
          }}
        >
          <div>
            {/* Header Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 14, borderBottom: '2px solid #F1F5F9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 18,
                    background: '#E0F2FE',
                    border: '2px solid #0284C7',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: 32,
                    boxShadow: '0 6px 16px rgba(2, 132, 199, 0.2)',
                  }}
                >
                  🦁
                </div>
                <div>
                  <div style={{ color: '#0284C7', fontSize: 30, fontWeight: 900, letterSpacing: 1 }}>
                    THE AGGRESSIVE LION
                  </div>
                  <div style={{ color: THEME.textDark, fontSize: 20, fontWeight: 900 }}>
                    విరాట్ కోహ్లీ అప్రోచ్ (King Kohli Approach)
                  </div>
                </div>
              </div>

              {isKohliFocus && (
                <div style={{ background: '#0284C7', color: '#FFFFFF', padding: '6px 16px', borderRadius: 16, fontSize: 14, fontWeight: 900 }}>
                  SPEAKING 🎤
                </div>
              )}
            </div>

            {/* Embedded Action Highlight Video */}
            <div
              style={{
                width: '100%',
                height: 220,
                borderRadius: 20,
                overflow: 'hidden',
                background: '#0F172A',
                border: '2.5px solid #0284C7',
                boxShadow: '0 10px 25px rgba(2, 132, 199, 0.25)',
                marginBottom: 16,
              }}
            >
              <Video
                src={staticFile('cricket/videos/kohli_cover_drive.mp4')}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                muted
                loop
              />
            </div>

            {/* Large Bullet Points in Anek Telugu */}
            <div style={{ color: '#1E293B', fontSize: 22, lineHeight: 1.6, fontWeight: 700 }}>
              <div style={{ margin: '10px 0', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>🔥</span>
                <div>
                  <strong style={{ color: '#0284C7' }}>నిర్భయమైన అగ్రెషన్:</strong> బౌలర్ల మైండ్ పై ఎదురుదాడి చేసి మొదటి బంతి నుంచే డామినేట్ చేయడం.
                </div>
              </div>
              <div style={{ margin: '10px 0', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>⚡</span>
                <div>
                  <strong style={{ color: '#0284C7' }}>కౌంటర్-ఎటాక్ & పేస్:</strong> తీవ్రమైన ఒత్తిడిలో బౌండరీలతో ప్రెషర్ మొత్తం రిలీజ్ చేసే బ్యాటింగ్ పవర్.
                </div>
              </div>
              <div style={{ margin: '10px 0', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>🏆</span>
                <div>
                  <strong style={{ color: '#0284C7' }}>SENA చారిత్రక విజయాలు:</strong> ఆస్ట్రేలియా, ఇంగ్లాండ్, సౌతాఫ్రికా లలో చారిత్రక టెస్ట్ గెలుపులు.
                </div>
              </div>
              <div style={{ margin: '10px 0', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>🤝</span>
                <div>
                  <strong style={{ color: '#0284C7' }}>లోయర్ ఆర్డర్ స్ట్రైక్:</strong> టెయిలెండర్లను నడిపిస్తూ భారీ పార్ట్‌నర్‌షిప్స్ నిర్మించే నాయకత్వం.
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bold Quote Pill */}
          <div
            style={{
              background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
              border: '2px solid #0284C7',
              borderRadius: 18,
              padding: '14px 24px',
              textAlign: 'center',
              color: '#0369A1',
              fontWeight: 900,
              fontSize: 22,
              marginTop: 10,
              boxShadow: '0 6px 20px rgba(2, 132, 199, 0.12)',
            }}
          >
            "క్రీజులో కోహ్లీ ఉంటే ప్రత్యర్థి బౌలర్లకు దడ!"
          </div>
        </div>

        {/* Right: Smith Style Full-Screen Card */}
        <div
          style={{
            flex: 1,
            background: '#FFFFFF',
            borderRadius: 32,
            border: `3.5px solid ${isSmithFocus ? '#D97706' : '#94A3B8'}`,
            boxShadow: isSmithFocus
              ? '0 25px 70px -10px rgba(217, 119, 6, 0.35), 0 0 25px rgba(217, 119, 6, 0.2)'
              : '0 20px 50px -15px rgba(15, 23, 42, 0.1)',
            padding: '24px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transform: `translateX(${(1 - spr) * 70}px) scale(${isSmithFocus ? 1.01 : 0.99})`,
            transition: 'border 0.3s, transform 0.3s, box-shadow 0.3s',
            opacity: Math.min(1, spr * 1.5),
            position: 'relative',
          }}
        >
          <div>
            {/* Header Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 14, borderBottom: '2px solid #F1F5F9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 18,
                    background: '#FEF3C7',
                    border: '2px solid #D97706',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: 32,
                    boxShadow: '0 6px 16px rgba(217, 119, 6, 0.2)',
                  }}
                >
                  🛡️
                </div>
                <div>
                  <div style={{ color: '#D97706', fontSize: 30, fontWeight: 900, letterSpacing: 1 }}>
                    THE INDESTRUCTIBLE WALL
                  </div>
                  <div style={{ color: THEME.textDark, fontSize: 20, fontWeight: 900 }}>
                    స్టీవ్ స్మిత్ అప్రోచ్ (Steve Smith Approach)
                  </div>
                </div>
              </div>

              {isSmithFocus && (
                <div style={{ background: '#D97706', color: '#FFFFFF', padding: '6px 16px', borderRadius: 16, fontSize: 14, fontWeight: 900 }}>
                  SPEAKING 🎤
                </div>
              )}
            </div>

            {/* Embedded Action Highlight Video */}
            <div
              style={{
                width: '100%',
                height: 220,
                borderRadius: 20,
                overflow: 'hidden',
                background: '#0F172A',
                border: '2.5px solid #D97706',
                boxShadow: '0 10px 25px rgba(217, 119, 6, 0.25)',
                marginBottom: 16,
              }}
            >
              <Video
                src={staticFile('cricket/videos/smith_leave.mp4')}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                muted
                loop
              />
            </div>

            {/* Large Bullet Points in Anek Telugu */}
            <div style={{ color: '#1E293B', fontSize: 22, lineHeight: 1.6, fontWeight: 700 }}>
              <div style={{ margin: '10px 0', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>🎯</span>
                <div>
                  <strong style={{ color: '#D97706' }}>అన్‌ఆర్థోడాక్స్ స్టైల్:</strong> క్రీజు చుట్టూ తిరుగుతూ బంతిని వదిలేసే (leaving the ball) విచిత్ర శైలి.
                </div>
              </div>
              <div style={{ margin: '10px 0', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>⏳</span>
                <div>
                  <strong style={{ color: '#D97706' }}>అంతులేని సహనం:</strong> గంటల తరబడి బంతిని లీవ్ చేస్తూ ప్రత్యర్థి బౌలర్ల సహనాన్ని పరీక్షించడం.
                </div>
              </div>
              <div style={{ margin: '10px 0', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>🚫</span>
                <div>
                  <strong style={{ color: '#D97706' }}>అన్‌-ప్లేయబుల్ డిఫెన్స్:</strong> ఒక్కసారి క్రీజులో సెట్ అయితే ఔట్ చేయడం దాదాపు అసాధ్యం.
                </div>
              </div>
              <div style={{ margin: '10px 0', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>🧠</span>
                <div>
                  <strong style={{ color: '#D97706' }}>టెస్ట్ ఫార్మాట్ డెడికేషన్:</strong> రెడ్ బాల్ క్రికెట్ కోసమే పుట్టిన అసమాన టెక్నిక్ & ఫోకస్.
                </div>
              </div>
            </div>
          </div>

          {/* Bowler Frustration Meter Box */}
          <div
            style={{
              background: '#FFFBEB',
              border: '2px solid #F59E0B',
              borderRadius: 18,
              padding: '12px 20px',
              marginTop: 10,
              boxShadow: '0 6px 20px rgba(217, 119, 6, 0.12)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ color: '#92400E', fontSize: 15, fontWeight: 900, letterSpacing: 1.5 }}>
                BOWLER FRUSTRATION INDEX
              </span>
              <span style={{ color: '#DC2626', fontSize: 16, fontWeight: 900 }}>
                {frustration}% OVERLOAD 🔥
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: 14,
                background: '#FEF3C7',
                borderRadius: 7,
                overflow: 'hidden',
                border: '1px solid rgba(217, 119, 6, 0.3)',
              }}
            >
              <div
                style={{
                  width: `${frustration}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #F59E0B, #DC2626)',
                  borderRadius: 7,
                  boxShadow: '0 0 12px rgba(220, 38, 38, 0.6)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
