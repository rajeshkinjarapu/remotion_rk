import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { THEME } from '../theme';

interface SpiderRadarChartProps {
  delay?: number;
  size?: number;
}

export const SpiderRadarChart: React.FC<SpiderRadarChartProps> = ({
  delay = 0,
  size = 520,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 18, stiffness: 75, mass: 1.1 },
  });

  const center = size / 2;
  const radius = size * 0.36;

  // 5 Axes definitions
  const axes = [
    { label: 'రన్స్ & సెంచరీలు (Pure Stats)', angle: -90, kohli: 8.5, smith: 10.0 },
    { label: 'SENA కన్సిస్టెన్సీ (Away Dominance)', angle: -18, kohli: 8.5, smith: 9.8 },
    { label: 'ఓపిక & డిఫెన్స్ (Patience)', angle: 54, kohli: 8.5, smith: 10.0 },
    { label: 'అగ్రెషన్ & కౌంటర్-ఎటాక్', angle: 126, kohli: 10.0, smith: 7.0 },
    { label: 'ప్రెషర్ లో మ్యాచ్ విన్నింగ్', angle: 198, kohli: 9.8, smith: 9.2 },
  ];

  const getCoordinates = (angleDeg: number, val: number, maxVal = 10) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const r = (val / maxVal) * radius * spr;
    const x = center + r * Math.cos(angleRad);
    const y = center + r * Math.sin(angleRad);
    return { x, y };
  };

  const getAxisEnd = (angleDeg: number) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const x = center + radius * Math.cos(angleRad);
    const y = center + radius * Math.sin(angleRad);
    return { x, y };
  };

  const kohliPoints = axes
    .map((a) => {
      const { x, y } = getCoordinates(a.angle, a.kohli);
      return `${x},${y}`;
    })
    .join(' ');

  const smithPoints = axes
    .map((a) => {
      const { x, y } = getCoordinates(a.angle, a.smith);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <svg width={size} height={size} style={{ overflow: 'visible' }}>
        {/* Background Concentric Webs */}
        {[0.2, 0.4, 0.6, 0.8, 1.0].map((step, idx) => {
          const webPoints = axes
            .map((a) => {
              const angleRad = (a.angle * Math.PI) / 180;
              const r = radius * step;
              const x = center + r * Math.cos(angleRad);
              const y = center + r * Math.sin(angleRad);
              return `${x},${y}`;
            })
            .join(' ');
          return (
            <polygon
              key={idx}
              points={webPoints}
              fill={idx % 2 === 0 ? '#F8FAFC' : '#FFFFFF'}
              stroke="#CBD5E1"
              strokeWidth={1.5}
            />
          );
        })}

        {/* Axis Spokes */}
        {axes.map((a, idx) => {
          const end = getAxisEnd(a.angle);
          return (
            <line
              key={idx}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke="#94A3B8"
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Smith Polygon (Gold/Amber) */}
        <polygon
          points={smithPoints}
          fill="rgba(217, 119, 6, 0.25)"
          stroke="#D97706"
          strokeWidth={3.5}
          style={{ filter: 'drop-shadow(0 4px 12px rgba(217, 119, 6, 0.3))' }}
        />

        {/* Kohli Polygon (Ocean/India Blue) */}
        <polygon
          points={kohliPoints}
          fill="rgba(2, 132, 199, 0.25)"
          stroke="#0284C7"
          strokeWidth={3.5}
          style={{ filter: 'drop-shadow(0 4px 12px rgba(2, 132, 199, 0.3))' }}
        />

        {/* Axis Label Text Nodes (Dark, Large, Bold) */}
        {axes.map((a, idx) => {
          const angleRad = (a.angle * Math.PI) / 180;
          const labelDist = radius + 46;
          const x = center + labelDist * Math.cos(angleRad);
          const y = center + labelDist * Math.sin(angleRad);

          return (
            <text
              key={idx}
              x={x}
              y={y}
              fill="#0F172A"
              fontSize={18}
              fontWeight={900}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontFamily: THEME.fontFamily,
              }}
            >
              {a.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};
