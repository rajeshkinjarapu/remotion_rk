import { loadFont } from '@remotion/google-fonts/AnekTelugu';

export const { fontFamily: teluguFont } = loadFont();

export const THEME = {
  // Pure Luxury White Studio Background
  bg: '#FFFFFF',
  bgGradient: 'radial-gradient(circle at 50% 15%, #FFFFFF 0%, #F8FAFC 55%, #EDF2F7 100%)',
  
  // Font
  fontFamily: `${teluguFont}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
  
  // Cards & Surfaces
  cardBg: '#FFFFFF',
  cardBgGlass: 'rgba(255, 255, 255, 0.95)',
  cardBorder: 'rgba(15, 23, 42, 0.08)',
  cardShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.12), 0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04)',
  cardShadowHover: '0 35px 80px -20px rgba(0, 0, 0, 0.2), 0 15px 35px -5px rgba(0, 0, 0, 0.1)',

  // Deep High-Contrast Typography
  textDark: '#0F172A',     // Slate 900
  textMuted: '#334155',    // Slate 700
  textSubtle: '#64748B',   // Slate 500
  textWhite: '#FFFFFF',

  // Kohli (Royal Navy & Fire Saffron)
  kohli: {
    primary: '#0369A1',    // Ocean/India Blue
    darkNavy: '#0F2C59',   // Deep Indian Navy
    accent: '#EA580C',     // Indian Saffron / Fire
    badgeBg: '#E0F2FE',    // Soft Blue Pill
    glow: 'rgba(3, 105, 161, 0.25)',
    cardBorder: '#0284C7',
    name: 'విరాట్ కోహ్లీ',
    engName: 'VIRAT KOHLI',
    title: 'THE KING 👑',
    tag: 'IND',
    flagColor: '#FF9933',
  },

  // Smith (Aussie Baggy Green & Rich Gold)
  smith: {
    primary: '#046A38',    // Aussie Baggy Green
    gold: '#D97706',       // Rich Warm Gold
    darkGreen: '#034123',  // Deep Aussie Forest
    badgeBg: '#FEF3C7',    // Soft Gold Pill
    glow: 'rgba(217, 119, 6, 0.25)',
    cardBorder: '#F59E0B',
    name: 'స్టీవ్ స్మిత్',
    engName: 'STEVE SMITH',
    title: 'THE RUN MACHINE 🛡️',
    tag: 'AUS',
    flagColor: '#FFD700',
  },

  // SENA Countries (Clean High-Contrast Palette)
  sena: {
    aus: { code: 'AUS', name: 'ఆస్ట్రేలియా', color: '#D97706', bg: '#FFFBEB' },
    sa:  { code: 'SA',  name: 'సౌతాఫ్రికా', color: '#059669', bg: '#ECFDF5' },
    eng: { code: 'ENG', name: 'ఇంగ్లాండ్',   color: '#0284C7', bg: '#F0F9FF' },
    nz:  { code: 'NZ',  name: 'న్యూజిలాండ్', color: '#1E293B', bg: '#F8FAFC' },
  }
};
