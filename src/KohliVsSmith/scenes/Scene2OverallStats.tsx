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
  Img,
} from 'remotion';
import { THEME } from '../theme';
import { KineticTeluguTitle } from '../components/KineticTeluguTitle';
import { StatBarCompare } from '../components/StatBarCompare';

export const Scene2OverallStats: React.FC<{ hasAudio?: boolean }> = ({ hasAudio = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Active focus phases based on voiceover timing:
  // 0 - 200: Intro
  // 200 - 720: Kohli focus
  // 720 - 1300: Smith focus (with 57 average shockwave at ~900-1100)
  // 1300 - 1686: Round 1 Conclusion & Transition
  const isKohliFocus = frame >= 200 && frame < 720;
  const isSmithFocus = frame >= 720 && frame < 1300;
  const isShockwave = frame >= 900 && frame < 1120;
  const isConclusion = frame >= 1300;

  // Subtle breathing animations for left & right player cards
  const breatheL = Math.sin(frame * 0.04) * (isKohliFocus ? 8 : 4);
  const breatheR = Math.sin((frame + 25) * 0.04) * (isSmithFocus ? 8 : 4);

  const sprL = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 18, stiffness: 75, mass: 1.1 } });
  const sprR = spring({ frame: Math.max(0, frame - 25), fps, config: { damping: 18, stiffness: 75, mass: 1.1 } });
  const verdictSpr = spring({ frame: Math.max(0, frame - 1300), fps, config: { damping: 16, stiffness: 85, mass: 1.1 } });

  const shockwavePulse = isShockwave
    ? 1 + Math.sin((frame - 900) * 0.12) * 0.05
    : 1;

  return (
    <AbsoluteFill
      style={{
        background: THEME.bgGradient,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 36px',
        fontFamily: THEME.fontFamily,
      }}
    >
      {hasAudio && <Audio src={staticFile('audio/kohli_vs_smith/scene2_overall_stats.wav')} volume={1} />}

      {/* Background Stadium Motion Video */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          filter: 'blur(4px) grayscale(40%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <Video
          src={staticFile('cricket/videos/cricket_action_clean.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          muted
          loop
        />
      </div>

      {/* Scene Header */}
      <KineticTeluguTitle
        badge="ROUND 1: CAREER NUMBERS"
        badgeColor="#0284C7"
        title="ఓవరాల్ టెస్ట్ స్టాట్స్ & సెంచరీలు"
        subtitle="టెస్ట్ క్రికెట్ లో ఇద్దరి ప్రస్థానం | రన్స్, యావరేజ్ & హయ్యెస్ట్ స్కోర్స్"
        titleSize={76}
        subtitleSize={28}
        delay={10}
      />

      {/* Main Stats Display Matrix - Full Width */}
      <div
        style={{
          display: 'flex',
          width: '100%',
          maxWidth: 1850,
          gap: 20,
          alignItems: 'stretch',
          marginTop: 2,
          zIndex: 10,
        }}
      >
        {/* Left Side: Kohli Full Height Studio Card */}
        <div
          style={{
            width: 420,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: '#FFFFFF',
            borderRadius: 32,
            border: `3.5px solid ${isKohliFocus ? '#0284C7' : '#94A3B8'}`,
            boxShadow: isKohliFocus
              ? '0 30px 80px -10px rgba(2, 132, 199, 0.4), 0 0 30px rgba(2, 132, 199, 0.25)'
              : '0 20px 50px -15px rgba(15, 23, 42, 0.12)',
            overflow: 'hidden',
            transform: `translateX(${(1 - sprL) * -80}px) translateY(${breatheL}px) scale(${isKohliFocus ? 1.03 : 1})`,
            transition: 'border 0.3s, transform 0.3s, box-shadow 0.3s',
            opacity: Math.min(1, sprL * 1.5),
            position: 'relative',
          }}
        >
          {/* Active Speaking Indicator */}
          {isKohliFocus && (
            <div
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                background: '#0284C7',
                color: '#FFFFFF',
                padding: '6px 16px',
                borderRadius: 20,
                fontSize: 14,
                fontWeight: 900,
                letterSpacing: 1,
                zIndex: 20,
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)',
              }}
            >
              FOCUS 🎤
            </div>
          )}

          {/* Country Pill */}
          <div
            style={{
              position: 'absolute',
              top: 14,
              left: 14,
              background: '#E0F2FE',
              color: '#0284C7',
              padding: '8px 20px',
              borderRadius: 20,
              fontSize: 16,
              fontWeight: 900,
              letterSpacing: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              zIndex: 15,
              border: '1.5px solid #0284C7',
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF9933' }} />
            <span>INDIA 🇮🇳</span>
          </div>

          {/* Large Portrait Section */}
          <div
            style={{
              width: '100%',
              height: 480,
              overflow: 'hidden',
              background: 'radial-gradient(circle at 50% 30%, #FFFFFF 0%, #E0F2FE 75%, #CBD5E1 100%)',
              position: 'relative',
            }}
          >
            <Img
              src={staticFile('cricket/kohli_portrait.png')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top center',
                transform: `scale(${isKohliFocus ? 1.08 : 1.02})`,
                transition: 'transform 0.3s',
              }}
            />
          </div>

          {/* Player Info Footer */}
          <div
            style={{
              width: '100%',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '16px 20px',
              background: 'linear-gradient(to top, #FFFFFF 90%, rgba(255, 255, 255, 0.95) 100%)',
              borderTop: '1px solid rgba(0, 0, 0, 0.05)',
            }}
          >
            <div style={{ color: THEME.textDark, fontSize: 32, fontWeight: 900, textAlign: 'center', letterSpacing: 1 }}>
              {THEME.kohli.engName}
            </div>
            <div style={{ color: '#0284C7', fontSize: 20, fontWeight: 900, marginTop: 4, letterSpacing: 0.5 }}>
              {THEME.kohli.name} • {THEME.kohli.title}
            </div>
            <div
              style={{
                marginTop: 8,
                background: '#E0F2FE',
                color: '#0369A1',
                padding: '4px 16px',
                borderRadius: 16,
                fontSize: 16,
                fontWeight: 800,
              }}
            >
              118 MATCHES • 9,040 RUNS
            </div>
          </div>
        </div>

        {/* Center: Stat Bars Stack (Dynamic reveals synced with voiceover) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* 1. Matches */}
          <StatBarCompare
            label="టెస్ట్ మ్యాచ్‌లు (TEST MATCHES)"
            valKohli={118}
            valSmith={109}
            delay={30}
          />

          {/* 2. Total Runs */}
          <StatBarCompare
            label="మొత్తం పరుగులు (TOTAL RUNS)"
            valKohli={9040}
            valSmith={9685}
            format={(v) => Math.round(v).toLocaleString()}
            delay={80}
          />

          {/* 3. Batting Average with Shockwave & Spotlight on Smith */}
          <div
            style={{
              transform: `scale(${shockwavePulse})`,
              transition: 'transform 0.1s',
              position: 'relative',
            }}
          >
            {isShockwave && (
              <div
                style={{
                  position: 'absolute',
                  top: -24,
                  right: 20,
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                  color: '#FFFFFF',
                  padding: '6px 20px',
                  borderRadius: 20,
                  fontSize: 16,
                  fontWeight: 900,
                  boxShadow: '0 6px 20px rgba(217, 119, 6, 0.5)',
                  zIndex: 30,
                  animation: 'pulse 1s infinite',
                }}
              >
                🤯 BRADMANESQUE 56.97 AVG!
              </div>
            )}
            <StatBarCompare
              label="బ్యాటింగ్ యావరేజ్ (BATTING AVERAGE)"
              subLabel="Bradmanesque ~57 Avg (Mind-Blowing!)"
              valKohli={48.0}
              valSmith={56.97}
              format={(v) => v.toFixed(2)}
              maxVal={70}
              delay={130}
            />
          </div>

          {/* 4. Centuries */}
          <StatBarCompare
            label="సెంచరీలు (CENTURIES)"
            valKohli={29}
            valSmith={32}
            delay={180}
          />

          {/* 5. Highest Score */}
          <StatBarCompare
            label="హయ్యెస్ట్ స్కోర్ (HIGHEST SCORE)"
            subLabel="Kohli 254* vs SA (Pune) | Smith 239 vs ENG (Perth)"
            valKohli={254}
            valSmith={239}
            format={(v) => `${Math.round(v)}${v === 254 ? '*' : ''}`}
            delay={230}
          />

          {/* Phase 4 Verdict Banner at bottom */}
          {isConclusion && (
            <div
              style={{
                marginTop: 10,
                background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
                border: '2.5px solid #D97706',
                borderRadius: 22,
                padding: '14px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 10px 30px rgba(217, 119, 6, 0.2)',
                transform: `scale(${interpolate(verdictSpr, [0, 1], [0.92, 1])})`,
                opacity: Math.min(1, verdictSpr * 1.5),
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 28 }}>🛡️</span>
                <span style={{ color: '#92400E', fontSize: 22, fontWeight: 900 }}>
                  రౌండ్ 1 వర్డిక్ట్: స్టాట్స్ పరంగా స్టీవ్ స్మిత్ దే అప్పర్ హ్యాండ్!
                </span>
              </div>
              <div
                style={{
                  background: '#0F172A',
                  color: '#FFFFFF',
                  padding: '8px 20px',
                  borderRadius: 16,
                  fontSize: 16,
                  fontWeight: 900,
                  letterSpacing: 1,
                }}
              >
                NEXT: SENA RECORDS 🌍
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Smith Full Height Studio Card */}
        <div
          style={{
            width: 420,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: '#FFFFFF',
            borderRadius: 32,
            border: `3.5px solid ${isSmithFocus ? '#D97706' : '#94A3B8'}`,
            boxShadow: isSmithFocus
              ? '0 30px 80px -10px rgba(217, 119, 6, 0.4), 0 0 30px rgba(217, 119, 6, 0.25)'
              : '0 20px 50px -15px rgba(15, 23, 42, 0.12)',
            overflow: 'hidden',
            transform: `translateX(${(1 - sprR) * 80}px) translateY(${breatheR}px) scale(${isSmithFocus ? 1.03 : 1})`,
            transition: 'border 0.3s, transform 0.3s, box-shadow 0.3s',
            opacity: Math.min(1, sprR * 1.5),
            position: 'relative',
          }}
        >
          {/* Active Speaking Indicator */}
          {isSmithFocus && (
            <div
              style={{
                position: 'absolute',
                top: 14,
                left: 14,
                background: '#D97706',
                color: '#FFFFFF',
                padding: '6px 16px',
                borderRadius: 20,
                fontSize: 14,
                fontWeight: 900,
                letterSpacing: 1,
                zIndex: 20,
                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.4)',
              }}
            >
              FOCUS 🎤
            </div>
          )}

          {/* Country Pill */}
          <div
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              background: '#FEF3C7',
              color: '#D97706',
              padding: '8px 20px',
              borderRadius: 20,
              fontSize: 16,
              fontWeight: 900,
              letterSpacing: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              zIndex: 15,
              border: '1.5px solid #F59E0B',
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F59E0B' }} />
            <span>AUSTRALIA 🇦🇺</span>
          </div>

          {/* Large Portrait Section */}
          <div
            style={{
              width: '100%',
              height: 480,
              overflow: 'hidden',
              background: 'radial-gradient(circle at 50% 30%, #FFFFFF 0%, #FEF3C7 75%, #CBD5E1 100%)',
              position: 'relative',
            }}
          >
            <Img
              src={staticFile('cricket/smith_portrait.png')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top center',
                transform: `scale(${isSmithFocus ? 1.08 : 1.02})`,
                transition: 'transform 0.3s',
              }}
            />
          </div>

          {/* Player Info Footer */}
          <div
            style={{
              width: '100%',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '16px 20px',
              background: 'linear-gradient(to top, #FFFFFF 90%, rgba(255, 255, 255, 0.95) 100%)',
              borderTop: '1px solid rgba(0, 0, 0, 0.05)',
            }}
          >
            <div style={{ color: THEME.textDark, fontSize: 32, fontWeight: 900, textAlign: 'center', letterSpacing: 1 }}>
              {THEME.smith.engName}
            </div>
            <div style={{ color: '#D97706', fontSize: 20, fontWeight: 900, marginTop: 4, letterSpacing: 0.5 }}>
              {THEME.smith.name} • {THEME.smith.title}
            </div>
            <div
              style={{
                marginTop: 8,
                background: '#FEF3C7',
                color: '#B45309',
                padding: '4px 16px',
                borderRadius: 16,
                fontSize: 16,
                fontWeight: 800,
              }}
            >
              109 MATCHES • 9,685 RUNS
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
