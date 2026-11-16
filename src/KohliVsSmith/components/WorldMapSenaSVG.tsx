import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { THEME } from '../theme';
import mapData from './worldMapData.json';

interface WorldMapSenaSVGProps {
  activeCountry?: 'all' | 'aus' | 'sa' | 'eng' | 'nz';
  delay?: number;
}

export const WorldMapSenaSVG: React.FC<WorldMapSenaSVGProps> = ({
  activeCountry = 'all',
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 18, stiffness: 75, mass: 1.1 },
  });

  // Radar Pulse waves
  const pulse = (frame % 45) / 45;
  const pulseScale = 1 + pulse * 1.5;
  const pulseOpacity = 1 - pulse;

  // Arc flight path animation progress (cycles smoothly)
  const flightProgress = ((frame * 0.8) % 100) / 100;

  // Nodes for SENA + India
  const nodes = [
    {
      id: 'ind',
      tag: 'IND',
      flag: '🇮🇳',
      name: 'భారత్ (INDIA)',
      sub: 'The Home Base',
      x: 871,
      y: 239,
      color: '#0284C7',
      bg: '#E0F2FE',
      isOrigin: true,
      highlight: true,
    },
    {
      id: 'eng',
      tag: 'ENG',
      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      name: 'ఇంగ్లాండ్ (ENGLAND)',
      sub: 'The Swing Test',
      x: 585,
      y: 113,
      color: '#0284C7',
      bg: '#E0F2FE',
      highlight: activeCountry === 'eng' || activeCountry === 'all',
    },
    {
      id: 'sa',
      tag: 'SA',
      flag: '🇿🇦',
      name: 'సౌతాఫ్రికా (SOUTH AFRICA)',
      sub: 'Pace & Bounce',
      x: 677,
      y: 460,
      color: '#059669',
      bg: '#D1FAE5',
      highlight: activeCountry === 'sa' || activeCountry === 'all',
    },
    {
      id: 'aus',
      tag: 'AUS',
      flag: '🇦🇺',
      name: 'ఆస్ట్రేలియా (AUSTRALIA)',
      sub: 'Fast & Bouncy',
      x: 1073,
      y: 439,
      color: '#D97706',
      bg: '#FEF3C7',
      highlight: activeCountry === 'aus' || activeCountry === 'all',
    },
    {
      id: 'nz',
      tag: 'NZ',
      flag: '🇳🇿',
      name: 'న్యూజిలాండ్ (NEW ZEALAND)',
      sub: 'Green Seamers',
      x: 1223,
      y: 507,
      color: '#1E293B',
      bg: '#F1F5F9',
      highlight: activeCountry === 'nz' || activeCountry === 'all',
    },
  ];

  // Flight curves from India (871, 239) to destination
  const flightArcs = [
    { id: 'eng', d: 'M 871 239 Q 720 120 585 113', color: '#0284C7', active: activeCountry === 'eng' || activeCountry === 'all' },
    { id: 'sa',  d: 'M 871 239 Q 780 380 677 460', color: '#059669', active: activeCountry === 'sa' || activeCountry === 'all' },
    { id: 'aus', d: 'M 871 239 Q 970 320 1073 439', color: '#D97706', active: activeCountry === 'aus' || activeCountry === 'all' },
    { id: 'nz',  d: 'M 871 239 Q 1060 360 1223 507', color: '#1E293B', active: activeCountry === 'nz' || activeCountry === 'all' },
  ];

  return (
    <div
      style={{
        position: 'relative',
        width: 1420,
        height: 570,
        background: '#FFFFFF',
        borderRadius: 32,
        border: '2px solid rgba(15, 23, 42, 0.08)',
        boxShadow: '0 25px 70px -15px rgba(15, 23, 42, 0.14), 0 0 0 1px rgba(0, 0, 0, 0.03)',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: Math.min(1, spr * 1.5),
        transform: `scale(${interpolate(spr, [0, 1], [0.94, 1])})`,
        fontFamily: THEME.fontFamily,
      }}
    >
      {/* Precision Map Coordinates Background Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(15, 23, 42, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15, 23, 42, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      <svg width={1420} height={570} viewBox="0 0 1360 580">
        <defs>
          <radialGradient id="oceanGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="100%" stopColor="#F8FAFC" stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* Global Parallels / Longitude Curves */}
        <ellipse cx="680" cy="290" rx="640" ry="260" fill="none" stroke="#E2E8F0" strokeWidth="1.2" strokeDasharray="6 6" />
        <ellipse cx="680" cy="290" rx="420" ry="170" fill="none" stroke="#E2E8F0" strokeWidth="1.2" strokeDasharray="6 6" />
        <line x1="40" y1="290" x2="1320" y2="290" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4 4" />

        {/* Realistic World Continents (177 Sovereign Nations Polygons) */}
        <path
          d={mapData.otherCountries}
          fill="#E2E8F0"
          stroke="#CBD5E1"
          strokeWidth="0.8"
          style={{ opacity: 0.85 }}
        />

        {/* SENA Countries Individual Realistic Polygons with Custom Highlighting */}
        {/* India */}
        <path
          d={mapData.sena.ind.d}
          fill="#BAE6FD"
          stroke="#0284C7"
          strokeWidth="2"
          style={{ filter: 'drop-shadow(0 2px 8px rgba(2, 132, 199, 0.4))' }}
        />

        {/* England */}
        <path
          d={mapData.sena.eng.d}
          fill={activeCountry === 'eng' || activeCountry === 'all' ? '#BAE6FD' : '#E2E8F0'}
          stroke="#0284C7"
          strokeWidth={activeCountry === 'eng' ? 2.5 : 1.2}
          style={{
            filter: activeCountry === 'eng' ? 'drop-shadow(0 0 10px rgba(2, 132, 199, 0.6))' : 'none',
          }}
        />

        {/* South Africa */}
        <path
          d={mapData.sena.sa.d}
          fill={activeCountry === 'sa' || activeCountry === 'all' ? '#A7F3D0' : '#E2E8F0'}
          stroke="#059669"
          strokeWidth={activeCountry === 'sa' ? 2.5 : 1.2}
          style={{
            filter: activeCountry === 'sa' ? 'drop-shadow(0 0 10px rgba(5, 150, 105, 0.6))' : 'none',
          }}
        />

        {/* Australia */}
        <path
          d={mapData.sena.aus.d}
          fill={activeCountry === 'aus' || activeCountry === 'all' ? '#FDE68A' : '#E2E8F0'}
          stroke="#D97706"
          strokeWidth={activeCountry === 'aus' ? 2.5 : 1.2}
          style={{
            filter: activeCountry === 'aus' ? 'drop-shadow(0 0 12px rgba(217, 119, 6, 0.6))' : 'none',
          }}
        />

        {/* New Zealand */}
        <path
          d={mapData.sena.nz.d}
          fill={activeCountry === 'nz' || activeCountry === 'all' ? '#CBD5E1' : '#E2E8F0'}
          stroke="#1E293B"
          strokeWidth={activeCountry === 'nz' ? 2.5 : 1.2}
          style={{
            filter: activeCountry === 'nz' ? 'drop-shadow(0 0 10px rgba(30, 41, 59, 0.6))' : 'none',
          }}
        />

        {/* Animated Flight Arcs from India to SENA Destinations */}
        {flightArcs.map((arc) => {
          if (!arc.active) return null;
          return (
            <g key={arc.id}>
              {/* Path base line */}
              <path
                d={arc.d}
                fill="none"
                stroke={arc.color}
                strokeWidth={2.5}
                strokeDasharray="6 6"
                strokeDashoffset={-frame * 0.8}
                opacity={0.7}
              />
            </g>
          );
        })}

        {/* SENA Markers, Country Badges and Pulsing Rings */}
        {nodes.map((node) => {
          const isAct = node.highlight;
          const isPrimaryTarget = (activeCountry === 'aus' && (node.id === 'aus' || node.id === 'sa')) ||
                                  (activeCountry === 'eng' && node.id === 'eng') ||
                                  (activeCountry === 'nz' && node.id === 'nz');

          // Position offset for label box
          const labelOffsetY = node.id === 'eng' ? -42 : node.id === 'nz' ? -35 : -35;
          const labelOffsetX = node.id === 'nz' ? -220 : node.id === 'aus' ? -100 : 20;

          return (
            <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
              {/* Pulsing ring on target */}
              {isAct && (
                <circle
                  r={26 * (isPrimaryTarget ? pulseScale : 1)}
                  fill="none"
                  stroke={node.color}
                  strokeWidth={2.5}
                  opacity={isPrimaryTarget ? pulseOpacity : 0.3}
                />
              )}

              {/* Core Dot Marker */}
              <circle
                r={node.isOrigin ? 14 : 11}
                fill={node.color}
                stroke="#FFFFFF"
                strokeWidth={3}
                style={{
                  filter: `drop-shadow(0 4px 12px ${node.color}99)`,
                }}
              />
              <circle r={4} fill="#FFFFFF" />

              {/* Grand Country Detail Badge */}
              {isAct && (
                <g transform={`translate(${labelOffsetX}, ${labelOffsetY})`}>
                  <rect
                    width={230}
                    height={58}
                    rx={16}
                    fill="#FFFFFF"
                    stroke={node.color}
                    strokeWidth={isPrimaryTarget ? 2.5 : 1.5}
                    style={{
                      filter: isPrimaryTarget
                        ? 'drop-shadow(0 12px 28px rgba(15, 23, 42, 0.2))'
                        : 'drop-shadow(0 6px 16px rgba(15, 23, 42, 0.1))',
                    }}
                  />

                  {/* Flag Icon Tag */}
                  <rect
                    x={10}
                    y={10}
                    width={40}
                    height={38}
                    rx={10}
                    fill={node.bg}
                    stroke={node.color}
                    strokeWidth={1.5}
                  />
                  <text
                    x={30}
                    y={35}
                    fontSize={22}
                    textAnchor="middle"
                  >
                    {node.flag}
                  </text>

                  {/* Country Name */}
                  <text
                    x={60}
                    y={28}
                    fill={THEME.textDark}
                    fontSize={14}
                    fontWeight={900}
                    fontFamily={THEME.fontFamily}
                  >
                    {node.name}
                  </text>

                  {/* Condition Subtitle */}
                  <text
                    x={60}
                    y={46}
                    fill={node.color}
                    fontSize={12}
                    fontWeight={800}
                    fontFamily={THEME.fontFamily}
                  >
                    {node.sub}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
