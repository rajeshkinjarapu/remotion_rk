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
import { PlayerCard3D } from '../components/PlayerCard3D';
import { KineticTeluguTitle } from '../components/KineticTeluguTitle';

export const Scene1Intro: React.FC<{ hasAudio?: boolean }> = ({ hasAudio = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle broadcast camera crane motion
  const cameraZoom = interpolate(frame, [0, 1380], [1, 1.02]);

  // Phase Definitions based on Telugu Voiceover:
  // Phase 1 (0 - 280): Hook & Title Entrance
  // Phase 2 (280 - 640): King Virat Kohli Spotlight & Batting Video
  // Phase 3 (640 - 1000): Steve Smith Spotlight & Unorthodox Leave Video
  // Phase 4 (1000 - 1380): Grand Dual Clash Face-Off
  const isPhase1 = frame < 280;
  const isPhase2 = frame >= 280 && frame < 640;
  const isPhase3 = frame >= 640 && frame < 1000;
  const isPhase4 = frame >= 1000;

  // Spring transitions for phases
  const p1Spring = spring({ frame, fps, config: { damping: 18, stiffness: 75, mass: 1.1 } });
  const p2Spring = spring({ frame: Math.max(0, frame - 280), fps, config: { damping: 18, stiffness: 75, mass: 1.1 } });
  const p3Spring = spring({ frame: Math.max(0, frame - 640), fps, config: { damping: 18, stiffness: 75, mass: 1.1 } });
  const p4Spring = spring({ frame: Math.max(0, frame - 1000), fps, config: { damping: 18, stiffness: 75, mass: 1.1 } });

  return (
    <AbsoluteFill
      style={{
        background: THEME.bgGradient,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        transform: `scale(${cameraZoom})`,
        fontFamily: THEME.fontFamily,
      }}
    >
      {/* Voiceover Track (optional if played by master) */}
      {hasAudio && <Audio src={staticFile('audio/kohli_vs_smith/scene1_intro.wav')} volume={1} />}

      {/* Background Stadium Video Atmosphere (Subtle Clean White Bleed) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.12,
          filter: 'blur(3px) grayscale(40%)',
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

      {/* Subtle Studio Floor Horizon Line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 380,
          background: 'linear-gradient(to top, rgba(226, 232, 240, 0.7) 0%, transparent 100%)',
          zIndex: 1,
        }}
      />

      {/* ========================================================================= */}
      {/* PHASE 1: Hook & Grand Dual Player Entrance (Frames 0 - 280)               */}
      {/* ========================================================================= */}
      {isPhase1 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 1840,
            paddingTop: 20,
            zIndex: 10,
            opacity: Math.min(1, p1Spring * 1.5),
            transform: `scale(${interpolate(p1Spring, [0, 1], [0.94, 1])})`,
          }}
        >
          {/* Main Kinetic Badge */}
          <div
            style={{
              background: '#FFFFFF',
              border: '2.5px solid #D97706',
              color: '#D97706',
              padding: '8px 28px',
              borderRadius: 30,
              fontSize: 18,
              fontWeight: 900,
              letterSpacing: 2,
              marginBottom: 10,
              boxShadow: '0 8px 24px rgba(217, 119, 6, 0.15)',
            }}
          >
            🔥 THE MODERN DAY GREATS RIVALRY
          </div>

          <h1
            style={{
              fontSize: 84,
              fontWeight: 900,
              color: THEME.textDark,
              margin: '0 0 10px 0',
              textAlign: 'center',
              lineHeight: 1.15,
              letterSpacing: -1,
            }}
          >
            కింగ్ విరాట్ కోహ్లీ <span style={{ color: '#D97706' }}>VS</span> స్టీవ్ స్మిత్
          </h1>

          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: THEME.textMuted,
              textAlign: 'center',
              maxWidth: 1400,
              lineHeight: 1.3,
              marginBottom: 16,
            }}
          >
            టెస్ట్ క్రికెట్ లో ఒరిజినల్ బాస్ ఎవరు? | రికార్డ్స్, సెంచరీలు & SENA డామినేషన్
          </div>

          {/* Dual Giant Player Boxes side-by-side filling the screen */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              padding: '0 30px',
              position: 'relative',
            }}
          >
            {/* Left: Giant Kohli Box */}
            <PlayerCard3D player="kohli" align="left" cardWidth={560} cardHeight={700} delay={0} />

            {/* Center VS Pulse Badge */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 30,
                transform: `scale(${interpolate(p1Spring, [0, 1], [0.6, 1])})`,
              }}
            >
              {/* Rotating Ring */}
              <div
                style={{
                  position: 'absolute',
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  border: '3px dashed #CBD5E1',
                  transform: `rotate(${frame * 0.8}deg)`,
                }}
              />

              <div
                style={{
                  width: 105,
                  height: 105,
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: '3.5px solid #0F172A',
                  boxShadow: '0 20px 45px rgba(0, 0, 0, 0.18), 0 0 0 8px rgba(255, 255, 255, 0.9)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 3,
                }}
              >
                <span
                  style={{
                    color: '#0F172A',
                    fontSize: 44,
                    fontWeight: 900,
                    letterSpacing: -1,
                  }}
                >
                  VS
                </span>
              </div>

              <div
                style={{
                  marginTop: 14,
                  background: '#FFFFFF',
                  border: '2px solid #D97706',
                  color: '#D97706',
                  padding: '6px 20px',
                  borderRadius: 20,
                  fontSize: 15,
                  fontWeight: 900,
                  letterSpacing: 2,
                  boxShadow: '0 8px 20px rgba(217, 119, 6, 0.15)',
                  whiteSpace: 'nowrap',
                }}
              >
                TEST RIVALRY
              </div>
            </div>

            {/* Right: Giant Smith Box */}
            <PlayerCard3D player="smith" align="right" cardWidth={560} cardHeight={700} delay={0} />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHASE 2: Virat Kohli Spotlight & Real Batting Video (Frames 280 - 640)    */}
      {/* ========================================================================= */}
      {isPhase2 && (
        <div
          style={{
            display: 'flex',
            width: '100%',
            maxWidth: 1840,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '40px 60px',
            zIndex: 10,
            opacity: Math.min(1, p2Spring * 1.5),
          }}
        >
          {/* Left: Giant Kohli 3D Player Card */}
          <div style={{ width: 560 }}>
            <PlayerCard3D player="kohli" align="left" cardWidth={560} cardHeight={720} delay={0} />
          </div>

          {/* Right: Broadcast Real Video Replay Stage */}
          <div
            style={{
              flex: 1,
              marginLeft: 50,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transform: `translateX(${(1 - p2Spring) * 100}px)`,
            }}
          >
            {/* Top Stage Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: '#E0F2FE',
                border: '2px solid #0284C7',
                padding: '8px 24px',
                borderRadius: 20,
                color: '#0369A1',
                fontSize: 18,
                fontWeight: 900,
                letterSpacing: 1.5,
                marginBottom: 16,
              }}
            >
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#DC2626' }} />
              <span>ACTION HIGHLIGHT: THE SIGNATURE COVER DRIVE</span>
            </div>

            {/* Video Frame */}
            <div
              style={{
                width: 900,
                height: 520,
                borderRadius: 32,
                overflow: 'hidden',
                background: '#0F172A',
                border: '4px solid #0284C7',
                boxShadow: '0 30px 80px -15px rgba(2, 132, 199, 0.35)',
                position: 'relative',
              }}
            >
              <Video
                src={staticFile('cricket/videos/kohli_cover_drive.mp4')}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                muted
                loop
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 20,
                  left: 24,
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(8px)',
                  padding: '10px 22px',
                  borderRadius: 16,
                  color: '#FFFFFF',
                  fontSize: 20,
                  fontWeight: 900,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                ⚡ "అగ్రెసివ్ అప్రోచ్‌తో బౌలర్లను డామినేట్ చేసే కింగ్!"
              </div>
            </div>

            {/* Kinetic Text Callouts Below */}
            <div style={{ display: 'flex', gap: 20, marginTop: 24 }}>
              <div style={{ background: '#FFFFFF', padding: '12px 24px', borderRadius: 20, border: '2px solid #0284C7', color: '#0F172A', fontSize: 20, fontWeight: 900, boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
                🦁 ఫస్ట్ బాల్ నుంచే అటాక్!
              </div>
              <div style={{ background: '#FFFFFF', padding: '12px 24px', borderRadius: 20, border: '2px solid #0284C7', color: '#0F172A', fontSize: 20, fontWeight: 900, boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
                🎯 బౌలర్ల మైండ్ పై ఎదురుదాడి!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHASE 3: Steve Smith Spotlight & Unorthodox Video (Frames 640 - 1000)     */}
      {/* ========================================================================= */}
      {isPhase3 && (
        <div
          style={{
            display: 'flex',
            width: '100%',
            maxWidth: 1840,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '40px 60px',
            zIndex: 10,
            opacity: Math.min(1, p3Spring * 1.5),
          }}
        >
          {/* Left: Broadcast Real Video Replay Stage */}
          <div
            style={{
              flex: 1,
              marginRight: 50,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transform: `translateX(${(1 - p3Spring) * -100}px)`,
            }}
          >
            {/* Top Stage Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: '#FEF3C7',
                border: '2px solid #D97706',
                padding: '8px 24px',
                borderRadius: 20,
                color: '#B45309',
                fontSize: 18,
                fontWeight: 900,
                letterSpacing: 1.5,
                marginBottom: 16,
              }}
            >
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#D97706' }} />
              <span>ACTION HIGHLIGHT: THE UNORTHODOX LEAVE & PATIENCE</span>
            </div>

            {/* Video Frame */}
            <div
              style={{
                width: 900,
                height: 520,
                borderRadius: 32,
                overflow: 'hidden',
                background: '#0F172A',
                border: '4px solid #D97706',
                boxShadow: '0 30px 80px -15px rgba(217, 119, 6, 0.35)',
                position: 'relative',
              }}
            >
              <Video
                src={staticFile('cricket/videos/smith_leave.mp4')}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                muted
                loop
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 20,
                  left: 24,
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(8px)',
                  padding: '10px 22px',
                  borderRadius: 16,
                  color: '#FFFFFF',
                  fontSize: 20,
                  fontWeight: 900,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                🛡️ "క్రీజు చుట్టూ తిరుగుతూ బౌలర్ల సహనాన్ని పరీక్షించే అద్భుతం!"
              </div>
            </div>

            {/* Kinetic Text Callouts Below */}
            <div style={{ display: 'flex', gap: 20, marginTop: 24 }}>
              <div style={{ background: '#FFFFFF', padding: '12px 24px', borderRadius: 20, border: '2px solid #D97706', color: '#0F172A', fontSize: 20, fontWeight: 900, boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
                ⏳ గంటల తరబడి బంతిని వదిలేసే శైలి!
              </div>
              <div style={{ background: '#FFFFFF', padding: '12px 24px', borderRadius: 20, border: '2px solid #D97706', color: '#0F172A', fontSize: 20, fontWeight: 900, boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
                📈 మోడ్రన్-డే బ్రాడ్‌మన్ యావరేజ్!
              </div>
            </div>
          </div>

          {/* Right: Giant Smith 3D Player Card */}
          <div style={{ width: 560 }}>
            <PlayerCard3D player="smith" align="right" cardWidth={560} cardHeight={720} delay={0} />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHASE 4: The Grand Dual Clash & Face-Off (Frames 1000 - 1380)             */}
      {/* ========================================================================= */}
      {isPhase4 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 1840,
            paddingTop: 30,
            zIndex: 10,
            opacity: Math.min(1, p4Spring * 1.5),
          }}
        >
          <KineticTeluguTitle
            badge="ROUND 1 READY"
            badgeColor="#D97706"
            title="అసలు ఈ ఇద్దరిలో ఒరిజినల్ బాస్ ఎవరు?"
            subtitle="ఓవరాల్ రికార్డ్స్, సెంచరీలు & SENA దేశాల్లో డామినేషన్ చూద్దాం!"
            titleSize={82}
            subtitleSize={30}
            delay={0}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              padding: '0 40px',
              marginTop: 10,
              position: 'relative',
            }}
          >
            {/* Left: Kohli */}
            <PlayerCard3D player="kohli" align="left" cardWidth={600} cardHeight={720} delay={0} />

            {/* Center VS Clashing Badge */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 30,
                transform: `scale(${interpolate(p4Spring, [0, 1], [0.5, 1])})`,
              }}
            >
              {/* Rotating Ring */}
              <div
                style={{
                  position: 'absolute',
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  border: '3px dashed #CBD5E1',
                  transform: `rotate(${frame * 0.8}deg)`,
                }}
              />

              <div
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: '3.5px solid #0F172A',
                  boxShadow: '0 20px 45px rgba(0, 0, 0, 0.18), 0 0 0 8px rgba(255, 255, 255, 0.9)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 3,
                }}
              >
                <span
                  style={{
                    color: '#0F172A',
                    fontSize: 48,
                    fontWeight: 900,
                    letterSpacing: -1,
                  }}
                >
                  VS
                </span>
              </div>

              <div
                style={{
                  marginTop: 16,
                  background: '#FFFFFF',
                  border: '2px solid #D97706',
                  color: '#D97706',
                  padding: '8px 24px',
                  borderRadius: 24,
                  fontSize: 16,
                  fontWeight: 900,
                  letterSpacing: 2,
                  boxShadow: '0 8px 20px rgba(217, 119, 6, 0.15)',
                  whiteSpace: 'nowrap',
                }}
              >
                TEST RIVALRY
              </div>
            </div>

            {/* Right: Smith */}
            <PlayerCard3D player="smith" align="right" cardWidth={600} cardHeight={720} delay={0} />
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
