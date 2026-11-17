import React, { useState } from 'react';
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
import timings from './timings.json';
import { THEME } from './theme';

// ============================================================================
// PLAYER IMAGE PATHS (Using High-Res Portraits from public/cricket/)
// ============================================================================
export const PLAYER_IMAGES_CYBER = {
  kohli: staticFile('cricket/kohli_portrait.png'),
  smith: staticFile('cricket/smith_portrait.png'),
};

export const TOTAL_CYBER_DARK_FRAMES =
  timings.scene1_intro.durationFrames +
  timings.scene2_overall_stats.durationFrames +
  timings.scene3_sena_records.durationFrames +
  timings.scene4_playing_style.durationFrames +
  timings.scene5_verdict_outro.durationFrames; // 8448 frames

const COLORS = {
  bgDark: '#040711',
  bgDeep: '#080D21',
  kohliPrimary: '#FF5500',
  kohliSecondary: '#00D2FF',
  kohliGold: '#FF9E00',
  smithPrimary: '#FFD700',
  smithSecondary: '#00FF87',
  smithEmerald: '#10B981',
  textWhite: '#F8FAFC',
  textMuted: '#94A3B8',
  glassBg: 'rgba(10, 16, 36, 0.82)',
};

// ============================================================================
// 1. 3D HOLOGRAPHIC PLAYER CUTOUT SHOWCASE COMPONENT
// ============================================================================
const PlayerHeroShowcase: React.FC<{
  player: 'kohli' | 'smith';
  height?: number;
  width?: number;
  badgeText?: string;
  subBadge?: string;
  auraMode?: 'normal' | 'fire' | 'fortress' | 'crown';
  enterProgress?: number;
}> = ({
  player,
  height = 520,
  width = 420,
  badgeText,
  subBadge,
  auraMode = 'normal',
  enterProgress = 1,
}) => {
  const frame = useCurrentFrame();
  const [imgError, setImgError] = useState(false);

  const isKohli = player === 'kohli';
  const primary = isKohli ? COLORS.kohliPrimary : COLORS.smithPrimary;
  const secondary = isKohli ? COLORS.kohliSecondary : COLORS.smithSecondary;
  const jerseyNum = isKohli ? '18' : '49';
  const playerName = isKohli ? 'VIRAT KOHLI' : 'STEVE SMITH';
  const imgSrc = isKohli ? PLAYER_IMAGES_CYBER.kohli : PLAYER_IMAGES_CYBER.smith;

  // Subtle 3D breathing & floating animation
  const floatY = Math.sin(frame * 0.06 + (isKohli ? 0 : 2)) * 8;
  const tiltY = isKohli
    ? 6 + Math.sin(frame * 0.04) * 2
    : -6 + Math.cos(frame * 0.04) * 2;
  const shimmerPos = ((frame * 3.5) % 260) - 80;
  const ringRotate = (frame * 1.4) % 360;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        transform: `scale(${enterProgress}) perspective(1100px) rotateY(${tiltY}deg)`,
        transformStyle: 'preserve-3d',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderRadius: 34,
        background: `linear-gradient(165deg, ${primary}28 0%, rgba(8,14,34,0.94) 55%, ${secondary}22 100%)`,
        border: `2.5px solid ${primary}`,
        boxShadow: `0 25px 70px ${primary}33, inset 0 0 45px ${primary}22`,
        overflow: 'hidden',
        fontFamily: THEME.fontFamily,
      }}
    >
      {/* Rotating Holographic Target Ring Behind Player */}
      <div
        style={{
          position: 'absolute',
          top: '14%',
          width: width * 0.78,
          height: width * 0.78,
          borderRadius: '50%',
          border: `2px dashed ${secondary}66`,
          boxShadow: `0 0 50px ${primary}44, inset 0 0 40px ${secondary}33`,
          transform: `rotate(${ringRotate}deg)`,
          pointerEvents: 'none',
        }}
      />

      {/* Giant Metallic Jersey Number Watermark (#18 / #49) */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: isKohli ? undefined : 22,
          left: isKohli ? 22 : undefined,
          fontSize: height * 0.42,
          fontWeight: 900,
          lineHeight: 0.85,
          color: 'transparent',
          WebkitTextStroke: `3px ${primary}55`,
          background: `linear-gradient(180deg, ${primary}44 0%, transparent 90%)`,
          WebkitBackgroundClip: 'text',
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        {jerseyNum}
      </div>

      {/* Special Aura Effects */}
      {auraMode === 'fire' &&
        Array.from({ length: 10 }).map((_, idx) => {
          const pY = height - ((frame * (3 + (idx % 3)) + idx * 55) % height);
          const pX = 40 + ((idx * 43) % (width - 80));
          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: pX,
                top: pY,
                width: 10,
                height: 22,
                borderRadius: '50%',
                background: `linear-gradient(180deg, #FFF, ${COLORS.kohliPrimary}, transparent)`,
                filter: 'blur(2px)',
                opacity: 0.75,
                zIndex: 2,
              }}
            />
          );
        })}

      {auraMode === 'fortress' && (
        <div
          style={{
            position: 'absolute',
            inset: 16,
            borderRadius: 26,
            border: `2px solid ${COLORS.smithSecondary}88`,
            boxShadow: `inset 0 0 35px ${COLORS.smithSecondary}44`,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
      )}

      {auraMode === 'crown' && (
        <div
          style={{
            position: 'absolute',
            top: 14,
            fontSize: 52,
            filter: 'drop-shadow(0 0 20px #FFD700)',
            transform: `translateY(${Math.sin(frame * 0.1) * 5}px)`,
            zIndex: 15,
          }}
        >
          👑
        </div>
      )}

      {/* Top Corner Country & Role Pill */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: isKohli ? 20 : undefined,
          left: isKohli ? undefined : 20,
          padding: '6px 16px',
          borderRadius: 999,
          background: 'rgba(4, 7, 17, 0.85)',
          border: `1.5px solid ${secondary}`,
          color: '#FFFFFF',
          fontWeight: 900,
          fontSize: 15,
          letterSpacing: 1.5,
          zIndex: 12,
          boxShadow: `0 0 18px ${secondary}55`,
        }}
      >
        {isKohli ? '🇮🇳 INDIA // #18' : '🇦🇺 AUSTRALIA // #49'}
      </div>

      {/* PLAYER IMAGE (Using 1080p Portrait Crop) */}
      <div
        style={{
          position: 'relative',
          width: '94%',
          height: '84%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          transform: `translateY(${floatY}px)`,
          zIndex: 5,
          overflow: 'hidden',
          borderRadius: 24,
        }}
      >
        {!imgError ? (
          <img
            src={imgSrc}
            alt={playerName}
            onError={() => setImgError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
              filter: `drop-shadow(0 -4px 22px ${primary}AA) drop-shadow(0 18px 28px rgba(0,0,0,0.9))`,
            }}
          />
        ) : (
          <svg
            viewBox="0 0 300 380"
            style={{
              width: '88%',
              height: '92%',
              filter: `drop-shadow(0 0 24px ${primary})`,
            }}
          >
            <circle cx="150" cy="78" r="42" fill={primary} stroke="#FFF" strokeWidth="3" />
            <path
              d="M 65 200 C 65 135, 105 122, 150 122 C 195 122, 235 135, 235 200 L 250 375 L 50 375 Z"
              fill={secondary}
              stroke="#FFFFFF"
              strokeWidth="3"
            />
            <text x="150" y="245" textAnchor="middle" fill="#FFFFFF" fontSize="74" fontWeight="900">
              {jerseyNum}
            </text>
          </svg>
        )}
      </div>

      {/* Metallic Light-Sweep Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(115deg, transparent ${shimmerPos}%, rgba(255,255,255,0.22) ${
            shimmerPos + 15
          }%, transparent ${shimmerPos + 30}%)`,
          pointerEvents: 'none',
          zIndex: 8,
        }}
      />

      {/* Bottom Lower-Third Nameplate & Dynamic Badge */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background:
            'linear-gradient(180deg, transparent 0%, rgba(4,7,17,0.95) 35%, rgba(4,7,17,0.99) 100%)',
          padding: '24px 20px 16px',
          textAlign: 'center',
          zIndex: 10,
          borderTop: `1px solid ${primary}66`,
        }}
      >
        {badgeText && (
          <div
            style={{
              display: 'inline-block',
              padding: '4px 14px',
              borderRadius: 999,
              background: primary,
              color: isKohli ? '#FFF' : '#040711',
              fontWeight: 900,
              fontSize: 14,
              letterSpacing: 1.5,
              marginBottom: 4,
            }}
          >
            {badgeText}
          </div>
        )}
        <div
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: 1,
            textShadow: `0 0 20px ${primary}`,
          }}
        >
          {playerName}
        </div>
        {subBadge && (
          <div
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: secondary,
              marginTop: 2,
            }}
          >
            {subBadge}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 2. SHARED STADIUM ATMOSPHERE, HUD & COUNTERS
// ============================================================================
const CyberStadiumBackground: React.FC<{
  leftColor?: string;
  rightColor?: string;
}> = ({
  leftColor = COLORS.kohliPrimary,
  rightColor = COLORS.smithSecondary,
}) => {
  const frame = useCurrentFrame();
  const gridOffset = (frame * 1.3) % 80;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgDark, overflow: 'hidden' }}>
      {/* Dual Stadium Floodlight Cones */}
      <div
        style={{
          position: 'absolute',
          top: -280,
          left: -180,
          width: 1150,
          height: 1150,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${leftColor}42 0%, transparent 68%)`,
          filter: 'blur(85px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -280,
          right: -180,
          width: 1150,
          height: 1150,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${rightColor}42 0%, transparent 68%)`,
          filter: 'blur(85px)',
        }}
      />

      {/* 3D Perspective Stadium Turf Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          backgroundPosition: `0px ${gridOffset}px`,
          transform: 'perspective(850px) rotateX(58deg) scale(1.65)',
          transformOrigin: 'center bottom',
          opacity: 0.65,
        }}
      />

      {/* Floating Broadcast Bokeh Sparks */}
      {Array.from({ length: 20 }).map((_, i) => {
        const speed = 1.1 + (i % 4) * 0.55;
        const yPos = 1080 - ((frame * speed + i * 90) % 1180);
        const xPos = ((i * 131) % 1860) + Math.sin(frame * 0.03 + i) * 30;
        const size = 4 + (i % 4) * 2;
        const color = xPos < 960 ? leftColor : rightColor;
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
    [0, TOTAL_CYBER_DARK_FRAMES],
    [0, 100],
    { extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 60,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 24,
          left: 44,
          right: 44,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Left Channel Brand Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            background: 'rgba(6, 10, 24, 0.88)',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '9px 22px',
            borderRadius: 999,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          }}
        >
          <div
            style={{
              width: 11,
              height: 11,
              borderRadius: '50%',
              backgroundColor: '#FF2A54',
              boxShadow: '0 0 12px #FF2A54',
            }}
          />
          <span
            style={{
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: 17,
              letterSpacing: 2,
            }}
          >
            RK CRICKET TELUGU
          </span>
          <span
            style={{
              color: COLORS.smithPrimary,
              fontWeight: 800,
              fontSize: 14,
              borderLeft: '1px solid rgba(255,255,255,0.2)',
              paddingLeft: 12,
            }}
          >
            CYBER MATRIX EDITION
          </span>
        </div>

        {/* Right Current Round Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            background: 'rgba(6, 10, 24, 0.88)',
            border: '1px solid rgba(0, 210, 255, 0.4)',
            padding: '9px 24px',
            borderRadius: 999,
          }}
        >
          <span
            style={{
              color: COLORS.kohliSecondary,
              fontWeight: 900,
              fontSize: 15,
              letterSpacing: 1.5,
            }}
          >
            {sectionTitle}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
          <span style={{ color: '#FFF', fontWeight: 700, fontSize: 16 }}>
            {teluguSubtitle}
          </span>
        </div>
      </div>

      {/* Bottom Master Timeline Progress */}
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
            boxShadow: '0 0 18px rgba(0, 210, 255, 0.9)',
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
  color?: string;
  fontSize?: number;
}> = ({
  target,
  startFrame,
  duration = 45,
  suffix = '',
  prefix = '',
  color = '#FFFFFF',
  fontSize = 60,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const eased = 1 - Math.pow(1 - progress, 3);
  const currentVal = Math.round(target * eased);

  return (
    <span
      style={{
        fontSize,
        fontWeight: 900,
        color,
        fontVariantNumeric: 'tabular-nums',
        textShadow: `0 0 26px ${color}66`,
      }}
    >
      {prefix}
      {currentVal.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
};

// ============================================================================
// SCENE 1: CYBER INTRO (0 - 1380 frames)
// ============================================================================
const CyberScene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const kohliPop = spring({
    frame: frame - 140,
    fps,
    config: { damping: 13, stiffness: 110 },
  });
  const smithPop = spring({
    frame: frame - 210,
    fps,
    config: { damping: 13, stiffness: 110 },
  });
  const bossBannerPop = spring({
    frame: frame - 810,
    fps,
    config: { damping: 10, stiffness: 150 },
  });
  const senaGridPop = spring({
    frame: frame - 1050,
    fps,
    config: { damping: 13 },
  });

  return (
    <AbsoluteFill>
      <CyberStadiumBackground
        leftColor={COLORS.kohliPrimary}
        rightColor={COLORS.smithPrimary}
      />
      <BroadcastHUD
        sectionTitle="STAGE 01 // THE MODERN ERA TITANS"
        teluguSubtitle="కింగ్ కోహ్లీ vs మోడ్రన్ డే బ్రాడ్‌మన్ స్మిత్"
        globalFrame={frame}
      />

      {/* PHASE 1: RK CRICKET TELUGU GRAND STINGER (0 - 155) */}
      {frame < 165 && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: '90px 60px',
            opacity: interpolate(frame, [135, 165], [1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '340px 1fr 340px',
              gap: 32,
              alignItems: 'center',
              width: '100%',
            }}
          >
            <PlayerHeroShowcase
              player="kohli"
              height={460}
              width={340}
              badgeText="KING KOHLI"
              subBadge="కింగ్ విరాట్ కోహ్లీ"
            />

            <div
              style={{
                background: 'rgba(8, 14, 34, 0.9)',
                border: `2px solid ${COLORS.smithPrimary}`,
                borderRadius: 36,
                padding: '46px 40px',
                textAlign: 'center',
                boxShadow: '0 0 80px rgba(255, 215, 0, 0.3)',
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: COLORS.kohliSecondary,
                  letterSpacing: 5,
                }}
              >
                HELLO CRICKET FANS // స్వాగతం
              </div>
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 900,
                  background: `linear-gradient(90deg, ${COLORS.kohliPrimary}, ${COLORS.smithPrimary}, ${COLORS.smithSecondary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginTop: 10,
                }}
              >
                RK CRICKET TELUGU
              </div>
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  color: '#FFFFFF',
                  marginTop: 14,
                }}
              >
                మోడ్రన్ ఎరా టెస్ట్ క్రికెట్ ఒరిజినల్ బాస్ ఎవరు?
              </div>
            </div>

            <PlayerHeroShowcase
              player="smith"
              height={460}
              width={340}
              badgeText="MODERN BRADMAN"
              subBadge="స్టీవ్ స్మిత్"
            />
          </div>
        </AbsoluteFill>
      )}

      {/* PHASE 2: FULL PLAYER CUTOUT FACE-OFF (150 - 1070) */}
      {frame >= 150 && frame < 1080 && (
        <AbsoluteFill
          style={{
            padding: '95px 54px 54px',
            opacity: interpolate(frame, [1040, 1075], [1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '430px 1fr 430px',
              gap: 28,
              alignItems: 'center',
              flex: 1,
            }}
          >
            {/* LEFT: VIRAT KOHLI 3D CUTOUT CARD */}
            <PlayerHeroShowcase
              player="kohli"
              height={620}
              width={430}
              enterProgress={kohliPop}
              auraMode={frame >= 450 ? 'fire' : 'normal'}
              badgeText="THE KING // TEAM INDIA"
              subBadge="అగ్రెసివ్ అప్రోచ్ & బౌలర్లపై డామినేషన్ 🔥"
            />

            {/* CENTER: RIVALRY CORE & ECG WAVE */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: 620,
              }}
            >
              <div
                style={{
                  background: COLORS.glassBg,
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: 28,
                  padding: '22px 28px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 900,
                    color: COLORS.smithPrimary,
                    letterSpacing: 3,
                  }}
                >
                  MODERN ERA TEST GIANTS
                </div>
                <div
                  style={{
                    fontSize: 44,
                    fontWeight: 900,
                    color: '#FFF',
                    marginTop: 6,
                  }}
                >
                  KOHLI <span style={{ color: COLORS.smithPrimary }}>VS</span>{' '}
                  SMITH
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: '#CBD5E1',
                    marginTop: 6,
                  }}
                >
                  వీళ్ళిద్దరూ పిచ్ మీద ఉంటే బౌలర్లకు నిద్ర పట్టదు! ⚡
                </div>
              </div>

              {/* Dynamic Style Clash & Bowler Heartbeat Monitor */}
              <div
                style={{
                  background: 'rgba(8, 13, 30, 0.9)',
                  border: `2px solid ${
                    frame >= 450 ? '#FF2A54' : 'rgba(255,255,255,0.15)'
                  }`,
                  borderRadius: 28,
                  padding: 24,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{
                      color: COLORS.kohliPrimary,
                      fontWeight: 900,
                      fontSize: 19,
                    }}
                  >
                    ⚡ AGGRESSIVE DOMINANCE
                  </span>
                  <span
                    style={{
                      color: COLORS.smithSecondary,
                      fontWeight: 900,
                      fontSize: 19,
                    }}
                  >
                    UNORTHODOX PATIENCE 🛡️
                  </span>
                </div>

                {/* Animated Bowler ECG Heart-Rate SVG */}
                <svg width="100%" height="75" viewBox="0 0 600 75">
                  <path
                    d="M 0 40 L 110 40 L 130 12 L 150 68 L 175 8 L 200 70 L 220 38 L 360 38 L 385 10 L 410 68 L 435 12 L 460 40 L 600 40"
                    fill="none"
                    stroke="#FF2A54"
                    strokeWidth="4"
                    strokeDasharray="600"
                    strokeDashoffset={interpolate(
                      (frame * 6) % 600,
                      [0, 600],
                      [600, 0]
                    )}
                  />
                </svg>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 16,
                    marginTop: 10,
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255,85,0,0.15)',
                      padding: 12,
                      borderRadius: 14,
                      fontSize: 18,
                      fontWeight: 700,
                      color: '#FFF',
                    }}
                  >
                    అగ్రెసివ్ అప్రోచ్‌తో బౌలర్లను డామినేట్ చేసే కింగ్!
                  </div>
                  <div
                    style={{
                      background: 'rgba(0,255,135,0.14)',
                      padding: 12,
                      borderRadius: 14,
                      fontSize: 18,
                      fontWeight: 700,
                      color: '#FFF',
                    }}
                  >
                    డిఫరెంట్ బ్యాటింగ్ స్టైల్‌తో సహనాన్ని పరీక్షించే స్మిత్!
                  </div>
                </div>
              </div>

              {/* FAB 4 BOSS BANNER */}
              <div
                style={{
                  transform: `scale(${frame >= 800 ? bossBannerPop : 0.85})`,
                  opacity: frame >= 800 ? 1 : 0.35,
                  background:
                    'linear-gradient(90deg, rgba(255,85,0,0.28), rgba(255,215,0,0.34), rgba(0,255,135,0.28))',
                  border: `2px solid ${COLORS.smithPrimary}`,
                  borderRadius: 26,
                  padding: '20px 26px',
                  textAlign: 'center',
                  boxShadow: '0 0 45px rgba(255,215,0,0.3)',
                }}
              >
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 900,
                    color: COLORS.smithPrimary,
                    letterSpacing: 2,
                  }}
                >
                  FAB-4 SEPARATE LEAGUE // ఫ్యాబ్-4 లో సపరేట్ రేంజ్
                </div>
                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 900,
                    color: '#FFF',
                    marginTop: 4,
                  }}
                >
                  టెస్ట్ ఫార్మాట్‌కి ఒరిజినల్ బాస్ ఎవరు? 👑
                </div>
              </div>
            </div>

            {/* RIGHT: STEVE SMITH 3D CUTOUT CARD */}
            <PlayerHeroShowcase
              player="smith"
              height={620}
              width={430}
              enterProgress={smithPop}
              auraMode={frame >= 540 ? 'fortress' : 'normal'}
              badgeText="MODERN DAY BRADMAN"
              subBadge="అంతులేని ఓపిక & అసాధారణ టెక్నిక్ 🛡️"
            />
          </div>
        </AbsoluteFill>
      )}

      {/* PHASE 3: SENA 4-NATION PILLARS (1050 - 1380) */}
      {frame >= 1050 && (
        <AbsoluteFill
          style={{
            padding: '105px 60px 65px',
            opacity: senaGridPop,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: COLORS.kohliSecondary,
                letterSpacing: 4,
              }}
            >
              COMPLETE TEST BREAKDOWN // ఓవరాల్ రికార్డ్స్ + సెంచరీలు + SENA స్టాట్స్
            </div>
            <div
              style={{
                fontSize: 52,
                fontWeight: 900,
                color: '#FFFFFF',
                marginTop: 6,
              }}
            >
              THE S.E.N.A. CRUCIBLE (అత్యంత కష్టమైన 4 దేశాలు)
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 24,
            }}
          >
            {[
              { code: 'S', name: 'SOUTH AFRICA', telugu: 'సౌతాఫ్రికా 🇿🇦', desc: 'FIERCE PACE & BOUNCE', color: '#00FF87' },
              { code: 'E', name: 'ENGLAND', telugu: 'ఇంగ్లాండ్ 🏴󠁧󠁢󠁥󠁮󠁧󠁿', desc: 'LETHAL DUKES SWING', color: '#00D2FF' },
              { code: 'N', name: 'NEW ZEALAND', telugu: 'న్యూజిలాండ్ 🇳🇿', desc: 'GREEN SEAM TRACKS', color: '#A855F7' },
              { code: 'A', name: 'AUSTRALIA', telugu: 'ఆస్ట్రేలియా 🇦🇺', desc: 'STEEP BOUNCE & PACE', color: '#FFD700' },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(12, 19, 42, 0.9)',
                  border: `2px solid ${item.color}`,
                  borderRadius: 28,
                  padding: '30px 22px',
                  textAlign: 'center',
                  boxShadow: `0 18px 45px ${item.color}28`,
                }}
              >
                <div
                  style={{
                    fontSize: 92,
                    fontWeight: 900,
                    color: item.color,
                    lineHeight: 1,
                    textShadow: `0 0 28px ${item.color}`,
                  }}
                >
                  {item.code}
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#FFF', marginTop: 12 }}>
                  {item.name}
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: item.color, marginTop: 6 }}>
                  {item.telugu}
                </div>
                <div
                  style={{
                    marginTop: 14,
                    padding: '8px 12px',
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.06)',
                    color: '#E2E8F0',
                    fontSize: 15,
                    fontWeight: 800,
                  }}
                >
                  {item.desc}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              alignSelf: 'center',
              background:
                'linear-gradient(90deg, rgba(255,85,0,0.3), rgba(255,215,0,0.3), rgba(0,255,135,0.3))',
              border: `1.5px solid ${COLORS.smithPrimary}`,
              padding: '16px 42px',
              borderRadius: 999,
              fontSize: 27,
              fontWeight: 900,
              color: '#FFF',
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
// SCENE 2: CYBER OVERALL STATS (1686 frames)
// ============================================================================
const CyberScene2OverallStats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const verdictScale = spring({
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
        sectionTitle="ROUND 01 // OVERALL TEST CAREER MATRIX"
        teluguSubtitle="ఓవరాల్ టెస్ట్ రికార్డ్స్: కోహ్లీ vs స్మిత్"
        globalFrame={1380 + frame}
      />

      {/* 57 AVERAGE SUPERNOVA SHOCKWAVE */}
      {frame >= 1005 && frame <= 1160 && (
        <div
          style={{
            position: 'absolute',
            right: 120,
            top: 260,
            width: 480,
            height: 480,
            borderRadius: '50%',
            border: `8px solid ${COLORS.smithPrimary}`,
            transform: `scale(${interpolate(frame, [1005, 1150], [0.3, 3.4])})`,
            opacity: interpolate(frame, [1005, 1150], [1, 0]),
            pointerEvents: 'none',
            zIndex: 45,
          }}
        />
      )}

      <AbsoluteFill
        style={{
          padding: '96px 48px 52px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '370px 1fr 370px',
            gap: 24,
            alignItems: 'stretch',
            flex: 1,
          }}
        >
          {/* LEFT: VIRAT KOHLI PODIUM */}
          <PlayerHeroShowcase
            player="kohli"
            height={610}
            width={370}
            badgeText="118+ TESTS // 9000+ RUNS"
            subBadge="కెరీర్ బెస్ట్ స్కోర్: 254* NOT OUT"
          />

          {/* CENTER: HEAD-TO-HEAD BARS */}
          <div
            style={{
              background: COLORS.glassBg,
              border: '1.5px solid rgba(255,255,255,0.16)',
              borderRadius: 32,
              padding: '26px 32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 900,
                  color: COLORS.kohliSecondary,
                  letterSpacing: 3,
                }}
              >
                HEAD-TO-HEAD STATISTICAL BREAKDOWN
              </div>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#FFF', marginTop: 4 }}>
                OVERALL TEST NUMBERS // ఓవరాల్ గణాంకాలు
              </div>
            </div>

            {[
              {
                label: 'TEST MATCHES (మ్యాచ్‌లు)',
                kohliVal: 118,
                kohliSuffix: '+',
                kohliStart: 140,
                smithVal: 109,
                smithSuffix: '',
                smithStart: 810,
                kohliPct: 52,
                highlight: 'none',
              },
              {
                label: 'TOTAL TEST RUNS (పరుగులు)',
                kohliVal: 9000,
                kohliSuffix: '+',
                kohliStart: 250,
                smithVal: 9600,
                smithSuffix: '+',
                smithStart: 890,
                kohliPct: 48,
                highlight: 'smith',
              },
              {
                label: 'TEST AVERAGE (బ్యాటింగ్ యావరేజ్)',
                kohliVal: 48,
                kohliPrefix: '~',
                kohliStart: 370,
                smithVal: 57,
                smithPrefix: '~',
                smithStart: 1010,
                kohliPct: 45,
                highlight: 'smith-shock',
              },
              {
                label: 'TEST CENTURIES (సెంచరీలు)',
                kohliVal: 29,
                kohliSuffix: ' 100s',
                kohliStart: 500,
                smithVal: 32,
                smithSuffix: ' 100s',
                smithStart: 1150,
                kohliPct: 47,
                highlight: 'smith',
              },
              {
                label: 'HIGHEST SCORE (కెరీర్ బెస్ట్)',
                kohliVal: 254,
                kohliSuffix: '*',
                kohliStart: 600,
                smithVal: 239,
                smithSuffix: '',
                smithStart: 1260,
                kohliPct: 52,
                highlight: 'kohli',
              },
            ].map((row, idx) => {
              const showSmith = frame >= row.smithStart - 20;
              const isShockRow = row.highlight === 'smith-shock' && frame >= 1010;
              return (
                <div
                  key={idx}
                  style={{
                    background: isShockRow
                      ? 'linear-gradient(90deg, rgba(255,85,0,0.15), rgba(255,215,0,0.32), rgba(0,255,135,0.25))'
                      : 'rgba(255,255,255,0.04)',
                    border: isShockRow
                      ? `2px solid ${COLORS.smithPrimary}`
                      : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 18,
                    padding: '10px 20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <AnimatedCounter
                      target={row.kohliVal}
                      startFrame={row.kohliStart}
                      prefix={row.kohliPrefix}
                      suffix={row.kohliSuffix}
                      color={COLORS.kohliPrimary}
                      fontSize={38}
                    />

                    <span
                      style={{
                        color: isShockRow ? COLORS.smithPrimary : '#E2E8F0',
                        fontWeight: 900,
                        fontSize: 18,
                        letterSpacing: 1,
                      }}
                    >
                      {row.label} {isShockRow ? '🤯 MIND-BLOWING!' : ''}
                    </span>

                    <div style={{ opacity: showSmith ? 1 : 0.2 }}>
                      <AnimatedCounter
                        target={row.smithVal}
                        startFrame={row.smithStart}
                        prefix={row.smithPrefix}
                        suffix={row.smithSuffix}
                        color={isShockRow ? COLORS.smithPrimary : COLORS.smithSecondary}
                        fontSize={isShockRow ? 44 : 38}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      height: 8,
                      borderRadius: 999,
                      background: 'rgba(255,255,255,0.1)',
                      overflow: 'hidden',
                      display: 'flex',
                      marginTop: 6,
                    }}
                  >
                    <div style={{ width: `${row.kohliPct}%`, background: COLORS.kohliPrimary }} />
                    <div
                      style={{
                        width: `${100 - row.kohliPct}%`,
                        background: COLORS.smithSecondary,
                        opacity: showSmith ? 1 : 0.15,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: STEVE SMITH PODIUM */}
          <PlayerHeroShowcase
            player="smith"
            height={610}
            width={370}
            auraMode={frame >= 1010 ? 'crown' : 'normal'}
            badgeText="LEG SPINNER TO 57 AVG!"
            subBadge="109 మ్యాచ్‌ల్లోనే 9,600+ పరుగులు & 32 సెంచరీలు"
          />
        </div>

        {/* BOTTOM ROUND-1 VERDICT */}
        <div
          style={{
            marginTop: 18,
            transform: `scale(${frame >= 1380 ? verdictScale : 0.95})`,
            opacity: frame >= 1380 ? 1 : 0.4,
            background:
              'linear-gradient(90deg, rgba(0,255,135,0.24), rgba(255,215,0,0.32), rgba(8,14,34,0.95))',
            border: `2px solid ${COLORS.smithPrimary}`,
            borderRadius: 22,
            padding: '16px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: 25, fontWeight: 900, color: '#FFF' }}>
            📊 ఓవరాల్ స్టాట్స్ తీర్పు: తక్కువ మ్యాచ్‌లు, ఎక్కువ పరుగులు, ఎక్కువ సెంచరీలు & బ్రాడ్‌మన్ తర్వాత అత్యధిక యావరేజ్ (~57) తో{' '}
            <span style={{ color: COLORS.smithPrimary }}>
              స్టీవ్ స్మిత్ అప్పర్ హ్యాండ్!
            </span>
          </div>
          <div
            style={{
              padding: '10px 24px',
              borderRadius: 14,
              background: COLORS.smithSecondary,
              color: '#040711',
              fontWeight: 900,
              fontSize: 20,
            }}
          >
            ROUND 1: SMITH 🏆
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 3: CYBER SENA DEEP DIVE (3013 frames)
// ============================================================================
const CyberScene3SenaMap: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <CyberStadiumBackground leftColor="#00D2FF" rightColor={COLORS.smithPrimary} />
      <BroadcastHUD
        sectionTitle="ROUND 02 // S.E.N.A. OVERSEAS BATTLEFIELD"
        teluguSubtitle="SENA దేశాల్లో అసలు పరీక్ష: పేస్, స్వింగ్ & బౌన్స్"
        globalFrame={3066 + frame}
      />

      {/* SUB-STAGE A: HAWK-EYE PITCH (0 - 450) */}
      {frame < 450 && (
        <AbsoluteFill
          style={{
            padding: '100px 52px 58px',
            display: 'grid',
            gridTemplateColumns: '350px 1fr 350px',
            gap: 26,
            alignItems: 'center',
          }}
        >
          <PlayerHeroShowcase
            player="kohli"
            height={580}
            width={350}
            badgeText="SENA CHALLENGER"
            subBadge="విదేశీ పిచ్‌లపై కింగ్ వేట"
          />

          <div
            style={{
              height: 580,
              background: COLORS.glassBg,
              border: '2px solid rgba(0, 210, 255, 0.45)',
              borderRadius: 32,
              padding: 30,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              textAlign: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: COLORS.kohliPrimary, letterSpacing: 2 }}>
                కానీ అసలు కథ ఇక్కడే మొదలవుతుంది! // THE SENA TEST
              </div>
              <div style={{ fontSize: 40, fontWeight: 900, color: '#FFF', marginTop: 6 }}>
                FULL SWING • FIERCE PACE • STEEP BOUNCE
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#CBD5E1', marginTop: 6 }}>
                హోమ్ గ్రౌండ్‌లో రన్స్ కొట్టడం కాదు.. SENA కంట్రీస్‌లో ఆడితేనే అసలు తోపు!
              </div>
            </div>

            <div
              style={{
                background: 'rgba(4, 8, 22, 0.9)',
                borderRadius: 24,
                padding: 18,
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <svg width="100%" height="230" viewBox="0 0 700 230">
                <polygon
                  points="230,25 470,25 640,210 60,210"
                  fill="rgba(16, 185, 129, 0.18)"
                  stroke="#10B981"
                  strokeWidth="2"
                />
                <path d="M 350 200 Q 340 130 310 145 Q 270 40 210 15" fill="none" stroke="#FFD700" strokeWidth="5" />
                <circle cx="210" cy="15" r="10" fill="#FFD700" />
                <text x="130" y="35" fill="#FFD700" fontSize="18" fontWeight="900">
                  AUS/SA STEEP BOUNCE
                </text>
                <path d="M 350 200 Q 370 120 390 130 Q 470 65 520 20" fill="none" stroke="#00D2FF" strokeWidth="5" />
                <circle cx="520" cy="20" r="10" fill="#00D2FF" />
                <text x="485" y="55" fill="#00D2FF" fontSize="18" fontWeight="900">
                  ENG LATE SWING
                </text>
              </svg>
            </div>

            <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.smithPrimary }}>
              ఆస్ట్రేలియా • సౌతాఫ్రికా • ఇంగ్లాండ్ • న్యూజిలాండ్ రికార్డులు చూద్దాం!
            </div>
          </div>

          <PlayerHeroShowcase
            player="smith"
            height={580}
            width={350}
            badgeText="SENA DOMINATOR"
            subBadge="50+ కన్సిస్టెంట్ యావరేజ్"
          />
        </AbsoluteFill>
      )}

      {/* SUB-STAGE B: AUSTRALIA & SA (450 - 1320) */}
      {frame >= 450 && frame < 1320 && (
        <AbsoluteFill
          style={{
            padding: '98px 52px 54px',
            display: 'grid',
            gridTemplateColumns: '350px 1fr 350px',
            gap: 24,
            alignItems: 'center',
          }}
        >
          <PlayerHeroShowcase
            player="kohli"
            height={600}
            width={350}
            auraMode="fire"
            badgeText="AUS: 54+ AVG (6 100s)"
            subBadge="2014 అడిలైడ్ టెస్ట్‌లో 2 సెంచరీలు! 🔥"
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, height: 600, justifyContent: 'space-between' }}>
            <div
              style={{
                background: COLORS.glassBg,
                border: `2px solid ${COLORS.smithPrimary}`,
                borderRadius: 28,
                padding: '22px 28px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 32, fontWeight: 900, color: '#FFF' }}>
                  🇦🇺 AUSTRALIA (ఆస్ట్రేలియా గడ్డపై)
                </span>
                <span
                  style={{
                    padding: '5px 14px',
                    borderRadius: 999,
                    background: 'rgba(255,215,0,0.2)',
                    color: COLORS.smithPrimary,
                    fontWeight: 900,
                    fontSize: 15,
                  }}
                >
                  2014 ADELAIDE TWIN 100s ⭐
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <div style={{ background: 'rgba(255,85,0,0.18)', borderLeft: `5px solid ${COLORS.kohliPrimary}`, borderRadius: 18, padding: 16 }}>
                  <div style={{ color: '#FFB088', fontWeight: 900, fontSize: 18 }}>VIRAT KOHLI (వేరే లెవెల్!)</div>
                  <div style={{ display: 'flex', gap: 24, marginTop: 6 }}>
                    <AnimatedCounter target={54} startFrame={480} suffix="+ AVG" color="#FFF" fontSize={44} />
                    <AnimatedCounter target={6} startFrame={530} suffix=" 100s" color={COLORS.smithPrimary} fontSize={44} />
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(0,255,135,0.15)',
                    borderLeft: `5px solid ${COLORS.smithSecondary}`,
                    borderRadius: 18,
                    padding: 16,
                    opacity: frame >= 880 ? 1 : 0.3,
                  }}
                >
                  <div style={{ color: COLORS.smithSecondary, fontWeight: 900, fontSize: 18 }}>STEVE SMITH (హోమ్ గ్రౌండ్ కింగ్)</div>
                  <div style={{ marginTop: 6 }}>
                    <AnimatedCounter target={62} startFrame={910} suffix="+ AVG" color={COLORS.smithPrimary} fontSize={46} />
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                background: COLORS.glassBg,
                border: `2px solid ${COLORS.smithSecondary}`,
                borderRadius: 28,
                padding: '22px 28px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: frame >= 730 ? 1 : 0.35,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 32, fontWeight: 900, color: '#FFF' }}>
                  🇿🇦 SOUTH AFRICA (సౌతాఫ్రికా పేస్ అటాక్‌పై)
                </span>
                <span
                  style={{
                    padding: '5px 14px',
                    borderRadius: 999,
                    background: 'rgba(0,255,135,0.2)',
                    color: COLORS.smithSecondary,
                    fontWeight: 900,
                    fontSize: 15,
                  }}
                >
                  DEADLY PROTEAS PACE
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <div style={{ background: 'rgba(255,85,0,0.18)', borderLeft: `5px solid ${COLORS.kohliPrimary}`, borderRadius: 18, padding: 16 }}>
                  <div style={{ color: '#FFB088', fontWeight: 900, fontSize: 18 }}>VIRAT KOHLI IN SA</div>
                  <div style={{ display: 'flex', gap: 24, marginTop: 6 }}>
                    <AnimatedCounter target={50} startFrame={760} suffix=" AVG" color="#FFF" fontSize={44} />
                    <AnimatedCounter target={3} startFrame={800} suffix=" 100s" color={COLORS.smithPrimary} fontSize={44} />
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(0,255,135,0.15)',
                    borderLeft: `5px solid ${COLORS.smithSecondary}`,
                    borderRadius: 18,
                    padding: 16,
                    opacity: frame >= 1020 ? 1 : 0.3,
                  }}
                >
                  <div style={{ color: COLORS.smithSecondary, fontWeight: 900, fontSize: 18 }}>STEVE SMITH IN SA</div>
                  <div style={{ marginTop: 6 }}>
                    <AnimatedCounter target={41} startFrame={1050} suffix=" AVG (STRONG)" color={COLORS.smithSecondary} fontSize={42} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <PlayerHeroShowcase
            player="smith"
            height={600}
            width={350}
            badgeText="AUS: 62+ AVG // SA: 41"
            subBadge="ఆస్ట్రేలియా & సౌతాఫ్రికాలో అద్భుత రికార్డ్"
          />
        </AbsoluteFill>
      )}

      {/* SUB-STAGE C: ENGLAND (1320 - 2310) */}
      {frame >= 1320 && frame < 2310 && (
        <AbsoluteFill
          style={{
            padding: '98px 52px 54px',
            display: 'grid',
            gridTemplateColumns: '360px 1fr 360px',
            gap: 24,
            alignItems: 'center',
          }}
        >
          <PlayerHeroShowcase
            player="kohli"
            height={600}
            width={360}
            auraMode="fire"
            badgeText="2018 KING COMEBACK"
            subBadge="593 RUNS // సిరీస్ టాప్ స్కోరర్ 👑"
          />

          <div
            style={{
              height: 600,
              background: COLORS.glassBg,
              border: '2px solid #00D2FF',
              borderRadius: 32,
              padding: '26px 30px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#00D2FF', letterSpacing: 2 }}>
                🏴󠁧󠁢󠁥󠁮󠁧󠁿 ENGLAND SWING TEST // అండర్సన్ & బ్రాడ్ హోమ్ కండిషన్స్
              </div>
              <div style={{ fontSize: 38, fontWeight: 900, color: '#FFF', marginTop: 4 }}>
                2018 REDEMPTION 🔥 VS 2019 ASHES MIRACLE 🤯
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(90deg, rgba(255,85,0,0.26), rgba(10,16,36,0.9))',
                border: `2px solid ${COLORS.kohliPrimary}`,
                borderRadius: 22,
                padding: '18px 24px',
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 900, color: COLORS.smithPrimary }}>
                2014 లో ఇబ్బంది పడి.. 2018 లో కింగ్‌లా కంబ్యాక్ ఇచ్చిన కోహ్లీ!
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <AnimatedCounter target={593} startFrame={1560} suffix=" RUNS (2018)" color="#FFF" fontSize={46} />
                <AnimatedCounter target={33} startFrame={1720} suffix="+ AVG (2 100s)" color={COLORS.kohliPrimary} fontSize={38} />
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(90deg, rgba(255,215,0,0.28), rgba(0,255,135,0.22))',
                border: `2px solid ${COLORS.smithPrimary}`,
                borderRadius: 22,
                padding: '18px 24px',
                opacity: frame >= 1840 ? 1 : 0.25,
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 900, color: '#FFF' }}>
                2019 యాషెస్‌లో బ్యాన్ తర్వాత తిరిగొచ్చి 110 యావరేజ్‌తో 774 పరుగులు!
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <AnimatedCounter target={774} startFrame={1980} suffix=" RUNS (110 AVG)" color={COLORS.smithPrimary} fontSize={44} />
                <AnimatedCounter target={58} startFrame={2120} suffix="+ ENG AVG (7 100s)" color={COLORS.smithSecondary} fontSize={36} />
              </div>
            </div>
          </div>

          <PlayerHeroShowcase
            player="smith"
            height={600}
            width={360}
            auraMode="crown"
            badgeText="2019 ASHES: 774 RUNS"
            subBadge="ఇంగ్లాండ్‌లో 58+ యావరేజ్ & 7 సెంచరీలు!"
          />
        </AbsoluteFill>
      )}

      {/* SUB-STAGE D: NZ & SENA SUMMARY (2310 - 3013) */}
      {frame >= 2310 && (
        <AbsoluteFill
          style={{
            padding: '98px 50px 54px',
            display: 'grid',
            gridTemplateColumns: '340px 1fr 340px',
            gap: 24,
            alignItems: 'center',
          }}
        >
          <PlayerHeroShowcase
            player="kohli"
            height={600}
            width={340}
            badgeText="HISTORIC OVERSEAS WINS"
            subBadge="ఇండియాకు చారిత్రక విజయాలు అందించిన కింగ్"
          />

          <div style={{ height: 600, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div
              style={{
                background: COLORS.glassBg,
                border: '2px solid #A855F7',
                borderRadius: 26,
                padding: '20px 28px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: 17, fontWeight: 900, color: '#C084FC' }}>
                  🇳🇿 NEW ZEALAND GREEN PITCHES
                </div>
                <div style={{ fontSize: 30, fontWeight: 900, color: '#FFF' }}>
                  న్యూజిలాండ్ గ్రీన్ పిచ్‌లపై యావరేజ్
                </div>
              </div>
              <div style={{ display: 'flex', gap: 36 }}>
                <AnimatedCounter target={36} startFrame={2340} prefix="Kohli: " suffix=" AVG" color={COLORS.kohliPrimary} fontSize={38} />
                <AnimatedCounter target={53} startFrame={2410} prefix="Smith: " suffix=" AVG" color={COLORS.smithSecondary} fontSize={38} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { c: '🇦🇺 AUSTRALIA', k: '54+ Avg (6 100s)', s: '62+ Avg' },
                { c: '🇿🇦 SOUTH AFRICA', k: '50 Avg (3 100s)', s: '41 Avg' },
                { c: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 ENGLAND', k: '33+ Avg (593 Peak)', s: '58+ Avg (7 100s)' },
                { c: '🇳🇿 NEW ZEALAND', k: '36 Avg', s: '53 Avg' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(12, 18, 40, 0.92)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 20,
                    padding: '16px 22px',
                  }}
                >
                  <div style={{ fontSize: 20, fontWeight: 900, color: COLORS.smithPrimary }}>{item.c}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#FFB088', marginTop: 6 }}>Kohli: {item.k}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.smithSecondary, marginTop: 2 }}>Smith: {item.s}</div>
                </div>
              ))}
            </div>

            <div
              style={{
                background: 'linear-gradient(90deg, rgba(255,85,0,0.25), rgba(0,255,135,0.25))',
                border: `2px solid ${COLORS.smithPrimary}`,
                borderRadius: 22,
                padding: '16px 24px',
                fontSize: 21,
                fontWeight: 800,
                color: '#FFF',
                textAlign: 'center',
              }}
            >
              విదేశీ విజయాల్లో కోహ్లీ పాత్ర అనూహ్యం 🇮🇳 | స్టాటిస్టికల్‌గా 50+ యావరేజ్‌తో స్మిత్ డామినేషన్ 🇦🇺
            </div>
          </div>

          <PlayerHeroShowcase
            player="smith"
            height={600}
            width={340}
            auraMode="crown"
            badgeText="50+ SENA CONSISTENCY"
            subBadge="ప్రతీ SENA దేశంలోనూ తిరుగులేని గణాంకాలు"
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 4: CYBER IMPACT & PLAYING STYLE (1085 frames)
// ============================================================================
const CyberScene4ImpactStyle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <CyberStadiumBackground leftColor={COLORS.kohliPrimary} rightColor={COLORS.smithSecondary} />
      <BroadcastHUD
        sectionTitle="ROUND 03 // PLAYING IMPACT & CAPTAINCY"
        teluguSubtitle="అగ్రెషన్ & కెప్టెన్సీ vs అంతులేని ఓపిక"
        globalFrame={6079 + frame}
      />

      <AbsoluteFill
        style={{
          padding: '98px 50px 54px',
          display: 'grid',
          gridTemplateColumns: '390px 1fr 390px',
          gap: 26,
          alignItems: 'center',
        }}
      >
        <PlayerHeroShowcase
          player="kohli"
          height={615}
          width={390}
          auraMode="fire"
          badgeText="BOWLER FEAR FACTOR 🔥"
          subBadge="SENA దేశాల్లో కళ్ళు చెదిరే కెప్టెన్సీ విజయాలు!"
        />

        <div style={{ height: 615, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(255,85,0,0.24), rgba(10,16,36,0.92))',
              border: `2px solid ${COLORS.kohliPrimary}`,
              borderRadius: 28,
              padding: '24px 28px',
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 900, color: COLORS.kohliPrimary, letterSpacing: 1.5 }}>
              ⚡ VIRAT KOHLI: THE AGGRESSIVE LEADER
            </div>
            <div style={{ fontSize: 23, fontWeight: 800, color: '#FFF', marginTop: 10, lineHeight: 1.45 }}>
              • కోహ్లీ క్రీజ్‌లో ఉంటే అపోజిషన్ బౌలర్లకి ఒక భయం ఉంటుంది!
              <br />
              • అగ్రెషన్, కౌంటర్ అటాక్ & లోయర్ ఆర్డర్‌తో కలిసి రన్స్ రాబట్టే స్టైల్
              <br />• కోహ్లీ కెప్టెన్సీలోనే టీమ్ ఇండియా SENA దేశాల్లో చారిత్రక విజయాలు నమోదు చేసింది!
            </div>
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, rgba(0,255,135,0.2), rgba(10,16,36,0.92))',
              border: `2px solid ${COLORS.smithSecondary}`,
              borderRadius: 28,
              padding: '24px 28px',
              opacity: frame >= 500 ? 1 : 0.3,
              transform: `scale(${
                frame >= 500 ? spring({ frame: frame - 500, fps, config: { damping: 13 } }) : 0.95
              })`,
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 900, color: COLORS.smithSecondary, letterSpacing: 1.5 }}>
              🛡️ STEVE SMITH: BORN FOR TEST CRICKET
            </div>
            <div style={{ fontSize: 23, fontWeight: 800, color: '#FFF', marginTop: 10, lineHeight: 1.45 }}>
              • క్రీజ్ చుట్టూ తిరుగుతూ, బంతిని వదిలేస్తూ బౌలర్లను ఫ్రస్ట్రేట్ చేస్తాడు!
              <br />
              • పిచ్ ఎంత వర్స్ట్‌గా ఉన్నా సెట్ అయితే అవుట్ చేయడం దాదాపు అసాధ్యం
              <br />• టెస్ట్ ఫార్మాట్ కోసమే పుట్టాడా అనేంత ఓపిక స్మిత్ సొంతం!
            </div>
          </div>
        </div>

        <PlayerHeroShowcase
          player="smith"
          height={615}
          width={390}
          auraMode="fortress"
          badgeText="IMPOSSIBLE TO DISMISS 🛡️"
          subBadge="బౌలర్ల సహనాన్ని పరీక్షించే టెస్ట్ వాల్!"
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 5: CYBER VERDICT & SPIDER RADAR (1283 frames)
// ============================================================================
const CyberScene5VerdictOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const radarDraw = interpolate(frame, [30, 180], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const pollSwing = Math.sin(frame * 0.08) * 5;
  const kohliPct = Math.round(50 + pollSwing);
  const smithPct = 100 - kohliPct;

  const outroPop = spring({
    frame: frame - 900,
    fps,
    config: { damping: 12 },
  });

  return (
    <AbsoluteFill>
      <CyberStadiumBackground leftColor={COLORS.kohliPrimary} rightColor={COLORS.smithPrimary} />
      <BroadcastHUD
        sectionTitle="FINAL VERDICT // 6-AXIS RADAR & FAN POLL"
        teluguSubtitle="తుది తీర్పు: కింగ్ కోహ్లీనా? స్టీవ్ స్మిత్ ఆ?"
        globalFrame={7164 + frame}
      />

      {/* PART 1: 6-AXIS RADAR (0 - 915) */}
      {frame < 915 && (
        <AbsoluteFill
          style={{
            padding: '96px 48px 52px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '370px 1fr 370px', gap: 24, alignItems: 'center', flex: 1 }}>
            <PlayerHeroShowcase
              player="kohli"
              height={560}
              width={370}
              auraMode="crown"
              badgeText="MATCH-WINNING IMPACT KING"
              subBadge="ప్రెషర్‌లో ఇండియాకు మరపురాని విజయాలు!"
            />

            <div
              style={{
                height: 560,
                background: COLORS.glassBg,
                border: `2px solid ${COLORS.smithPrimary}`,
                borderRadius: 32,
                padding: '22px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 17, fontWeight: 900, color: COLORS.smithPrimary, letterSpacing: 2 }}>
                  THE ULTIMATE TEST MATRIX RADAR
                </div>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#FFF' }}>
                  NUMBERS (SMITH) 📊 VS IMPACT (KOHLI) 🔥
                </div>
              </div>

              {/* 6-Axis Spider Polygon SVG */}
              <svg width="460" height="290" viewBox="0 0 460 290">
                {[0.4, 0.7, 1].map((scale, idx) => (
                  <polygon
                    key={idx}
                    points="230,25 350,85 350,205 230,265 110,205 110,85"
                    fill="none"
                    stroke="rgba(255,255,255,0.16)"
                    strokeWidth="1.5"
                    transform={`translate(${230 * (1 - scale)}, ${145 * (1 - scale)}) scale(${scale})`}
                  />
                ))}

                <polygon
                  points="230,45 342,90 345,200 230,248 125,195 115,88"
                  fill="rgba(255, 85, 0, 0.34)"
                  stroke={COLORS.kohliPrimary}
                  strokeWidth="3.5"
                  opacity={radarDraw}
                />

                <polygon
                  points="230,26 335,95 320,190 230,262 112,204 130,96"
                  fill="rgba(0, 255, 135, 0.30)"
                  stroke={COLORS.smithSecondary}
                  strokeWidth="3.5"
                  opacity={radarDraw}
                />

                <text x="230" y="16" textAnchor="middle" fill="#FFD700" fontSize="14" fontWeight="900">
                  57 TEST AVG
                </text>
                <text x="362" y="88" fill="#FF8844" fontSize="14" fontWeight="900">
                  MATCH IMPACT
                </text>
                <text x="362" y="210" fill="#FF8844" fontSize="14" fontWeight="900">
                  CAPTAINCY WINS
                </text>
                <text x="230" y="285" textAnchor="middle" fill="#00FF87" fontSize="14" fontWeight="900">
                  SENA CONSISTENCY
                </text>
                <text x="96" y="210" textAnchor="end" fill="#00FF87" fontSize="14" fontWeight="900">
                  PATIENCE
                </text>
                <text x="96" y="88" textAnchor="end" fill="#FFFFFF" fontSize="14" fontWeight="900">
                  FEAR FACTOR
                </text>
              </svg>

              {/* Live Audience Poll Bar */}
              <div style={{ width: '100%' }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#FFF', textAlign: 'center', marginBottom: 8 }}>
                  మీ దృష్టిలో బెస్ట్ టెస్ట్ బ్యాట్స్‌మెన్ ఎవరు? కింద కామెంట్ చేయండి! 💬
                </div>
                <div
                  style={{
                    height: 36,
                    borderRadius: 999,
                    overflow: 'hidden',
                    display: 'flex',
                    border: '2px solid rgba(255,255,255,0.25)',
                  }}
                >
                  <div
                    style={{
                      width: `${kohliPct}%`,
                      background: COLORS.kohliPrimary,
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: 18,
                      fontWeight: 900,
                      fontSize: 18,
                      color: '#FFF',
                    }}
                  >
                    KING KOHLI ({kohliPct}%)
                  </div>
                  <div
                    style={{
                      width: `${smithPct}%`,
                      background: COLORS.smithSecondary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingRight: 18,
                      fontWeight: 900,
                      fontSize: 18,
                      color: '#040711',
                    }}
                  >
                    STEVE SMITH ({smithPct}%)
                  </div>
                </div>
              </div>
            </div>

            <PlayerHeroShowcase
              player="smith"
              height={560}
              width={370}
              auraMode="crown"
              badgeText="STATISTICAL & SENA KING"
              subBadge="57 యావరేజ్ & SENA కన్సిస్టెన్సీ బాస్!"
            />
          </div>
        </AbsoluteFill>
      )}

      {/* PART 2: SUBSCRIBE OUTRO (900 - 1283) */}
      {frame >= 900 && (
        <AbsoluteFill
          style={{
            padding: '95px 52px 55px',
            opacity: outroPop,
            transform: `scale(${interpolate(outroPop, [0, 1], [0.9, 1])})`,
            display: 'grid',
            gridTemplateColumns: '340px 1fr 340px',
            gap: 28,
            alignItems: 'center',
          }}
        >
          <PlayerHeroShowcase
            player="kohli"
            height={560}
            width={340}
            auraMode="crown"
            badgeText="VOTE IN COMMENTS"
            subBadge="టీమ్ కింగ్ కోహ్లీ 🇮🇳"
          />

          <div
            style={{
              background: 'rgba(8, 13, 32, 0.94)',
              border: `3px solid ${COLORS.smithPrimary}`,
              borderRadius: 36,
              padding: '44px 38px',
              textAlign: 'center',
              boxShadow: '0 0 80px rgba(255, 215, 0, 0.3)',
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 900, color: COLORS.kohliSecondary, letterSpacing: 4 }}>
              NEXT MATRIX VIDEO COMING SOON
            </div>
            <div style={{ fontSize: 64, fontWeight: 900, color: '#FFFFFF', marginTop: 10 }}>
              RK CRICKET TELUGU
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#CBD5E1', marginTop: 12 }}>
              ఈ వీడియో నచ్చితే ఒక LIKE వేసి, మన ఛానల్‌కి SUBSCRIBE చేసుకోవడం మర్చిపోకండి!
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 34 }}>
              <div
                style={{
                  padding: '18px 36px',
                  borderRadius: 999,
                  background: `linear-gradient(90deg, ${COLORS.kohliSecondary}, #0077FF)`,
                  color: '#FFF',
                  fontSize: 26,
                  fontWeight: 900,
                  transform: `scale(${1 + Math.sin(frame * 0.15) * 0.05})`,
                }}
              >
                👍 LIKE VIDEO
              </div>
              <div
                style={{
                  padding: '18px 42px',
                  borderRadius: 999,
                  background: 'linear-gradient(90deg, #FF0044, #FF5500)',
                  color: '#FFF',
                  fontSize: 26,
                  fontWeight: 900,
                  transform: `scale(${1 + Math.cos(frame * 0.15) * 0.06})`,
                }}
              >
                🔔 SUBSCRIBE
              </div>
            </div>

            <div style={{ marginTop: 32, fontSize: 23, fontWeight: 900, color: COLORS.smithSecondary }}>
              ఇంకో ఇంట్రెస్టింగ్ మ్యాట్రిక్స్ వీడియోతో మళ్ళీ కలుద్దాం... SIGNING OFF! 🚀
            </div>
          </div>

          <PlayerHeroShowcase
            player="smith"
            height={560}
            width={340}
            auraMode="crown"
            badgeText="VOTE IN COMMENTS"
            subBadge="టీమ్ స్టీవ్ స్మిత్ 🇦🇺"
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ============================================================================
// MASTER SINGLE SCENE CYBER DARK TIMELINE COMPONENT
// ============================================================================
export const ViratVsSmithCyberDark: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bgDark,
        fontFamily: THEME.fontFamily,
      }}
    >
      {/* 1. Continuous Master Voice-Over Audio (0 to 8448 frames) */}
      <Audio
        src={staticFile('audio/kohli_vs_smith/master_complete_audio.wav')}
        volume={1}
      />

      {/* 2. Ambient Studio Beat Music */}
      <Audio
        src={staticFile('Youtube Free Musics/Beat Your Competition - Vibe Tracks.mp3')}
        volume={0.12}
        loop
      />

      {/* 3. Frame-Accurate Sequential Stages */}
      <Series>
        <Series.Sequence durationInFrames={timings.scene1_intro.durationFrames}>
          <CyberScene1Intro />
        </Series.Sequence>

        <Series.Sequence durationInFrames={timings.scene2_overall_stats.durationFrames}>
          <CyberScene2OverallStats />
        </Series.Sequence>

        <Series.Sequence durationInFrames={timings.scene3_sena_records.durationFrames}>
          <CyberScene3SenaMap />
        </Series.Sequence>

        <Series.Sequence durationInFrames={timings.scene4_playing_style.durationFrames}>
          <CyberScene4ImpactStyle />
        </Series.Sequence>

        <Series.Sequence durationInFrames={timings.scene5_verdict_outro.durationFrames}>
          <CyberScene5VerdictOutro />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

