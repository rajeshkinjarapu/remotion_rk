import React from 'react';
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Img } from 'remotion';
import { THEME } from '../theme';

interface PlayerCard3DProps {
  player: 'kohli' | 'smith';
  align: 'left' | 'right';
  cardWidth?: number;
  cardHeight?: number;
  delay?: number;
}

export const PlayerCard3D: React.FC<PlayerCard3DProps> = ({
  player,
  align,
  cardWidth = 580,
  cardHeight = 720,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isKohli = player === 'kohli';
  const theme = isKohli ? THEME.kohli : THEME.smith;

  // Realistic physical spring
  const spr = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 18, stiffness: 70, mass: 1.2 },
  });

  // Subtle realistic breathing and 3D gyro tilt
  const breathe = Math.sin((frame + (isKohli ? 0 : 25)) * 0.04) * 8;
  const tiltY = Math.cos((frame + (isKohli ? 0 : 35)) * 0.03) * (align === 'left' ? 3 : -3);
  const tiltX = Math.sin(frame * 0.03) * 2;

  // Realistic light reflection sweep across glass (repeats every 150 frames)
  const glintProgress = ((frame + (isKohli ? 0 : 60)) % 150) / 150;
  const glintTranslate = interpolate(glintProgress, [0, 0.4, 1], [-120, 220, 220]);

  const imgPath = isKohli ? 'cricket/kohli_portrait.png' : 'cricket/smith_portrait.png';

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: `
          translateX(${align === 'left' ? (1 - spr) * -180 : (1 - spr) * 180}px)
          translateY(${breathe}px)
          perspective(1000px)
          rotateY(${tiltY}deg)
          rotateX(${tiltX}deg)
        `,
        opacity: Math.min(1, spr * 1.5),
        width: cardWidth,
        zIndex: 15,
        fontFamily: THEME.fontFamily,
      }}
    >
      {/* Soft Studio Floor Contact Shadow (Realistic Grounding) */}
      <div
        style={{
          position: 'absolute',
          bottom: -35,
          width: cardWidth * 0.9,
          height: 40,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.24) 0%, rgba(15, 23, 42, 0.05) 50%, transparent 75%)',
          filter: 'blur(10px)',
          transform: `scale(${1 - breathe * 0.015})`,
          zIndex: 0,
        }}
      />

      {/* Main Luxury White Studio Card (Large Majestic Box) */}
      <div
        style={{
          position: 'relative',
          width: cardWidth,
          height: cardHeight,
          borderRadius: 36,
          background: '#FFFFFF',
          border: `3.5px solid ${isKohli ? '#0284C7' : '#F59E0B'}`,
          boxShadow: `
            0 35px 85px -15px rgba(15, 23, 42, 0.18),
            0 15px 35px -8px rgba(15, 23, 42, 0.08),
            0 0 0 1px rgba(0, 0, 0, 0.04)
          `,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 1,
        }}
      >
        {/* Dynamic Glass Glint Reflection Effect */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, transparent 40%, rgba(255, 255, 255, 0.55) 50%, transparent 60%)',
            transform: `translateX(${glintTranslate}%)`,
            pointerEvents: 'none',
            zIndex: 25,
          }}
        />

        {/* Top Header: Country Pill Badge */}
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            background: theme.badgeBg,
            padding: '12px 26px',
            borderRadius: 26,
            border: `2px solid ${isKohli ? THEME.kohli.primary : THEME.smith.gold}`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            zIndex: 20,
            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.06)',
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: theme.flagColor,
              boxShadow: `0 0 10px ${theme.flagColor}`,
            }}
          />
          <span
            style={{
              color: THEME.textDark,
              fontSize: 18,
              fontWeight: 900,
              letterSpacing: 2,
              fontFamily: THEME.fontFamily,
            }}
          >
            {isKohli ? 'INDIA 🇮🇳' : 'AUSTRALIA 🇦🇺'}
          </span>
        </div>

        {/* Top Right: Telugu Player Short Tag */}
        <div
          style={{
            position: 'absolute',
            top: 24,
            right: 24,
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '8px 20px',
            borderRadius: 20,
            border: `1.5px solid ${isKohli ? '#BAE6FD' : '#FDE68A'}`,
            color: isKohli ? '#0284C7' : '#D97706',
            fontSize: 18,
            fontWeight: 900,
            zIndex: 20,
            fontFamily: THEME.fontFamily,
          }}
        >
          {theme.name}
        </div>

        {/* Large Prominent Person Portrait Stage */}
        <div
          style={{
            width: '100%',
            height: cardHeight - 140,
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: `radial-gradient(circle at 50% 30%, #FFFFFF 0%, ${isKohli ? '#E0F2FE' : '#FEF3C7'} 75%, #CBD5E1 100%)`,
            position: 'relative',
          }}
        >
          <Img
            src={staticFile(imgPath)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
              filter: 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.2))',
              transform: 'scale(1.03)',
            }}
          />
        </div>

        {/* Player Name & Title Banner (Bold, High Contrast, Large Text) */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '20px 24px 24px 24px',
            background: 'linear-gradient(to top, #FFFFFF 90%, rgba(255, 255, 255, 0.96) 96%, transparent 100%)',
            textAlign: 'center',
            zIndex: 20,
            borderTop: '1px solid rgba(0, 0, 0, 0.05)',
          }}
        >
          <div
            style={{
              color: THEME.textDark,
              fontSize: 38,
              fontWeight: 900,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              lineHeight: 1.1,
              fontFamily: THEME.fontFamily,
            }}
          >
            {theme.engName}
          </div>
          <div
            style={{
              color: isKohli ? THEME.kohli.primary : THEME.smith.gold,
              fontSize: 22,
              fontWeight: 900,
              marginTop: 6,
              letterSpacing: 0.5,
              fontFamily: THEME.fontFamily,
            }}
          >
            {theme.title}
          </div>
        </div>
      </div>
    </div>
  );
};
