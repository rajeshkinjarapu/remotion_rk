import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { THEME, teluguFont } from '../theme';

interface KineticTeluguTitleProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  titleSize?: number;
  subtitleSize?: number;
  delay?: number;
}

export const KineticTeluguTitle: React.FC<KineticTeluguTitleProps> = ({
  title,
  subtitle,
  badge,
  badgeColor = THEME.kohli.primary,
  titleSize = 82,
  subtitleSize = 32,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Realistic smooth spring (Apple-like deceleration, no jerky wobble)
  const spr = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 18, stiffness: 75, mass: 1.1 },
  });

  const translateY = interpolate(spr, [0, 1], [-25, 0]);
  const opacity = Math.min(1, spr * 1.5);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        transform: `translateY(${translateY}px)`,
        opacity,
        margin: '6px 0 18px 0',
        zIndex: 20,
        fontFamily: THEME.fontFamily,
      }}
    >
      {badge && (
        <div
          style={{
            background: '#FFFFFF',
            border: `2.5px solid ${badgeColor}`,
            color: badgeColor,
            padding: '8px 26px',
            borderRadius: 30,
            fontSize: 18,
            fontWeight: 900,
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginBottom: 10,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
            fontFamily: THEME.fontFamily,
          }}
        >
          {badge}
        </div>
      )}

      {/* Massive Bold Telugu Title */}
      <h1
        style={{
          fontFamily: THEME.fontFamily,
          fontSize: titleSize,
          fontWeight: 900,
          color: THEME.textDark,
          margin: 0,
          padding: '0 20px',
          lineHeight: 1.2,
          letterSpacing: -0.5,
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.06)',
        }}
      >
        {title}
      </h1>

      {subtitle && (
        <div
          style={{
            fontFamily: THEME.fontFamily,
            fontSize: subtitleSize,
            fontWeight: 800,
            color: THEME.textMuted,
            marginTop: 8,
            letterSpacing: 0.3,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};
