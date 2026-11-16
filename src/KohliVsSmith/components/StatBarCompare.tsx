import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { THEME } from '../theme';

interface StatBarCompareProps {
  label: string;
  subLabel?: string;
  valKohli: number;
  valSmith: number;
  format?: (v: number) => string;
  maxVal?: number;
  delay?: number;
  showWinner?: boolean;
}

export const StatBarCompare: React.FC<StatBarCompareProps> = ({
  label,
  subLabel,
  valKohli,
  valSmith,
  format = (v) => Math.round(v).toString(),
  maxVal,
  delay = 0,
  showWinner = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const effectiveFrame = Math.max(0, frame - delay);
  // Realistic physical spring
  const spr = spring({
    frame: effectiveFrame,
    fps,
    config: { damping: 18, stiffness: 80, mass: 1.1 },
  });

  const max = maxVal || Math.max(valKohli, valSmith) * 1.15;
  const currentKohli = interpolate(spr, [0, 1], [0, valKohli]);
  const currentSmith = interpolate(spr, [0, 1], [0, valSmith]);

  const pctKohli = Math.min(100, (currentKohli / max) * 100);
  const pctSmith = Math.min(100, (currentSmith / max) * 100);

  const kohliWins = valKohli > valSmith;
  const smithWins = valSmith > valKohli;

  return (
    <div
      style={{
        width: '100%',
        margin: '10px 0',
        padding: '16px 26px',
        background: '#FFFFFF',
        borderRadius: 22,
        border: '1.5px solid rgba(15, 23, 42, 0.08)',
        boxShadow: '0 10px 30px -6px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
        opacity: Math.min(1, spr * 1.5),
        transform: `translateY(${(1 - spr) * 20}px)`,
        fontFamily: THEME.fontFamily,
      }}
    >
      {/* Title & Massive Number Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        {/* Left: Kohli Big Number */}
        <div style={{ width: 200, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              color: THEME.kohli.primary,
              fontSize: 50,
              fontWeight: 900,
              fontFamily: THEME.fontFamily,
              letterSpacing: -1,
              lineHeight: 1,
            }}
          >
            {format(currentKohli)}
          </span>
          {kohliWins && showWinner && (
            <span
              style={{
                fontSize: 22,
                background: '#E0F2FE',
                borderRadius: '50%',
                padding: '3px 8px',
                border: '1.5px solid #0284C7',
                boxShadow: '0 4px 10px rgba(2, 132, 199, 0.25)',
              }}
            >
              👑
            </span>
          )}
        </div>

        {/* Center: Large Label */}
        <div style={{ flex: 1, textAlign: 'center', padding: '0 10px' }}>
          <div
            style={{
              color: THEME.textDark,
              fontSize: 25,
              fontWeight: 900,
              letterSpacing: 0.3,
              fontFamily: THEME.fontFamily,
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </div>
          {subLabel && (
            <div
              style={{
                color: THEME.textSubtle,
                fontSize: 15,
                fontWeight: 700,
                marginTop: 2,
                fontFamily: THEME.fontFamily,
              }}
            >
              {subLabel}
            </div>
          )}
        </div>

        {/* Right: Smith Big Number */}
        <div style={{ width: 200, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
          {smithWins && showWinner && (
            <span
              style={{
                fontSize: 22,
                background: '#FEF3C7',
                borderRadius: '50%',
                padding: '3px 8px',
                border: '1.5px solid #F59E0B',
                boxShadow: '0 4px 10px rgba(217, 119, 6, 0.25)',
              }}
            >
              👑
            </span>
          )}
          <span
            style={{
              color: THEME.smith.gold,
              fontSize: 50,
              fontWeight: 900,
              fontFamily: THEME.fontFamily,
              letterSpacing: -1,
              lineHeight: 1,
            }}
          >
            {format(currentSmith)}
          </span>
        </div>
      </div>

      {/* Realistic Fluid Dual Progress Bars */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          height: 20,
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Kohli Left Track */}
        <div
          style={{
            flex: 1,
            height: '100%',
            background: '#F1F5F9',
            borderRadius: 10,
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'flex-end',
            border: '1px solid rgba(0, 0, 0, 0.05)',
          }}
        >
          <div
            style={{
              width: `${pctKohli}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #38BDF8, #0284C7)',
              borderRadius: 10,
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)',
            }}
          />
        </div>

        {/* Center Minimal Dot */}
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#0F172A',
            flexShrink: 0,
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
          }}
        />

        {/* Smith Right Track */}
        <div
          style={{
            flex: 1,
            height: '100%',
            background: '#F1F5F9',
            borderRadius: 10,
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'flex-start',
            border: '1px solid rgba(0, 0, 0, 0.05)',
          }}
        >
          <div
            style={{
              width: `${pctSmith}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #F59E0B, #D97706)',
              borderRadius: 10,
              boxShadow: '0 2px 8px rgba(217, 119, 6, 0.3)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
