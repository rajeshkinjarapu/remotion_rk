import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Series,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/AnekTelugu';
import timings from './timings.json';

const { fontFamily: teluguFont } = loadFont('normal', {
  weights: ['400', '600', '700', '800'],
  ignoreTooManyRequestsWarning: true,
});

export const TOTAL_SINGLE_SCENE_FRAMES =
  timings.scene1_intro.durationFrames +
  timings.scene2_overall_stats.durationFrames +
  timings.scene3_sena_records.durationFrames +
  timings.scene4_playing_style.durationFrames +
  timings.scene5_verdict_outro.durationFrames; // 8447 frames

const COLORS = {
  bgDark: '#050814',
  bgDeep: '#090D24',
  kohliPrimary: '#FF5500',
  kohliSecondary: '#00D2FF',
  smithPrimary: '#FFD700',
  smithSecondary: '#00FF87',
  accentPink: '#FF007A',
  textWhite: '#F8FAFC',
  textMuted: '#94A3B8',
  glassBg: 'rgba(15, 23, 42, 0.72)',
  glassBorder: 'rgba(255, 255, 255, 0.14)',
};

// ============================================================================
// REUSABLE BROADCAST FX COMPONENTS
// ============================================================================

const CyberStadiumBackground: React.FC<{
  leftColor?: string;
  rightColor?: string;
  intensity?: number;
}> = ({
  leftColor = COLORS.kohliPrimary,
  rightColor = COLORS.smithSecondary,
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const gridOffset = (frame * 1.2) % 80;
  const pulse = Math.sin(frame * 0.05) * 0.15 + 0.85;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgDark, overflow: 'hidden' }}>
      {/* Dual Atmospheric Stadium Spotlights */}
      <div
        style={{
          position: 'absolute',
          top: -250,
          left: -200,
          width: 1100,
          height: 1100,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${leftColor}44 0%, transparent 70%)`,
          filter: 'blur(90px)',
          opacity: pulse * intensity,
          transform: `translate(${Math.sin(frame * 0.02) * 50}px, ${
            Math.cos(frame * 0.02) * 30
          }px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -250,
          right: -200,
          width: 1100,
          height: 1100,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${rightColor}44 0%, transparent 70%)`,
          filter: 'blur(90px)',
          opacity: pulse * intensity,
          transform: `translate(${Math.cos(frame * 0.02) * -50}px, ${
            Math.sin(frame * 0.02) * -30
          }px)`,
        }}
      />

      {/* 3D Perspective Moving Cyber Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          backgroundPosition: `0px ${gridOffset}px`,
          transform: 'perspective(900px) rotateX(55deg) scale(1.6)',
          transformOrigin: 'center bottom',
          opacity: 0.65,
        }}
      />

      {/* Floating Energy Sparks */}
      {Array.from({ length: 18 }).map((_, i) => {
        const speed = 1.2 + (i % 4) * 0.6;
        const yPos = 1080 - ((frame * speed + i * 95) % 1180);
        const xPos = ((i * 137) % 1840) + Math.sin(frame * 0.03 + i) * 35;
        const size = 4 + (i % 5) * 2;
        const isLeft = xPos < 960;
        const color = isLeft ? leftColor : rightColor;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: xPos,
              top: yPos,
              width: size,
              height: size,
              borderRadius: '50%',
              backgroundColor: color,
              boxShadow: `0 0 ${size * 3}px ${color}`,
              opacity: 0.55,
            }}
          />
        );
      })}

      {/* Broadcast Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at center, transparent 55%, rgba(0,0,0,0.75) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

const BroadcastHUD: React.FC<{
  sectionTitle: string;
  teluguSubtitle: string;
  globalFrame: number;
}> = ({ sectionTitle, teluguSubtitle, globalFrame }) => {
  const progress = interpolate(
    globalFrame,
    [0, TOTAL_SINGLE_SCENE_FRAMES],
    [0, 100],
    { extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      {/* Top Broadcast Bar */}
      <div
        style={{
          position: 'absolute',
          top: 28,
          left: 48,
          right: 48,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Channel Bug */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            background: 'rgba(8, 12, 28, 0.85)',
            border: '1px solid rgba(255,255,255,0.18)',
            padding: '10px 22px',
            borderRadius: 999,
            boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#FF2A54',
              boxShadow: '0 0 12px #FF2A54',
            }}
          />
          <span
            style={{
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: 18,
              letterSpacing: 2,
            }}
          >
            RK CRICKET TELUGU
          </span>
          <span
            style={{
              color: COLORS.smithPrimary,
              fontWeight: 700,
              fontSize: 15,
              borderLeft: '1px solid rgba(255,255,255,0.2)',
              paddingLeft: 12,
            }}
          >
            TEST MATRIX
          </span>
        </div>

        {/* Dynamic Stage Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            background: 'rgba(8, 12, 28, 0.85)',
            border: '1px solid rgba(0, 210, 255, 0.35)',
            padding: '10px 26px',
            borderRadius: 999,
          }}
        >
          <span
            style={{
              color: COLORS.kohliSecondary,
              fontWeight: 800,
              fontSize: 16,
              letterSpacing: 1.5,
            }}
          >
            {sectionTitle}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
          <span
            style={{
              color: '#FFF',
              fontWeight: 700,
              fontSize: 17,
            }}
          >
            {teluguSubtitle}
          </span>
        </div>
      </div>

      {/* Bottom Master Timeline Progress Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          backgroundColor: 'rgba(255,255,255,0.08)',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${COLORS.kohliPrimary}, ${COLORS.kohliSecondary}, ${COLORS.smithPrimary}, ${COLORS.smithSecondary})`,
            boxShadow: '0 0 16px rgba(0, 210, 255, 0.9)',
          }}
        />
      </div>
    </div>
  );
};

const AnimatedCounter: React.FC<{
  target: number;
  startFrame: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  color?: string;
  fontSize?: number;
}> = ({
  target,
  startFrame,
  duration = 45,
  suffix = '',
  prefix = '',
  decimals = 0,
  color = '#FFFFFF',
  fontSize = 68,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  // Ease out cubic
  const eased = 1 - Math.pow(1 - progress, 3);
  const currentVal = (target * eased).toFixed(decimals);

  return (
    <span
      style={{
        fontSize,
        fontWeight: 900,
        color,
        fontVariantNumeric: 'tabular-nums',
        textShadow: `0 0 28px ${color}66`,
      }}
    >
      {prefix}
      {Number(currentVal).toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
};

// ============================================================================
// SCENE 1: INTRO - THE MODERN DAY GREATS (0 - 1380 frames / 45.99s)
// ============================================================================
export const Scene1Intro: React.FC<{ hasAudio?: boolean }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Sub-beat phases synced to Telugu voiceover:
  // 0-150: Welcome to RK Cricket Telugu
  // 150-450: King Virat Kohli vs Modern Day Bradman Steve Smith
  // 450-810: Bowlers sleepless! Aggression vs Unorthodox Patience
  // 810-1080: Fab 4 Separate League -> Who is the Original Boss?
  // 1080-1380: Overall, Centuries & SENA Countries (SA, ENG, NZ, AUS) roadmap

  const welcomeScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 110 },
  });

  const kohliEnter = spring({
    frame: frame - 165,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const smithEnter = spring({
    frame: frame - 225,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const styleMeterEnter = spring({
    frame: frame - 460,
    fps,
    config: { damping: 13 },
  });

  const bossStampScale = spring({
    frame: frame - 830,
    fps,
    config: { damping: 9, stiffness: 160 },
  });

  const senaEnter = spring({
    frame: frame - 1060,
    fps,
    config: { damping: 14 },
  });

  return (
    <AbsoluteFill>
      <CyberStadiumBackground
        leftColor={COLORS.kohliPrimary}
        rightColor={COLORS.smithPrimary}
      />
      <BroadcastHUD
        sectionTitle="STAGE 01 // THE CLASH OF TITANS"
        teluguSubtitle="మోడ్రన్ ఎరా టెస్ట్ క్రికెట్ బాస్ ఎవరు?"
        globalFrame={frame}
      />

      {/* PHASE 1: Welcome Stinger (Frames 0 - 165) */}
      {frame < 185 && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: interpolate(frame, [145, 180], [1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            transform: `scale(${welcomeScale})`,
          }}
        >
          <div
            style={{
              padding: '44px 80px',
              borderRadius: 36,
              background: 'rgba(10, 16, 38, 0.85)',
              border: `2px solid ${COLORS.smithPrimary}`,
              boxShadow: `0 0 80px rgba(255, 215, 0, 0.35)`,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: COLORS.kohliSecondary,
                letterSpacing: 6,
                marginBottom: 14,
              }}
            >
              WELCOME CRICKET FANS // స్వాగతం
            </div>
            <div
              style={{
                fontSize: 88,
                fontWeight: 900,
                background: `linear-gradient(90deg, ${COLORS.kohliPrimary}, ${COLORS.smithPrimary}, ${COLORS.smithSecondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: 2,
              }}
            >
              RK CRICKET TELUGU
            </div>
            <div
              style={{
                fontSize: 34,
                fontWeight: 700,
                color: '#FFFFFF',
                marginTop: 16,
              }}
            >
              టెస్ట్ క్రికెట్ మోడ్రన్ ఇరా స్పెషల్ అనాలసిస్
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* PHASE 2 & 3: Dual Hero Split Cards (Frames 150 - 1080) */}
      {frame >= 150 && frame < 1100 && (
        <AbsoluteFill
          style={{
            padding: '110px 64px 70px',
            opacity: interpolate(frame, [1050, 1095], [1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          {/* Main Dual Fighter Arena */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 140px 1fr',
              gap: 24,
              height: 560,
              alignItems: 'stretch',
            }}
          >
            {/* LEFT CARD: KING VIRAT KOHLI */}
            <div
              style={{
                transform: `translateX(${interpolate(
                  kohliEnter,
                  [0, 1],
                  [-700, 0]
                )}px) perspective(1000px) rotateY(4deg)`,
                opacity: kohliEnter,
                background:
                  'linear-gradient(145deg, rgba(255,85,0,0.22) 0%, rgba(10,15,35,0.92) 70%)',
                border: `2px solid ${COLORS.kohliPrimary}`,
                borderRadius: 32,
                padding: 38,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: `0 20px 60px rgba(255, 85, 0, 0.25)`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '6px 18px',
                    borderRadius: 999,
                    backgroundColor: COLORS.kohliPrimary,
                    color: '#FFF',
                    fontWeight: 900,
                    fontSize: 18,
                    letterSpacing: 2,
                    marginBottom: 16,
                  }}
                >
                  TEAM INDIA // THE KING
                </div>
                <div
                  style={{
                    fontSize: 66,
                    fontWeight: 900,
                    color: '#FFF',
                    lineHeight: 1.05,
                  }}
                >
                  VIRAT KOHLI
                </div>
                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 800,
                    color: '#FFB088',
                    marginTop: 8,
                  }}
                >
                  కింగ్ విరాట్ కోహ్లీ
                </div>
              </div>

              {/* Style Meter revealed at frame 460 */}
              <div
                style={{
                  opacity: styleMeterEnter,
                  transform: `translateY(${interpolate(
                    styleMeterEnter,
                    [0, 1],
                    [40, 0]
                  )}px)`,
                  background: 'rgba(0,0,0,0.45)',
                  borderRadius: 20,
                  padding: 22,
                  borderLeft: `5px solid ${COLORS.kohliPrimary}`,
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: COLORS.kohliSecondary,
                    letterSpacing: 1.5,
                  }}
                >
                  WEAPON: AGGRESSIVE DOMINANCE
                </div>
                <div
                  style={{
                    fontSize: 25,
                    fontWeight: 700,
                    color: '#FFF',
                    marginTop: 6,
                  }}
                >
                  అగ్రెసివ్ అప్రోచ్తో బౌలర్లపై ఆధిపత్యం 🔥
                </div>
                <div
                  style={{
                    marginTop: 12,
                    height: 12,
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.1)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${interpolate(
                        frame,
                        [480, 560],
                        [0, 98],
                        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                      )}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${COLORS.kohliPrimary}, #FFAA00)`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* CENTER VS LIGHTNING PILLAR */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${COLORS.kohliPrimary}, ${COLORS.smithPrimary})`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: 42,
                  fontWeight: 900,
                  color: '#050814',
                  boxShadow: '0 0 45px rgba(255, 215, 0, 0.7)',
                  transform: `scale(${1 + Math.sin(frame * 0.1) * 0.06})`,
                }}
              >
                VS
              </div>
              {frame >= 450 && (
                <div
                  style={{
                    marginTop: 24,
                    padding: '10px 14px',
                    borderRadius: 14,
                    background: 'rgba(255, 0, 85, 0.2)',
                    border: '1px solid #FF0055',
                    color: '#FF88AA',
                    fontSize: 15,
                    fontWeight: 800,
                    textAlign: 'center',
                  }}
                >
                  బౌలర్లకు నిద్ర పట్టదు! ⚡
                </div>
              )}
            </div>

            {/* RIGHT CARD: STEVE SMITH */}
            <div
              style={{
                transform: `translateX(${interpolate(
                  smithEnter,
                  [0, 1],
                  [700, 0]
                )}px) perspective(1000px) rotateY(-4deg)`,
                opacity: smithEnter,
                background:
                  'linear-gradient(215deg, rgba(0,255,135,0.2) 0%, rgba(10,15,35,0.92) 70%)',
                border: `2px solid ${COLORS.smithSecondary}`,
                borderRadius: 32,
                padding: 38,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: `0 20px 60px rgba(0, 255, 135, 0.22)`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '6px 18px',
                    borderRadius: 999,
                    backgroundColor: COLORS.smithPrimary,
                    color: '#050814',
                    fontWeight: 900,
                    fontSize: 18,
                    letterSpacing: 2,
                    marginBottom: 16,
                  }}
                >
                  AUSTRALIA // MODERN DAY BRADMAN
                </div>
                <div
                  style={{
                    fontSize: 66,
                    fontWeight: 900,
                    color: '#FFF',
                    lineHeight: 1.05,
                  }}
                >
                  STEVE SMITH
                </div>
                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 800,
                    color: COLORS.smithPrimary,
                    marginTop: 8,
                  }}
                >
                  మోడ్రన్ డే బ్రాడ్మన్ స్టీవ్ స్మిత్
                </div>
              </div>

              {/* Style Meter revealed at frame 550 */}
              <div
                style={{
                  opacity: styleMeterEnter,
                  transform: `translateY(${interpolate(
                    styleMeterEnter,
                    [0, 1],
                    [40, 0]
                  )}px)`,
                  background: 'rgba(0,0,0,0.45)',
                  borderRadius: 20,
                  padding: 22,
                  borderLeft: `5px solid ${COLORS.smithSecondary}`,
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: COLORS.smithPrimary,
                    letterSpacing: 1.5,
                  }}
                >
                  WEAPON: UNORTHODOX PATIENCE
                </div>
                <div
                  style={{
                    fontSize: 25,
                    fontWeight: 700,
                    color: '#FFF',
                    marginTop: 6,
                  }}
                >
                  డిఫరెంట్ స్టైల్తో బౌలర్ల సహనానికి పరీక్ష 🛡️
                </div>
                <div
                  style={{
                    marginTop: 12,
                    height: 12,
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.1)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${interpolate(
                        frame,
                        [560, 640],
                        [0, 99],
                        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                      )}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${COLORS.smithPrimary}, ${COLORS.smithSecondary})`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PHASE 4: FAB 4 APEX & "WHO IS THE ORIGINAL BOSS?" (Frames 810 - 1080) */}
          {frame >= 810 && (
            <div
              style={{
                marginTop: 34,
                transform: `scale(${bossStampScale})`,
                background:
                  'linear-gradient(90deg, rgba(255,85,0,0.22), rgba(255,215,0,0.28), rgba(0,255,135,0.22))',
                border: '2px solid rgba(255, 215, 0, 0.7)',
                borderRadius: 28,
                padding: '26px 48px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 0 60px rgba(255,215,0,0.3)',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: COLORS.smithPrimary,
                    letterSpacing: 3,
                  }}
                >
                  FAB 4 SEPARATE LEAGUE // ఫ్యాబ్-4 లో సపరేట్ రేంజ్
                </div>
                <div
                  style={{
                    fontSize: 48,
                    fontWeight: 900,
                    color: '#FFF',
                    marginTop: 6,
                  }}
                >
                  టెస్ట్ ఫార్మాట్కి ఒరిజినల్ బాస్ ఎవరు? 👑
                </div>
              </div>
              <div
                style={{
                  padding: '16px 32px',
                  borderRadius: 20,
                  backgroundColor: COLORS.smithPrimary,
                  color: '#050814',
                  fontSize: 30,
                  fontWeight: 900,
                }}
              >
                WHO IS THE BOSS?
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* PHASE 5: SENA COUNTRIES & ANALYSIS ROADMAP (Frames 1060 - 1380) */}
      {frame >= 1060 && (
        <AbsoluteFill
          style={{
            padding: '120px 70px 80px',
            opacity: senaEnter,
            transform: `translateY(${interpolate(senaEnter, [0, 1], [50, 0])}px)`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: COLORS.kohliSecondary,
                letterSpacing: 4,
              }}
            >
              ULTIMATE TEST CRUCIBLE // నేటి పూర్తి విశ్లేషణ
            </div>
            <div
              style={{
                fontSize: 60,
                fontWeight: 900,
                color: '#FFFFFF',
                marginTop: 10,
              }}
            >
              OVERALL STATS + CENTURIES + SENA RECORDS
            </div>
            <div
              style={{
                fontSize: 30,
                fontWeight: 700,
                color: COLORS.smithPrimary,
                marginTop: 8,
              }}
            >
              బ్యాటింగ్ చేయడానికి అత్యంత కష్టమైన SENA దేశాల్లో ఎవరిది పైచేయి?
            </div>
          </div>

          {/* 4 SENA Holographic Pillars */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 26,
              marginTop: 20,
            }}
          >
            {[
              {
                letter: 'S',
                country: 'SOUTH AFRICA',
                telugu: 'సౌతాఫ్రికా',
                trait: 'DEADLY PACE & BOUNCE',
                color: '#00FF87',
                delay: 1090,
              },
              {
                letter: 'E',
                country: 'ENGLAND',
                telugu: 'ఇంగ్లాండ్',
                trait: 'LETHAL DUKES SWING',
                color: '#00D2FF',
                delay: 1125,
              },
              {
                letter: 'N',
                country: 'NEW ZEALAND',
                telugu: 'న్యూజిలాండ్',
                trait: 'GREEN SEAMING TRACKS',
                color: '#A855F7',
                delay: 1160,
              },
              {
                letter: 'A',
                country: 'AUSTRALIA',
                telugu: 'ఆస్ట్రేలియా',
                trait: 'STEEP BOUNCE & PACE',
                color: '#FFD700',
                delay: 1195,
              },
            ].map((item, idx) => {
              const cardPop = spring({
                frame: frame - item.delay,
                fps,
                config: { damping: 12 },
              });
              return (
                <div
                  key={idx}
                  style={{
                    transform: `scale(${cardPop}) translateY(${interpolate(
                      cardPop,
                      [0, 1],
                      [60, 0]
                    )}px)`,
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: `2px solid ${item.color}`,
                    borderRadius: 28,
                    padding: '32px 26px',
                    textAlign: 'center',
                    boxShadow: `0 16px 40px ${item.color}28`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 96,
                      fontWeight: 900,
                      color: item.color,
                      lineHeight: 1,
                      textShadow: `0 0 30px ${item.color}`,
                    }}
                  >
                    {item.letter}
                  </div>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 900,
                      color: '#FFF',
                      marginTop: 14,
                    }}
                  >
                    {item.country}
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: item.color,
                      marginTop: 4,
                    }}
                  >
                    {item.telugu}
                  </div>
                  <div
                    style={{
                      marginTop: 16,
                      padding: '8px 12px',
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.06)',
                      color: '#CBD5E1',
                      fontSize: 15,
                      fontWeight: 800,
                      letterSpacing: 1,
                    }}
                  >
                    {item.trait}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              textAlign: 'center',
              fontSize: 28,
              fontWeight: 800,
              color: '#FFF',
              background: 'rgba(255,255,255,0.08)',
              padding: '16px 36px',
              borderRadius: 999,
              alignSelf: 'center',
            }}
          >
            వీడియో ఎండింగ్ వరకు చూసి ఆ బెస్ట్ ఎవరో మీరే డిసైడ్ చేయండి! 👇
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 2: OVERALL TEST STATS (1686 frames / 56.21s, Global 1380 - 3066)
// ============================================================================
export const Scene2OverallStats: React.FC<{ hasAudio?: boolean }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Voiceover timing inside Scene 2 (0 - 1686):
  // 0 - 120: ముందుగా వీళ్ళ ఓవరాల్ టెస్ట్ నంబర్స్ చూద్దాం
  // 120 - 720: Virat Kohli: 118+ matches, 9000+ runs, ~48 avg, 29 centuries, 254* best
  // 720 - 1380: Steve Smith: Started as leg spinner, 109 matches, 9600+ runs, ~57 avg (mind-block shockwave!), 32 centuries, 239 best
  // 1380 - 1686: Overall verdict: fewer matches, more runs, more centuries, highest avg after Bradman -> Steve Smith Upper Hand!

  const kohliPanelEnter = spring({
    frame: frame - 80,
    fps,
    config: { damping: 14 },
  });

  const smithPanelEnter = spring({
    frame: frame - 710,
    fps,
    config: { damping: 14 },
  });

  const shockwave57 = spring({
    frame: frame - 1010,
    fps,
    config: { damping: 8, stiffness: 150 },
  });

  const verdictBanner = spring({
    frame: frame - 1380,
    fps,
    config: { damping: 12 },
  });

  return (
    <AbsoluteFill>
      <CyberStadiumBackground
        leftColor={COLORS.kohliPrimary}
        rightColor={COLORS.smithSecondary}
      />
      <BroadcastHUD
        sectionTitle="ROUND 01 // OVERALL TEST NUMBERS"
        teluguSubtitle="ఓవరాల్ టెస్ట్ రికార్డ్స్ & సెంచరీలు"
        globalFrame={1380 + frame}
      />

      {/* Shockwave Ring when 57 Average is announced (around frame 1010) */}
      {frame >= 1010 && frame <= 1160 && (
        <div
          style={{
            position: 'absolute',
            right: 280,
            top: 380,
            width: 500,
            height: 500,
            borderRadius: '50%',
            border: `6px solid ${COLORS.smithPrimary}`,
            transform: `scale(${interpolate(frame, [1010, 1140], [0.2, 3.2])})`,
            opacity: interpolate(frame, [1010, 1140], [0.95, 0]),
            pointerEvents: 'none',
            zIndex: 30,
          }}
        />
      )}

      <AbsoluteFill style={{ padding: '105px 60px 60px' }}>
        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontSize: 46,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: 1,
            }}
          >
            OVERALL TEST CAREER COMPARISON // ఓవరాల్ టెస్ట్ స్టాట్స్
          </div>
        </div>

        {/* Main 2-Column Stat Matrix */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 36,
            flex: 1,
          }}
        >
          {/* LEFT: VIRAT KOHLI STATS */}
          <div
            style={{
              opacity: kohliPanelEnter,
              transform: `translateY(${interpolate(
                kohliPanelEnter,
                [0, 1],
                [50, 0]
              )}px)`,
              background: COLORS.glassBg,
              border: `2px solid ${COLORS.kohliPrimary}`,
              borderRadius: 30,
              padding: '28px 34px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 20px 50px rgba(255, 85, 0, 0.2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.12)',
                paddingBottom: 14,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 40,
                    fontWeight: 900,
                    color: '#FFF',
                  }}
                >
                  VIRAT KOHLI
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: COLORS.kohliPrimary,
                  }}
                >
                  కింగ్ కోహ్లీ ఓవరాల్ రికార్డ్
                </div>
              </div>
              <div
                style={{
                  padding: '8px 20px',
                  borderRadius: 14,
                  background: 'rgba(255,85,0,0.2)',
                  border: `1px solid ${COLORS.kohliPrimary}`,
                  color: '#FFF',
                  fontWeight: 900,
                  fontSize: 20,
                }}
              >
                IND 🇮🇳
              </div>
            </div>

            {/* Stat Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 18,
                marginTop: 14,
              }}
            >
              <div
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: 20,
                  padding: 18,
                }}
              >
                <div style={{ color: COLORS.textMuted, fontSize: 17, fontWeight: 700 }}>
                  TEST MATCHES (మ్యాచ్లు)
                </div>
                <AnimatedCounter
                  target={118}
                  startFrame={140}
                  suffix="+"
                  color="#FFFFFF"
                  fontSize={56}
                />
              </div>

              <div
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: 20,
                  padding: 18,
                }}
              >
                <div style={{ color: COLORS.textMuted, fontSize: 17, fontWeight: 700 }}>
                  TOTAL RUNS (పరుగులు)
                </div>
                <AnimatedCounter
                  target={9000}
                  startFrame={250}
                  suffix="+"
                  color={COLORS.kohliSecondary}
                  fontSize={56}
                />
              </div>

              <div
                style={{
                  background: 'rgba(255,85,0,0.12)',
                  border: `1px solid ${COLORS.kohliPrimary}66`,
                  borderRadius: 20,
                  padding: 18,
                }}
              >
                <div style={{ color: '#FFB088', fontSize: 17, fontWeight: 800 }}>
                  TEST AVERAGE (యావరేజ్)
                </div>
                <AnimatedCounter
                  target={48}
                  startFrame={370}
                  prefix="~"
                  color={COLORS.kohliPrimary}
                  fontSize={60}
                />
              </div>

              <div
                style={{
                  background: 'rgba(255,215,0,0.1)',
                  border: '1px solid rgba(255,215,0,0.4)',
                  borderRadius: 20,
                  padding: 18,
                }}
              >
                <div style={{ color: COLORS.smithPrimary, fontSize: 17, fontWeight: 800 }}>
                  CENTURIES (సెంచరీలు)
                </div>
                <AnimatedCounter
                  target={29}
                  startFrame={500}
                  color={COLORS.smithPrimary}
                  fontSize={60}
                />
              </div>
            </div>

            {/* Career Best Strip */}
            <div
              style={{
                marginTop: 14,
                background: 'linear-gradient(90deg, rgba(255,85,0,0.3), transparent)',
                borderRadius: 18,
                padding: '14px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ color: '#FFF', fontSize: 22, fontWeight: 800 }}>
                CAREER BEST SCORE (కెరీర్ బెస్ట్ స్కోర్)
              </span>
              <span
                style={{
                  color: COLORS.smithPrimary,
                  fontSize: 42,
                  fontWeight: 900,
                }}
              >
                {frame >= 600 ? '254*' : '---'}
              </span>
            </div>
          </div>

          {/* RIGHT: STEVE SMITH STATS */}
          <div
            style={{
              opacity: frame >= 700 ? smithPanelEnter : 0.2,
              transform: `translateY(${interpolate(
                smithPanelEnter,
                [0, 1],
                [50, 0]
              )}px)`,
              background: COLORS.glassBg,
              border: `2px solid ${COLORS.smithSecondary}`,
              borderRadius: 30,
              padding: '28px 34px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 20px 50px rgba(0, 255, 135, 0.2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.12)',
                paddingBottom: 14,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 40,
                    fontWeight: 900,
                    color: '#FFF',
                  }}
                >
                  STEVE SMITH
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: COLORS.smithSecondary,
                  }}
                >
                  లెగ్ స్పిన్నర్ నుండి టెస్ట్ లెజెండ్ వరకు!
                </div>
              </div>
              <div
                style={{
                  padding: '8px 20px',
                  borderRadius: 14,
                  background: 'rgba(0,255,135,0.2)',
                  border: `1px solid ${COLORS.smithSecondary}`,
                  color: '#FFF',
                  fontWeight: 900,
                  fontSize: 20,
                }}
              >
                AUS 🇦🇺
              </div>
            </div>

            {/* Stat Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 18,
                marginTop: 14,
              }}
            >
              <div
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: 20,
                  padding: 18,
                }}
              >
                <div style={{ color: COLORS.textMuted, fontSize: 17, fontWeight: 700 }}>
                  TEST MATCHES (తక్కువ మ్యాచ్లు)
                </div>
                <AnimatedCounter
                  target={109}
                  startFrame={820}
                  color="#FFFFFF"
                  fontSize={56}
                />
              </div>

              <div
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: 20,
                  padding: 18,
                }}
              >
                <div style={{ color: COLORS.textMuted, fontSize: 17, fontWeight: 700 }}>
                  TOTAL RUNS (ఎక్కువ పరుగులు)
                </div>
                <AnimatedCounter
                  target={9600}
                  startFrame={890}
                  suffix="+"
                  color={COLORS.smithSecondary}
                  fontSize={56}
                />
              </div>

              {/* 57 AVERAGE MIND-BLOCK HIGHLIGHT */}
              <div
                style={{
                  background:
                    frame >= 1010
                      ? 'linear-gradient(135deg, rgba(255,215,0,0.32), rgba(0,255,135,0.22))'
                      : 'rgba(255,255,255,0.04)',
                  border: `2px solid ${COLORS.smithPrimary}`,
                  borderRadius: 20,
                  padding: 18,
                  transform:
                    frame >= 1010 ? `scale(${0.95 + shockwave57 * 0.08})` : 'none',
                  boxShadow:
                    frame >= 1010 ? '0 0 35px rgba(255,215,0,0.45)' : 'none',
                }}
              >
                <div
                  style={{
                    color: COLORS.smithPrimary,
                    fontSize: 17,
                    fontWeight: 900,
                  }}
                >
                  MIND-BLOWING AVG (యావరేజ్) 🤯
                </div>
                <AnimatedCounter
                  target={57}
                  startFrame={1010}
                  prefix="~"
                  color={COLORS.smithPrimary}
                  fontSize={64}
                />
              </div>

              <div
                style={{
                  background: 'rgba(0,255,135,0.12)',
                  border: `1px solid ${COLORS.smithSecondary}`,
                  borderRadius: 20,
                  padding: 18,
                }}
              >
                <div
                  style={{
                    color: COLORS.smithSecondary,
                    fontSize: 17,
                    fontWeight: 800,
                  }}
                >
                  CENTURIES (సెంచరీలు)
                </div>
                <AnimatedCounter
                  target={32}
                  startFrame={1150}
                  color={COLORS.smithSecondary}
                  fontSize={60}
                />
              </div>
            </div>

            {/* Career Best Strip */}
            <div
              style={{
                marginTop: 14,
                background:
                  'linear-gradient(90deg, rgba(0,255,135,0.3), transparent)',
                borderRadius: 18,
                padding: '14px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ color: '#FFF', fontSize: 22, fontWeight: 800 }}>
                HIGHEST SCORE (హైయెస్ట్ స్కోర్)
              </span>
              <span
                style={{
                  color: COLORS.smithPrimary,
                  fontSize: 42,
                  fontWeight: 900,
                }}
              >
                {frame >= 1260 ? '239' : '---'}
              </span>
            </div>
          </div>
        </div>

        {/* ROUND 1 VERDICT BAR (Frames 1380 - 1686) */}
        {frame >= 1380 && (
          <div
            style={{
              marginTop: 26,
              transform: `scale(${verdictBanner})`,
              background:
                'linear-gradient(90deg, rgba(0,255,135,0.25), rgba(255,215,0,0.3), rgba(10,15,35,0.95))',
              border: `2px solid ${COLORS.smithPrimary}`,
              borderRadius: 24,
              padding: '20px 38px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: COLORS.smithPrimary,
                  letterSpacing: 2,
                }}
              >
                OVERALL STATS VERDICT // బ్రాడ్మన్ తర్వాత అత్యధిక యావరేజ్
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 900,
                  color: '#FFF',
                  marginTop: 4,
                }}
              >
                తక్కువ మ్యాచ్లు + ఎక్కువ రన్స్ (9600+) + 32 సెంచరీలు + ~57 యావరేజ్ =
                స్టీవ్ స్మిత్ అప్పర్ హ్యాండ్!
              </div>
            </div>
            <div
              style={{
                padding: '12px 28px',
                borderRadius: 16,
                backgroundColor: COLORS.smithSecondary,
                color: '#050814',
                fontWeight: 900,
                fontSize: 24,
              }}
            >
              EDGE: STEVE SMITH 🏆
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 3: SENA COUNTRIES DEEP DIVE (3013 frames / 100.44s, Global 3066 - 6079)
// ============================================================================
export const Scene3SenaMap: React.FC<{ hasAudio?: boolean }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Sub-stages inside Scene 3 (0 to 3013 frames):
  // Stage A (0 - 450): "కానీ అసలు కథ ఇక్కడే మొదలవుతుంది..." SENA Crucible Intro (Swing, Pace, Bounce)
  // Stage B (450 - 1320): Australia & South Africa records (Kohli 54+ avg, 6 100s, 2014 Adelaide twin 100s; SA 50 avg, 3 100s vs Smith 62+ AUS, 41 SA)
  // Stage C (1320 - 2310): England Swing Test (Anderson/Broad, Kohli 2014 struggle -> 2018 593 runs comeback, 33+ avg, 2 100s vs Smith 2019 Ashes 774 runs @ 110 avg, 58+ avg, 7 100s)
  // Stage D (2310 - 3013): New Zealand (Kohli 36 vs Smith 53) & Overall SENA Verdict (Kohli historic overseas wins vs Smith 50+ statistical dominance)

  return (
    <AbsoluteFill>
      <CyberStadiumBackground
        leftColor="#00D2FF"
        rightColor={COLORS.smithPrimary}
      />
      <BroadcastHUD
        sectionTitle="ROUND 02 // SENA COUNTRIES BATTLEFIELD"
        teluguSubtitle="సౌతాఫ్రికా • ఇంగ్లాండ్ • న్యూజిలాండ్ • ఆస్ట్రేలియా"
        globalFrame={3066 + frame}
      />

      {/* SUB-STAGE A: SENA INTRO & WORLD FLIGHT ARCS (0 - 450) */}
      {frame < 450 && (
        <AbsoluteFill
          style={{
            padding: '115px 70px 75px',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: COLORS.kohliPrimary,
                letterSpacing: 3,
              }}
            >
              కానీ అసలు కథ ఇక్కడే మొదలవుతుంది! // THE REAL TEST BEGINS
            </div>
            <div
              style={{
                fontSize: 58,
                fontWeight: 900,
                color: '#FFF',
                marginTop: 8,
              }}
            >
              SENA COUNTRIES: SWING • FIERCE PACE • DEADLY BOUNCE
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: '#CBD5E1',
                marginTop: 8,
              }}
            >
              హోమ్ గ్రౌండ్లో కాదు.. ఫుల్ స్వింగ్, భయంకరమైన పేస్, బౌన్స్ ఉండే SENA పిచ్లపై అసలు పరీక్ష!
            </div>
          </div>

          {/* Animated SVG Tactical SENA Radar Map */}
          <div
            style={{
              height: 460,
              background: 'rgba(10, 16, 36, 0.85)',
              borderRadius: 32,
              border: '2px solid rgba(0, 210, 255, 0.35)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <svg width="1600" height="420" viewBox="0 0 1600 420">
              {/* Glowing Flight Arcs from India (Center-Right) to SENA Hubs */}
              {[
                { x: 260, y: 120, label: 'ENGLAND (SWING)', color: '#00D2FF' },
                {
                  x: 480,
                  y: 330,
                  label: 'SOUTH AFRICA (PACE & BOUNCE)',
                  color: '#00FF87',
                },
                {
                  x: 1180,
                  y: 320,
                  label: 'AUSTRALIA (STEEP BOUNCE)',
                  color: '#FFD700',
                },
                {
                  x: 1420,
                  y: 350,
                  label: 'NEW ZEALAND (GREEN SEAM)',
                  color: '#A855F7',
                },
              ].map((hub, idx) => {
                const dashOffset = interpolate(
                  frame,
                  [30 + idx * 35, 180 + idx * 35],
                  [1000, 0],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                );
                return (
                  <g key={idx}>
                    <path
                      d={`M 820 180 Q ${(820 + hub.x) / 2} 30 ${hub.x} ${hub.y}`}
                      fill="none"
                      stroke={hub.color}
                      strokeWidth="4"
                      strokeDasharray="12 8"
                      strokeDashoffset={dashOffset}
                    />
                    <circle
                      cx={hub.x}
                      cy={hub.y}
                      r={18 + Math.sin(frame * 0.1 + idx) * 4}
                      fill={`${hub.color}33`}
                      stroke={hub.color}
                      strokeWidth="3"
                    />
                    <text
                      x={hub.x}
                      y={hub.y - 28}
                      fill="#FFFFFF"
                      fontSize="22"
                      fontWeight="900"
                      textAnchor="middle"
                    >
                      {hub.label}
                    </text>
                  </g>
                );
              })}

              {/* Origin Hub */}
              <circle cx={820} cy={180} r={22} fill={COLORS.kohliPrimary} />
              <text
                x={820}
                y={225}
                fill="#FFFFFF"
                fontSize="22"
                fontWeight="900"
                textAnchor="middle"
              >
                TEST ARENA HUB
              </text>
            </svg>
          </div>

          {/* 3 Pitch Hazard Badges */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 24,
            }}
          >
            {[
              { title: 'FULL SWING', sub: 'పిచ్ నుండి ఫుల్ స్వింగ్', color: '#00D2FF' },
              { title: 'FIERCE PACE', sub: 'భయంకరమైన పేస్ (150+ KPH)', color: '#FF5500' },
              { title: 'DEADLY BOUNCE', sub: 'అనూహ్యమైన బౌన్స్', color: '#FFD700' },
            ].map((b, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${b.color}`,
                  borderRadius: 20,
                  padding: '16px 24px',
                  textAlign: 'center',
                }}
              >
                <div style={{ color: b.color, fontSize: 26, fontWeight: 900 }}>
                  {b.title}
                </div>
                <div style={{ color: '#FFF', fontSize: 20, fontWeight: 700 }}>
                  {b.sub}
                </div>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      )}

      {/* SUB-STAGE B: AUSTRALIA & SOUTH AFRICA (450 - 1320) */}
      {frame >= 450 && frame < 1320 && (
        <AbsoluteFill style={{ padding: '110px 60px 65px' }}>
          <div style={{ textAlign: 'center', marginBottom: 22 }}>
            <div style={{ fontSize: 46, fontWeight: 900, color: '#FFF' }}>
              AUSTRALIA 🇦🇺 & SOUTH AFRICA 🇿🇦 RECORDS
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.smithPrimary }}>
              ఆస్ట్రేలియా & సౌతాఫ్రికా బౌన్సీ పిచ్లపై ఆధిపత్యం ఎవరిది?
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 32,
              flex: 1,
            }}
          >
            {/* AUSTRALIA BATTLE CARD */}
            <div
              style={{
                background: COLORS.glassBg,
                border: `2px solid ${COLORS.smithPrimary}`,
                borderRadius: 28,
                padding: 30,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 36, fontWeight: 900, color: '#FFF' }}>
                  🇦🇺 IN AUSTRALIA (ఆస్ట్రేలియాలో)
                </span>
                <span
                  style={{
                    padding: '6px 16px',
                    borderRadius: 999,
                    background: 'rgba(255,215,0,0.2)',
                    color: COLORS.smithPrimary,
                    fontWeight: 800,
                  }}
                >
                  PACE & BOUNCE
                </span>
              </div>

              {/* Kohli in Aus */}
              <div
                style={{
                  background: 'rgba(255,85,0,0.15)',
                  borderLeft: `6px solid ${COLORS.kohliPrimary}`,
                  borderRadius: 20,
                  padding: 22,
                }}
              >
                <div style={{ fontSize: 24, fontWeight: 900, color: '#FFB088' }}>
                  VIRAT KOHLI (వేరే లెవెల్ రికార్డ్ 🔥)
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: 36,
                    marginTop: 10,
                    alignItems: 'baseline',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 15, color: COLORS.textMuted }}>AVERAGE</div>
                    <AnimatedCounter
                      target={54}
                      startFrame={480}
                      suffix="+"
                      color="#FFF"
                      fontSize={54}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, color: COLORS.textMuted }}>CENTURIES</div>
                    <AnimatedCounter
                      target={6}
                      startFrame={530}
                      suffix=" 100s"
                      color={COLORS.smithPrimary}
                      fontSize={54}
                    />
                  </div>
                </div>
                {/* 2014 Adelaide Flashback */}
                <div
                  style={{
                    marginTop: 12,
                    padding: '10px 16px',
                    borderRadius: 12,
                    background: 'rgba(255,215,0,0.2)',
                    color: '#FFF',
                    fontSize: 19,
                    fontWeight: 800,
                  }}
                >
                  ⭐ 2014 అడిలైడ్ టెస్ట్లో మర్చిపోలేని 2 సెంచరీలు (Twin 100s)!
                </div>
              </div>

              {/* Smith in Aus */}
              <div
                style={{
                  background: 'rgba(0,255,135,0.12)',
                  borderLeft: `6px solid ${COLORS.smithSecondary}`,
                  borderRadius: 20,
                  padding: 22,
                  opacity: frame >= 880 ? 1 : 0.35,
                }}
              >
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    color: COLORS.smithSecondary,
                  }}
                >
                  STEVE SMITH (హోమ్ గ్రౌండ్ ఫోర్ట్రెస్ 🏰)
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 8,
                  }}
                >
                  <span style={{ color: '#CBD5E1', fontSize: 20, fontWeight: 700 }}>
                    ఆస్ట్రేలియన్ కాబట్టి హోమ్ కండిషన్స్లో డామినేషన్:
                  </span>
                  <AnimatedCounter
                    target={62}
                    startFrame={910}
                    suffix="+ AVG"
                    color={COLORS.smithPrimary}
                    fontSize={52}
                  />
                </div>
              </div>
            </div>

            {/* SOUTH AFRICA BATTLE CARD */}
            <div
              style={{
                background: COLORS.glassBg,
                border: `2px solid ${COLORS.smithSecondary}`,
                borderRadius: 28,
                padding: 30,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: frame >= 730 ? 1 : 0.3,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 36, fontWeight: 900, color: '#FFF' }}>
                  🇿🇦 IN SOUTH AFRICA (సౌతాఫ్రికాలో)
                </span>
                <span
                  style={{
                    padding: '6px 16px',
                    borderRadius: 999,
                    background: 'rgba(0,255,135,0.2)',
                    color: COLORS.smithSecondary,
                    fontWeight: 800,
                  }}
                >
                  PROTEAS PACE ATTACK
                </span>
              </div>

              {/* Kohli in SA */}
              <div
                style={{
                  background: 'rgba(255,85,0,0.15)',
                  borderLeft: `6px solid ${COLORS.kohliPrimary}`,
                  borderRadius: 20,
                  padding: 24,
                }}
              >
                <div style={{ fontSize: 24, fontWeight: 900, color: '#FFB088' }}>
                  VIRAT KOHLI vs SA PACE ATTACK
                </div>
                <div style={{ display: 'flex', gap: 40, marginTop: 12 }}>
                  <div>
                    <div style={{ fontSize: 15, color: COLORS.textMuted }}>AVERAGE</div>
                    <AnimatedCounter
                      target={50}
                      startFrame={760}
                      color="#FFF"
                      fontSize={58}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, color: COLORS.textMuted }}>CENTURIES</div>
                    <AnimatedCounter
                      target={3}
                      startFrame={800}
                      suffix=" 100s"
                      color={COLORS.smithPrimary}
                      fontSize={58}
                    />
                  </div>
                </div>
              </div>

              {/* Smith in SA */}
              <div
                style={{
                  background: 'rgba(0,255,135,0.12)',
                  borderLeft: `6px solid ${COLORS.smithSecondary}`,
                  borderRadius: 20,
                  padding: 24,
                  opacity: frame >= 1020 ? 1 : 0.35,
                }}
              >
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    color: COLORS.smithSecondary,
                  }}
                >
                  STEVE SMITH IN SOUTH AFRICA
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 12,
                  }}
                >
                  <span style={{ color: '#FFF', fontSize: 22, fontWeight: 700 }}>
                    సౌతాఫ్రికాలో కూడా స్ట్రాంగ్ కన్సిస్టెన్సీ:
                  </span>
                  <AnimatedCounter
                    target={41}
                    startFrame={1050}
                    suffix=" AVG"
                    color={COLORS.smithSecondary}
                    fontSize={56}
                  />
                </div>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* SUB-STAGE C: ENGLAND - THE SWING TEST & REDEMPTION (1320 - 2310) */}
      {frame >= 1320 && frame < 2310 && (
        <AbsoluteFill style={{ padding: '110px 60px 65px' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: COLORS.kohliSecondary,
                letterSpacing: 3,
              }}
            >
              ENGLAND // THE ULTIMATE SWING TEST (అండర్సన్ & బ్రాడ్ హోమ్ కండిషన్స్)
            </div>
            <div style={{ fontSize: 48, fontWeight: 900, color: '#FFF', marginTop: 4 }}>
              2018 KING COMEBACK 🔥 VS 2019 ASHES GOD MODE 👑
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 34,
              flex: 1,
            }}
          >
            {/* KOHLI IN ENGLAND */}
            <div
              style={{
                background: COLORS.glassBg,
                border: `2px solid ${COLORS.kohliPrimary}`,
                borderRadius: 28,
                padding: 30,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 900,
                    color: '#FFF',
                  }}
                >
                  VIRAT KOHLI IN ENGLAND 🏴
                </div>
                <div style={{ fontSize: 21, color: '#FFB088', fontWeight: 700 }}>
                  2014 లో ఇబ్బంది పడి.. 2018 లో కింగ్లా కంబ్యాక్!
                </div>
              </div>

              {/* 2018 Redemption Highlight Box */}
              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,85,0,0.28), rgba(0,0,0,0.5))',
                  border: `2px solid ${COLORS.kohliPrimary}`,
                  borderRadius: 22,
                  padding: 24,
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: 19,
                    fontWeight: 800,
                    color: COLORS.smithPrimary,
                    letterSpacing: 2,
                  }}
                >
                  2018 ENGLAND SERIES TOP SCORER
                </div>
                <div style={{ marginTop: 8 }}>
                  <AnimatedCounter
                    target={593}
                    startFrame={1560}
                    suffix=" RUNS"
                    color="#FFFFFF"
                    fontSize={72}
                  />
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#FFF', marginTop: 6 }}>
                  అండర్సన్ & బ్రాడ్లను ఎదుర్కొని సిరీస్ టాప్ స్కోరర్!
                </div>
              </div>

              {/* Overall England Stats */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 16,
                }}
              >
                <div
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 18,
                    padding: 18,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ color: COLORS.textMuted, fontSize: 16 }}>
                    ENGLAND AVERAGE
                  </div>
                  <AnimatedCounter
                    target={33}
                    startFrame={1720}
                    suffix="+"
                    color={COLORS.kohliPrimary}
                    fontSize={50}
                  />
                </div>
                <div
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 18,
                    padding: 18,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ color: COLORS.textMuted, fontSize: 16 }}>
                    ENGLAND CENTURIES
                  </div>
                  <AnimatedCounter
                    target={2}
                    startFrame={1760}
                    suffix=" 100s"
                    color={COLORS.smithPrimary}
                    fontSize={50}
                  />
                </div>
              </div>
            </div>

            {/* SMITH IN ENGLAND */}
            <div
              style={{
                background: COLORS.glassBg,
                border: `2px solid ${COLORS.smithPrimary}`,
                borderRadius: 28,
                padding: 30,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: frame >= 1840 ? 1 : 0.25,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 900,
                    color: '#FFF',
                  }}
                >
                  STEVE SMITH IN ENGLAND (UNREAL!) 🤯
                </div>
                <div
                  style={{
                    fontSize: 21,
                    color: COLORS.smithPrimary,
                    fontWeight: 700,
                  }}
                >
                  2019 యాషెస్లో బ్యాన్ తర్వాత తిరిగొచ్చి చరిత్ర సృష్టించాడు!
                </div>
              </div>

              {/* 2019 Ashes Highlight Box */}
              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,215,0,0.3), rgba(0,255,135,0.2))',
                  border: `2px solid ${COLORS.smithPrimary}`,
                  borderRadius: 22,
                  padding: 24,
                  textAlign: 'center',
                  boxShadow: '0 0 40px rgba(255,215,0,0.3)',
                }}
              >
                <div
                  style={{
                    fontSize: 19,
                    fontWeight: 900,
                    color: '#FFF',
                    letterSpacing: 2,
                  }}
                >
                  2019 ASHES COMEBACK // 110 AVERAGE!
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    marginTop: 8,
                  }}
                >
                  <div>
                    <AnimatedCounter
                      target={774}
                      startFrame={1980}
                      suffix=" RUNS"
                      color={COLORS.smithPrimary}
                      fontSize={64}
                    />
                  </div>
                  <div>
                    <AnimatedCounter
                      target={110}
                      startFrame={1950}
                      suffix=" AVG"
                      color={COLORS.smithSecondary}
                      fontSize={64}
                    />
                  </div>
                </div>
              </div>

              {/* Overall England Stats */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 16,
                }}
              >
                <div
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 18,
                    padding: 18,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ color: COLORS.textMuted, fontSize: 16 }}>
                    ENGLAND AVERAGE
                  </div>
                  <AnimatedCounter
                    target={58}
                    startFrame={2120}
                    suffix="+"
                    color={COLORS.smithPrimary}
                    fontSize={50}
                  />
                </div>
                <div
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 18,
                    padding: 18,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ color: COLORS.textMuted, fontSize: 16 }}>
                    ENGLAND CENTURIES
                  </div>
                  <AnimatedCounter
                    target={7}
                    startFrame={2160}
                    suffix=" 100s"
                    color={COLORS.smithSecondary}
                    fontSize={50}
                  />
                </div>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* SUB-STAGE D: NEW ZEALAND & COMPLETE SENA MATRIX (2310 - 3013) */}
      {frame >= 2310 && (
        <AbsoluteFill
          style={{
            padding: '110px 60px 65px',
            justifyContent: 'space-between',
          }}
        >
          {/* New Zealand Green Pitch Comparison */}
          <div
            style={{
              background: COLORS.glassBg,
              border: '2px solid #A855F7',
              borderRadius: 28,
              padding: '24px 36px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#C084FC' }}>
                NEW ZEALAND GREEN PITCHES // న్యూజిలాండ్ గ్రీన్ పిచ్లపై
              </div>
              <div style={{ fontSize: 38, fontWeight: 900, color: '#FFF', marginTop: 4 }}>
                🇳🇿 NEW ZEALAND TEST AVERAGE COMPARISON
              </div>
            </div>
            <div style={{ display: 'flex', gap: 48 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, color: '#FFB088', fontWeight: 800 }}>
                  VIRAT KOHLI
                </div>
                <AnimatedCounter
                  target={36}
                  startFrame={2340}
                  suffix=" AVG"
                  color={COLORS.kohliPrimary}
                  fontSize={56}
                />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: 18,
                    color: COLORS.smithSecondary,
                    fontWeight: 800,
                  }}
                >
                  STEVE SMITH
                </div>
                <AnimatedCounter
                  target={53}
                  startFrame={2410}
                  suffix=" AVG"
                  color={COLORS.smithSecondary}
                  fontSize={56}
                />
              </div>
            </div>
          </div>

          {/* Complete 4-Country SENA Summary Table */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 20,
            }}
          >
            {[
              {
                country: 'AUSTRALIA 🇦🇺',
                kohli: '54+ Avg (6 100s)',
                smith: '62+ Avg',
              },
              {
                country: 'SOUTH AFRICA 🇿🇦',
                kohli: '50 Avg (3 100s)',
                smith: '41 Avg',
              },
              {
                country: 'ENGLAND 🏴',
                kohli: '33+ Avg (593 peak)',
                smith: '58+ Avg (7 100s)',
              },
              {
                country: 'NEW ZEALAND 🇳🇿',
                kohli: '36 Avg',
                smith: '53 Avg',
              },
            ].map((row, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255,255,255,0.16)',
                  borderRadius: 22,
                  padding: 22,
                }}
              >
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 900,
                    color: COLORS.smithPrimary,
                    marginBottom: 12,
                  }}
                >
                  {row.country}
                </div>
                <div
                  style={{
                    fontSize: 19,
                    fontWeight: 800,
                    color: '#FFB088',
                    marginBottom: 8,
                  }}
                >
                  Kohli: {row.kohli}
                </div>
                <div
                  style={{
                    fontSize: 19,
                    fontWeight: 800,
                    color: COLORS.smithSecondary,
                  }}
                >
                  Smith: {row.smith}
                </div>
              </div>
            ))}
          </div>

          {/* Dual SENA Takeaway Banner */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 28,
            }}
          >
            <div
              style={{
                background: 'rgba(255,85,0,0.18)',
                border: `2px solid ${COLORS.kohliPrimary}`,
                borderRadius: 24,
                padding: '20px 28px',
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: COLORS.kohliPrimary,
                }}
              >
                HISTORIC OVERSEAS VICTORIES 🇮🇳
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: '#FFF',
                  marginTop: 6,
                }}
              >
                విదేశీ గడ్డపై ఇండియాకు చారిత్రక విజయాలు అందించడంలో కోహ్లీ పాత్ర అనూహ్యం!
              </div>
            </div>

            <div
              style={{
                background: 'rgba(0,255,135,0.16)',
                border: `2px solid ${COLORS.smithSecondary}`,
                borderRadius: 24,
                padding: '20px 28px',
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: COLORS.smithSecondary,
                }}
              >
                50+ SENA STATISTICAL DOMINATION 🇦🇺
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: '#FFF',
                  marginTop: 6,
                }}
              >
                స్టాటిస్టికల్గా చూస్తే SENA లో కన్సిస్టెంట్గా 50+ యావరేజ్తో స్మిత్ డామినేషన్!
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 4: PLAYING IMPACT & BOWLER FRUSTRATION (1085 frames / 36.17s)
// ============================================================================
export const Scene4ImpactStyle: React.FC<{ hasAudio?: boolean }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Voiceover timing inside Scene 4 (0 - 1085):
  // 0 - 540: Kohli impact: Bowlers fear him, Aggression, Counter-attack, Batting with lower order, Historic SENA Test wins as Captain!
  // 540 - 1085: Smith approach: Moving around crease, leaving balls, frustrating bowlers, impossible to get out once set even on worst pitches, born for Test cricket patience!

  const kohliAura = spring({ frame, fps, config: { damping: 13 } });
  const smithFortress = spring({
    frame: frame - 520,
    fps,
    config: { damping: 13 },
  });

  return (
    <AbsoluteFill>
      <CyberStadiumBackground
        leftColor={COLORS.kohliPrimary}
        rightColor={COLORS.smithSecondary}
      />
      <BroadcastHUD
        sectionTitle="ROUND 03 // PLAYING IMPACT & MINDSET"
        teluguSubtitle="ప్లేయింగ్ ఇంపాక్ట్: అగ్రెషన్ vs ఓపిక"
        globalFrame={6079 + frame}
      />

      <AbsoluteFill
        style={{
          padding: '110px 60px 65px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 36,
        }}
      >
        {/* LEFT: VIRAT KOHLI FEAR FACTOR & CAPTAINCY */}
        <div
          style={{
            opacity: kohliAura,
            transform: `scale(${interpolate(kohliAura, [0, 1], [0.92, 1])})`,
            background:
              'linear-gradient(160deg, rgba(255,85,0,0.24) 0%, rgba(10,15,35,0.92) 100%)',
            border: `2px solid ${COLORS.kohliPrimary}`,
            borderRadius: 32,
            padding: 36,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 0 60px rgba(255,85,0,0.25)',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-block',
                padding: '6px 18px',
                borderRadius: 999,
                background: COLORS.kohliPrimary,
                color: '#FFF',
                fontWeight: 900,
                fontSize: 17,
                letterSpacing: 2,
              }}
            >
              THE FEAR FACTOR // బౌలర్లలో భయం
            </div>
            <div
              style={{
                fontSize: 50,
                fontWeight: 900,
                color: '#FFF',
                marginTop: 12,
              }}
            >
              KOHLI’S IMPACT & CAPTAINCY
            </div>
            <div style={{ fontSize: 25, fontWeight: 700, color: '#FFB088' }}>
              కోహ్లీ క్రీజ్లో ఉంటే అపోజిషన్ బౌలర్లకి ఒక భయం ఉంటుంది!
            </div>
          </div>

          {/* 3 Impact Pillars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              {
                title: '1. AGGRESSION & COUNTER-ATTACK ⚡',
                desc: 'ప్రెషర్లో ఉన్నప్పుడు బౌలర్లపై ఎదురుదాడి చేసే దూకుడు',
                delay: 90,
              },
              {
                title: '2. BATTING WITH LOWER ORDER 🤝',
                desc: 'లోయర్ ఆర్డర్తో కలిసి కీలక పరుగులు రాబట్టే కోహ్లీ స్టైల్',
                delay: 210,
              },
              {
                title: '3. HISTORIC SENA CAPTAINCY WINS 🏆',
                desc: 'కోహ్లీ కెప్టెన్సీలోనే SENA దేశాల్లో కళ్ళు చెదిరే టెస్ట్ విజయాలు!',
                delay: 340,
              },
            ].map((trait, i) => {
              const pop = spring({
                frame: frame - trait.delay,
                fps,
                config: { damping: 14 },
              });
              return (
                <div
                  key={i}
                  style={{
                    opacity: pop,
                    transform: `translateX(${interpolate(
                      pop,
                      [0, 1],
                      [-40, 0]
                    )}px)`,
                    background: 'rgba(0,0,0,0.45)',
                    borderLeft: `5px solid ${COLORS.kohliPrimary}`,
                    borderRadius: 18,
                    padding: '18px 22px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 900,
                      color: COLORS.smithPrimary,
                    }}
                  >
                    {trait.title}
                  </div>
                  <div
                    style={{
                      fontSize: 21,
                      fontWeight: 700,
                      color: '#FFF',
                      marginTop: 4,
                    }}
                  >
                    {trait.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: STEVE SMITH BOWLER FRUSTRATION & PATIENCE */}
        <div
          style={{
            opacity: frame >= 520 ? smithFortress : 0.2,
            transform: `scale(${interpolate(
              smithFortress,
              [0, 1],
              [0.92, 1]
            )})`,
            background:
              'linear-gradient(160deg, rgba(0,255,135,0.2) 0%, rgba(10,15,35,0.92) 100%)',
            border: `2px solid ${COLORS.smithSecondary}`,
            borderRadius: 32,
            padding: 36,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 0 60px rgba(0,255,135,0.22)',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-block',
                padding: '6px 18px',
                borderRadius: 999,
                background: COLORS.smithSecondary,
                color: '#050814',
                fontWeight: 900,
                fontSize: 17,
                letterSpacing: 2,
              }}
            >
              BORN FOR TEST CRICKET // అంతులేని ఓపిక
            </div>
            <div
              style={{
                fontSize: 50,
                fontWeight: 900,
                color: '#FFF',
                marginTop: 12,
              }}
            >
              SMITH’S WALL OF PATIENCE
            </div>
            <div
              style={{
                fontSize: 25,
                fontWeight: 700,
                color: COLORS.smithPrimary,
              }}
            >
              టెస్ట్ ఫార్మాట్ కోసమే పుట్టాడా అనేంత ఓపిక స్మిత్ సొంతం!
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              {
                title: '1. CREASE MOVEMENT & LEAVES 🛡️',
                desc: 'క్రీజ్ చుట్టూ తిరుగుతూ, బంతిని వదిలేస్తూ బౌలర్లను ఫ్రస్ట్రేట్ చేస్తాడు',
                delay: 580,
              },
              {
                title: '2. IMPOSSIBLE TO DISMISS ONCE SET 🔒',
                desc: 'పిచ్ ఎంత వర్స్ట్గా ఉన్నా సెట్ అయితే అవుట్ చేయడం దాదాపు అసాధ్యం!',
                delay: 720,
              },
              {
                title: '3. BOWLER FRUSTRATION LEVEL: 100% 🤯',
                desc: 'బౌలర్ల సహనాన్ని చివరి బంతి వరకు పరీక్షించే మాస్టర్ మైండ్',
                delay: 860,
              },
            ].map((trait, i) => {
              const pop = spring({
                frame: frame - trait.delay,
                fps,
                config: { damping: 14 },
              });
              return (
                <div
                  key={i}
                  style={{
                    opacity: pop,
                    transform: `translateX(${interpolate(
                      pop,
                      [0, 1],
                      [40, 0]
                    )}px)`,
                    background: 'rgba(0,0,0,0.45)',
                    borderLeft: `5px solid ${COLORS.smithSecondary}`,
                    borderRadius: 18,
                    padding: '18px 22px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 900,
                      color: COLORS.smithSecondary,
                    }}
                  >
                    {trait.title}
                  </div>
                  <div
                    style={{
                      fontSize: 21,
                      fontWeight: 700,
                      color: '#FFF',
                      marginTop: 4,
                    }}
                  >
                    {trait.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 5: FINAL VERDICT & CTA OUTRO (1283 frames / 42.78s, Global 7164 - 8447)
// ============================================================================
export const Scene5VerdictOutro: React.FC<{ hasAudio?: boolean }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Voiceover timing inside Scene 5 (0 - 1283):
  // 0 - 550: Final Verdict: Smith numbers & SENA consistency slightly ahead, BUT Kohli's match-winning impact under pressure for India is undeniable!
  // 550 - 920: Who is the best Test batsman in your view? King Kohli or Steve Smith? Comment below!
  // 920 - 1283: Like the video, Subscribe to RK Cricket Telugu, see you in next interesting Matrix video, Signing Off!

  const pollSwing = Math.sin(frame * 0.08) * 6; // Oscillates between 44% and 56%
  const kohliVote = Math.round(50 + pollSwing);
  const smithVote = 100 - kohliVote;

  const ctaEnter = spring({
    frame: frame - 900,
    fps,
    config: { damping: 12 },
  });

  return (
    <AbsoluteFill>
      <CyberStadiumBackground
        leftColor={COLORS.kohliPrimary}
        rightColor={COLORS.smithPrimary}
      />
      <BroadcastHUD
        sectionTitle="FINAL VERDICT // THE CONCLUSION"
        teluguSubtitle="తుది తీర్పు & మీ ఒపీనియన్"
        globalFrame={7164 + frame}
      />

      {/* PART 1: FINAL VERDICT & LIVE FAN POLL (0 - 920) */}
      {frame < 940 && (
        <AbsoluteFill
          style={{
            padding: '110px 64px 70px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: COLORS.smithPrimary,
                letterSpacing: 3,
              }}
            >
              THE FINAL MATRIX VERDICT // తుది విశ్లేషణ
            </div>
            <div style={{ fontSize: 52, fontWeight: 900, color: '#FFF', marginTop: 6 }}>
              PURE NUMBERS 📊 VS MATCH-WINNING IMPACT 🔥
            </div>
          </div>

          {/* Dual Crown Conclusion Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 32,
            }}
          >
            <div
              style={{
                background: 'rgba(0, 255, 135, 0.14)',
                border: `2px solid ${COLORS.smithSecondary}`,
                borderRadius: 28,
                padding: 32,
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: COLORS.smithSecondary,
                }}
              >
                👑 STATISTICAL & SENA CONSISTENCY KING
              </div>
              <div
                style={{
                  fontSize: 44,
                  fontWeight: 900,
                  color: '#FFF',
                  marginTop: 8,
                }}
              >
                STEVE SMITH
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: '#E2E8F0',
                  marginTop: 12,
                  lineHeight: 1.45,
                }}
              >
                టెస్ట్ క్రికెట్ నంబర్స్, ~57 యావరేజ్ మరియు SENA దేశాల్లో అద్భుతమైన కన్సిస్టెన్సీ వల్ల గణాంకాల్లో స్టీవ్ స్మిత్ ముందుంటాడు!
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 85, 0, 0.16)',
                border: `2px solid ${COLORS.kohliPrimary}`,
                borderRadius: 28,
                padding: 32,
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: COLORS.kohliPrimary,
                }}
              >
                👑 PRESSURE MATCH-WINNER & IMPACT KING
              </div>
              <div
                style={{
                  fontSize: 44,
                  fontWeight: 900,
                  color: '#FFF',
                  marginTop: 8,
                }}
              >
                VIRAT KOHLI
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: '#E2E8F0',
                  marginTop: 12,
                  lineHeight: 1.45,
                }}
              >
                అండర్ ప్రెషర్లో అగ్రెసివ్ బ్రాండ్ ఆఫ్ క్రికెట్ ఆడుతూ ఇండియాకు మరపురాని విదేశీ విజయాలు అందించిన కోహ్లీ ఇంపాక్ట్ని ఎవరూ కాదనలేరు!
              </div>
            </div>
          </div>

          {/* Interactive Fan Poll Meter (Frames 520 - 940) */}
          <div
            style={{
              background: 'rgba(10, 16, 36, 0.92)',
              border: `2px solid ${COLORS.smithPrimary}`,
              borderRadius: 28,
              padding: '26px 40px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 34, fontWeight: 900, color: '#FFF' }}>
              మీ దృష్టిలో టెస్ట్ ఫార్మాట్లో బెస్ట్ బ్యాట్స్మెన్ ఎవరు? కింద కామెంట్ చేయండి! 💬
            </div>
            <div
              style={{
                marginTop: 18,
                height: 44,
                borderRadius: 999,
                overflow: 'hidden',
                display: 'flex',
                border: '2px solid rgba(255,255,255,0.2)',
              }}
            >
              <div
                style={{
                  width: `${kohliVote}%`,
                  background: `linear-gradient(90deg, ${COLORS.kohliPrimary}, #FF8800)`,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 24,
                  fontWeight: 900,
                  fontSize: 22,
                  color: '#FFF',
                }}
              >
                KING KOHLI ({kohliVote}%)
              </div>
              <div
                style={{
                  width: `${smithVote}%`,
                  background: `linear-gradient(90deg, ${COLORS.smithSecondary}, ${COLORS.smithPrimary})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: 24,
                  fontWeight: 900,
                  fontSize: 22,
                  color: '#050814',
                }}
              >
                STEVE SMITH ({smithVote}%)
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* PART 2: LIKE, SUBSCRIBE & MATRIX SIGN-OFF (Frames 900 - 1283) */}
      {frame >= 900 && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 70,
            opacity: ctaEnter,
            transform: `scale(${interpolate(ctaEnter, [0, 1], [0.88, 1])})`,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 1420,
              background: 'rgba(8, 13, 32, 0.92)',
              border: `3px solid ${COLORS.smithPrimary}`,
              borderRadius: 40,
              padding: '56px 70px',
              textAlign: 'center',
              boxShadow: '0 0 90px rgba(255, 215, 0, 0.3)',
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: COLORS.kohliSecondary,
                letterSpacing: 5,
              }}
            >
              THANK YOU FOR WATCHING // మళ్ళీ కలుద్దాం
            </div>
            <div
              style={{
                fontSize: 78,
                fontWeight: 900,
                color: '#FFFFFF',
                marginTop: 12,
              }}
            >
              RK CRICKET TELUGU
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: '#CBD5E1',
                marginTop: 12,
              }}
            >
              ఈ వీడియో నచ్చితే ఒక LIKE వేసి, మన ఛానల్కి SUBSCRIBE చేసుకోవడం మర్చిపోకండి!
            </div>

            {/* Animated CTA Buttons */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 36,
                marginTop: 42,
              }}
            >
              <div
                style={{
                  padding: '22px 48px',
                  borderRadius: 999,
                  background: `linear-gradient(90deg, ${COLORS.kohliSecondary}, #0077FF)`,
                  color: '#FFF',
                  fontSize: 32,
                  fontWeight: 900,
                  boxShadow: '0 12px 35px rgba(0, 210, 255, 0.45)',
                  transform: `scale(${1 + Math.sin(frame * 0.15) * 0.05})`,
                }}
              >
                👍 LIKE VIDEO
              </div>

              <div
                style={{
                  padding: '22px 54px',
                  borderRadius: 999,
                  background: 'linear-gradient(90deg, #FF0044, #FF5500)',
                  color: '#FFF',
                  fontSize: 32,
                  fontWeight: 900,
                  boxShadow: '0 12px 35px rgba(255, 0, 68, 0.5)',
                  transform: `scale(${1 + Math.cos(frame * 0.15) * 0.06})`,
                }}
              >
                🔔 SUBSCRIBE NOW
              </div>

              <div
                style={{
                  padding: '22px 48px',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.1)',
                  border: `2px solid ${COLORS.smithPrimary}`,
                  color: COLORS.smithPrimary,
                  fontSize: 32,
                  fontWeight: 900,
                }}
              >
                💬 COMMENT BELOW
              </div>
            </div>

            <div
              style={{
                marginTop: 42,
                fontSize: 26,
                fontWeight: 800,
                color: COLORS.smithSecondary,
                letterSpacing: 2,
              }}
            >
              ఇంకో ఇంట్రెస్టింగ్ మ్యాట్రిక్స్ వీడియోతో మళ్ళీ కలుద్దాం... SIGNING OFF! 🚀
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ============================================================================
// MASTER SINGLE SCENE TIMELINE COMPONENT
// ============================================================================
export const ViratVsSmithSingleScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgDark, fontFamily: `${teluguFont}, Inter, system-ui, sans-serif` }}>
      {/* 1. Continuous Master Voice-Over Audio (0 to 8447 frames) */}
      <Audio
        src={staticFile('audio/kohli_vs_smith/master_complete_audio.wav')}
        volume={1}
      />

      {/* 2. Ambient Studio Beat Music (ducked under voiceover) */}
      <Audio
        src={staticFile('Youtube Free Musics/Beat Your Competition - Vibe Tracks.mp3')}
        volume={0.12}
        loop
      />

      {/* 3. Frame-Accurate Sequential Stages */}
      <Series>
        <Series.Sequence durationInFrames={timings.scene1_intro.durationFrames}>
          <Scene1Intro hasAudio={false} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={timings.scene2_overall_stats.durationFrames}>
          <Scene2OverallStats hasAudio={false} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={timings.scene3_sena_records.durationFrames}>
          <Scene3SenaMap hasAudio={false} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={timings.scene4_playing_style.durationFrames}>
          <Scene4ImpactStyle hasAudio={false} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={timings.scene5_verdict_outro.durationFrames}>
          <Scene5VerdictOutro hasAudio={false} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
