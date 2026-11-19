import React, { useState } from 'react';
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { SceneData } from './scenes_60';

// ============================================================================
// CINEMATIC THEME & COLOR PALETTE
// ============================================================================
export const C = {
  bgDark: '#070B16',
  cardBg: 'rgba(15, 23, 42, 0.85)',
  cardBorder: 'rgba(255, 255, 255, 0.12)',
  white: '#FFFFFF',
  ink: '#0F172A',
  muted: '#94A3B8',
  prabhasGold: '#F59E0B',
  prabhasGlow: '#FDE047',
  prabhasRoyal: '#2563EB',
  alluRed: '#EF4444',
  alluGreen: '#10B981',
  alluGlow: '#34D399',
  profitGreen: '#10B981',
  lossRed: '#EF4444',
  breakYellow: '#F59E0B',
};

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// Card Container Style
const baseCard: React.CSSProperties = {
  background: C.cardBg,
  border: `2px solid ${C.cardBorder}`,
  borderRadius: 32,
  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.65)',
  backdropFilter: 'blur(16px)',
  boxSizing: 'border-box',
};

// ============================================================================
// HELPER ANIMATION PRIMITIVES
// ============================================================================
export const AnimatedCounter: React.FC<{
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  delay?: number;
  decimals?: number;
  fontSize?: number;
  color?: string;
}> = ({ target, prefix = '', suffix = '', duration = 40, delay = 10, decimals = 0, fontSize = 64, color = C.white }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [delay, delay + duration], [0, 1], clamp);
  const eased = 1 - Math.pow(1 - progress, 3);
  const val = target * eased;
  const formatted = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString('en-IN');
  return (
    <span style={{ fontSize, fontWeight: 900, color, fontVariantNumeric: 'tabular-nums', textShadow: '0 4px 18px rgba(0,0,0,0.6)' }}>
      {prefix}{formatted}{suffix}
    </span>
  );
};

export const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  from?: 'up' | 'down' | 'zoom' | 'fade';
  style?: React.CSSProperties;
}> = ({ children, delay = 0, from = 'up', style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 120 } });
  const tr =
    from === 'up' ? `translateY(${(1 - p) * 45}px)`
    : from === 'down' ? `translateY(${(1 - p) * -45}px)`
    : from === 'zoom' ? `scale(${0.7 + 0.3 * p})`
    : 'none';
  return <div style={{ opacity: Math.min(1, p * 1.5), transform: tr, ...style }}>{children}</div>;
};

// ============================================================================
// 1. TITLE_CARD COMPONENT (5–7 Seconds)
// ============================================================================
export const TitleCard: React.FC<{ data: SceneData }> = ({ data }) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '0 80px', textAlign: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background Cinematic Glows */}
      <div style={{
        position: 'absolute', top: '20%', left: '15%', width: 500, height: 500,
        background: `radial-gradient(circle, ${C.prabhasGold}33 0%, transparent 70%)`,
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', right: '15%', width: 500, height: 500,
        background: `radial-gradient(circle, ${C.alluRed}33 0%, transparent 70%)`,
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      {/* Chapter Tag */}
      <Reveal delay={2}>
        <div style={{
          display: 'inline-block',
          background: 'linear-gradient(90deg, #F59E0B, #EF4444)',
          color: '#FFFFFF',
          fontWeight: 900,
          fontSize: 24,
          padding: '8px 28px',
          borderRadius: 999,
          letterSpacing: 2,
          textTransform: 'uppercase',
          boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)',
        }}>
          చాప్టర్ {data.chapter} · {data.chapterTitle}
        </div>
      </Reveal>

      {/* Main Title */}
      <Reveal delay={8} from="zoom">
        <h1 style={{
          fontSize: data.title.length > 30 ? 68 : 84,
          fontWeight: 900,
          color: C.white,
          lineHeight: 1.35,
          margin: '28px 0 16px',
          textShadow: '0 8px 30px rgba(0,0,0,0.85)',
          transform: `scale(${pulse})`,
        }}>
          {data.title}
        </h1>
      </Reveal>

      {/* Subtitle */}
      {data.sub && (
        <Reveal delay={18}>
          <div style={{
            fontSize: 36,
            fontWeight: 700,
            color: C.muted,
            maxWidth: 1400,
            lineHeight: 1.5,
            marginBottom: 32,
          }}>
            {data.sub}
          </div>
        </Reveal>
      )}

      {/* Chips */}
      {data.chips && data.chips.length > 0 && (
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
          {data.chips.map((c, i) => (
            <Reveal key={i} delay={28 + i * 8} from="zoom">
              <div style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1.5px solid rgba(255, 255, 255, 0.18)',
                padding: '10px 26px',
                borderRadius: 999,
                fontSize: 28,
                fontWeight: 800,
                color: C.white,
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              }}>
                {c}
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 2. SINGLE_MOVIE_CARD COMPONENT (7–8 Seconds)
// ============================================================================
export const SingleMovieCard: React.FC<{ data: SceneData }> = ({ data }) => {
  const m = data.movie;
  const isPrabhas = data.hero === 'prabhas';
  const heroColor = isPrabhas ? C.prabhasGold : C.alluGreen;
  const heroTag = isPrabhas ? 'REBEL STAR PRABHAS' : 'ICON STAR ALLU ARJUN';
  const [imgErr, setImgErr] = useState(false);

  return (
    <div style={{
      width: '100%', height: '100%', display: 'grid', gridTemplateColumns: '540px 1fr',
      gap: 48, padding: '36px 64px', boxSizing: 'border-box', alignItems: 'center',
    }}>
      {/* 1. LEFT: Full-Bleed Movie Poster Frame */}
      <Reveal delay={4} from="zoom" style={{ height: '100%', display: 'flex' }}>
        <div style={{
          ...baseCard,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
          border: `3.5px solid ${heroColor}`,
          boxShadow: `0 25px 65px ${heroColor}44`,
        }}>
          {imgErr || !m?.poster ? (
            <div style={{
              width: '100%', height: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', background: `linear-gradient(135deg, #1E293B, #0F172A)`,
              color: heroColor, fontSize: 48, fontWeight: 900, textAlign: 'center', padding: 20,
            }}>
              {m?.name}
            </div>
          ) : (
            <img
              src={m.poster}
              onError={() => setImgErr(true)}
              style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'center 20%',
              }}
            />
          )}

          {/* Top Pill: Hero Tag */}
          <div style={{
            position: 'absolute', top: 20, left: 20, background: 'rgba(5,9,20,0.85)',
            border: `2px solid ${heroColor}`, borderRadius: 999, padding: '6px 20px',
            color: '#FFFFFF', fontSize: 20, fontWeight: 900, letterSpacing: 1.5,
            zIndex: 10, backdropFilter: 'blur(8px)',
          }}>
            {heroTag}
          </div>

          {/* Bottom Gradient with Movie Name */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '60px 24px 24px',
            background: 'linear-gradient(0deg, rgba(5,9,20,0.98) 0%, rgba(5,9,20,0.82) 60%, transparent 100%)',
            zIndex: 10,
          }}>
            <div style={{ fontSize: 38, fontWeight: 900, color: '#FFFFFF', textShadow: '0 4px 14px rgba(0,0,0,0.8)' }}>
              {m?.name}
            </div>
            {m?.year && (
              <div style={{ fontSize: 22, fontWeight: 800, color: heroColor, marginTop: 4 }}>
                {m.year}
              </div>
            )}
          </div>
        </div>
      </Reveal>

      {/* 2. RIGHT: Metrics & Box Office Data */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26, justifyContent: 'center' }}>
        <Reveal delay={8}>
          <div style={{ fontSize: 28, fontWeight: 900, color: heroColor, letterSpacing: 2 }}>
            {data.chapterTitle}
          </div>
          <h2 style={{ fontSize: 58, fontWeight: 900, color: C.white, lineHeight: 1.3, margin: '8px 0 0' }}>
            {data.title}
          </h2>
        </Reveal>

        {/* Big Gross Counter Card */}
        <Reveal delay={18} from="zoom" style={{
          ...baseCard, padding: '36px 44px', borderLeft: `14px solid ${heroColor}`,
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: C.muted }}>
            వరల్డ్‌వైడ్ బాక్సాఫీస్ గ్రాస్ (Worldwide Gross)
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
            <AnimatedCounter target={m?.gross || 0} prefix="₹" suffix=" Cr" duration={50} delay={20} fontSize={92} color={heroColor} />
            {m?.budget && (
              <span style={{ fontSize: 32, fontWeight: 800, color: C.muted }}>
                (బడ్జెట్: {m.budget})
              </span>
            )}
          </div>
        </Reveal>

        {/* Verdict Badge */}
        {m?.verdict && (
          <Reveal delay={34}>
            <div style={{
              display: 'inline-block',
              background: m.verdictColor || heroColor,
              color: '#FFFFFF',
              fontSize: 34,
              fontWeight: 900,
              padding: '12px 36px',
              borderRadius: 999,
              boxShadow: `0 10px 30px ${m.verdictColor || heroColor}55`,
            }}>
              {m.verdict}
            </div>
          </Reveal>
        )}

        {/* Analytical Note */}
        {m?.note && (
          <Reveal delay={44}>
            <div style={{
              ...baseCard,
              padding: '20px 30px',
              fontSize: 32,
              fontWeight: 700,
              color: C.white,
              lineHeight: 1.5,
              borderLeft: `6px solid ${C.white}44`,
            }}>
              💡 {m.note}
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 3. VS_BAR_RACE COMPONENT (8–10 Seconds)
// ============================================================================
export const VsBarRace: React.FC<{ data: SceneData }> = ({ data }) => {
  const c = data.comparison;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const maxVal = Math.max(c?.leftValue || 1, c?.rightValue || 1);
  const leftGrow = spring({ frame: frame - 16, fps, config: { damping: 16, stiffness: 70 } });
  const rightGrow = spring({ frame: frame - 28, fps, config: { damping: 16, stiffness: 70 } });

  const leftWidth = `${Math.min(100, Math.max(12, ((c?.leftValue || 0) / maxVal) * 100 * leftGrow))}%`;
  const rightWidth = `${Math.min(100, Math.max(12, ((c?.rightValue || 0) / maxVal) * 100 * rightGrow))}%`;

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', padding: '0 80px', gap: 36, boxSizing: 'border-box',
    }}>
      <Reveal delay={4} style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 26, fontWeight: 900, color: C.prabhasGold, letterSpacing: 2 }}>
          HEAD-TO-HEAD పోలిక
        </div>
        <h2 style={{ fontSize: 62, fontWeight: 900, color: C.white, margin: '8px 0 0' }}>
          {data.title}
        </h2>
        {c?.metric && (
          <div style={{ fontSize: 32, fontWeight: 700, color: C.muted, marginTop: 8 }}>
            📊 {c.metric}
          </div>
        )}
      </Reveal>

      {/* Comparison Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36, marginTop: 10 }}>
        {/* Left Side: Prabhas */}
        <Reveal delay={12} style={{ ...baseCard, padding: '26px 36px', borderLeft: `12px solid ${C.prabhasGold}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: C.prabhasGold }}>{c?.leftLabel}</span>
              {c?.winner === 'prabhas' && <span style={{ fontSize: 32 }}>👑 విన్నర్</span>}
            </div>
            <div style={{ fontSize: 44, fontWeight: 900, color: C.prabhasGold }}>
              {c?.leftStr}
            </div>
          </div>
          {/* Animated Bar */}
          <div style={{ height: 38, borderRadius: 19, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', position: 'relative' }}>
            <div style={{
              width: leftWidth, height: '100%', borderRadius: 19,
              background: `linear-gradient(90deg, ${C.prabhasGold}, #FBBF24)`,
              boxShadow: `0 0 25px ${C.prabhasGold}88`,
            }} />
          </div>
          {c?.leftNote && <div style={{ fontSize: 24, fontWeight: 700, color: C.muted, marginTop: 10 }}>{c.leftNote}</div>}
        </Reveal>

        {/* Right Side: Allu Arjun */}
        <Reveal delay={24} style={{ ...baseCard, padding: '26px 36px', borderLeft: `12px solid ${C.alluRed}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: C.alluRed }}>{c?.rightLabel}</span>
              {c?.winner === 'allu_arjun' && <span style={{ fontSize: 32 }}>👑 విన్నర్</span>}
            </div>
            <div style={{ fontSize: 44, fontWeight: 900, color: C.alluRed }}>
              {c?.rightStr}
            </div>
          </div>
          {/* Animated Bar */}
          <div style={{ height: 38, borderRadius: 19, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', position: 'relative' }}>
            <div style={{
              width: rightWidth, height: '100%', borderRadius: 19,
              background: `linear-gradient(90deg, ${C.alluRed}, #F87171)`,
              boxShadow: `0 0 25px ${C.alluRed}88`,
            }} />
          </div>
          {c?.rightNote && <div style={{ fontSize: 24, fontWeight: 700, color: C.muted, marginTop: 10 }}>{c.rightNote}</div>}
        </Reveal>
      </div>
    </div>
  );
};

// ============================================================================
// 4. MAP_HIGHLIGHT COMPONENT (8 Seconds)
// ============================================================================
export const MapHighlight: React.FC<{ data: SceneData }> = ({ data }) => {
  const m = data.mapData;

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', padding: '0 80px', gap: 32, boxSizing: 'border-box',
    }}>
      <Reveal delay={4} style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 26, fontWeight: 900, color: C.prabhasGold, letterSpacing: 2 }}>
          టెరిటరీ వారీగా కలెక్షన్ల విభజన
        </div>
        <h2 style={{ fontSize: 60, fontWeight: 900, color: C.white, margin: '8px 0 0' }}>
          {data.title}
        </h2>
        {m?.territory && (
          <div style={{ fontSize: 32, fontWeight: 800, color: C.alluGlow, marginTop: 6 }}>
            📍 {m.territory}
          </div>
        )}
      </Reveal>

      {/* Comparison Scoreboard for Territory */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <Reveal delay={14} style={{ ...baseCard, padding: '32px', borderTop: `10px solid ${C.prabhasGold}`, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: C.prabhasGold }}>ప్రభాస్ షేర్ / గ్రాస్</div>
          <div style={{ fontSize: 52, fontWeight: 900, color: C.white, margin: '14px 0' }}>
            {m?.prabhasShare}
          </div>
        </Reveal>

        <Reveal delay={24} style={{ ...baseCard, padding: '32px', borderTop: `10px solid ${C.alluRed}`, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: C.alluRed }}>అల్లు అర్జున్ షేర్ / గ్రాస్</div>
          <div style={{ fontSize: 52, fontWeight: 900, color: C.white, margin: '14px 0' }}>
            {m?.bunnyshare}
          </div>
        </Reveal>
      </div>

      {/* Sub-Territory Details Cards */}
      {m?.details && m.details.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${m.details.length}, 1fr)`, gap: 20 }}>
          {m.details.map((d, i) => (
            <Reveal key={i} delay={36 + i * 10} from="zoom" style={{
              ...baseCard, padding: '20px 24px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.95)',
            }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: C.muted }}>{d.area}</div>
              <div style={{ fontSize: 30, fontWeight: 900, color: C.prabhasGold, marginTop: 8 }}>
                P: {d.pVal}
              </div>
              <div style={{ fontSize: 30, fontWeight: 900, color: C.alluRed, marginTop: 4 }}>
                AA: {d.bVal}
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {/* Key Highlight Banner */}
      {m?.highlight && (
        <Reveal delay={54}>
          <div style={{
            ...baseCard, padding: '20px 32px', fontSize: 30, fontWeight: 800,
            color: '#FFFFFF', textAlign: 'center', background: 'rgba(37, 99, 235, 0.25)',
            border: `2px solid ${C.prabhasRoyal}`,
          }}>
            🎯 {m.highlight}
          </div>
        </Reveal>
      )}
    </div>
  );
};

// ============================================================================
// 5. ROI_GAUGE_METER COMPONENT (8–10 Seconds)
// ============================================================================
export const RoiGaugeMeter: React.FC<{ data: SceneData }> = ({ data }) => {
  const r = data.roiData;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isProfit = (r?.recovery || 0) >= 100;
  const color = r?.zoneColor || (isProfit ? C.profitGreen : C.lossRed);
  const meterProgress = spring({ frame: frame - 15, fps, config: { damping: 14, stiffness: 60 } });
  const animatedRecovery = Math.round(Math.min(r?.recovery || 0, (r?.recovery || 0) * meterProgress));
  const [imgErr, setImgErr] = useState(false);

  return (
    <div style={{
      width: '100%', height: '100%', display: 'grid', gridTemplateColumns: '480px 1fr',
      gap: 48, padding: '36px 64px', boxSizing: 'border-box', alignItems: 'center',
    }}>
      {/* 1. LEFT: Movie Poster Frame */}
      <Reveal delay={4} from="zoom" style={{ height: '100%', display: 'flex' }}>
        <div style={{
          ...baseCard, width: '100%', height: '100%', overflow: 'hidden', position: 'relative',
          border: `3.5px solid ${color}`, boxShadow: `0 20px 60px ${color}33`,
        }}>
          {imgErr || !r?.poster ? (
            <div style={{
              width: '100%', height: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', background: '#1E293B', color: '#fff', fontSize: 40,
              fontWeight: 900, textAlign: 'center', padding: 20,
            }}>
              {r?.movieName}
            </div>
          ) : (
            <img
              src={r.poster}
              onError={() => setImgErr(true)}
              style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'center 20%',
              }}
            />
          )}

          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, padding: '50px 20px 20px',
            background: 'linear-gradient(0deg, rgba(5,9,20,0.98) 0%, transparent 100%)',
          }}>
            <div style={{ fontSize: 34, fontWeight: 900, color: '#fff' }}>{r?.movieName}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: color, marginTop: 4 }}>
              ప్రీ-రిలీజ్ బిజినెస్: {r?.preBiz}
            </div>
          </div>
        </div>
      </Reveal>

      {/* 2. RIGHT: Speedometer Gauge & Recovery Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26, justifyContent: 'center' }}>
        <Reveal delay={8}>
          <div style={{ fontSize: 26, fontWeight: 900, color: color, letterSpacing: 2 }}>
            థియేట్రికల్ రికవరీ అనాలిసిస్ (ROI)
          </div>
          <h2 style={{ fontSize: 56, fontWeight: 900, color: C.white, lineHeight: 1.3, margin: '8px 0 0' }}>
            {data.title}
          </h2>
        </Reveal>

        {/* Speedometer Percentage Box */}
        <Reveal delay={18} from="zoom" style={{
          ...baseCard, padding: '36px 44px', borderLeft: `14px solid ${color}`,
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: C.muted }}>
            బయ్యర్ల పెట్టుబడి రికవరీ శాతం (Recovery Ratio)
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
            <span style={{ fontSize: 105, fontWeight: 900, color, fontVariantNumeric: 'tabular-nums' }}>
              {animatedRecovery}%
            </span>
            <div style={{
              background: isProfit ? '#DCFCE7' : '#FEE2E2',
              color: isProfit ? '#15803D' : '#DC2626',
              fontWeight: 900,
              fontSize: 32,
              padding: '10px 28px',
              borderRadius: 999,
            }}>
              {r?.profitStatus === 'PROFIT' ? 'సూపర్ ప్రాఫిట్ 🟢' : 'నష్టం (Loss Zone) 🔴'}
            </div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.muted }}>
            * 100% బ్రేక్-ఈవెన్ దాటితేనే బయ్యర్లు లాభాల్లోకి వస్తారు
          </div>
        </Reveal>

        {/* Business Impact Note */}
        {r?.note && (
          <Reveal delay={34}>
            <div style={{
              ...baseCard, padding: '22px 32px', fontSize: 32, fontWeight: 800,
              color: '#FFFFFF', lineHeight: 1.5, borderLeft: `6px solid ${color}`,
            }}>
              📌 {r.note}
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 6. SCOREBOARD_UPDATE COMPONENT (5–6 Seconds)
// ============================================================================
export const ScoreboardUpdate: React.FC<{ data: SceneData }> = ({ data }) => {
  const s = data.scoreboard;

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center', padding: '0 80px', gap: 36, boxSizing: 'border-box',
    }}>
      <Reveal delay={4} style={{ textAlign: 'center' }}>
        <div style={{
          display: 'inline-block', background: 'linear-gradient(90deg, #F59E0B, #EF4444)',
          color: '#fff', fontSize: 24, fontWeight: 900, padding: '8px 30px', borderRadius: 999,
          letterSpacing: 2, marginBottom: 12,
        }}>
          స్కోర్‌బోర్డ్ అప్‌డేట్ · రౌండ్ {s?.round}
        </div>
        <h2 style={{ fontSize: 62, fontWeight: 900, color: C.white, margin: 0 }}>
          {s?.roundTitle}
        </h2>
      </Reveal>

      {/* Head to Head Points Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '460px 460px', gap: 48 }}>
        {/* Prabhas Point Card */}
        <Reveal delay={14} from="zoom" style={{
          ...baseCard, padding: '36px', borderTop: `12px solid ${C.prabhasGold}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center',
        }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: C.prabhasGold }}>ప్రభాస్ (Prabhas)</div>
          <div style={{ fontSize: 130, fontWeight: 900, color: C.white, lineHeight: 1 }}>
            {s?.pScore}
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.muted }}>పాయింట్లు</div>
        </Reveal>

        {/* Allu Arjun Point Card */}
        <Reveal delay={24} from="zoom" style={{
          ...baseCard, padding: '36px', borderTop: `12px solid ${C.alluRed}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center',
        }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: C.alluRed }}>అల్లు అర్జున్ (Allu Arjun)</div>
          <div style={{ fontSize: 130, fontWeight: 900, color: C.white, lineHeight: 1 }}>
            {s?.bScore}
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.muted }}>పాయింట్లు</div>
        </Reveal>
      </div>

      {/* Round Verdict Summary */}
      {s?.summary && (
        <Reveal delay={36}>
          <div style={{
            ...baseCard, padding: '22px 48px', fontSize: 34, fontWeight: 900,
            color: '#FFFFFF', textAlign: 'center', background: 'rgba(16, 185, 129, 0.22)',
            border: `2px solid ${C.alluGreen}`, borderRadius: 999,
          }}>
            🏆 {s.summary}
          </div>
        </Reveal>
      )}
    </div>
  );
};
