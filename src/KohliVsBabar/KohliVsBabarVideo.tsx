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
import { loadFont as loadAnek } from '@remotion/google-fonts/AnekTelugu';
import chapterTimingsData from './chapter_timings.json';

const { fontFamily: fontAnek } = loadAnek();

export interface ChapterTiming {
  id: number;
  file: string;
  dur_sec: number;
  frames: number;
}

export const CHAPTER_TIMINGS: ChapterTiming[] = chapterTimingsData;

// ============================================================================
// VIRAT KOHLI (#18) vs BABAR AZAM (#56) — 15-MINUTE ANALYSIS (900s · 27,000f)
// 16:9 (1920x1080) · 30 FPS · 6 Acts · 36 Voice-Synced Chapters (Telugu)
// ============================================================================

// ============================================================================
// 1. ASSET PATHS (Place PNGs in public/images/kohli_vs_babar/ if available)
//    Zero-crash fallback: Missing images automatically render crisp jersey
//    numbers (#18 / #56), initials, country badges, and custom vector icons.
// ============================================================================
const IMG = (p: string) => staticFile(`images/kohli_vs_babar/${p}`);

export const PLAYER_IMAGES = {
  kohli: IMG('virat_kohli_18.png'),     // transparent PNG, India blue jersey #18
  babar: IMG('babar_azam_56.png'),      // transparent PNG, Pakistan green jersey #56
  kohliTest: IMG('virat_test.png'),     // optional white Test jersey cutout
  babarTest: IMG('babar_test.png'),     // optional white Test jersey cutout
};

export const MASTER_VO = 'audio/kohli_vs_babar/master_complete_audio.mp3';
export const BG_MUSIC = 'audio/kohli_vs_babar/cinematic_sports_bed.mp3';

// ============================================================================
// 2. CINEMATIC BROADCAST COLOR PALETTE
// ============================================================================
const C = {
  bgDark: '#050914',
  bgCard: 'rgba(13, 21, 42, 0.88)',
  bgCardSolid: '#0D152A',
  lineDark: 'rgba(255, 255, 255, 0.12)',
  testBg: '#F8FAFC',
  testCard: '#FFFFFF',
  testLine: 'rgba(15, 23, 42, 0.10)',
  white: '#FFFFFF',
  ink: '#0F172A',
  muted: '#94A3B8',
  mutedDark: '#475569',
  // Team Colors (from Visual Cues)
  kohliBlue: '#0055FF',
  kohliGlow: '#38BDF8',
  kohliSoft: 'rgba(0, 85, 255, 0.18)',
  babarGreen: '#00A651',
  babarGlow: '#34D399',
  babarSoft: 'rgba(0, 166, 81, 0.18)',
  // Accents
  gold: '#F59E0B',
  goldLight: '#FDE047',
  crimson: '#DC2626',
  neonCyan: '#06B6D4',
  neonPurple: '#A855F7',
};

type Who = 'kohli' | 'babar';

const PLAYERS = {
  kohli: {
    main: C.kohliBlue,
    glow: C.kohliGlow,
    soft: C.kohliSoft,
    name: 'విరాట్ కోహ్లీ',
    short: 'కోహ్లీ',
    en: 'VIRAT KOHLI',
    jersey: '#18',
    team: 'INDIA',
    flag: '🇮🇳',
    img: PLAYER_IMAGES.kohli,
    ini: 'VK',
  },
  babar: {
    main: C.babarGreen,
    glow: C.babarGlow,
    soft: C.babarSoft,
    name: 'బాబర్ ఆజం',
    short: 'బాబర్',
    en: 'BABAR AZAM',
    jersey: '#56',
    team: 'PAKISTAN',
    flag: '🇵🇰',
    img: PLAYER_IMAGES.babar,
    ini: 'BA',
  },
};

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const fill = (a: number, b: number, f: number) => interpolate(f, [a, b], [0, 1], clamp);

const darkCard: React.CSSProperties = {
  background: C.bgCard,
  border: `2px solid ${C.lineDark}`,
  borderRadius: 32,
  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.55)',
  backdropFilter: 'blur(12px)',
};

const lightCard: React.CSSProperties = {
  background: C.testCard,
  border: `2px solid ${C.testLine}`,
  borderRadius: 32,
  boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)',
};

// ============================================================================
// 3. 6 ACTS (Exact timestamps matching the 15:00 script)
// ============================================================================
const ACTS = [
  { key: 'CH 1 · HOOK', te: 'ది హుక్ & డిబేట్', time: '00:00 – 01:45' },
  { key: 'CH 2 · TESTS', te: 'టెస్ట్ క్రికెట్ పరీక్ష', time: '01:45 – 04:45' },
  { key: 'CH 3 · ODIS', te: 'వన్డే సామ్రాజ్యం', time: '04:45 – 08:00' },
  { key: 'CH 4 · T20IS', te: 'టీ20 ఇంటర్నేషనల్స్', time: '08:00 – 10:30' },
  { key: 'CH 5 · SENA', te: 'విదేశీ & SENA రికార్డు', time: '10:30 – 13:30' },
  { key: 'CH 6 · VERDICT', te: 'తుది తీర్పు & ముగింపు', time: '13:30 – 15:00' },
];

// ============================================================================
// 4. MASTER DATA & CHAPTER DEFINITIONS (36 Chapters = 900s Exact)
// ============================================================================
export type Ch = {
  id: number;
  act: number;
  sec: number;
  title: string;
  type: string;
  theme?: 'dark' | 'test' | 'neon';
  [k: string]: any;
};

export const CHAPTERS: Ch[] = [
  // ───────────── ACT 1: THE HOOK & THE DEBATE (00:00 – 01:45 = 105s) ─────────────
  {
    id: 1, act: 1, sec: 18, title: 'కవర్ డ్రైవ్ కింగ్స్ – అతిపెద్ద చర్చ', type: 'heroClash',
    kicker: 'COVER DRIVE KINGS',
    headline: '86 vs 32 CENTURIES',
    subTag: 'REALITY CHECK',
    teQuestion: 'ఆధునిక క్రికెట్ చక్రవర్తి కోహ్లీకి, బాబర్ ఆజం నిజంగానే పోటీ ఇవ్వగలడా?',
  },
  {
    id: 2, act: 1, sec: 16, title: 'ది రన్ మెషీన్ – విరాట్ కోహ్లీ (#18)', type: 'spotlight', who: 'kohli',
    eyebrow: '17+ YEARS OF DOMINANCE',
    heroTitle: 'విరాట్ కోహ్లీ – ది రన్ మెషీన్',
    items: [
      { t: 'పదిహేడేళ్లకు పైగా ప్రపంచ మైదానాలపై ఆధిపత్యం', ok: true },
      { t: '86 అంతర్జాతీయ సెంచరీలు (30 Test + 55 ODI + 1 T20I)', ok: true },
      { t: '28,613 అంతర్జాతీయ పరుగుల మహా సామ్రాజ్యం', ok: true },
    ],
  },
  {
    id: 3, act: 1, sec: 16, title: 'పాకిస్థాన్ బ్యాటింగ్ వెన్నెముక – బాబర్ ఆజం (#56)', type: 'spotlight', who: 'babar',
    eyebrow: 'PAKISTAN BATTING BACKBONE',
    heroTitle: 'బాబర్ ఆజం – క్లాసిక్ కవర్ డ్రైవ్',
    items: [
      { t: 'క్లాసిక్ కవర్ డ్రైవ్‌లతో పాకిస్థాన్ క్రికెట్‌కు కొత్త ఆశలు', ok: true },
      { t: '32 అంతర్జాతీయ సెంచరీలు (9 Test + 20 ODI + 3 T20I)', ok: true },
      { t: 'వైట్-బాల్ క్రికెట్‌లో నిలకడైన ప్రదర్శన', ok: true },
    ],
  },
  {
    id: 4, act: 1, sec: 18, title: 'అభిమానుల అంచనాలు vs అసలైన గణాంకాలు', type: 'faceoff',
    leftNote: 'జెర్సీ #18 · ది రన్ మెషీన్',
    rightNote: 'జెర్సీ #56 · క్లాసిక్ స్టైల్',
    centerTitle: 'నంబర్ 3 పొజిషన్ ఆధిపత్యం',
    items: [
      'ఇద్దరి బ్యాటింగ్ స్టైల్ & కవర్ డ్రైవ్ చూడటానికి ఒకేలా ఉంటాయి',
      'ఇద్దరూ తమ జట్లలో నంబర్ 3 పొజిషన్‌ను శాసించిన వాళ్లే',
      'కానీ అంచనాలకు, ప్యూర్ డేటాకు మధ్య అసలైన తేడా ఎంత?',
    ],
  },
  {
    id: 5, act: 1, sec: 20, title: 'ప్యూర్ డేటా కంపారిజన్ రోడ్‌మ్యాప్', type: 'chips', cols: 4,
    heroTitle: 'నేడు మనం విశ్లేషించబోయే 4 ప్రమాణాలు',
    tiles: [
      { big: 'TEST', t: 'టెస్ట్ క్రికెట్', sub: 'అసలైన పునాది' },
      { big: 'ODI', t: 'వన్డే క్రికెట్', sub: 'కింగ్స్ టెరిటరీ' },
      { big: 'T20I', t: 'టీ20 ఫార్మాట్', sub: 'సగటు vs స్ట్రైక్ రేట్' },
      { big: 'SENA', t: 'విదేశీ పిచ్‌లు', sub: 'SA · ENG · NZ · AUS' },
    ],
  },
  {
    id: 6, act: 1, sec: 17, title: 'అసలైన కింగ్ ఎవరో తేల్చే SENA పరీక్ష', type: 'quote', sides: ['kohli', 'babar'],
    sub: 'PURE DATA · NO BIAS',
    text: 'విదేశీ గడ్డపై గణాంకాలు చూస్తే అసలైన కింగ్ ఎవరో మీకే అర్థమవుతుంది!',
    size: 74,
  },

  // ───────────── ACT 2: TEST CRICKET — THE ULTIMATE ACID TEST (01:45 – 04:45 = 180s) ─────────────
  {
    id: 7, act: 2, sec: 20, title: 'టెస్ట్ క్రికెట్ – అసలైన యాసిడ్ టెస్ట్', type: 'testIntro', theme: 'test',
    eyebrow: 'THE ULTIMATE ACID TEST',
    heroTitle: 'టెస్ట్ క్రికెట్ పోలిక',
    sub: 'ఐదు రోజుల పాటు సహనాన్ని, టెక్నిక్‌ను, మానసిక దృఢత్వాన్ని పరీక్షించే ఫార్మాట్',
    badges: ['123 vs 67 మ్యాచ్‌లు', '9,230 vs 4,821 రన్స్', '30 vs 9 సెంచరీలు'],
  },
  {
    id: 8, act: 2, sec: 26, title: 'విరాట్ కోహ్లీ టెస్ట్ రికార్డు & 7 డబుల్ సెంచరీలు', type: 'testPlayer', theme: 'test', who: 'kohli',
    badge: '2025లో టెస్ట్ క్రికెట్‌కు వీడ్కోలు · భారత చరిత్రలో అరుదైన రికార్డు',
    stats: [
      { label: 'మ్యాచ్‌లు', val: 123, dec: 0 },
      { label: 'మొత్తం పరుగులు', val: 9230, dec: 0 },
      { label: 'బ్యాటింగ్ సగటు', val: 46.85, dec: 2 },
      { label: 'సెంచరీలు', val: 30, dec: 0 },
    ],
    highlight: '7 డబుల్ సెంచరీలు (200s) — భారత క్రికెట్ చరిత్రలోనే అత్యధికం!',
  },
  {
    id: 9, act: 2, sec: 24, title: 'బాబర్ ఆజం టెస్ట్ గణాంకాలు (67 మ్యాచ్‌లు)', type: 'testPlayer', theme: 'test', who: 'babar',
    badge: 'టెస్ట్ ఫార్మాట్‌లో నిలకడైన ఆరంభం — కానీ భారీ సెంచరీల కొరత',
    stats: [
      { label: 'మ్యాచ్‌లు', val: 67, dec: 0 },
      { label: 'మొత్తం పరుగులు', val: 4821, dec: 0 },
      { label: 'బ్యాటింగ్ సగటు', val: 43.04, dec: 2 },
      { label: 'సెంచరీలు', val: 9, dec: 0 },
    ],
    highlight: '35 హాఫ్ సెంచరీలు ఉన్నాయి — కానీ 9 మాత్రమే సెంచరీలుగా మారాయి!',
  },
  {
    id: 10, act: 2, sec: 30, title: 'టెస్ట్ బ్యాటింగ్ హెడ్-టు-హెడ్ బార్ చార్ట్', type: 'testBars', theme: 'test',
    metrics: [
      { label: 'మ్యాచ్‌లు (Matches)', k: 123, b: 67, max: 140, dec: 0 },
      { label: 'పరుగులు (Runs)', k: 9230, b: 4821, max: 10000, dec: 0 },
      { label: 'సగటు (Average)', k: 46.85, b: 43.04, max: 60, dec: 2 },
      { label: 'సెంచరీలు (100s)', k: 30, b: 9, max: 35, dec: 0 },
    ],
  },
  {
    id: 11, act: 2, sec: 28, title: '2022 డిసెంబర్ తర్వాత బాబర్ టెస్ట్ సెంచరీ కరువు', type: 'drought', theme: 'test',
    heroTitle: '2022 డిసెంబర్ తర్వాత టెస్ట్ సెంచరీలు: 0',
    leftCard: { yr: '2022 వరకు', title: 'వేగవంతమైన ఆరంభం', desc: '9 టెస్ట్ సెంచరీలతో దూసుకెళ్లిన బాబర్ కెరీర్', tone: C.babarGreen },
    rightCard: { yr: 'డిసెంబర్ 2022 తర్వాత', title: 'ఒక్క సెంచరీ కూడా లేదు!', desc: '35 హాఫ్ సెంచరీలు ఉన్నా, వాటిని భారీ సెంచరీలుగా మలచడంలో వెనుకబాటు', tone: C.crimson },
  },
  {
    id: 12, act: 2, sec: 28, title: 'సెంచరీ కన్వర్షన్ రేట్: ప్రతి 7 vs 13.6 ఇన్నింగ్స్', type: 'conversion', theme: 'test',
    heroTitle: 'సెంచరీ కన్వర్షన్ రేట్ పోలిక',
    kohliRate: 7.0,
    babarRate: 13.6,
    foot: 'కోహ్లీ దాదాపు ప్రతి 7 ఇన్నింగ్స్‌కు ఒక సెంచరీ చేస్తే, బాబర్ ప్రతి 13.6 ఇన్నింగ్స్‌కు ఒక సెంచరీ చేశాడు',
  },
  {
    id: 13, act: 2, sec: 24, title: 'టెస్ట్ క్రికెట్ తీర్పు – కోహ్లీ స్పష్టమైన ఆధిపత్యం', type: 'quote', sides: ['kohli', null],
    sub: 'CHAPTER 2 VERDICT · TEST CRICKET',
    text: 'అనుభవం, సెంచరీల కన్వర్షన్ రేట్ & 7 డబుల్ సెంచరీలతో విరాట్ కోహ్లీ చాలా ముందున్నాడు!',
    size: 72,
  },

  // ───────────── ACT 3: ODI CRICKET — THE KING\'S TERRITORY (04:45 – 08:00 = 195s) ─────────────
  {
    id: 14, act: 3, sec: 22, title: 'వన్డే క్రికెట్ – రారాజు కోహ్లీ సామ్రాజ్యం', type: 'bigMilestone', who: 'kohli',
    eyebrow: 'ODI CRICKET · THE KING’S TERRITORY',
    label: '2026 నాటికి విరాట్ కోహ్లీ వన్డే సెంచరీలు (సచిన్ 49 రికార్డు బ్రేక్)',
    from: 49,
    value: 55,
    chips: ['322 మ్యాచ్‌లు', '15,195 పరుగులు', '58.22 యావరేజ్', '94.50 స్ట్రైక్ రేట్'],
  },
  {
    id: 15, act: 3, sec: 28, title: '8,000 నుంచి 15,000 ODI రన్స్ – ఫాస్టెస్ట్ మైలురాళ్లు', type: 'odiRace',
    heroTitle: '8,000 → 15,000 ODI పరుగుల మైలురాయి రేస్',
    milestones: ['8K', '9K', '10K', '11K', '12K', '13K', '14K', '15K'],
    note: '8,000 నుంచి 15,000 పరుగుల వరకు ప్రతి మైలురాయిని అత్యంత వేగంగా చేరుకున్న బ్యాటర్ విరాట్ కోహ్లీ!',
  },
  {
    id: 16, act: 3, sec: 26, title: 'బాబర్ ఆజం వన్డే రికార్డు – అత్యంత బలమైన ఫార్మాట్', type: 'spotlight', who: 'babar',
    eyebrow: 'BABAR’S STRONGEST FORMAT',
    heroTitle: 'బాబర్ ఆజం ODI గణాంకాలు',
    items: [
      { t: '148 మ్యాచ్‌లలో 6,744 పరుగులు — అద్భుతమైన 52.27 సగటు', ok: true },
      { t: '20 వన్డే సెంచరీలు మరియు 38 హాఫ్ సెంచరీలు', ok: true },
      { t: 'అత్యంత వేగంగా 5,000 ODI పరుగులు పూర్తి చేసి కోహ్లీ రికార్డును అధిగమించాడు', ok: true },
    ],
  },
  {
    id: 17, act: 3, sec: 30, title: 'ODI హెడ్-టు-హెడ్: కోహ్లీ vs బాబర్', type: 'compareBars',
    heroTitle: 'వన్డే క్రికెట్ పూర్తి గణాంకాల పోలిక',
    rows: [
      { label: 'మ్యాచ్‌లు', k: 322, b: 148, max: 350, dec: 0 },
      { label: 'పరుగులు', k: 15195, b: 6744, max: 16000, dec: 0 },
      { label: 'యావరేజ్', k: 58.22, b: 52.27, max: 65, dec: 2 },
      { label: 'సెంచరీలు', k: 55, b: 20, max: 60, dec: 0 },
      { label: 'స్ట్రైక్ రేట్', k: 94.5, b: 88.0, max: 110, dec: 2 },
    ],
  },
  {
    id: 18, act: 3, sec: 30, title: 'అసలైన తేడా #1: ది ఛేజ్ మాస్టర్ (25+ ఛేజింగ్ 100s)', type: 'bigMilestone', who: 'kohli',
    eyebrow: 'THE UNDISPUTED CHASE MASTER',
    label: 'లక్ష్య ఛేదనలో (Run Chases) విరాట్ కోహ్లీ సెంచరీలు',
    value: 25,
    suffix: '+',
    chips: ['ప్రపంచంలోనే నంబర్ 1 ఛేజ్ మాస్టర్', 'ఒత్తిడి పెరిగే కొద్దీ మరింత ప్రమాదకరం'],
  },
  {
    id: 19, act: 3, sec: 30, title: 'అసలైన తేడా #2: స్ట్రైక్ రేట్ & మ్యాచ్ ఇంపాక్ట్', type: 'duelCard',
    heroTitle: 'స్ట్రైక్ రేట్ & గేమ్ పేస్ వ్యత్యాసం',
    left: { who: 'kohli', big: '94.50', label: 'ODI స్ట్రైక్ రేట్', sub: 'ఆధునిక వన్డే వేగానికి సరిపోయే దూకుడు' },
    right: { who: 'babar', big: '88.00', label: 'ODI స్ట్రైక్ రేట్', sub: 'మిడిల్ ఓవర్లలో నెమ్మదించే ఇన్నింగ్స్ పేస్' },
    foot: '6.50 స్ట్రైక్ రేట్ వ్యత్యాసం భారీ లక్ష్యాలలో నిర్ణయాత్మక పాత్ర పోషిస్తుంది',
  },
  {
    id: 20, act: 3, sec: 29, title: 'వన్డే తీర్పు: వరల్డ్ క్లాస్ vs వేరే గ్రహం రికార్డులు', type: 'quote', sides: ['kohli', 'babar'],
    sub: 'CHAPTER 3 VERDICT · ODI CRICKET',
    text: 'బాబర్ వరల్డ్ క్లాస్ బ్యాటర్ అనడంలో సందేహం లేదు — కానీ కోహ్లీ వన్డే రికార్డులు వేరే గ్రహానికి చెందినవి!',
    size: 70,
  },

  // ───────────── ACT 4: T20 INTERNATIONALS — CONSISTENCY VS STRIKE RATE (08:00 – 10:30 = 150s) ─────────────
  {
    id: 21, act: 4, sec: 24, title: 'T20 ఇంటర్నేషనల్స్ – గట్టి పోటీ ఫార్మాట్', type: 't20Board', theme: 'neon',
    heroTitle: 'T20I స్కోర్‌బోర్డ్: కోహ్లీ vs బాబర్',
    kStats: { m: 125, r: 4188, avg: 48.7, sr: 137.04, h: 1, f: 38 },
    bStats: { m: 145, r: 4596, avg: 38.94, sr: 129.0, h: 3, f: 39 },
  },
  {
    id: 22, act: 4, sec: 26, title: '2024 T20 వరల్డ్ కప్ విజేతగా కోహ్లీ రిటైర్మెంట్', type: 'spotlight', who: 'kohli', theme: 'neon',
    eyebrow: '2024 T20 WORLD CUP CHAMPION',
    heroTitle: 'విరాట్ కోహ్లీ T20I కెరీర్ ముగింపు',
    items: [
      { t: '2024 T20 వరల్డ్ కప్ గెలిచిన తర్వాత ఘనంగా వీడ్కోలు', ok: true },
      { t: '125 మ్యాచ్‌లలో 4,188 రన్స్ · 48.70 అద్భుత సగటు', ok: true },
      { t: '137.04 స్ట్రైక్ రేట్‌తో 1 సెంచరీ, 38 హాఫ్ సెంచరీలు', ok: true },
    ],
  },
  {
    id: 23, act: 4, sec: 26, title: 'మొత్తం పరుగులు & సెంచరీలలో బాబర్ ఆధిక్యం', type: 'spotlight', who: 'babar', theme: 'neon',
    eyebrow: 'ALL-TIME T20I RUNS & 50s LEADER',
    heroTitle: '2026 వరకు ఆడుతూ బాబర్ సాధించిన రికార్డులు',
    items: [
      { t: '145 మ్యాచ్‌లలో 4,596 పరుగులతో కోహ్లీ రికార్డు దాటేశాడు', ok: true },
      { t: '39 హాఫ్ సెంచరీలు — T20I చరిత్రలో అత్యధిక 50+ స్కోర్లు', ok: true },
      { t: 'T20 అంతర్జాతీయ క్రికెట్‌లో 3 సెంచరీలు (కోహ్లీ 1)', ok: true },
    ],
  },
  {
    id: 24, act: 4, sec: 26, title: 'ట్విస్ట్: యావరేజ్ (+9.76) & స్ట్రైక్ రేట్ (+8.04) లో కోహ్లీ కింగ్', type: 'duelCard', theme: 'neon',
    heroTitle: 'అసలైన T20 ట్విస్ట్: యావరేజ్ & స్ట్రైక్ రేట్',
    left: { who: 'kohli', big: '48.70 | 137.04', label: 'యావరేజ్ | స్ట్రైక్ రేట్', sub: 'దాదాపు 10 పరుగుల ఎక్కువ యావరేజ్!' },
    right: { who: 'babar', big: '38.94 | ~129', label: 'యావరేజ్ | స్ట్రైక్ రేట్', sub: 'ఎక్కువ మ్యాచ్‌లు ఆడినా తక్కువ యావరేజ్' },
    foot: 'మొత్తం పరుగుల్లో బాబర్ ముందున్నా, ఎఫిషియెన్సీలో కోహ్లీ చాలా ముందున్నాడు',
  },
  {
    id: 25, act: 4, sec: 24, title: 'మెల్‌బోర్న్ 82* – వరల్డ్ కప్ నాకౌట్ ఇంపాక్ట్', type: 'bigMilestone', who: 'kohli', theme: 'neon',
    eyebrow: 'BIG MATCH TEMPERAMENT · MCG CLASSIC',
    label: 'మెల్‌బోర్న్ చారిత్రాత్మక ఛేజింగ్ ఇన్నింగ్స్',
    value: 82,
    suffix: '*',
    chips: ['T20 వరల్డ్ కప్ నాకౌట్ మ్యాచ్‌లు', 'ఒత్తిడిలో సాటిలేని ఇంపాక్ట్'],
  },
  {
    id: 26, act: 4, sec: 24, title: 'T20I తీర్పు: వాల్యూమ్ vs క్లచ్ ఇంపాక్ట్', type: 'quote', sides: ['kohli', 'babar'], theme: 'neon',
    sub: 'CHAPTER 4 VERDICT · T20 INTERNATIONALS',
    text: 'పరుగులు, సెంచరీల సంఖ్యలో బాబర్ ముందున్నా — వరల్డ్ కప్ నాకౌట్ ఇంపాక్ట్‌లో కోహ్లీ సాటిలేనిది!',
    size: 68,
  },

  // ───────────── ACT 5: THE REAL TEST — SENA COUNTRIES RECORD (10:30 – 13:30 = 180s) ─────────────
  {
    id: 27, act: 5, sec: 24, title: 'SENA దేశాల అసలైన అగ్నిపరీక్ష', type: 'senaGlobe',
    heroTitle: 'SENA దేశాల్లో అసలైన పరీక్ష',
    sub: 'South Africa · England · New Zealand · Australia',
    desc: 'బంతి బుల్లెట్‌లా దూసుకొచ్చే విదేశీ పిచ్‌లపై ఆసియా బ్యాటర్ సత్తా బయటపడుతుంది!',
    focus: ['SA', 'ENG', 'NZ', 'AUS'],
  },
  {
    id: 28, act: 5, sec: 30, title: 'బాబర్ ఆజం SENA టెస్ట్ రికార్డు (21 మ్యాచ్‌లు)', type: 'senaBabar',
    heroTitle: 'బాబర్ ఆజం SENA టెస్ట్ గణాంకాలు',
    stats: [
      { label: 'మ్యాచ్‌లు', val: '21' },
      { label: 'రన్స్', val: '1,386' },
      { label: 'సగటు', val: '38.50' },
      { label: 'సెంచరీలు', val: '01' },
    ],
    countries: [
      { code: 'AUS', name: 'ఆస్ట్రేలియా', status: '1 సెంచరీ (104 - గబ్బా 2019)', ok: true },
      { code: 'ENG', name: 'ఇంగ్లాండ్', status: '0 సెంచరీలు', ok: false },
      { code: 'NZ', name: 'న్యూజిలాండ్', status: '0 సెంచరీలు', ok: false },
      { code: 'SA', name: 'సౌతాఫ్రికా', status: '0 సెంచరీలు', ok: false },
    ],
  },
  {
    id: 29, act: 5, sec: 32, title: 'విరాట్ కోహ్లీ SENA టెస్ట్ విధ్వంసం (12 సెంచరీలు)', type: 'senaKohliTests',
    heroTitle: 'SENA గడ్డపై విరాట్ కోహ్లీ 12 టెస్ట్ సెంచరీలు',
    countries: [
      { code: 'AUS', name: 'ఆస్ట్రేలియా', hundreds: 7, note: 'బౌన్సీ పిచ్‌లపై 7 శతకాలు!' },
      { code: 'ENG', name: 'ఇంగ్లాండ్', hundreds: 2, note: 'స్వింగ్ కండిషన్స్‌లో 2 శతకాలు' },
      { code: 'SA', name: 'సౌతాఫ్రికా', hundreds: 2, note: 'కఠిన పిచ్‌లపై 2 శతకాలు' },
      { code: 'NZ', name: 'న్యూజిలాండ్', hundreds: 1, note: 'న్యూజిలాండ్‌లో 1 శతకం' },
    ],
  },
  {
    id: 30, act: 5, sec: 26, title: 'నవంబర్ 2026 ప్రపంచ రికార్డు – SENA ODIs లో 50+ యావరేజ్!', type: 'bigMilestone', who: 'kohli',
    eyebrow: 'NOVEMBER 2026 WORLD RECORD · NZ INNINGS',
    label: 'మొత్తం 4 SENA దేశాల్లో 50+ ODI సగటు కలిగిన ఏకైక బ్యాటర్',
    value: 50,
    suffix: '+ AVG',
    chips: ['ఆస్ట్రేలియా ✓', 'ఇంగ్లాండ్ ✓', 'సౌతాఫ్రికా ✓', 'న్యూజిలాండ్ (51.53) ✓'],
  },
  {
    id: 31, act: 5, sec: 38, title: 'SENA దేశాల వారీగా కోహ్లీ ODI పరుగులు', type: 'senaKohliOdi',
    heroTitle: 'అన్ని SENA దేశాల్లో కోహ్లీ 50+ ODI యావరేజ్ ప్రపంచ రికార్డు',
    countries: [
      { code: 'ENG', name: 'ఇంగ్లాండ్', runs: 1493, badge: '50+ AVG ✓' },
      { code: 'AUS', name: 'ఆస్ట్రేలియా', runs: 1401, badge: '50+ AVG ✓' },
      { code: 'SA', name: 'సౌతాఫ్రికా', runs: 993, badge: '50+ AVG ✓' },
      { code: 'NZ', name: 'న్యూజిలాండ్', runs: 670, badge: '51.53 AVG (NOV 2026) ✓' },
    ],
  },
  {
    id: 32, act: 5, sec: 30, title: 'SENA తీర్పు: విదేశీ గడ్డపై మైళ్ల దూరంలో కోహ్లీ', type: 'quote', sides: ['kohli', 'babar'],
    sub: 'CHAPTER 5 VERDICT · OVERSEAS & SENA',
    text: 'విదేశీ బౌన్సీ పిచ్‌లపై ఆడటంలో బాబర్ ఆజం కంటే విరాట్ కోహ్లీ కొన్ని మైళ్ల దూరంలో ఉన్నాడు!',
    size: 70,
  },

  // ───────────── ACT 6: FINAL VERDICT & OUTRO (13:30 – 15:00 = 90s) ─────────────
  {
    id: 33, act: 6, sec: 22, title: 'మాస్టర్ డేటా సమ్మరీ మ్యాట్రిక్స్', type: 'summaryMatrix',
    heroTitle: 'కోహ్లీ vs బాబర్ – పూర్తి గణాంకాల సమ్మరీ',
  },
  {
    id: 34, act: 6, sec: 20, title: 'బాబర్ ఆజం స్థానం – గౌరవప్రదమైన గుర్తింపు', type: 'spotlight', who: 'babar',
    eyebrow: 'RESPECT WHERE IT IS DUE',
    heroTitle: 'ఆధునిక క్రికెట్‌లో బాబర్ ప్రత్యేక స్థానం',
    items: [
      { t: 'వన్డే క్రికెట్‌లో 52.27 అద్భుత యావరేజ్ (20 సెంచరీలు)', ok: true },
      { t: 'T20 అంతర్జాతీయ క్రికెట్‌లో 4,596+ పరుగులు (39 హాఫ్ 100s)', ok: true },
      { t: 'పాకిస్థాన్ క్రికెట్ చరిత్రలో అత్యంత ప్రతిభావంతుడైన బ్యాటర్లలో ఒకడు', ok: true },
    ],
  },
  {
    id: 35, act: 6, sec: 24, title: 'తుది తీర్పు: క్లాస్ బ్యాటర్ vs ఆల్-టైమ్ గ్రేట్', type: 'verdictBoard',
    heroTitle: 'విరాట్ కోహ్లీతో పోలిక ఎందుకు న్యాయం కాదు?',
    reasons: [
      { num: '54', title: '86 vs 32 సెంచరీలు', desc: 'అంతర్జాతీయ క్రికెట్‌లో 54 సెంచరీల భారీ అంతరం' },
      { num: 'SENA', title: 'విదేశీ గడ్డపై ఆధిపత్యం', desc: '12 SENA టెస్ట్ 100s & 4 SENA దేశాల్లో 50+ ODI సగటు' },
      { num: 'CLUTCH', title: 'నాకౌట్ & ఛేజింగ్ ఇంపాక్ట్', desc: '25+ ODI ఛేజ్ సెంచరీలు & వరల్డ్ కప్ నాకౌట్ మ్యాచ్ విన్నింగ్' },
    ],
    verdictLine: 'బాబర్ ఒక గొప్ప క్లాస్ బ్యాటర్ అయితే — విరాట్ కోహ్లీ క్రికెట్ చరిత్రలోనే ఒక దిగ్గజం (All-Time Great)!',
  },
  {
    id: 36, act: 6, sec: 24, title: 'కామెంట్ చేయండి · లైక్ · సబ్‌స్క్రైబ్ · జై హింద్', type: 'outro',
    heroTitle: 'మీ అభిప్రాయాన్ని కామెంట్ సెక్షన్‌లో తెలియజేయండి!',
    question: 'భవిష్యత్తులో బాబర్ ఆజం విరాట్ కోహ్లీ రికార్డుల దగ్గరకు వెళ్లగలడా?',
  },
];

// ============================================================================
// 5. TIMELINE MATH (30 FPS · Voice-Synced to edge-tts frame measurements)
// ============================================================================
export const KOHLI_BABAR_FPS = 30;
export const KOHLI_BABAR_TOTAL_FRAMES = CHAPTER_TIMINGS.reduce((acc, t) => acc + t.frames, 0); // 19,703 frames (~656.77s)
export const BASE_SECONDS = CHAPTER_TIMINGS.reduce((acc, t) => acc + t.dur_sec, 0);

const buildTimeline = (scale: number = 1) => {
  const frames = CHAPTER_TIMINGS.map((t) => Math.max(30, Math.round(t.frames * scale)));
  const starts: number[] = [];
  let s = 0;
  frames.forEach((f) => {
    starts.push(s);
    s += f;
  });
  return { frames, starts, total: s };
};

const ACT_TICKS = ACTS.map((_, a) => {
  const first = CHAPTERS.findIndex((c) => c.act === a + 1);
  const framesBefore = CHAPTER_TIMINGS.slice(0, first).reduce((x, t) => x + t.frames, 0);
  return (framesBefore / KOHLI_BABAR_TOTAL_FRAMES) * 100;
}).slice(1);

// ============================================================================
// 6. TELUGU-SAFE TYPOGRAPHY & MOTION PRIMITIVES
// ============================================================================
const graphemes = (t: string): string[] => {
  const Seg = (Intl as any).Segmenter;
  return Seg
    ? Array.from(new Seg('te', { granularity: 'grapheme' }).segment(t), (x: any) => x.segment as string)
    : Array.from(t);
};

const SplitText: React.FC<{
  text: string;
  size: number;
  delay?: number;
  color?: string;
  shadow?: string;
  center?: boolean;
  weight?: number;
}> = ({ text, size, delay = 0, color = C.white, shadow, center, weight = 900 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let n = 0;
  return (
    <div
      style={{
        fontSize: size,
        fontWeight: weight,
        color,
        lineHeight: 1.38,
        textShadow: shadow,
        textAlign: center ? 'center' : 'left',
        perspective: 900,
      }}
    >
      {text.split(' ').map((w, wi) => (
        <span key={wi} style={{ display: 'inline-block', whiteSpace: 'nowrap', marginRight: size * 0.25 }}>
          {graphemes(w).map((g, gi) => {
            const p = spring({ frame: frame - delay - n++ * 1.6, fps, config: { damping: 14, stiffness: 125 } });
            return (
              <span
                key={gi}
                style={{
                  display: 'inline-block',
                  opacity: Math.min(1, p * 1.5),
                  transform: `translateY(${(1 - p) * 55}px) rotateX(${(1 - p) * -75}deg)`,
                  filter: `blur(${(1 - p) * 10}px)`,
                }}
              >
                {g}
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
};

const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  from?: 'up' | 'left' | 'right' | 'zoom';
  style?: React.CSSProperties;
}> = ({ children, delay = 0, from = 'up', style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 115 } });
  const tr =
    from === 'up'
      ? `translateY(${(1 - p) * 48}px)`
      : from === 'left'
      ? `translateX(${(1 - p) * -110}px)`
      : from === 'right'
      ? `translateX(${(1 - p) * 110}px)`
      : `scale(${0.65 + 0.35 * p})`;
  return <div style={{ opacity: Math.min(1, p * 1.4), transform: tr, ...style }}>{children}</div>;
};

const AnimatedCounter: React.FC<{
  target: number;
  startFrame: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  color?: string;
  fontSize?: number;
}> = ({ target, startFrame, duration = 45, decimals = 0, suffix = '', prefix = '', color = C.white, fontSize = 54 }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], clamp);
  const eased = 1 - Math.pow(1 - progress, 3);
  const raw = target * eased;
  const formatted = decimals > 0 ? raw.toFixed(decimals) : Math.round(raw).toLocaleString('en-IN');
  return (
    <span style={{ fontSize, fontWeight: 900, color, fontVariantNumeric: 'tabular-nums' }}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

const BulletRow: React.FC<{
  t: string;
  ok?: boolean;
  delay: number;
  size?: number;
  color: string;
  light?: boolean;
}> = ({ t, ok, delay, size = 38, color, light }) => (
  <Reveal delay={delay} from="right" style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
    <div
      style={{
        width: size * 1.25,
        height: size * 1.25,
        borderRadius: '50%',
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 900,
        fontSize: size * 0.72,
        background:
          ok === false
            ? 'rgba(220, 38, 38, 0.22)'
            : ok === true
            ? 'rgba(0, 166, 81, 0.25)'
            : `${color}33`,
        color: ok === false ? '#F87171' : ok === true ? '#34D399' : color,
        border: `2px solid ${ok === false ? '#EF4444' : ok === true ? '#10B981' : color}`,
      }}
    >
      {ok === false ? '✕' : ok === true ? '✓' : '●'}
    </div>
    <div style={{ fontSize: size, fontWeight: 700, color: light ? C.ink : C.white, lineHeight: 1.4 }}>{t}</div>
  </Reveal>
);

// ============================================================================
// 7. PLAYER 3D TILT CARD, KING CROWN & CRICKET BALL VECTORS
// ============================================================================
const CrownSVG: React.FC<{ size?: number }> = ({ size = 90 }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 120 90">
    <defs>
      <linearGradient id="goldCrown" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    </defs>
    <path
      d="M10 74 L20 24 L45 48 L60 12 L75 48 L100 24 L110 74 Z"
      fill="url(#goldCrown)"
      stroke="#FEF08A"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <rect x="12" y="74" width="96" height="11" rx="5" fill="#D97706" />
    <circle cx="20" cy="20" r="6" fill="#FEF08A" />
    <circle cx="60" cy="8" r="7" fill="#FEF08A" />
    <circle cx="100" cy="20" r="6" fill="#FEF08A" />
  </svg>
);

const RedBallSVG: React.FC<{ size?: number; spin?: number }> = ({ size = 110, spin = 0 }) => (
  <div style={{ width: size, height: size, transform: `rotate(${spin}deg)`, flex: 'none' }}>
    <svg width={size} height={size} viewBox="0 0 120 120">
      <defs>
        <radialGradient id="leatherBall" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="55%" stopColor="#B91C1C" />
          <stop offset="100%" stopColor="#7F1D1D" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#leatherBall)" stroke="#450A0A" strokeWidth="2" />
      <path d="M 24 18 Q 60 60 24 102" fill="none" stroke="#F8FAFC" strokeWidth="3.5" strokeDasharray="6 4" />
      <path d="M 32 14 Q 68 60 32 106" fill="none" stroke="#F8FAFC" strokeWidth="3.5" strokeDasharray="6 4" />
    </svg>
  </div>
);

const PlayerTiltCard: React.FC<{
  who: Who;
  w: number;
  h: number;
  delay?: number;
  sub?: string;
  crown?: boolean;
  lightMode?: boolean;
}> = ({ who, w, h, delay = 0, sub, crown, lightMode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = PLAYERS[who];
  const [err, setErr] = useState(false);

  const pop = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 115 } });
  const tiltY = Math.sin(frame * 0.04 + (who === 'kohli' ? 0 : Math.PI)) * 6;
  const floatY = Math.cos(frame * 0.05 + (who === 'kohli' ? 0 : 2)) * 7;

  return (
    <div
      style={{
        width: w,
        height: h,
        position: 'relative',
        flex: 'none',
        borderRadius: 34,
        overflow: 'visible',
        transform: `perspective(1000px) rotateY(${tiltY}deg) translateY(${floatY}px) scale(${0.72 + 0.28 * pop})`,
        opacity: Math.min(1, pop * 1.5),
      }}
    >
      {crown && (
        <div
          style={{
            position: 'absolute',
            top: -58,
            left: '50%',
            transform: `translateX(-50%) scale(${spring({ frame: frame - delay - 18, fps, config: { damping: 10 } })})`,
            zIndex: 20,
            filter: 'drop-shadow(0 10px 25px rgba(245, 158, 11, 0.8))',
          }}
        >
          <CrownSVG size={110} />
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 34,
          overflow: 'hidden',
          position: 'relative',
          background: lightMode
            ? `linear-gradient(165deg, #FFFFFF 0%, ${p.main}18 75%, ${p.glow}28 100%)`
            : `linear-gradient(165deg, #0F172A 0%, ${p.main}44 65%, ${p.glow}33 100%)`,
          border: `3px solid ${p.main}`,
          boxShadow: `0 24px 65px ${p.main}55`,
        }}
      >
        {/* Giant Jersey Watermark */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 22,
            fontSize: Math.round(w * 0.24),
            fontWeight: 900,
            color: lightMode ? `${p.main}22` : 'rgba(255,255,255,0.12)',
            lineHeight: 1,
          }}
        >
          {p.jersey}
        </div>

        {/* Rotating Energy Ring */}
        <div
          style={{
            position: 'absolute',
            top: '12%',
            left: '50%',
            width: w * 0.78,
            height: w * 0.78,
            marginLeft: -w * 0.39,
            borderRadius: '50%',
            border: `4px dashed ${p.glow}77`,
            transform: `rotate(${(frame * 1.3) % 360}deg)`,
          }}
        />

        {/* Cutout Photo or Stylized Jersey Crest Fallback */}
        {err ? (
          <div
            style={{
              position: 'absolute',
              top: '20%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: w * 0.56,
              height: w * 0.56,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${p.main}, ${p.glow})`,
              border: '6px solid rgba(255,255,255,0.85)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 18px 45px ${p.main}88`,
            }}
          >
            <div style={{ fontSize: w * 0.19, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{p.ini}</div>
            <div style={{ fontSize: w * 0.11, fontWeight: 900, color: '#FEF08A', marginTop: 4 }}>{p.jersey}</div>
          </div>
        ) : (
          <img
            src={p.img}
            onError={() => setErr(true)}
            style={{
              position: 'absolute',
              bottom: '16%',
              left: 0,
              width: '100%',
              height: '74%',
              objectFit: 'contain',
              objectPosition: 'bottom',
            }}
          />
        )}

        {/* Flag + Jersey Pill */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'rgba(5, 9, 20, 0.85)',
            border: `2px solid ${p.glow}`,
            borderRadius: 999,
            padding: '6px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: '#fff',
            fontWeight: 900,
            fontSize: 22,
          }}
        >
          <span>{p.flag}</span>
          <span>{p.jersey}</span>
        </div>

        {/* Bottom Nameplate */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '48px 18px 22px',
            textAlign: 'center',
            background: lightMode
              ? 'linear-gradient(0deg, #FFFFFF 68%, rgba(255,255,255,0))'
              : 'linear-gradient(0deg, #050914 70%, rgba(5,9,20,0))',
          }}
        >
          <div style={{ fontSize: Math.round(w * 0.095), fontWeight: 900, color: lightMode ? C.ink : C.white }}>
            {p.name}
          </div>
          <div
            style={{
              display: 'inline-block',
              marginTop: 8,
              padding: '5px 22px',
              borderRadius: 999,
              background: p.main,
              color: '#fff',
              fontSize: Math.round(w * 0.056),
              fontWeight: 900,
              letterSpacing: 1.5,
            }}
          >
            {p.team} · {p.jersey}
          </div>
          {sub && (
            <div style={{ marginTop: 8, fontSize: Math.round(w * 0.06), fontWeight: 800, color: C.goldLight }}>
              {sub}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const VsClashBadge: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 9, stiffness: 150 } });
  const pulse = 1 + Math.sin(frame * 0.14) * 0.05;
  return (
    <div
      style={{
        width: 112,
        height: 112,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${C.kohliBlue}, #0F172A 50%, ${C.babarGreen})`,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 42,
        fontWeight: 900,
        border: '5px solid #FDE047',
        boxShadow: '0 0 45px rgba(245, 158, 11, 0.65)',
        transform: `scale(${pop * pulse})`,
        flex: 'none',
        zIndex: 10,
      }}
    >
      VS
    </div>
  );
};

// ============================================================================
// 8. CINEMATIC DYNAMIC BACKGROUNDS & BROADCAST HUD
// ============================================================================
const ArenaBackground: React.FC<{ gf: number; theme?: 'dark' | 'test' | 'neon' }> = ({ gf, theme = 'dark' }) => {
  const gridOffset = (gf * 1.4) % 80;

  if (theme === 'test') {
    return (
      <AbsoluteFill style={{ backgroundColor: C.testBg, overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            top: -260,
            left: -180,
            width: 950,
            height: 950,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,85,255,0.14) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -260,
            right: -180,
            width: 950,
            height: 950,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(220,38,38,0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(to right, rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.05) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            backgroundPosition: `0px ${gridOffset}px`,
          }}
        />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: C.bgDark, overflow: 'hidden' }}>
      {/* Colliding Blue (#0055FF) & Green (#00A651) Energy Streaks */}
      <div
        style={{
          position: 'absolute',
          top: -280,
          left: -220,
          width: 1180,
          height: 1180,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${C.kohliBlue}55 0%, transparent 66%)`,
          filter: 'blur(75px)',
          transform: `translate(${Math.sin(gf * 0.015) * 70}px, ${Math.cos(gf * 0.012) * 50}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -280,
          right: -220,
          width: 1180,
          height: 1180,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${C.babarGreen}50 0%, transparent 66%)`,
          filter: 'blur(75px)',
          transform: `translate(${Math.cos(gf * 0.014) * 70}px, ${Math.sin(gf * 0.013) * 50}px)`,
        }}
      />
      {theme === 'neon' && (
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '35%',
            width: 700,
            height: 700,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.22) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          backgroundPosition: `0px ${gridOffset}px`,
          transform: 'perspective(900px) rotateX(60deg) scale(1.7)',
          transformOrigin: 'center bottom',
        }}
      />
    </AbsoluteFill>
  );
};

const BroadcastHUD: React.FC<{ ch: Ch; gf: number; total: number }> = ({ ch, gf, total }) => {
  const act = ACTS[ch.act - 1];
  const progress = interpolate(gf, [0, total], [0, 100], clamp);
  const pad = (n: number) => String(n).padStart(2, '0');
  const isTest = ch.theme === 'test';

  const pill: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    background: isTest ? 'rgba(255, 255, 255, 0.94)' : 'rgba(13, 21, 42, 0.92)',
    border: `1.5px solid ${isTest ? 'rgba(15,23,42,0.14)' : 'rgba(255,255,255,0.16)'}`,
    padding: '9px 24px',
    borderRadius: 999,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
  };

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 60 }}>
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 44,
          right: 44,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={pill}>
          <div
            style={{
              width: 11,
              height: 11,
              borderRadius: '50%',
              backgroundColor: '#EF4444',
              boxShadow: '0 0 12px #EF4444',
            }}
          />
          <span style={{ color: isTest ? C.ink : C.white, fontWeight: 900, fontSize: 16, letterSpacing: 1.6 }}>
            CRICKET DATA LAB · KOHLI #18 vs BABAR #56
          </span>
          <span
            style={{
              color: C.gold,
              fontWeight: 800,
              fontSize: 14,
              borderLeft: '1.5px solid rgba(148,163,184,0.35)',
              paddingLeft: 12,
            }}
          >
            {act.time}
          </span>
        </div>

        <div style={{ ...pill, maxWidth: 1050 }}>
          <span
            style={{
              background: `linear-gradient(90deg, ${C.kohliBlue}, ${C.babarGreen})`,
              color: '#fff',
              borderRadius: 10,
              padding: '3px 12px',
              fontWeight: 900,
              fontSize: 15,
            }}
          >
            {pad(ch.id)}/{CHAPTERS.length}
          </span>
          <span style={{ color: C.gold, fontWeight: 900, fontSize: 15, letterSpacing: 1.2 }}>{act.key}</span>
          <span style={{ color: C.muted }}>|</span>
          <span
            style={{
              color: isTest ? C.ink : C.white,
              fontWeight: 800,
              fontSize: 18,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {ch.title}
          </span>
        </div>
      </div>

      {/* Bottom 15-Minute Chapter Timeline Progress Bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 7, backgroundColor: 'rgba(148,163,184,0.2)' }}>
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${C.kohliBlue}, ${C.kohliGlow}, ${C.gold}, ${C.babarGreen})`,
          }}
        />
        {ACT_TICKS.map((t, i) => (
          <div key={i} style={{ position: 'absolute', left: `${t}%`, top: 0, width: 3, height: 7, background: '#fff' }} />
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 9. SPECIALIZED SCENE TEMPLATES
// ============================================================================

// Template 1: Chapter 1 Hero Clash
const HeroClash: React.FC<{ c: Ch }> = ({ c }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '430px 1fr 430px', gap: 32, height: '100%', alignItems: 'center' }}>
    <PlayerTiltCard who="kohli" w={430} h={880} delay={4} sub="86 INTERNATIONAL 100s" crown />
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 24 }}>
      <Reveal delay={6} from="zoom">
        <div
          style={{
            padding: '10px 32px',
            borderRadius: 999,
            background: 'rgba(245, 158, 11, 0.18)',
            border: `2px solid ${C.gold}`,
            color: C.goldLight,
            fontSize: 30,
            fontWeight: 900,
            letterSpacing: 4,
          }}
        >
          {c.kicker}
        </div>
      </Reveal>
      <SplitText text={c.headline} size={86} delay={14} center shadow="0 8px 32px rgba(0,85,255,0.65)" />
      <VsClashBadge delay={28} />
      <Reveal delay={40} from="zoom">
        <div
          style={{
            padding: '10px 36px',
            borderRadius: 16,
            background: C.crimson,
            color: '#fff',
            fontSize: 34,
            fontWeight: 900,
            letterSpacing: 5,
            boxShadow: '0 10px 30px rgba(220,38,38,0.55)',
          }}
        >
          {c.subTag}
        </div>
      </Reveal>
      <Reveal delay={55} style={{ ...darkCard, padding: '24px 32px', marginTop: 8 }}>
        <div style={{ fontSize: 36, fontWeight: 800, color: C.white, lineHeight: 1.45 }}>{c.teQuestion}</div>
      </Reveal>
    </div>
    <PlayerTiltCard who="babar" w={430} h={880} delay={12} sub="32 INTERNATIONAL 100s" />
  </div>
);

// Template 2: Player Spotlight
const Spotlight: React.FC<{ c: Ch }> = ({ c }) => {
  const who = c.who as Who;
  const p = PLAYERS[who];
  const left = who === 'kohli';
  const cardEl = <PlayerTiltCard who={who} w={450} h={900} delay={4} crown={who === 'kohli'} />;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: left ? '450px 1fr' : '1fr 450px', gap: 38, height: '100%' }}>
      {left && cardEl}
      <div style={{ ...darkCard, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', border: `2.5px solid ${p.main}88` }}>
        <div style={{ background: `linear-gradient(90deg, ${p.main}, ${p.glow})`, padding: '28px 48px' }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', opacity: 0.9, letterSpacing: 2.5 }}>{c.eyebrow}</div>
          <SplitText text={c.heroTitle} size={58} color="#fff" delay={8} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', padding: '24px 52px' }}>
          {c.items.map((it: any, i: number) => (
            <BulletRow key={i} t={it.t} ok={it.ok} delay={24 + i * 16} size={40} color={p.glow} />
          ))}
        </div>
      </div>
      {!left && cardEl}
    </div>
  );
};

// Template 3: Split Faceoff
const FaceOff: React.FC<{ c: Ch }> = ({ c }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '440px 1fr 440px', gap: 32, height: '100%' }}>
    <PlayerTiltCard who="kohli" w={440} h={900} delay={4} sub={c.leftNote} />
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 26, textAlign: 'center' }}>
      <SplitText text={c.centerTitle} size={62} delay={8} center />
      <VsClashBadge delay={26} />
      {c.items.map((t: string, i: number) => (
        <Reveal key={i} delay={38 + i * 15} style={{ ...darkCard, padding: '22px 32px', fontSize: 36, fontWeight: 700, color: C.white, width: '100%' }}>
          {t}
        </Reveal>
      ))}
    </div>
    <PlayerTiltCard who="babar" w={440} h={900} delay={12} sub={c.rightNote} />
  </div>
);

// Template 4: Chips Grid
const ChipsGrid: React.FC<{ c: Ch }> = ({ c }) => {
  const cols: number = c.cols || 4;
  const accents = [C.kohliBlue, C.gold, C.neonCyan, C.babarGreen];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, height: '100%' }}>
      <SplitText text={c.heroTitle} size={68} delay={6} center />
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 26, flex: 1 }}>
        {c.tiles.map((t: any, i: number) => {
          const col = accents[i % accents.length];
          return (
            <Reveal
              key={i}
              delay={20 + i * 12}
              from="zoom"
              style={{
                ...darkCard,
                borderTop: `10px solid ${col}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 20,
                padding: 28,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 88, fontWeight: 900, color: col }}>{t.big}</div>
              <div style={{ fontSize: 42, fontWeight: 900, color: C.white }}>{t.t}</div>
              {t.sub && <div style={{ fontSize: 30, fontWeight: 700, color: C.muted }}>{t.sub}</div>}
            </Reveal>
          );
        })}
      </div>
    </div>
  );
};

// Template 5: Test Intro
const TestIntro: React.FC<{ c: Ch }> = ({ c }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 40, height: '100%', alignItems: 'center' }}>
      <div style={{ ...lightCard, padding: '48px 54px', display: 'flex', flexDirection: 'column', gap: 26, borderLeft: `14px solid ${C.crimson}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <RedBallSVG size={115} spin={frame * 2.2} />
          <div>
            <div style={{ fontSize: 26, fontWeight: 900, color: C.crimson, letterSpacing: 3 }}>{c.eyebrow}</div>
            <SplitText text={c.heroTitle} size={76} color={C.ink} delay={8} />
          </div>
        </div>
        <Reveal delay={24}>
          <div style={{ fontSize: 38, fontWeight: 700, color: C.mutedDark, lineHeight: 1.5 }}>{c.sub}</div>
        </Reveal>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 10 }}>
          {c.badges.map((b: string, i: number) => (
            <Reveal key={i} delay={38 + i * 12} from="zoom">
              <div style={{ padding: '14px 28px', borderRadius: 999, background: C.ink, color: '#fff', fontSize: 30, fontWeight: 800 }}>
                {b}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
        <PlayerTiltCard who="kohli" w={340} h={840} delay={10} lightMode sub="30 TEST 100s" />
        <PlayerTiltCard who="babar" w={340} h={840} delay={18} lightMode sub="9 TEST 100s" />
      </div>
    </div>
  );
};

// Template 6: Test Player Card
const TestPlayer: React.FC<{ c: Ch }> = ({ c }) => {
  const frame = useCurrentFrame();
  const who = c.who as Who;
  const p = PLAYERS[who];
  const left = who === 'kohli';
  const cardEl = <PlayerTiltCard who={who} w={440} h={900} delay={4} lightMode crown={who === 'kohli'} />;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: left ? '440px 1fr' : '1fr 440px', gap: 36, height: '100%' }}>
      {left && cardEl}
      <div style={{ ...lightCard, padding: '36px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: p.main }}>{c.badge}</div>
            <SplitText text={`${p.name} – టెస్ట్ కెరీర్`} size={62} color={C.ink} delay={8} />
          </div>
          <RedBallSVG size={90} spin={frame * 2} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {c.stats.map((s: any, i: number) => (
            <Reveal
              key={i}
              delay={20 + i * 12}
              from="zoom"
              style={{
                background: '#F1F5F9',
                borderRadius: 24,
                padding: '24px 32px',
                borderLeft: `8px solid ${p.main}`,
              }}
            >
              <div style={{ fontSize: 30, fontWeight: 800, color: C.mutedDark }}>{s.label}</div>
              <AnimatedCounter target={s.val} decimals={s.dec} startFrame={24 + i * 12} duration={45} fontSize={78} color={p.main} />
            </Reveal>
          ))}
        </div>
        <Reveal delay={70}>
          <div
            style={{
              padding: '22px 32px',
              borderRadius: 22,
              background: who === 'kohli' ? 'rgba(245, 158, 11, 0.16)' : 'rgba(220, 38, 38, 0.12)',
              border: `2.5px solid ${who === 'kohli' ? C.gold : C.crimson}`,
              fontSize: 36,
              fontWeight: 900,
              color: C.ink,
              textAlign: 'center',
            }}
          >
            {c.highlight}
          </div>
        </Reveal>
      </div>
      {!left && cardEl}
    </div>
  );
};

// Template 7: Test Comparison Bars
const TestBars: React.FC<{ c: Ch }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ ...lightCard, padding: '36px 52px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SplitText text="టెస్ట్ క్రికెట్ గణాంకాల పోలిక" size={62} color={C.ink} delay={4} />
        <div style={{ display: 'flex', gap: 24, fontSize: 30, fontWeight: 900 }}>
          <span style={{ color: C.kohliBlue }}>■ విరాట్ కోహ్లీ (#18)</span>
          <span style={{ color: C.babarGreen }}>■ బాబర్ ఆజం (#56)</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26, flex: 1, justifyContent: 'center' }}>
        {c.metrics.map((m: any, i: number) => {
          const prog = spring({ frame: frame - 18 - i * 14, fps, config: { damping: 16, stiffness: 80 } });
          const kw = (m.k / m.max) * 100 * prog;
          const bw = (m.b / m.max) * 100 * prog;
          return (
            <div key={i} style={{ background: '#F8FAFC', borderRadius: 22, padding: '18px 28px', border: '1.5px solid #E2E8F0' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: C.ink, marginBottom: 12 }}>{m.label}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                  <div style={{ width: `${Math.max(4, kw)}%`, height: 34, borderRadius: 99, background: `linear-gradient(90deg, ${C.kohliBlue}, ${C.kohliGlow})` }} />
                  <AnimatedCounter target={m.k} decimals={m.dec} startFrame={20 + i * 14} duration={40} fontSize={36} color={C.kohliBlue} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                  <div style={{ width: `${Math.max(4, bw)}%`, height: 34, borderRadius: 99, background: `linear-gradient(90deg, ${C.babarGreen}, ${C.babarGlow})` }} />
                  <AnimatedCounter target={m.b} decimals={m.dec} startFrame={20 + i * 14} duration={40} fontSize={36} color={C.babarGreen} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Template 8: Babar Test Drought
const DroughtScene: React.FC<{ c: Ch }> = ({ c }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 440px', gap: 36, height: '100%' }}>
    <div style={{ ...lightCard, padding: '44px 52px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <SplitText text={c.heroTitle} size={62} color={C.crimson} delay={6} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, flex: 1, margin: '28px 0' }}>
        {[c.leftCard, c.rightCard].map((box: any, i: number) => (
          <Reveal
            key={i}
            delay={24 + i * 20}
            from="zoom"
            style={{
              background: '#F8FAFC',
              borderRadius: 28,
              padding: 36,
              borderTop: `12px solid ${box.tone}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 18,
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 900, color: box.tone }}>{box.yr}</div>
            <div style={{ fontSize: 46, fontWeight: 900, color: C.ink }}>{box.title}</div>
            <div style={{ fontSize: 34, fontWeight: 700, color: C.mutedDark, lineHeight: 1.45 }}>{box.desc}</div>
          </Reveal>
        ))}
      </div>
    </div>
    <PlayerTiltCard who="babar" w={440} h={900} delay={8} lightMode sub="0 TEST 100s SINCE DEC 2022" />
  </div>
);

// Template 9: Conversion Rate
const ConversionScene: React.FC<{ c: Ch }> = ({ c }) => (
  <div style={{ ...lightCard, padding: '44px 56px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'center' }}>
    <SplitText text={c.heroTitle} size={68} color={C.ink} delay={6} center />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, flex: 1, alignItems: 'center' }}>
      <Reveal delay={20} from="zoom" style={{ background: 'rgba(0,85,255,0.08)', border: `3px solid ${C.kohliBlue}`, borderRadius: 32, padding: 40 }}>
        <div style={{ fontSize: 36, fontWeight: 900, color: C.kohliBlue }}>విరాట్ కోహ్లీ (#18)</div>
        <div style={{ margin: '16px 0' }}>
          <AnimatedCounter target={c.kohliRate} decimals={1} startFrame={24} duration={45} fontSize={140} color={C.kohliBlue} />
        </div>
        <div style={{ fontSize: 36, fontWeight: 800, color: C.ink }}>ఇన్నింగ్స్‌కు 1 టెస్ట్ సెంచరీ</div>
      </Reveal>
      <Reveal delay={35} from="zoom" style={{ background: 'rgba(0,166,81,0.08)', border: `3px solid ${C.babarGreen}`, borderRadius: 32, padding: 40 }}>
        <div style={{ fontSize: 36, fontWeight: 900, color: C.babarGreen }}>బాబర్ ఆజం (#56)</div>
        <div style={{ margin: '16px 0' }}>
          <AnimatedCounter target={c.babarRate} decimals={1} startFrame={38} duration={45} fontSize={140} color={C.babarGreen} />
        </div>
        <div style={{ fontSize: 36, fontWeight: 800, color: C.ink }}>ఇన్నింగ్స్‌కు 1 టెస్ట్ సెంచరీ</div>
      </Reveal>
    </div>
    <Reveal delay={65}>
      <div style={{ fontSize: 36, fontWeight: 800, color: C.ink, background: '#FEF3C7', padding: '18px 32px', borderRadius: 20 }}>
        {c.foot}
      </div>
    </Reveal>
  </div>
);

// Template 10: Big Milestone Counter
const BigMilestone: React.FC<{ c: Ch }> = ({ c }) => {
  const frame = useCurrentFrame();
  const who = c.who as Who;
  const p = PLAYERS[who];
  const fromTo = c.from !== undefined;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 450px', gap: 36, height: '100%' }}>
      <div style={{ ...darkCard, padding: '44px 54px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28, position: 'relative', overflow: 'hidden', border: `2.5px solid ${C.gold}88` }}>
        <Reveal delay={4}>
          <div style={{ fontSize: 28, fontWeight: 900, color: C.goldLight, letterSpacing: 2.5 }}>{c.eyebrow}</div>
        </Reveal>
        <Reveal delay={12}>
          <div style={{ fontSize: 40, fontWeight: 800, color: C.white, lineHeight: 1.4 }}>{c.label}</div>
        </Reveal>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 28 }}>
          {fromTo && (
            <>
              <AnimatedCounter target={c.from} startFrame={16} duration={35} fontSize={130} color={C.muted} />
              <span style={{ fontSize: 96, color: C.gold, fontWeight: 900 }}>→</span>
            </>
          )}
          <AnimatedCounter
            target={c.value}
            suffix={c.suffix || ''}
            startFrame={fromTo ? 48 : 16}
            duration={50}
            fontSize={fromTo ? 185 : 220}
            color={C.goldLight}
          />
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {(c.chips || []).map((x: string, i: number) => (
            <Reveal key={i} delay={55 + i * 10} from="zoom">
              <div style={{ padding: '12px 26px', borderRadius: 999, background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.2)', fontSize: 30, fontWeight: 800, color: C.white }}>
                {x}
              </div>
            </Reveal>
          ))}
        </div>
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: ((frame * 15) % 2200) - 300,
            width: 150,
            background: 'linear-gradient(90deg, transparent, rgba(253,224,71,0.22), transparent)',
            transform: 'skewX(-20deg)',
          }}
        />
      </div>
      <PlayerTiltCard who={who} w={450} h={900} delay={6} crown />
    </div>
  );
};

// Template 11: ODI Milestone Race
const OdiRace: React.FC<{ c: Ch }> = ({ c }) => {
  const frame = useCurrentFrame();
  const prog = fill(12, 140, frame);
  return (
    <div style={{ ...darkCard, padding: '44px 54px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <SplitText text={c.heroTitle} size={64} delay={6} center />
      <div style={{ position: 'relative', padding: '80px 30px' }}>
        <div style={{ height: 14, borderRadius: 99, background: 'rgba(255,255,255,0.12)' }} />
        <div
          style={{
            position: 'absolute',
            top: 80,
            left: 30,
            height: 14,
            borderRadius: 99,
            width: `calc((100% - 60px) * ${prog})`,
            background: `linear-gradient(90deg, ${C.kohliBlue}, ${C.gold})`,
            boxShadow: `0 0 30px ${C.gold}`,
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: -34 }}>
          {c.milestones.map((m: string, i: number) => {
            const thresh = i / (c.milestones.length - 1);
            const active = prog >= thresh;
            return (
              <div key={m} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: '50%',
                    background: active ? C.gold : '#1E293B',
                    border: `4px solid ${active ? '#FEF08A' : '#475569'}`,
                    boxShadow: active ? `0 0 28px ${C.gold}` : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: 20,
                    color: active ? C.ink : C.muted,
                  }}
                >
                  ⚡
                </div>
                <div style={{ fontSize: 38, fontWeight: 900, color: active ? C.goldLight : C.muted }}>{m}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: active ? C.kohliGlow : 'transparent' }}>FASTEST</div>
              </div>
            );
          })}
        </div>
      </div>
      <Reveal delay={55}>
        <div style={{ textAlign: 'center', fontSize: 36, fontWeight: 800, color: C.white, background: 'rgba(0,85,255,0.22)', padding: '22px 32px', borderRadius: 22, border: `2px solid ${C.kohliBlue}` }}>
          {c.note}
        </div>
      </Reveal>
    </div>
  );
};

// Template 12: Compare Bars
const CompareBars: React.FC<{ c: Ch }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ ...darkCard, padding: '34px 48px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SplitText text={c.heroTitle} size={58} delay={4} />
        <div style={{ display: 'flex', gap: 24, fontSize: 28, fontWeight: 900 }}>
          <span style={{ color: C.kohliGlow }}>■ కోహ్లీ (#18)</span>
          <span style={{ color: C.babarGlow }}>■ బాబర్ (#56)</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, flex: 1, justifyContent: 'center' }}>
        {c.rows.map((r: any, i: number) => {
          const prog = spring({ frame: frame - 14 - i * 12, fps, config: { damping: 16, stiffness: 85 } });
          return (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 20, padding: '14px 26px' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: C.muted, marginBottom: 8 }}>{r.label}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: `${Math.max(5, (r.k / r.max) * 78 * prog)}%`, height: 28, borderRadius: 99, background: C.kohliBlue }} />
                  <AnimatedCounter target={r.k} decimals={r.dec} startFrame={16 + i * 12} duration={38} fontSize={32} color={C.kohliGlow} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: `${Math.max(5, (r.b / r.max) * 78 * prog)}%`, height: 28, borderRadius: 99, background: C.babarGreen }} />
                  <AnimatedCounter target={r.b} decimals={r.dec} startFrame={16 + i * 12} duration={38} fontSize={32} color={C.babarGlow} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Template 13: Duel Card
const DuelCard: React.FC<{ c: Ch }> = ({ c }) => (
  <div style={{ ...darkCard, padding: '40px 52px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'center' }}>
    <SplitText text={c.heroTitle} size={64} delay={6} center />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, flex: 1, alignItems: 'center' }}>
      {[c.left, c.right].map((side: any, i: number) => {
        const p = PLAYERS[side.who as Who];
        return (
          <Reveal
            key={i}
            delay={20 + i * 16}
            from="zoom"
            style={{
              background: p.soft,
              border: `3px solid ${p.main}`,
              borderRadius: 32,
              padding: 40,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div style={{ fontSize: 34, fontWeight: 900, color: p.glow }}>
              {p.name} ({p.jersey})
            </div>
            <div style={{ fontSize: 96, fontWeight: 900, color: C.white }}>{side.big}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: C.goldLight }}>{side.label}</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: C.muted }}>{side.sub}</div>
          </Reveal>
        );
      })}
    </div>
    <Reveal delay={58}>
      <div style={{ fontSize: 34, fontWeight: 800, color: C.white, background: 'rgba(255,255,255,0.08)', padding: '18px 30px', borderRadius: 20 }}>
        {c.foot}
      </div>
    </Reveal>
  </div>
);

// Template 14: Neon T20 Board
const T20Board: React.FC<{ c: Ch }> = ({ c }) => {
  const rows = [
    { label: 'మ్యాచ్‌లు', k: c.kStats.m, b: c.bStats.m, dec: 0 },
    { label: 'పరుగులు', k: c.kStats.r, b: c.bStats.r, dec: 0 },
    { label: 'బ్యాటింగ్ సగటు', k: c.kStats.avg, b: c.bStats.avg, dec: 2 },
    { label: 'స్ట్రైక్ రేట్', k: c.kStats.sr, b: c.bStats.sr, dec: 2 },
    { label: 'సెంచరీలు / హాఫ్ 100s', k: `${c.kStats.h} / ${c.kStats.f}`, b: `${c.bStats.h} / ${c.bStats.f}`, text: true },
  ];
  return (
    <div style={{ ...darkCard, padding: '36px 50px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: `2.5px solid ${C.neonCyan}` }}>
      <SplitText text={c.heroTitle} size={62} delay={6} center />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: 20, alignItems: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: 38, fontWeight: 900, color: C.kohliGlow }}>🇮🇳 విరాట్ కోహ్లీ</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: C.neonCyan, letterSpacing: 3 }}>NEON T20I BOARD</div>
        <div style={{ fontSize: 38, fontWeight: 900, color: C.babarGlow }}>🇵🇰 బాబర్ ఆజం</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {rows.map((r: any, i: number) => (
          <Reveal
            key={i}
            delay={18 + i * 10}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.2fr 1fr',
              alignItems: 'center',
              textAlign: 'center',
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1.5px solid rgba(6, 182, 212, 0.28)',
              borderRadius: 20,
              padding: '16px 24px',
            }}
          >
            {r.text ? (
              <span style={{ fontSize: 42, fontWeight: 900, color: C.kohliGlow }}>{r.k}</span>
            ) : (
              <AnimatedCounter target={r.k} decimals={r.dec} startFrame={20 + i * 10} duration={40} fontSize={44} color={C.kohliGlow} />
            )}
            <span style={{ fontSize: 32, fontWeight: 800, color: C.white }}>{r.label}</span>
            {r.text ? (
              <span style={{ fontSize: 42, fontWeight: 900, color: C.babarGlow }}>{r.b}</span>
            ) : (
              <AnimatedCounter target={r.b} decimals={r.dec} startFrame={20 + i * 10} duration={40} fontSize={44} color={C.babarGlow} />
            )}
          </Reveal>
        ))}
      </div>
    </div>
  );
};

// Template 15: SENA Globe Scene
const SenaGlobeScene: React.FC<{ c: Ch }> = ({ c }) => {
  const frame = useCurrentFrame();
  const nodes = [
    { code: 'SA', name: 'సౌతాఫ్రికా', x: 240, y: 380 },
    { code: 'ENG', name: 'ఇంగ్లాండ్', x: 220, y: 120 },
    { code: 'AUS', name: 'ఆస్ట్రేలియా', x: 430, y: 360 },
    { code: 'NZ', name: 'న్యూజిలాండ్', x: 510, y: 440 },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 40, height: '100%', alignItems: 'center' }}>
      <div style={{ ...darkCard, height: '92%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <svg width="580" height="580" viewBox="0 0 600 600">
          <defs>
            <radialGradient id="globeGrad" cx="35%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="65%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>
          </defs>
          <circle cx="300" cy="300" r="250" fill="url(#globeGrad)" stroke={C.kohliGlow} strokeWidth="3" />
          {[-140, -70, 0, 70, 140].map((rx, idx) => (
            <ellipse
              key={idx}
              cx="300"
              cy="300"
              rx={Math.abs(Math.sin((frame * 0.02) + idx * 0.6)) * 240 + 10}
              ry="250"
              fill="none"
              stroke="rgba(56, 189, 248, 0.25)"
              strokeWidth="2"
            />
          ))}
          {[-150, -75, 0, 75, 150].map((dy, idx) => (
            <ellipse
              key={idx}
              cx="300"
              cy={300 + dy}
              rx={Math.sqrt(Math.max(0, 250 * 250 - dy * dy))}
              ry="22"
              fill="none"
              stroke="rgba(56, 189, 248, 0.22)"
              strokeWidth="2"
            />
          ))}
          {nodes.map((n, i) => (
            <g key={n.code}>
              <circle cx={n.x} cy={n.y} r={16 + Math.sin(frame * 0.15 + i) * 4} fill={C.gold} opacity="0.35" />
              <circle cx={n.x} cy={n.y} r="9" fill={C.goldLight} />
              <text x={n.x + 16} y={n.y + 8} fill="#FFFFFF" fontSize="24" fontWeight="900">
                {n.code}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div style={{ ...darkCard, padding: '44px 50px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: C.goldLight, letterSpacing: 3 }}>{c.sub}</div>
        <SplitText text={c.heroTitle} size={70} delay={8} />
        <Reveal delay={24}>
          <div style={{ fontSize: 38, fontWeight: 700, color: C.white, lineHeight: 1.5 }}>{c.desc}</div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 10 }}>
          {nodes.map((n, i) => (
            <Reveal
              key={n.code}
              delay={36 + i * 12}
              from="zoom"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: `2px solid ${C.kohliGlow}66`,
                borderRadius: 20,
                padding: '18px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <span style={{ fontSize: 30, fontWeight: 900, color: C.goldLight }}>{n.code}</span>
              <span style={{ fontSize: 32, fontWeight: 800, color: C.white }}>{n.name}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
};

// Template 16: Babar SENA Record
const SenaBabar: React.FC<{ c: Ch }> = ({ c }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 430px', gap: 36, height: '100%' }}>
    <div style={{ ...darkCard, padding: '38px 46px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <SplitText text={c.heroTitle} size={58} delay={6} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
        {c.stats.map((s: any, i: number) => (
          <Reveal key={i} delay={16 + i * 8} from="zoom" style={{ background: C.babarSoft, border: `2px solid ${C.babarGreen}`, borderRadius: 20, padding: '18px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: C.muted }}>{s.label}</div>
            <div style={{ fontSize: 52, fontWeight: 900, color: C.white, marginTop: 4 }}>{s.val}</div>
          </Reveal>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {c.countries.map((ct: any, i: number) => (
          <Reveal
            key={ct.code}
            delay={40 + i * 12}
            from="right"
            style={{
              background: ct.ok ? 'rgba(0, 166, 81, 0.16)' : 'rgba(220, 38, 38, 0.16)',
              border: `2px solid ${ct.ok ? C.babarGreen : C.crimson}`,
              borderRadius: 22,
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 18,
            }}
          >
            <div style={{ fontSize: 42 }}>{ct.ok ? '✅' : '⚠️'}</div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 900, color: C.white }}>{ct.name} ({ct.code})</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: ct.ok ? C.babarGlow : '#FCA5A5' }}>{ct.status}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
    <PlayerTiltCard who="babar" w={430} h={900} delay={8} sub="ONLY 1 SENA TEST 100" />
  </div>
);

// Template 17: Kohli SENA 12 Test Centuries
const SenaKohliTests: React.FC<{ c: Ch }> = ({ c }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '430px 1fr', gap: 36, height: '100%' }}>
    <PlayerTiltCard who="kohli" w={430} h={900} delay={4} crown sub="12 SENA TEST CENTURIES" />
    <div style={{ ...darkCard, padding: '40px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <SplitText text={c.heroTitle} size={58} delay={8} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, flex: 1, marginTop: 20 }}>
        {c.countries.map((ct: any, i: number) => (
          <Reveal
            key={ct.code}
            delay={22 + i * 14}
            from="zoom"
            style={{
              background: 'rgba(0, 85, 255, 0.16)',
              border: `2.5px solid ${C.kohliGlow}`,
              borderRadius: 26,
              padding: '26px 30px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: C.white }}>{ct.name}</span>
              <span style={{ fontSize: 34 }}>✅</span>
            </div>
            <div style={{ fontSize: 82, fontWeight: 900, color: C.goldLight, lineHeight: 1.05 }}>
              0{ct.hundreds} <span style={{ fontSize: 32, color: C.white }}>సెంచరీలు</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: C.kohliGlow }}>{ct.note}</div>
          </Reveal>
        ))}
      </div>
    </div>
  </div>
);

// Template 18: Kohli SENA ODIs Country-by-Country Runs
const SenaKohliOdi: React.FC<{ c: Ch }> = ({ c }) => (
  <div style={{ ...darkCard, padding: '40px 52px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: `2.5px solid ${C.gold}` }}>
    <SplitText text={c.heroTitle} size={58} delay={6} center />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, flex: 1, marginTop: 24 }}>
      {c.countries.map((ct: any, i: number) => (
        <Reveal
          key={ct.code}
          delay={20 + i * 14}
          from="zoom"
          style={{
            background: 'linear-gradient(180deg, rgba(0,85,255,0.22), rgba(13,21,42,0.95))',
            border: `2.5px solid ${C.kohliGlow}`,
            borderRadius: 28,
            padding: '28px 22px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 34, fontWeight: 900, color: C.goldLight }}>{ct.code}</div>
          <div style={{ fontSize: 38, fontWeight: 900, color: C.white }}>{ct.name}</div>
          <div>
            <AnimatedCounter target={ct.runs} startFrame={24 + i * 14} duration={45} fontSize={78} color={C.white} />
            <div style={{ fontSize: 26, fontWeight: 800, color: C.muted }}>ODI రన్స్</div>
          </div>
          <div style={{ padding: '10px 18px', borderRadius: 999, background: C.babarGreen, color: '#fff', fontSize: 22, fontWeight: 900 }}>
            {ct.badge}
          </div>
        </Reveal>
      ))}
    </div>
  </div>
);

// Template 19: Master Summary Matrix Table
const SummaryMatrix: React.FC<{ c: Ch }> = ({ c }) => {
  const rows = [
    { cat: 'Test క్రికెట్', k: '123 M | 9,230 R | Avg 46.85 | 30 100s (7x200)', b: '67 M | 4,821 R | Avg 43.04 | 9 100s' },
    { cat: 'ODI క్రికెట్', k: '322 M | 15,195 R | Avg 58.22 | 55 100s', b: '148 M | 6,744 R | Avg 52.27 | 20 100s' },
    { cat: 'T20I క్రికెట్', k: '125 M | 4,188 R | Avg 48.70 | 1 100, 38 50s', b: '145 M | 4,596 R | Avg 38.94 | 3 100s, 39 50s' },
    { cat: 'మొత్తం సెంచరీలు', k: '86 సెంచరీలు (30 + 55 + 1) 👑', b: '32 సెంచరీలు (9 + 20 + 3)' },
    { cat: 'SENA రికార్డు', k: '12 Test 100s | అన్ని SENA ODIs లో 50+ Avg', b: '21 Tests | 1,386 R | Avg 38.50 | 1 100' },
  ];
  return (
    <div style={{ ...darkCard, padding: '32px 44px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <SplitText text={c.heroTitle} size={56} delay={4} center />
      <div style={{ display: 'grid', gridTemplateColumns: '0.75fr 1.15fr 1.1fr', gap: 16, padding: '14px 24px', borderRadius: 18, background: 'rgba(255,255,255,0.08)', fontSize: 30, fontWeight: 900 }}>
        <span style={{ color: C.goldLight }}>విభాగం</span>
        <span style={{ color: C.kohliGlow }}>🇮🇳 విరాట్ కోహ్లీ (#18) 👑</span>
        <span style={{ color: C.babarGlow }}>🇵🇰 బాబర్ ఆజం (#56)</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1, justifyContent: 'center' }}>
        {rows.map((r, i) => (
          <Reveal
            key={i}
            delay={16 + i * 12}
            from="right"
            style={{
              display: 'grid',
              gridTemplateColumns: '0.75fr 1.15fr 1.1fr',
              gap: 16,
              alignItems: 'center',
              background: 'rgba(255,255,255,0.04)',
              border: '1.5px solid rgba(255,255,255,0.1)',
              borderRadius: 18,
              padding: '18px 24px',
            }}
          >
            <span style={{ fontSize: 28, fontWeight: 900, color: C.white }}>{r.cat}</span>
            <span style={{ fontSize: 27, fontWeight: 800, color: '#DBEAFE' }}>{r.k}</span>
            <span style={{ fontSize: 27, fontWeight: 700, color: '#D1FAE5' }}>{r.b}</span>
          </Reveal>
        ))}
      </div>
    </div>
  );
};

// Template 20: Final Verdict Board
const VerdictBoard: React.FC<{ c: Ch }> = ({ c }) => (
  <div style={{ ...darkCard, padding: '38px 48px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    <SplitText text={c.heroTitle} size={60} delay={6} center />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
      {c.reasons.map((r: any, i: number) => (
        <Reveal
          key={i}
          delay={20 + i * 14}
          from="zoom"
          style={{
            background: 'rgba(0, 85, 255, 0.14)',
            border: `2px solid ${C.kohliGlow}77`,
            borderRadius: 26,
            padding: 28,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{ fontSize: 56, fontWeight: 900, color: C.goldLight }}>{r.num}</div>
          <div style={{ fontSize: 34, fontWeight: 900, color: C.white }}>{r.title}</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: C.muted, lineHeight: 1.4 }}>{r.desc}</div>
        </Reveal>
      ))}
    </div>
    <Reveal delay={65}>
      <div
        style={{
          padding: '24px 36px',
          borderRadius: 24,
          background: `linear-gradient(90deg, ${C.kohliBlue}, #1E3A8A)`,
          border: `2.5px solid ${C.gold}`,
          fontSize: 36,
          fontWeight: 900,
          color: C.white,
          textAlign: 'center',
          lineHeight: 1.45,
        }}
      >
        👑 {c.verdictLine}
      </div>
    </Reveal>
  </div>
);

// Template 21: Quote / Verdict Banner
const QuoteScene: React.FC<{ c: Ch }> = ({ c }) => {
  const sides: (Who | null)[] = c.sides || [null, null];
  const cols = `${sides[0] ? '410px ' : ''}1fr${sides[1] ? ' 410px' : ''}`;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 32, height: '100%' }}>
      {sides[0] && <PlayerTiltCard who={sides[0] as Who} w={410} h={900} delay={2} crown={sides[0] === 'kohli'} />}
      <div style={{ ...darkCard, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '44px 56px', gap: 30 }}>
        {c.sub && (
          <Reveal>
            <div style={{ fontSize: 30, fontWeight: 900, color: C.goldLight, letterSpacing: 2.5 }}>{c.sub}</div>
          </Reveal>
        )}
        <SplitText text={c.text} size={c.size || 72} delay={10} center />
        <Reveal delay={50}>
          <div style={{ width: 380, height: 10, borderRadius: 99, background: `linear-gradient(90deg, ${C.kohliBlue}, ${C.gold}, ${C.babarGreen})` }} />
        </Reveal>
      </div>
      {sides[1] && <PlayerTiltCard who={sides[1] as Who} w={410} h={900} delay={10} />}
    </div>
  );
};

// Template 22: Interactive Outro
const OutroScene: React.FC<{ c: Ch }> = ({ c }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 36, height: '100%' }}>
      <div style={{ ...darkCard, padding: '44px 50px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 30 }}>
        <div style={{ fontSize: 90 }}>💬</div>
        <SplitText text={c.heroTitle} size={58} delay={6} />
        <Reveal delay={28} style={{ background: 'rgba(255,255,255,0.08)', borderLeft: `8px solid ${C.gold}`, borderRadius: 20, padding: '24px 30px' }}>
          <div style={{ fontSize: 38, fontWeight: 800, color: C.goldLight, lineHeight: 1.45 }}>{c.question}</div>
        </Reveal>
      </div>
      <div style={{ ...darkCard, background: `linear-gradient(160deg, #0F172A, #1E1B4B)`, border: `2.5px solid ${C.gold}`, padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 32 }}>
        <CrownSVG size={110} />
        <div style={{ fontSize: 44, fontWeight: 900, color: C.white }}>డేటా-డ్రివెన్ క్రికెట్ విశ్లేషణల కోసం</div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['👍 LIKE', '↗ SHARE', '🔔 SUBSCRIBE'].map((btn, i) => {
            const pulse = i === 2 ? 1 + Math.sin(frame * 0.18) * 0.06 : 1;
            return (
              <Reveal key={i} delay={36 + i * 12} from="zoom">
                <div
                  style={{
                    transform: `scale(${pulse})`,
                    padding: '18px 34px',
                    borderRadius: 999,
                    background: i === 2 ? C.crimson : C.white,
                    color: i === 2 ? C.white : C.ink,
                    fontSize: 32,
                    fontWeight: 900,
                  }}
                >
                  {btn}
                </div>
              </Reveal>
            );
          })}
        </div>
        <Reveal delay={75}>
          <div style={{ fontSize: 48, fontWeight: 900, color: C.goldLight, letterSpacing: 2 }}>జై హింద్! 🇮🇳</div>
        </Reveal>
      </div>
    </div>
  );
};

const TEMPLATES: Record<string, React.FC<{ c: Ch }>> = {
  heroClash: HeroClash,
  spotlight: Spotlight,
  faceoff: FaceOff,
  chips: ChipsGrid,
  testIntro: TestIntro,
  testPlayer: TestPlayer,
  testBars: TestBars,
  drought: DroughtScene,
  conversion: ConversionScene,
  bigMilestone: BigMilestone,
  odiRace: OdiRace,
  compareBars: CompareBars,
  duelCard: DuelCard,
  t20Board: T20Board,
  senaGlobe: SenaGlobeScene,
  senaBabar: SenaBabar,
  senaKohliTests: SenaKohliTests,
  senaKohliOdi: SenaKohliOdi,
  summaryMatrix: SummaryMatrix,
  verdictBoard: VerdictBoard,
  quote: QuoteScene,
  outro: OutroScene,
};

// ============================================================================
// 10. CHAPTER SCENE WRAPPER
// ============================================================================
const ChapterScene: React.FC<{ ch: Ch; idx: number; start: number; dur: number; total: number }> = ({
  ch,
  idx,
  start,
  dur,
  total,
}) => {
  const frame = useCurrentFrame();
  const gf = start + frame;
  const e = 1 - Math.pow(1 - fill(0, 20, frame), 3);
  const exit = 1 - fill(dur - 8, dur, frame);
  const v = idx % 3;

  const wrap: React.CSSProperties =
    v === 0
      ? { clipPath: `inset(0 ${(1 - e) * 100}% 0 0)`, opacity: exit }
      : v === 1
      ? { transform: `translateY(${(1 - e) * 65}px)`, opacity: e * exit }
      : { transform: `scale(${1.05 - 0.05 * e})`, filter: `blur(${(1 - e) * 8}px)`, opacity: e * exit };

  const actStart = idx > 0 && CHAPTERS[idx - 1].act !== ch.act;
  const SceneTemplate = TEMPLATES[ch.type];

  return (
    <AbsoluteFill>
      <ArenaBackground gf={gf} theme={ch.theme || 'dark'} />
      <BroadcastHUD ch={ch} gf={gf} total={total} />
      <AbsoluteFill style={{ padding: '98px 52px 40px', ...wrap }}>
        <SceneTemplate c={ch} />
      </AbsoluteFill>
      {actStart && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: 480,
            left: interpolate(frame, [0, 26], [-500, 1960], clamp),
            zIndex: 70,
            pointerEvents: 'none',
            background: `linear-gradient(90deg, transparent, ${C.kohliBlue}CC, ${C.gold}CC, ${C.babarGreen}CC, transparent)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// ============================================================================
// 11. MASTER VIDEO COMPOSITION (36 Voice-Synced Chapters)
// ============================================================================
export const KohliVsBabarVideo: React.FC<{ timeScale?: number }> = ({ timeScale = 1 }) => {
  const { frames, starts, total } = buildTimeline(timeScale);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bgDark,
        fontFamily: `${fontAnek}, 'Anek Telugu', 'Noto Sans Telugu', 'Nirmala UI', sans-serif`,
      }}
    >
      {/* 1. Cinematic Low-Volume Background Score across the entire video */}
      <Audio src={staticFile(BG_MUSIC)} volume={0.12} loop />

      {/* 2. Sequential 36-Chapter 100% Voice-Synced Timeline */}
      <Series>
        {CHAPTERS.map((ch, i) => {
          const timing = CHAPTER_TIMINGS[i];
          const dur = frames[i];
          return (
            <Series.Sequence key={ch.id} durationInFrames={dur}>
              {/* Discrete chapter Telugu voice-over: exact frame-locked synchronization */}
              {timing && <Audio src={staticFile(timing.file)} volume={1} />}
              <ChapterScene ch={ch} idx={i} start={starts[i]} dur={dur} total={total} />
            </Series.Sequence>
          );
        })}
      </Series>
    </AbsoluteFill>
  );
};

