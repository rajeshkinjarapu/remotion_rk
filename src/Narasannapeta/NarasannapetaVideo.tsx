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
import { loadFont as loadAnekTelugu } from '@remotion/google-fonts/AnekTelugu';

export const { fontFamily: fontAnek } = loadAnekTelugu('normal', {
  weights: ['400', '600', '700', '800'],
  subsets: ['telugu', 'latin'],
  ignoreTooManyRequestsWarning: true,
});

// ============================================================================
// NARASANNAPETA POLITICAL ANALYSIS — 45 CHAPTERS · 16:9 (1920x1080) · 30 FPS
// Baggu Ramana Murthy (TDP)  vs  Dharmana Krishna Das (YSRCP)
// ============================================================================

// ============================================================================
// IMAGE PATHS (Place transparent PNGs in public/images/narasannapeta/)
//   Missing images never break the video: every image falls back to a
//   coloured initial / party text badge automatically.
// ============================================================================
const IMG = (p: string) => staticFile(`images/narasannapeta/${p}`);

export const LEADER_IMAGES = {
  baggu: IMG('baggu_ramana_murthy.png'),
  dk: IMG('dharmana_krishna_das.png'),
};

export const OTHER_IMAGES = {
  sarojanamma: IMG('baggu_sarojanamma.png'),
  lakshmanaRao: IMG('baggu_lakshmana_rao.png'),
  prasadaRao: IMG('dharmana_prasada_rao.png'),
};

export const PARTY_SYMBOLS = {
  tdp: IMG('symbols/tdp_cycle.png'),
  ysrcp: IMG('symbols/ysrcp_fan.png'),
  jsp: IMG('symbols/jsp_glass.png'),
  bjp: IMG('symbols/bjp_lotus.png'),
  inc: IMG('symbols/inc_hand.png'),
};

// ============================================================================
// MASTER AUDIO
// ============================================================================
const MASTER_VO = 'audio/narasannapeta/master_complete_audio.wav';
const BG_MUSIC = 'Youtube Free Musics/Beat Your Competition - Vibe Tracks.mp3';

// ============================================================================
// PREMIUM WHITE STUDIO BROADCAST PALETTE
// ============================================================================
const C = {
  bg: '#F8FAFC',
  white: '#FFFFFF',
  line: 'rgba(15, 23, 42, 0.09)',
  ink: '#0F172A',
  body: '#334155',
  muted: '#64748B',
  yel: '#F5B800', // Baggu / TDP
  yel2: '#FFD84D',
  yelText: '#9A6F00',
  blue: '#0066CC', // Dharmana / YSRCP
  sky: '#0EA5E9',
  green: '#16A34A',
  red: '#DC2626',
};

export type Who = 'baggu' | 'dk';
export type SymKey = keyof typeof PARTY_SYMBOLS;

const P = {
  baggu: {
    main: '#F5B800', sub: '#FFD84D', soft: 'rgba(245, 184, 0, 0.14)', on: '#0F172A', text: '#9A6F00',
    name: 'బగ్గు రమణమూర్తి', short: 'బగ్గు', party: 'తెలుగుదేశం', partyFull: 'తెలుగుదేశం పార్టీ (TDP)', sym: 'tdp' as SymKey,
    partyBg: '#FFD800', partyText: '#0F172A',
    img: LEADER_IMAGES.baggu, ini: 'బ',
  },
  dk: {
    main: '#0047AB', sub: '#008751', soft: 'rgba(0, 71, 171, 0.12)', on: '#FFFFFF', text: '#0047AB',
    name: 'ధర్మాన కృష్ణదాస్', short: 'ధర్మాన', party: 'వైఎస్సార్సీపీ', partyFull: 'వైఎస్సార్ కాంగ్రెస్ పార్టీ (YSRCP)', sym: 'ysrcp' as SymKey,
    partyBg: '#0047AB', partyText: '#FFFFFF',
    img: LEADER_IMAGES.dk, ini: 'ధ',
  },
};

const SYM_META: Record<SymKey, { c: string; t: string }> = {
  tdp: { c: '#C79A00', t: 'TDP' },
  ysrcp: { c: C.blue, t: 'YSRCP' },
  jsp: { c: '#DC2626', t: 'JSP' },
  bjp: { c: '#EA580C', t: 'BJP' },
  inc: { c: '#16A34A', t: 'INC' },
};

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const fill = (a: number, b: number, f: number) => interpolate(f, [a, b], [0, 1], clamp);
const card: React.CSSProperties = {
  background: C.white,
  border: `2px solid ${C.line}`,
  borderRadius: 34,
  boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08)',
};

// ============================================================================
// 6 ACTS (HUD labels) — chapters below belong to one of these
// ============================================================================
export const ACTS = [
  { key: 'HOOK', te: 'హుక్ & పరిచయం' },
  { key: 'HISTORY', te: 'చారిత్రక పోరు' },
  { key: 'TRILOGY', te: 'ఎన్నికల త్రయం' },
  { key: 'GROUND', te: 'మండలాలు & సమీకరణాలు' },
  { key: 'LEADERS', te: 'నాయకత్వ శైలి' },
  { key: 'VERDICT', te: 'భవిష్యత్ & తీర్పు' },
];

// ============================================================================
// ERAS (chapters 9–15 timeline data)
// ============================================================================
export type Era = { y: string; who: Who; name: string; party: string; sym: SymKey; img: string; ini: string };
export const ERAS: Era[] = [
  { y: '1972', who: 'baggu', name: 'బగ్గు సరోజనమ్మ', party: 'కాంగ్రెస్', sym: 'inc', img: OTHER_IMAGES.sarojanamma, ini: 'స' },
  { y: '1989', who: 'dk', name: 'ధర్మాన ప్రసాదరావు', party: 'కాంగ్రెస్', sym: 'inc', img: OTHER_IMAGES.prasadaRao, ini: 'ధ' },
  { y: '1994', who: 'baggu', name: 'బగ్గు లక్ష్మణరావు', party: 'తెలుగుదేశం', sym: 'tdp', img: OTHER_IMAGES.lakshmanaRao, ini: 'ల' },
  { y: '1999', who: 'dk', name: 'ధర్మాన ప్రసాదరావు', party: 'కాంగ్రెస్', sym: 'inc', img: OTHER_IMAGES.prasadaRao, ini: 'ధ' },
  { y: '2004', who: 'dk', name: 'ధర్మాన కృష్ణదాస్', party: 'కాంగ్రెస్', sym: 'inc', img: LEADER_IMAGES.dk, ini: 'ధ' },
  { y: '2009', who: 'dk', name: 'ధర్మాన కృష్ణదాస్', party: 'కాంగ్రెస్', sym: 'inc', img: LEADER_IMAGES.dk, ini: 'ధ' },
  { y: '2012', who: 'dk', name: 'ధర్మాన కృష్ణదాస్', party: 'వైఎస్సార్సీపీ', sym: 'ysrcp', img: LEADER_IMAGES.dk, ini: 'ధ' },
  { y: '2014', who: 'baggu', name: 'బగ్గు రమణమూర్తి', party: 'తెలుగుదేశం', sym: 'tdp', img: LEADER_IMAGES.baggu, ini: 'బ' },
];

export const MANDALS = [
  { n: 'నరసన్నపేట', col: '#0066CC', x: 40, y: 280, w: 290, h: 240 },
  { n: 'జలుమూరు', col: '#16A34A', x: 60, y: 20, w: 300, h: 230 },
  { n: 'సారవకోట', col: '#EA580C', x: 370, y: 190, w: 210, h: 250 },
  { n: 'పోలాకి', col: '#0891B2', x: 110, y: 550, w: 420, h: 200 },
];

export const ELECTIONS = [
  { y: '2014', who: 'baggu' as Who, v: '76,559', m: '4,800' },
  { y: '2019', who: 'dk' as Who, v: '86,797', m: '19,555' },
  { y: '2024', who: 'baggu' as Who, v: '99,951', m: '29,371' },
];

// ============================================================================
// 45 CHAPTERS — sec = seconds at 30 fps.
// ============================================================================
export type Ch = { id: number; act: number; sec: number; title: string; type: string; [k: string]: any };

export const CHAPTERS: Ch[] = [
  // ───────────── ACT 1 · HOOK ─────────────
  { id: 1, act: 1, sec: 13, title: 'నరసన్నపేట – ఉత్తరాంధ్ర యుద్ధభూమి', type: 'hero',
    eyebrow: 'శ్రీకాకుళం జిల్లా · నియోజకవర్గం #8', heroTitle: 'నరసన్నపేట', tagline: 'కంచుకోట ఎవరిది?',
    chips: ['నరసన్నపేట', 'జలుమూరు', 'సారవకోట', 'పోలాకి'], stat: { value: 29371, label: '2024 రికార్డు మెజారిటీ' } },
  { id: 2, act: 1, sec: 19, title: 'రెండు కుటుంబాలు · పాతికేళ్ల పోరు', type: 'faceoff',
    leftNote: 'బగ్గు కుటుంబం', rightNote: 'ధర్మాన కుటుంబం', centerTitle: 'పాతికేళ్లుగా రెండు కుటుంబాల పోరు',
    items: ['వంశధార తీరం · పచ్చని పొలాలు', 'ఎప్పుడూ నిప్పులు కక్కే రాజకీయం', 'ఒకటి ధర్మాన, రెండోది బగ్గు'] },
  { id: 3, act: 1, sec: 10, title: 'ధర్మాన కృష్ణదాస్ – సీనియర్ మోస్ట్ లీడర్', type: 'leader', who: 'dk',
    eyebrow: 'ఒకవైపు…', heroTitle: 'ధర్మాన కృష్ణదాస్',
    items: [{ t: 'నాలుగుసార్లు ఎమ్మెల్యే' }, { t: 'ఆంధ్రప్రదేశ్ ఉపముఖ్యమంత్రి' }, { t: 'సీనియర్ మోస్ట్ లీడర్' }] },
  { id: 4, act: 1, sec: 14, title: 'బగ్గు రమణమూర్తి – జెయింట్ కిల్లర్', type: 'leader', who: 'baggu',
    eyebrow: 'మరోవైపు…', heroTitle: 'బగ్గు రమణమూర్తి',
    items: [{ t: 'తండ్రి బగ్గు లక్ష్మణరావు రాజకీయ వారసత్వం' }, { t: '2014లో జెయింట్ కిల్లర్' }, { t: '2024లో చారిత్రాత్మక మెజారిటీతో విక్టరీ' }] },
  { id: 5, act: 1, sec: 14, title: 'ఆశ్చర్యకరమైన ప్యాటర్న్', type: 'swing',
    heroTitle: 'ఒకసారి బగ్గు… మరోసారి ధర్మాన!',
    nodes: [{ y: '2014', who: 'baggu', t: 'బగ్గు విజయం' }, { y: '2019', who: 'dk', t: 'ధర్మాన విజయం' }, { y: '2024', who: 'baggu', t: 'బగ్గు విజయం' }],
    foot: 'కానీ 2024లో సమీకరణాలు పూర్తిగా మారాయి!' },
  { id: 6, act: 1, sec: 10, title: '2024 షాక్: 29,371 మెజారిటీ', type: 'bigstat', who: 'baggu',
    label: 'బగ్గు రమణమూర్తి భారీ మెజారిటీ', value: 29371, chips: ['2024 ఎన్నికలు', 'రాజకీయ సమీకరణాలు మారాయి'] },
  { id: 7, act: 1, sec: 14, title: 'అసలు నరసన్నపేటలో ఏం జరిగింది?', type: 'chips', cols: 2,
    heroTitle: 'నాలుగు కీలక ప్రశ్నలు',
    tiles: [
      { big: '1', t: 'అసలు ఏం జరిగింది?' },
      { big: '2', t: 'నాలుగు మండలాల్లో ఏ పార్టీ బలం ఎంత?' },
      { big: '3', t: 'ధర్మాన పట్టు సడలడానికి కారణాలేంటి?' },
      { big: '4', t: 'బగ్గు విజయం వెనుక అసలు వ్యూహం?' },
    ] },
  { id: 8, act: 1, sec: 10, title: 'డెప్త్ పొలిటికల్ అనాలిసిస్', type: 'chips', cols: 3,
    heroTitle: 'ఈ రోజు మనం చూడబోయేది',
    tiles: [{ big: '📊', t: 'పూర్తి డేటా' }, { big: '🔢', t: 'గణాంకాలు' }, { big: '🗺️', t: 'గ్రౌండ్ రియాలిటీ' }],
    footer: 'డెప్త్ పొలిటికల్ అనాలిసిస్' },

  // ───────────── ACT 2 · HISTORY ─────────────
  { id: 9, act: 2, sec: 13, title: '1972 – బగ్గు సరోజనమ్మ', type: 'era', focus: [0],
    cap: '1951లో ఏర్పడిన నియోజకవర్గం · 1972లో కాంగ్రెస్ తరఫున గెలుపు' },
  { id: 10, act: 2, sec: 10, title: '1989 – ధర్మాన ప్రసాదరావు ఎంట్రీ', type: 'era', focus: [1],
    cap: 'అసలైన రాజకీయ సమీకరణాలు మొదలయ్యాయి' },
  { id: 11, act: 2, sec: 10, title: '1994 & 1999 – లక్ష్మణరావు vs ప్రసాదరావు', type: 'era', focus: [2, 3],
    cap: 'ఒకసారి బగ్గు… మరోసారి ధర్మాన' },
  { id: 12, act: 2, sec: 10, title: '2004 – కృష్ణదాస్‌కు బాధ్యతలు', type: 'era', focus: [4],
    cap: 'ప్రసాదరావు శ్రీకాకుళం వెళ్లడంతో సోదరుడికి నరసన్నపేట బాధ్యతలు' },
  { id: 13, act: 2, sec: 12, title: '2004–2012 – కృష్ణదాస్ హ్యాట్రిక్', type: 'era', focus: [4, 5, 6],
    cap: 'కాంగ్రెస్ (2004, 2009) · వైఎస్సార్ కాంగ్రెస్ ఉపఎన్నిక (2012)' },
  { id: 14, act: 2, sec: 13, title: 'కంచుకోట బద్దలు కొట్టడం అసాధ్యమా?', type: 'era', focus: [4, 5], crack: true,
    cap: '2004, 2009లో బగ్గు లక్ష్మణరావుపై వరుస విజయాలు — అసాధ్యమని అంతా భావించారు' },
  { id: 15, act: 2, sec: 10, title: '2014 – బగ్గు రమణమూర్తి ఎంట్రీ', type: 'era', focus: [7],
    cap: 'తండ్రి వారసుడిగా బరిలోకి… సరిగ్గా అలాంటి సమయంలో!' },

  // ───────────── ACT 3 · TRILOGY ─────────────
  { id: 16, act: 3, sec: 11, title: 'ఎన్నికల త్రయం', type: 'chips', cols: 3,
    heroTitle: 'మూడు ఎన్నికలు · ఒక పొలిటికల్ ట్రయాలజీ',
    tiles: [{ big: '2014', t: 'మొదటి యుద్ధం', color: 'baggu' }, { big: '2019', t: 'రెండో యుద్ధం', color: 'dk' }, { big: '2024', t: 'హిస్టారిక్ షిఫ్ట్', color: 'baggu' }] },
  { id: 17, act: 3, sec: 11, title: '2014 – సిట్టింగ్ vs ఛాలెంజర్', type: 'faceoff',
    leftNote: 'తొలి ఎన్నిక', rightNote: '3 సార్లు గెలిచిన సిట్టింగ్', centerTitle: '2014 – మొదటి యుద్ధం',
    items: ['ధర్మాన: అప్పటికే సిట్టింగ్ ఎమ్మెల్యే', 'బగ్గు: తొలి ఎన్నికల్లోనే అద్భుత పోరాటం'] },
  { id: 18, act: 3, sec: 16, title: '2014 ఫలితం – 4,800 మెజారిటీ', type: 'bars', year: '2014',
    b: { v: 76559, s: 49.6 }, d: { v: 71759, s: 46.5 }, winner: 'baggu', margin: 4800, note: 'ధర్మాన కంచుకోట బద్దలు!' },
  { id: 19, act: 3, sec: 11, title: '2019 – వైసీపీ వేవ్', type: 'quote', sides: ['dk', null], bigYear: '2019',
    sub: 'రెండో యుద్ధం', text: 'వైసీపీ వేవ్‌లో కృష్ణదాస్ బౌన్స్ బ్యాక్!' },
  { id: 20, act: 3, sec: 16, title: '2019 ఫలితం – 19,555 మెజారిటీ', type: 'bars', year: '2019',
    b: { v: 67242, s: 41.0 }, d: { v: 86797, s: 52.9 }, winner: 'dk', margin: 19555, note: 'ఐదేళ్ల తర్వాత స్థానం తిరిగి కైవసం' },
  { id: 21, act: 3, sec: 10, title: 'డిప్యూటీ సీఎం & రెవెన్యూ మంత్రి', type: 'leader', who: 'dk',
    eyebrow: '2019 వైఎస్సార్సీపీ ప్రభంజనం', heroTitle: 'డిప్యూటీ సీఎం & రెవెన్యూ మంత్రి',
    items: [] },
  { id: 22, act: 3, sec: 20, title: '2024 – హిస్టారిక్ షిఫ్ట్', type: 'faceoff',
    leftNote: 'ఐదేళ్లు ప్రజల మధ్యే', rightNote: 'మాజీ ఉపముఖ్యమంత్రి', centerTitle: '2024 – మూడో యుద్ధం',
    items: ['2019 ఓటమి తర్వాత నియోజకవర్గాన్ని వీడని బగ్గు'],
    stat: { value: 81.7, decimals: 1, suffix: '%', label: 'రికార్డు స్థాయి పోలింగ్' } },
  { id: 23, act: 3, sec: 18, title: '2024 ఫలితం – 99,951 ఓట్లు', type: 'bars', year: '2024',
    b: { v: 99951, s: 56.35 }, d: { v: 70580, s: 39.79 }, winner: 'baggu', margin: 29371, note: 'లక్ష ఓట్లకు కేవలం 49 ఓట్ల దూరం!' },
  { id: 24, act: 3, sec: 11, title: 'రికార్డు మెజారిటీ – 29,371', type: 'bigstat', who: 'baggu',
    label: 'నరసన్నపేట చరిత్రలో అత్యధిక మెజారిటీ', value: 29371, chips: ['ఇదే మొదటిసారి', '2024 హిస్టారిక్ షిఫ్ట్'] },

  // ───────────── ACT 4 · GROUND REALITY ─────────────
  { id: 25, act: 4, sec: 10, title: 'ఇంత భారీ మార్పు ఎలా?', type: 'mandal', idx: [0, 1, 2, 3],
    name: 'నాలుగు మండలాలు', tag: 'OVERVIEW',
    points: ['నరసన్నపేట · జలుమూరు', 'సారవకోట · పోలాకి', 'సామాజిక సమీకరణాల విశ్లేషణ'] },
  { id: 26, act: 4, sec: 21, title: 'నరసన్నపేట టౌన్', type: 'mandal', idx: [0], name: 'నరసన్నపేట', tag: 'TOWN',
    points: ['వ్యాపార వర్గాలు, ఉద్యోగులు, పట్టణ ఓటర్లు', '2019లో వైసీపీకి అండగా నిలిచిన ప్రాంతం', '2024: ల్యాండ్ టైటిలింగ్ యాక్ట్ భయాలు', 'మౌలిక సదుపాయాల కొరత → టీడీపీ వైపు'] },
  { id: 27, act: 4, sec: 13, title: 'జలుమూరు & సారవకోట', type: 'mandal', idx: [1, 2], name: 'జలుమూరు · సారవకోట', tag: 'AGRICULTURE',
    points: ['పూర్తిగా వ్యవసాయ ఆధారిత మండలాలు', 'వంశధార కాలువల ఆధునీకరణ పెండింగ్', 'ధాన్యం కొనుగోలు సమస్యలు → రైతుల అసంతృప్తి'] },
  { id: 28, act: 4, sec: 10, title: 'ప్రతి గ్రామం చుట్టేసిన పోరాటం', type: 'leader', who: 'baggu',
    eyebrow: 'జలుమూరు & సారవకోట', heroTitle: 'రైతుల సమస్యలపై పోరాటం',
    items: [{ t: 'రెండు మండలాల్లో ప్రతి గ్రామం సందర్శన', ok: true }, { t: 'టీడీపీకి భారీ ఆధిక్యం', ok: true }] },
  { id: 29, act: 4, sec: 10, title: 'పోలాకి – తీర ప్రాంతం', type: 'mandal', idx: [3], name: 'పోలాకి', tag: 'COASTAL',
    points: ['మత్స్యకార ఓటర్లు · తీర గ్రామాలు', 'ఎప్పుడూ ఫలితాన్ని శాసించే మండలం', 'సాంప్రదాయకంగా ధర్మాన కుటుంబానికి పట్టు'] },
  { id: 30, act: 4, sec: 15, title: 'కూటమి – ఓట్లు ఏకపక్షంగా', type: 'alliance', mode: 'merge',
    sideTitle: 'కూటమి ప్రభావం', points: ['జనసేన–టీడీపీ–బీజేపీ పొత్తు', 'ఓట్లు చీలకుండా ఏకపక్షం', 'పోలాకిలో కూడా బగ్గుకే'] },
  { id: 31, act: 4, sec: 10, title: 'సామాజిక సమీకరణాలు', type: 'chips', cols: 5,
    heroTitle: 'నరసన్నపేటలో కీలక సామాజిక వర్గాలు',
    tiles: [{ big: 'కళింగ' }, { big: 'వెలమ' }, { big: 'కాపు' }, { big: 'బీసీ' }, { big: 'ఎస్సీ' }] },
  { id: 32, act: 4, sec: 17, title: '2019 చీలిక vs 2024 కూటమి', type: 'alliance', mode: 'both',
    sideTitle: 'ఓటు ఎటు మళ్లింది?', points: ['2019: జనసేన విడిగా పోటీ', '2024: కూటమి ఏర్పాటు', 'కాపు & యువత ఓట్లు బగ్గు వైపు'] },

  // ───────────── ACT 5 · LEADERSHIP STYLE ─────────────
  { id: 33, act: 5, sec: 18, title: 'ధర్మాన – అనుభవం & సంక్షేమం', type: 'leader', who: 'dk',
    eyebrow: 'నాయకత్వ శైలి (Leadership Style)', heroTitle: 'ధర్మాన కృష్ణదాస్ – బలాలు',
    items: [{ t: 'అత్యంత అనుభవజ్ఞుడైన రాజకీయ వేత్త', ok: true }, { t: 'నవరత్నాలు ఇంటింటికీ చేర్చడంలో కీలక పాత్ర', ok: true }] },
  { id: 34, act: 5, sec: 11, title: 'క్యాడర్‌కు దూరమయ్యారనే విమర్శ', type: 'leader', who: 'dk',
    eyebrow: 'బలహీనతలు', heroTitle: 'ధర్మాన కృష్ణదాస్',
    items: [{ t: 'ఉపముఖ్యమంత్రిగా రాష్ట్ర స్థాయి బాధ్యతలు', ok: false }, { t: 'క్యాడర్‌కు అందుబాటులో లేరనే విమర్శ (సొంత పార్టీ నుంచే)', ok: false }] },
  { id: 35, act: 5, sec: 10, title: 'ఓట్ షేర్ పతనం', type: 'bigstat', who: 'dk',
    label: 'ధర్మాన కృష్ణదాస్ ఓట్ షేర్ (2019 → 2024)', from: 52.9, fromDecimals: 1, value: 39.79, decimals: 2, suffix: '%',
    chips: ['స్థానిక నాయకుల మధ్య సమన్వయ లోపం'] },
  { id: 36, act: 5, sec: 13, title: 'బగ్గు – అందుబాటులో ఉండటం', type: 'leader', who: 'baggu',
    eyebrow: 'బలం & వ్యూహం', heroTitle: 'బగ్గు రమణమూర్తి',
    items: [{ t: 'అందుబాటులో ఉండే నాయకుడు (Accessibility)', ok: true }, { t: '2019 ఓటమి తర్వాత నియోజకవర్గాన్ని వీడలేదు', ok: true }] },
  { id: 37, act: 5, sec: 10, title: 'కార్యకర్తలకు ఫోన్ లిఫ్ట్', type: 'leader', who: 'baggu',
    eyebrow: 'కార్యకర్తలతో కనెక్షన్', heroTitle: 'సామాన్యుడికి అందుబాటులో',
    items: [{ t: 'సామాన్య కార్యకర్తకూ నేరుగా ఫోన్ లిఫ్ట్', ok: true }, { t: 'ప్రజల్లో మంచి పేరు', ok: true }] },
  { id: 38, act: 5, sec: 16, title: 'విజయ వ్యూహం – 3 కీలక అంశాలు', type: 'chips', cols: 3,
    heroTitle: 'బగ్గును విజేతగా నిలిపిన అంశాలు',
    tiles: [
      { big: '🏗️', t: '2014 నాటి అభివృద్ధి పనులు', color: 'baggu' },
      { big: '✅', t: 'కూటమి సూపర్ సిక్స్ హామీలు', color: 'baggu' },
      { big: '🤝', t: 'ఎంపీ రామ్మోహన్ నాయుడుతో సమన్వయం', sub: 'శ్రీకాకుళం ఎంపీ', color: 'baggu' },
    ] },

  // ───────────── ACT 6 · FUTURE ROADMAP & VERDICT ─────────────
  { id: 39, act: 6, sec: 10, title: 'శాశ్వత కంచుకోటలు లేవు', type: 'quote', sides: ['baggu', 'dk'],
    sub: 'ఒక స్పష్టమైన సందేశం', text: 'ఇక్కడ ఏ నాయకుడికీ శాశ్వత కంచుకోటలు లేవు!', size: 96 },
  { id: 40, act: 6, sec: 11, title: '2014 → 2019 → 2024 స్వింగ్', type: 'swing',
    heroTitle: 'ప్రతి ఐదేళ్లకోసారి మారుతున్న తీర్పు',
    nodes: [{ y: '2014', who: 'baggu', t: 'టీడీపీ' }, { y: '2019', who: 'dk', t: 'వైసీపీ' }, { y: '2024', who: 'baggu', t: 'టీడీపీ' }, { y: '2029', who: null, t: '?' }],
    foot: 'పనితీరును బట్టే ప్రజల తీర్పు' },
  { id: 41, act: 6, sec: 14, title: 'బగ్గు ముందున్న సవాళ్లు', type: 'leader', who: 'baggu',
    eyebrow: 'అతిపెద్ద సవాల్', heroTitle: 'బగ్గు ముందున్న సవాళ్లు',
    items: [{ t: 'వంశధార ప్రాజెక్ట్ పెండింగ్ పనులు పూర్తి' }, { t: 'నరసన్నపేట పట్టణ అభివృద్ధి' }, { t: 'నిరుద్యోగ యువతకు ఉపాధి అవకాశాలు' }] },
  { id: 42, act: 6, sec: 12, title: 'వరుసగా రెండోసారి గెలిస్తే…', type: 'quote', sides: ['baggu', null],
    sub: 'హామీలు నిలబెట్టుకుంటే', text: 'వరుసగా రెండోసారి గెలిచి కొత్త చరిత్ర!', size: 104 },
  { id: 43, act: 6, sec: 10, title: '2029 – ధర్మాన కుటుంబం వ్యూహం?', type: 'leader', who: 'dk',
    eyebrow: '2029 వైపు…', heroTitle: 'ధర్మాన కుటుంబం',
    items: [{ t: 'దశాబ్దాల రాజకీయ అనుభవం' }, { t: 'ఎలాంటి వ్యూహంతో తిరిగి పుంజుకుంటారు?' }] },
  { id: 44, act: 6, sec: 18, title: 'మీ అభిప్రాయం కామెంట్ చేయండి', type: 'cta', mode: 'comment',
    heroTitle: 'మీ అభిప్రాయం కామెంట్ చేయండి!',
    prompts: ['మీ దృష్టిలో బగ్గు రమణమూర్తి పనితీరు ఎలా ఉంది?', 'భవిష్యత్తులో నరసన్నపేట రాజకీయం ఏ వైపు వెళ్తుంది?'] },
  { id: 45, act: 6, sec: 13, title: 'లైక్ · షేర్ · సబ్‌స్క్రైబ్', type: 'cta', mode: 'subscribe',
    heroTitle: 'డేటా-డ్రివెన్ విశ్లేషణల కోసం సబ్‌స్క్రైబ్ చేయండి' },
];

// ============================================================================
// TIMELINE MATH (30 FPS)
// ============================================================================
export const NARASANNAPETA_FPS = 30;
export const BASE_SECONDS = CHAPTERS.reduce((a, c) => a + c.sec, 0);
export const NARASANNAPETA_TOTAL_FRAMES = BASE_SECONDS * NARASANNAPETA_FPS;

const buildTimeline = (scale: number) => {
  const frames = CHAPTERS.map((c) => Math.max(30, Math.round(c.sec * NARASANNAPETA_FPS * scale)));
  const target = Math.round(NARASANNAPETA_TOTAL_FRAMES * scale);
  frames[frames.length - 1] += target - frames.reduce((a, b) => a + b, 0); // last chapter absorbs rounding
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
  const secBefore = CHAPTERS.slice(0, first).reduce((x, c) => x + c.sec, 0);
  return (secBefore / BASE_SECONDS) * 100;
}).slice(1);

// ============================================================================
// 1. TEXT EFFECT & MOTION HELPERS
// ============================================================================
const graphemes = (t: string): string[] => {
  const Seg = (Intl as any).Segmenter;
  return Seg ? Array.from(new Seg('te', { granularity: 'grapheme' }).segment(t), (x: any) => x.segment as string) : Array.from(t);
};

// Telugu-safe letter reveal: split by grapheme (never by code point), wrap by word
const SplitText: React.FC<{
  text: string; size: number; delay?: number; color?: string; shadow?: string; center?: boolean; weight?: number;
}> = ({ text, size, delay = 0, color = C.ink, shadow, center, weight = 900 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let n = 0;
  return (
    <div style={{ fontSize: size, fontWeight: weight, color, lineHeight: 1.45, textShadow: shadow, textAlign: center ? 'center' : 'left', perspective: 900 }}>
      {text.split(' ').map((w, wi) => (
        <span key={wi} style={{ display: 'inline-block', whiteSpace: 'nowrap', marginRight: size * 0.24 }}>
          {graphemes(w).map((g, gi) => {
            const p = spring({ frame: frame - delay - n++ * 2, fps, config: { damping: 14, stiffness: 120 } });
            return (
              <span key={gi} style={{ display: 'inline-block', opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 70}px) rotateX(${(1 - p) * -80}deg)`, filter: `blur(${(1 - p) * 12}px)` }}>
                {g}
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
};

// Yellow marker sweep behind text
const Mark: React.FC<{ children: React.ReactNode; delay?: number; color?: string }> = ({ children, delay = 20, color = C.yel2 }) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [delay, delay + 24], [0, 100], clamp);
  return (
    <span style={{ backgroundImage: `linear-gradient(${color},${color})`, backgroundRepeat: 'no-repeat', backgroundPosition: '0 90%', backgroundSize: `${w}% 46%` }}>
      {children}
    </span>
  );
};

const Reveal: React.FC<{
  children: React.ReactNode; delay?: number; from?: 'up' | 'left' | 'right' | 'zoom'; style?: React.CSSProperties;
}> = ({ children, delay = 0, from = 'up', style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 110 } });
  const tr =
    from === 'up' ? `translateY(${(1 - p) * 50}px)`
    : from === 'left' ? `translateX(${(1 - p) * -120}px)`
    : from === 'right' ? `translateX(${(1 - p) * 120}px)`
    : `scale(${0.6 + 0.4 * p})`;
  return <div style={{ opacity: Math.min(1, p * 1.4), transform: tr, ...style }}>{children}</div>;
};

const AnimatedCounter: React.FC<{
  target: number; startFrame: number; duration?: number; decimals?: number; suffix?: string; prefix?: string; color?: string; fontSize?: number;
}> = ({ target, startFrame, duration = 40, decimals = 0, suffix = '', prefix = '', color = C.ink, fontSize = 44 }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], clamp);
  const eased = 1 - Math.pow(1 - progress, 3);
  const raw = target * eased;
  const formatted = decimals > 0 ? raw.toFixed(decimals) : Math.round(raw).toLocaleString('en-IN');
  return (
    <span style={{ fontSize, fontWeight: 900, color, fontVariantNumeric: 'tabular-nums' }}>
      {prefix}{formatted}{suffix}
    </span>
  );
};

const Pill: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.ink }) => (
  <div style={{ padding: '12px 30px', border: `2px solid ${C.line}`, borderRadius: 999, fontSize: 34, fontWeight: 800, color, background: C.white, boxShadow: '0 8px 20px rgba(15,23,42,.06)' }}>
    {children}
  </div>
);

const Row: React.FC<{ t: string; ok?: boolean; delay: number; size?: number; color: string }> = ({ t, ok, delay, size = 56, color }) => {
  const len = t.length;
  const responsiveSize = len > 46 ? Math.min(size, 38) : len > 34 ? Math.min(size, 44) : len > 24 ? Math.min(size, 50) : size;
  return (
    <Reveal delay={delay} from="right" style={{ display: 'flex', alignItems: 'center', gap: 24, width: '100%', minWidth: 0 }}>
      <div style={{
        width: Math.round(responsiveSize * 1.2),
        height: Math.round(responsiveSize * 1.2),
        borderRadius: '50%',
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 900,
        fontSize: Math.round(responsiveSize * 0.7),
        background: ok === false ? '#FEE2E2' : ok === true ? '#DCFCE7' : `${color}22`,
        color: ok === false ? C.red : ok === true ? C.green : color,
        border: `3px solid ${ok === false ? C.red : ok === true ? C.green : color}55`,
        boxShadow: '0 6px 18px rgba(15,23,42,0.08)',
      }}>
        {ok === false ? '✕' : ok === true ? '✓' : '●'}
      </div>
      <div style={{
        fontSize: responsiveSize,
        fontWeight: 800,
        color: C.ink,
        lineHeight: 1.55,
        padding: '14px 8px',
        whiteSpace: 'nowrap',
        overflow: 'visible',
        flex: 1,
        minWidth: 0,
      }}>
        {t}
      </div>
    </Reveal>
  );
};

// ============================================================================
// 2. IMAGE COMPONENTS — LEADER CARD, ROUND PHOTO, SQUARE PHOTO, PARTY SYMBOL (all with fallback)
// ============================================================================
const Sym: React.FC<{ k: SymKey; size?: number }> = ({ k, size = 90 }) => {
  const [err, setErr] = useState(false);
  const m = SYM_META[k];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: '#fff', border: `${Math.max(3, size / 20)}px solid ${m.c}`,
      boxShadow: '0 8px 20px rgba(15,23,42,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flex: 'none',
    }}>
      {err ? (
        <span style={{ fontSize: size * 0.26, fontWeight: 900, color: m.c }}>{m.t}</span>
      ) : (
        <img src={PARTY_SYMBOLS[k]} onError={() => setErr(true)} style={{ width: '68%', height: '68%', objectFit: 'contain' }} />
      )}
    </div>
  );
};

const Photo: React.FC<{ src: string; ini: string; color: string; size: number }> = ({ src, ini, color, size }) => {
  const [err, setErr] = useState(false);
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', border: '7px solid #fff', boxShadow: `0 16px 40px ${color}55, 0 0 0 4px ${color}`,
      background: `${color}22`, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
    }}>
      {err ? (
        <span style={{ fontSize: size * 0.5, fontWeight: 900, color }}>{ini}</span>
      ) : (
        <img src={src} onError={() => setErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }} />
      )}
    </div>
  );
};

const SquarePhoto: React.FC<{ src: string; ini: string; color: string; size?: number; objectPosition?: string }> = ({ src, ini, color, size = 300, objectPosition = 'center 15%' }) => {
  const [err, setErr] = useState(false);
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: 26,
      border: '4px solid #FFFFFF',
      boxShadow: `0 18px 40px rgba(15,23,42,0.12), 0 0 0 2.5px ${color}`,
      background: `linear-gradient(180deg, #FFFFFF 0%, ${color}22 100%)`,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none',
      position: 'relative',
    }}>
      {err ? (
        <span style={{ fontSize: size * 0.45, fontWeight: 900, color }}>{ini}</span>
      ) : (
        <img
          src={src}
          onError={() => setErr(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition,
          }}
        />
      )}
    </div>
  );
};

const LeaderCard: React.FC<{ who: Who; w: number; h: number; delay?: number; sub?: string }> = ({ who, w, h, delay = 0, sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = P[who];
  const [err, setErr] = useState(false);
  const pop = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 115 } });
  const floatY = Math.sin(frame * 0.06 + (who === 'dk' ? 2 : 0)) * 6;

  return (
    <div style={{
      width: w, height: h, position: 'relative', flex: 'none', overflow: 'hidden', borderRadius: 34,
      transform: `translateY(${floatY}px) scale(${0.7 + 0.3 * pop})`, opacity: Math.min(1, pop * 1.5),
      background: '#FFFFFF',
      border: `3.5px solid ${t.main}`,
      boxShadow: `0 25px 60px ${t.main}38, 0 10px 25px rgba(15,23,42,0.08)`,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 1. TOP: Dedicated Photo Frame - Fully separated, NO overlap with text */}
      <div style={{
        flex: 1,
        margin: '18px 18px 0 18px',
        borderRadius: 26,
        overflow: 'hidden',
        position: 'relative',
        background: `linear-gradient(180deg, #F8FAFC 0%, ${t.soft} 100%)`,
        border: '2px solid rgba(15,23,42,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {err ? (
          <span style={{ fontSize: 180, fontWeight: 900, color: t.main }}>{t.ini}</span>
        ) : (
          <img
            src={t.img}
            onError={() => setErr(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 12%',
            }}
          />
        )}

        {/* Floating Authentic Party Symbol Badge on the photo */}
        <div style={{ position: 'absolute', top: 18, right: 18, zIndex: 10 }}>
          <Sym k={t.sym} size={w < 400 ? 74 : w < 600 ? 88 : 98} />
        </div>

        {/* Floating Authentic Party Pill Badge */}
        <div style={{
          position: 'absolute',
          top: 18,
          left: 18,
          zIndex: 10,
          background: t.partyBg,
          color: t.partyText,
          padding: w < 600 ? '6px 20px' : '8px 24px',
          borderRadius: 999,
          fontSize: w < 400 ? 18 : w < 600 ? 22 : 26,
          fontWeight: 900,
          boxShadow: '0 6px 18px rgba(0,0,0,0.22)',
          border: '2px solid #FFFFFF',
        }}>
          {t.party}
        </div>
      </div>

      {/* 2. BOTTOM: Dedicated Nameplate Panel - Clean White, ZERO Overlap with image */}
      <div style={{
        flex: 'none',
        minHeight: sub ? (w < 400 ? 146 : w < 600 ? 162 : 172) : (w < 400 ? 118 : w < 600 ? 132 : 142),
        padding: w < 600 ? '12px 18px 22px' : '14px 22px 24px',
        textAlign: 'center',
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        borderTop: `1.5px solid ${t.main}33`,
      }}>
        <div style={{
          fontSize: w < 380 ? 30 : w < 460 ? 36 : w < 600 ? 40 : 46,
          fontWeight: 900,
          color: C.ink,
          lineHeight: 1.35,
          padding: '4px 0',
          whiteSpace: 'nowrap',
        }}>
          {t.name}
        </div>
        <div style={{
          padding: w < 600 ? '4px 20px' : '5px 26px',
          borderRadius: 999,
          background: t.partyBg,
          color: t.partyText,
          fontSize: w < 380 ? 15 : w < 600 ? 18 : 21,
          fontWeight: 800,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          {t.partyFull || t.party}
        </div>
        {sub && (
          <div style={{
            fontSize: w < 380 ? 15 : w < 600 ? 18 : 21,
            fontWeight: 700,
            color: C.muted,
            marginTop: 1,
          }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
};

const VsBadge: React.FC<{ delay?: number; abs?: boolean }> = ({ delay = 0, abs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 9, stiffness: 150 } });
  return (
    <div style={{
      width: 100, height: 100, borderRadius: '50%', background: C.ink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 40, fontWeight: 900, boxShadow: '0 0 0 12px #fff, 0 16px 40px rgba(15,23,42,.3)', zIndex: 5, flex: 'none',
      ...(abs ? { position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) scale(${pop})` } : { transform: `scale(${pop})` }),
    }}>VS</div>
  );
};

// ============================================================================
// 3. SHARED WHITE STUDIO BACKGROUND + BROADCAST HUD
// ============================================================================
const StudioWhiteBackground: React.FC<{ gf: number }> = ({ gf }) => {
  const gridOffset = (gf * 1.2) % 80;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -320, left: -200, width: 1100, height: 1100, borderRadius: '50%', background: `radial-gradient(circle, ${C.yel}33 0%, transparent 68%)`, filter: 'blur(70px)', transform: `translate(${Math.sin(gf * 0.01) * 60}px, ${Math.cos(gf * 0.012) * 40}px)` }} />
      <div style={{ position: 'absolute', bottom: -320, right: -200, width: 1100, height: 1100, borderRadius: '50%', background: `radial-gradient(circle, ${C.blue}2B 0%, transparent 68%)`, filter: 'blur(70px)', transform: `translate(${Math.cos(gf * 0.011) * 60}px, ${Math.sin(gf * 0.013) * 40}px)` }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(to right, rgba(15,23,42,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.045) 1px, transparent 1px)',
        backgroundSize: '80px 80px', backgroundPosition: `0px ${gridOffset}px`,
        transform: 'perspective(900px) rotateX(60deg) scale(1.7)', transformOrigin: 'center bottom', opacity: 0.75,
      }} />
      {Array.from({ length: 14 }).map((_, i) => {
        const speed = 1.0 + (i % 4) * 0.45;
        const yPos = 1080 - ((gf * speed + i * 95) % 1160);
        const xPos = ((i * 139) % 1860) + Math.sin(gf * 0.025 + i) * 28;
        const size = 6 + (i % 4) * 3;
        return <div key={i} style={{ position: 'absolute', left: xPos, top: yPos, width: size, height: size, borderRadius: '50%', backgroundColor: xPos < 960 ? C.yel : C.blue, opacity: 0.16 }} />;
      })}
    </AbsoluteFill>
  );
};

const BroadcastHUD: React.FC<{ ch: Ch; gf: number; total: number }> = ({ ch, gf, total }) => {
  const progress = interpolate(gf, [0, total], [0, 100], clamp);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 60 }}>
      {/* Top red-circled HUD bars have been REMOVED as requested */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, backgroundColor: 'rgba(15,23,42,0.08)' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: `linear-gradient(90deg, ${C.yel}, ${C.yel2}, ${C.green}, ${C.blue})` }} />
        {ACT_TICKS.map((t, i) => <div key={i} style={{ position: 'absolute', left: `${t}%`, top: 0, width: 3, height: 6, background: '#fff' }} />)}
      </div>
    </div>
  );
};

// ============================================================================
// 4. CHAPTER TEMPLATES
// ============================================================================
const Hero: React.FC<{ c: Ch }> = ({ c }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '760px 1fr', gap: 36, height: '100%' }}>
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Reveal delay={4}><div style={{ fontSize: 34, fontWeight: 700, color: C.muted }}>{c.eyebrow}</div></Reveal>
      <SplitText text={c.heroTitle} size={144} delay={10} shadow="8px 8px 0 rgba(245,184,0,.55)" />
      <Reveal delay={46}><div style={{ fontSize: 68, fontWeight: 900, color: C.ink }}><Mark delay={52}>{c.tagline}</Mark></div></Reveal>
      <div style={{ display: 'flex', gap: 16, margin: '26px 0', flexWrap: 'wrap' }}>
        {c.chips.map((t: string, i: number) => <Reveal key={t} delay={76 + i * 7} from="zoom"><Pill>{t}</Pill></Reveal>)}
      </div>
      <Reveal delay={110}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
          <AnimatedCounter target={c.stat.value} startFrame={114} duration={55} fontSize={114} color={C.blue} />
          <span style={{ fontSize: 36, fontWeight: 700, color: C.muted }}>{c.stat.label}</span>
        </div>
      </Reveal>
    </div>
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <LeaderCard who="baggu" w={480} h={940} delay={20} />
      <LeaderCard who="dk" w={480} h={940} delay={32} />
      <VsBadge delay={60} abs />
    </div>
  </div>
);

const FaceOff: React.FC<{ c: Ch }> = ({ c }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '460px minmax(0, 1fr) 460px', gap: 28, height: '100%', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
    <LeaderCard who="baggu" w={460} h={890} delay={4} sub={c.leftNote} />
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 22, textAlign: 'center', minWidth: 0, overflow: 'hidden' }}>
      <SplitText text={c.centerTitle} size={54} delay={8} center />
      <VsBadge delay={36} />
      {c.items.map((t: string, i: number) => (
        <Reveal
          key={i}
          delay={46 + i * 14}
          style={{
            ...card,
            padding: '16px 28px',
            fontSize: t.length > 28 ? 30 : 34,
            fontWeight: 700,
            width: '100%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {t}
        </Reveal>
      ))}
      {c.stat && (
        <Reveal delay={90}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <AnimatedCounter target={c.stat.value} decimals={c.stat.decimals} suffix={c.stat.suffix} startFrame={94} duration={50} fontSize={104} color={C.blue} />
            <div style={{ fontSize: 32, fontWeight: 700, color: C.muted }}>{c.stat.label}</div>
          </div>
        </Reveal>
      )}
    </div>
    <LeaderCard who="dk" w={460} h={890} delay={14} sub={c.rightNote} />
  </div>
);

const LeaderSlide: React.FC<{ c: Ch }> = ({ c }) => {
  const t = P[c.who as Who];
  const items = c.items || [];
  const n = items.length;
  const left = c.who === 'baggu';
  const cardEl = <LeaderCard who={c.who} w={580} h={940} delay={2} />;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: left ? '580px 1fr' : '1fr 580px', gap: 36, height: '100%' }}>
      {left && cardEl}
      <div style={{ ...card, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: `linear-gradient(90deg, ${t.main}, ${t.sub})`, padding: '34px 48px' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: t.on, opacity: 0.9, letterSpacing: 2, whiteSpace: 'nowrap' }}>{c.eyebrow}</div>
          <SplitText text={c.heroTitle} size={72} color={t.on} delay={6} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', padding: '36px 44px' }}>
          {n > 0 ? (
            items.map((it: any, i: number) => {
              const itemLen = it.t.length;
              const itemSize = itemLen > 38 ? 46 : itemLen > 24 ? 54 : 60;
              return <Row key={i} t={it.t} ok={it.ok} delay={26 + i * 16} size={itemSize} color={t.text} />;
            })
          ) : (
            /* Grand Party & Ministerial Presentation Showcase (No green bullet lines!) */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32, textAlign: 'center', height: '100%' }}>
              <Reveal delay={16} from="zoom">
                <div style={{
                  padding: '26px 40px',
                  borderRadius: 36,
                  background: t.soft,
                  border: `3px solid ${t.main}55`,
                  boxShadow: `0 20px 50px ${t.main}33`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 32,
                }}>
                  <Sym k={t.sym} size={130} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 52, fontWeight: 900, color: t.main }}>{t.partyFull || t.party}</div>
                    <div style={{ fontSize: 30, fontWeight: 700, color: C.muted }}>చారిత్రక పరిపాలన · 2019-2024</div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={34} from="up">
                <div style={{ display: 'flex', gap: 24 }}>
                  <div style={{
                    padding: '16px 40px',
                    borderRadius: 999,
                    background: '#0047AB',
                    color: '#fff',
                    fontSize: 36,
                    fontWeight: 900,
                    boxShadow: '0 12px 28px rgba(0,71,171,0.35)',
                  }}>
                    ఉపముఖ్యమంత్రి
                  </div>
                  <div style={{
                    padding: '16px 40px',
                    borderRadius: 999,
                    background: '#008751',
                    color: '#fff',
                    fontSize: 36,
                    fontWeight: 900,
                    boxShadow: '0 12px 28px rgba(0,135,81,0.35)',
                  }}>
                    రెవెన్యూ మంత్రి
                  </div>
                </div>
              </Reveal>

              <Reveal delay={52}>
                <div style={{
                  fontSize: 36,
                  fontWeight: 800,
                  color: C.body,
                  borderTop: `2px solid ${C.line}`,
                  paddingTop: 26,
                  width: '90%',
                  lineHeight: 1.4,
                }}>
                  వైఎస్సార్ కాంగ్రెస్ పార్టీ ప్రభుత్వంలో కీలక మంత్రిత్వ శాఖల నిర్వహణ
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </div>
      {!left && cardEl}
    </div>
  );
};

const CrackLine: React.FC = () => {
  const frame = useCurrentFrame();
  const p = fill(70, 100, frame);
  return (
    <svg viewBox="0 0 400 600" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <polyline points="210,0 190,90 235,170 180,260 240,350 195,440 230,520 205,600" fill="none" stroke={C.red} strokeWidth={6} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

const Era: React.FC<{ c: Ch }> = ({ c }) => {
  const frame = useCurrentFrame();
  const f: number[] = c.focus;
  const maxI = Math.max(...f);
  const upto = ERAS.slice(0, maxI + 1);
  const prog = (fill(0, 60, frame) * maxI) / (ERAS.length - 1);
  return (
    <div style={{ display: 'grid', gridTemplateRows: '1fr 150px', gap: 24, height: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.45fr .55fr', gap: 32, minHeight: 0 }}>
        <div style={{ ...card, padding: '24px 36px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
          {f.length === 1 ? (() => {
            const e = ERAS[f[0]];
            const t = P[e.who];
            return (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 44, padding: '10px 16px' }}>
                {/* 1. LEFT: Prominent Box Type Image */}
                <Reveal delay={6} from="zoom">
                  <SquarePhoto src={e.img} ini={e.ini} color={t.main} size={330} />
                </Reveal>

                {/* 2. RIGHT: Related Matter */}
                <Reveal delay={16} from="right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: 14, flex: 1 }}>
                  <div style={{ fontSize: 96, fontWeight: 900, color: C.ink, lineHeight: 1, letterSpacing: 2 }}>
                    {e.y}
                  </div>
                  <div style={{ fontSize: 48, fontWeight: 900, color: t.text, lineHeight: 1.35, padding: '4px 0', whiteSpace: 'nowrap' }}>
                    {e.name}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    background: '#FFFFFF',
                    padding: '8px 24px',
                    borderRadius: 999,
                    border: `2px solid ${t.main}55`,
                    boxShadow: '0 4px 14px rgba(15,23,42,0.06)',
                  }}>
                    <Sym k={e.sym} size={44} />
                    <span style={{ fontSize: 30, fontWeight: 800, color: t.text }}>{e.party}</span>
                  </div>
                </Reveal>
              </div>
            );
          })() : (
            <div style={{ display: 'flex', gap: 28, justifyContent: 'space-around', alignItems: 'center', flex: 1 }}>
              {f.map((i, k) => {
                const e = ERAS[i];
                const t = P[e.who];
                return (
                  <Reveal key={i} delay={6 + k * 14} from="zoom" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
                    <SquarePhoto src={e.img} ini={e.ini} color={t.main} size={210} />
                    <div style={{ fontSize: 72, fontWeight: 900, lineHeight: 1.1, color: C.ink }}>{e.y}</div>
                    <div style={{ fontSize: 34, fontWeight: 900, color: t.text, lineHeight: 1.35, padding: '2px 0' }}>{e.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Sym k={e.sym} size={44} />
                      <span style={{ fontSize: 26, fontWeight: 700, color: C.muted }}>{e.party}</span>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}
          <Reveal delay={10}>
            <div style={{ fontSize: 34, fontWeight: 800, color: C.ink, textAlign: 'center', borderTop: `2px solid ${C.line}`, paddingTop: 14, lineHeight: 1.35 }}>{c.cap}</div>
          </Reveal>
          {c.crack && <CrackLine />}
        </div>
        <div style={{ ...card, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 32, fontWeight: 900, textAlign: 'center' }}>కుటుంబాల విజయాలు</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, flex: 1 }}>
            {(['baggu', 'dk'] as Who[]).map((w) => {
              const t = P[w];
              const items = upto.filter((e) => e.who === w);
              return (
                <div key={w} style={{ background: t.soft, borderRadius: 24, padding: '16px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: t.text }}>{t.short}</div>
                  <div style={{ fontSize: 90, fontWeight: 900, color: t.text, lineHeight: 1 }}>{items.length}</div>
                  {items.map((e, i) => (
                    <Reveal key={e.y} delay={10 + i * 5} from="zoom">
                      <div style={{ background: t.main, color: t.on, fontWeight: 800, fontSize: 26, borderRadius: 99, padding: '3px 18px' }}>{e.y}</div>
                    </Reveal>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ ...card, padding: '20px 44px', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 94, right: 94, top: 40, height: 8, background: C.line, borderRadius: 9 }} />
        <div style={{ position: 'absolute', left: 94, top: 40, height: 8, borderRadius: 9, width: `calc((100% - 188px) * ${prog})`, background: `linear-gradient(90deg, ${C.yel}, ${C.blue})` }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
          {ERAS.map((e, i) => {
            const on = f.includes(i);
            const t = P[e.who];
            const reached = i <= maxI;
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 100 }}>
                <div style={{ height: 46, display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: on ? 46 : 32, height: on ? 46 : 32, borderRadius: '50%', background: reached ? t.main : '#fff', border: `6px solid ${reached ? '#fff' : C.line}`, boxShadow: on ? `0 0 0 5px ${t.main}, 0 0 30px ${t.main}` : 'none' }} />
                </div>
                <div style={{ fontSize: 28, fontWeight: on ? 900 : 600, color: on ? C.ink : C.muted }}>{e.y}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Bars: React.FC<{ c: Ch }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const maxH = 370;
  const bars: { who: Who; v: number; s: number }[] = [{ who: 'baggu', ...c.b }, { who: 'dk', ...c.d }];
  const wt = P[c.winner as Who];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '480px 1fr 480px', gap: 26, height: '100%' }}>
      <LeaderCard who="baggu" w={480} h={940} delay={2} sub={c.winner === 'baggu' ? 'విజేత 👑' : undefined} />
      <div style={{ ...card, padding: '26px 36px', display: 'flex', flexDirection: 'column' }}>
        <SplitText text={c.year} size={110} delay={4} center />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', padding: '0 24px' }}>
          {bars.map((b, i) => {
            const grow = spring({ frame: frame - 16 - i * 4, fps, config: { damping: 18, stiffness: 70 } });
            const t = P[b.who];
            const dec = (String(b.s).split('.')[1] || '').length;
            return (
              <div key={b.who} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: '40%' }}>
                <AnimatedCounter target={b.v} startFrame={18} duration={60} fontSize={58} color={t.text} />
                <div style={{ width: '100%', height: Math.max(0, (b.v / 100000) * maxH * grow), borderRadius: '22px 22px 0 0', background: `linear-gradient(${t.sub}, ${t.main})`, boxShadow: `0 14px 40px ${t.main}55`, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, bottom: 0, left: ((frame * 9) % 600) - 150, width: 70, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent)', transform: 'skewX(-20deg)' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                  <Sym k={t.sym} size={52} />
                  <span style={{ fontSize: 40, fontWeight: 900 }}>{t.short}</span>
                </div>
                <AnimatedCounter target={b.s} decimals={dec} suffix="%" startFrame={20} duration={60} fontSize={36} color={C.muted} />
              </div>
            );
          })}
        </div>
        <Reveal delay={95}>
          <div style={{ marginTop: 16, borderRadius: 26, background: wt.main, color: wt.on, textAlign: 'center', padding: '12px 0', fontSize: 46, fontWeight: 900 }}>
            మెజారిటీ <AnimatedCounter target={c.margin} startFrame={98} duration={40} fontSize={74} color={wt.on} />
          </div>
        </Reveal>
        <Reveal delay={120}><div style={{ textAlign: 'center', fontSize: 36, fontWeight: 700, marginTop: 12, color: C.body }}>{c.note}</div></Reveal>
      </div>
      <LeaderCard who="dk" w={480} h={940} delay={10} sub={c.winner === 'dk' ? 'విజేత 👑' : undefined} />
    </div>
  );
};

const BigStat: React.FC<{ c: Ch }> = ({ c }) => {
  const frame = useCurrentFrame();
  const t = P[(c.who as Who) || 'baggu'];
  const fromTo = c.from !== undefined;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 700px', gap: 36, height: '100%' }}>
      <div style={{ ...card, padding: '44px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28, position: 'relative', overflow: 'hidden' }}>
        <Reveal delay={4}><div style={{ fontSize: 42, fontWeight: 800, color: C.muted }}>{c.label}</div></Reveal>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 28, flexWrap: 'nowrap' }}>
          {fromTo && (
            <>
              <AnimatedCounter target={c.from} decimals={c.fromDecimals || 0} suffix={c.suffix || ''} startFrame={10} duration={40} fontSize={130} color={C.muted} />
              <span style={{ fontSize: 100, color: C.red, fontWeight: 900 }}>→</span>
            </>
          )}
          <AnimatedCounter target={c.value} decimals={c.decimals || 0} suffix={c.suffix || ''} startFrame={fromTo ? 50 : 10} duration={50} fontSize={fromTo ? 160 : 270} color={t.text} />
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {(c.chips || []).map((x: string, i: number) => <Reveal key={i} delay={60 + i * 10} from="zoom"><Pill>{x}</Pill></Reveal>)}
        </div>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: ((frame * 14) % 2400) - 300, width: 160, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.7), transparent)', transform: 'skewX(-20deg)' }} />
      </div>
      <LeaderCard who={(c.who as Who) || 'baggu'} w={700} h={940} delay={6} />
    </div>
  );
};

const MandalMap: React.FC<{ active: number[] }> = ({ active }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ ...card, padding: '28px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontSize: 36, fontWeight: 900 }}>నరసన్నపేట నియోజకవర్గం</div>
      <div style={{ position: 'relative', width: 620, flex: 1, marginTop: 10 }}>
        {MANDALS.map((m, i) => {
          const on = active.includes(i);
          const pop = spring({ frame: frame - 6 - i * 6, fps, config: { damping: 12 } });
          const pulse = on ? 1 + Math.sin(frame * 0.12) * 0.025 : 1;
          return (
            <div key={i} style={{
              position: 'absolute', left: m.x, top: m.y, width: m.w, height: m.h, borderRadius: '42% 58% 50% 50% / 50% 42% 58% 50%',
              background: on ? `linear-gradient(135deg, ${m.col}, ${m.col}CC)` : '#E2E8F0', color: on ? '#fff' : C.muted,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38, fontWeight: 900, textAlign: 'center',
              transform: `scale(${pop * pulse})`, boxShadow: on ? `0 0 0 6px ${m.col}44, 0 20px 50px ${m.col}66` : 'none',
            }}>{m.n}</div>
          );
        })}
      </div>
      <Reveal delay={40}><div style={{ background: C.yel, color: C.ink, fontWeight: 900, fontSize: 34, borderRadius: 99, padding: '8px 30px' }}>TDP ఆధిక్యం ↑ 2024</div></Reveal>
    </div>
  );
};

const Mandal: React.FC<{ c: Ch }> = ({ c }) => {
  const col = c.idx.length === 1 ? MANDALS[c.idx[0]].col : c.idx.length === 2 ? '#EA580C' : C.ink;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.3fr .7fr', gap: 36, height: '100%' }}>
      <div style={{ ...card, padding: '40px 52px', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', borderLeft: `14px solid ${col}` }}>
        <div>
          <Reveal delay={2}><div style={{ display: 'inline-block', background: col, color: '#fff', borderRadius: 99, padding: '6px 26px', fontSize: 28, fontWeight: 900, letterSpacing: 3 }}>{c.tag}</div></Reveal>
          <SplitText text={c.name} size={c.name.length > 12 ? 92 : 120} color={col} delay={8} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
          {c.points.map((p: string, i: number) => <Row key={i} t={p} delay={30 + i * 16} size={42} color={col} />)}
        </div>
      </div>
      <MandalMap active={c.idx} />
    </div>
  );
};

const AllianceRow: React.FC<{ keys: SymKey[]; title: string; sub: string; merge: boolean; tone: string; delay: number }> = ({ keys, title, sub, merge, tone, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay - 10, fps, config: { damping: 16, stiffness: 60 } });
  const gap = merge ? 320 - 350 * p : 20 + 360 * p;
  return (
    <Reveal delay={delay} style={{ ...card, flex: 1, padding: '24px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16, border: `3px solid ${tone}55` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 56, fontWeight: 900, color: tone }}>{title}</div>
        <div style={{ fontSize: 34, fontWeight: 700, color: C.body }}>{sub}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150, position: 'relative' }}>
        {keys.map((k, i) => (
          <div key={k} style={{ marginLeft: i ? gap : 0, display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: `3px solid ${SYM_META[k].c}`, borderRadius: 99, padding: '8px 26px 8px 8px', boxShadow: '0 10px 24px rgba(15,23,42,.12)', zIndex: 3 - i }}>
            <Sym k={k} size={84} />
            <span style={{ fontSize: 40, fontWeight: 900, color: SYM_META[k].c }}>{SYM_META[k].t}</span>
          </div>
        ))}
        {!merge && <div style={{ position: 'absolute', opacity: p, background: '#FEE2E2', color: C.red, fontWeight: 900, fontSize: 34, borderRadius: 99, padding: '6px 26px' }}>✕ ఓట్ల చీలిక</div>}
        {merge && <div style={{ position: 'absolute', inset: '8px 18%', border: `6px solid ${C.green}`, borderRadius: 99, opacity: p, boxShadow: `0 0 50px ${C.green}66` }} />}
      </div>
    </Reveal>
  );
};

const Alliance: React.FC<{ c: Ch }> = ({ c }) => {
  const both = c.mode === 'both';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 520px', gap: 36, height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {both && <AllianceRow keys={['tdp', 'jsp']} title="2019 · విడివిడిగా" sub="ప్రభుత్వ వ్యతిరేక ఓటు చీలింది" merge={false} tone={C.red} delay={4} />}
        <AllianceRow keys={['tdp', 'jsp', 'bjp']} title="2024 · ఒకే కూటమి" sub="ఓట్లు చీలలేదు" merge tone={C.green} delay={both ? 40 : 4} />
      </div>
      <div style={{ ...card, padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 34 }}>
        <Reveal delay={6}><div style={{ fontSize: 50, fontWeight: 900 }}><Mark delay={12}>{c.sideTitle}</Mark></div></Reveal>
        {c.points.map((p: string, i: number) => <Row key={i} t={p} ok delay={26 + i * 16} size={38} color={C.green} />)}
      </div>
    </div>
  );
};

const Chips: React.FC<{ c: Ch }> = ({ c }) => {
  const cols: number = c.cols || 3;
  const big = cols >= 4 ? 76 : cols === 3 ? 150 : 110;
  const accents = [C.blue, C.yel, C.green, '#EA580C', '#0891B2'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, height: '100%' }}>
      <SplitText text={c.heroTitle} size={76} delay={4} center />
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 28, flex: 1 }}>
        {c.tiles.map((t: any, i: number) => {
          const th = t.color ? P[t.color as Who] : null;
          const col = th ? th.main : accents[i % 5];
          const hasImg = Boolean(t.img);

          if (hasImg) {
            return (
              <Reveal
                key={i}
                delay={20 + i * 10}
                from="zoom"
                style={{
                  ...card,
                  borderTop: `10px solid ${col}`,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 20,
                  justifyContent: 'space-between',
                  borderRadius: 32,
                  boxShadow: `0 20px 48px rgba(15,23,42,0.08), 0 0 0 1.5px ${col}33`,
                }}
              >
                {/* 1. TOP: Related Image Box */}
                <div style={{
                  flex: 1,
                  borderRadius: 22,
                  overflow: 'hidden',
                  position: 'relative',
                  border: '2px solid rgba(15,23,42,0.08)',
                  boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
                  background: '#F1F5F9',
                }}>
                  <img
                    src={t.img}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: t.pos || 'center 20%',
                    }}
                  />
                  {th && (
                    <div style={{ position: 'absolute', top: 12, right: 12 }}>
                      <Sym k={th.sym} size={52} />
                    </div>
                  )}
                </div>

                {/* 2. BOTTOM: Text pushed down */}
                <div style={{
                  padding: '20px 12px 6px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  {t.t && (
                    <div style={{
                      fontSize: cols >= 4 ? 34 : 40,
                      fontWeight: 900,
                      color: C.ink,
                      lineHeight: 1.35,
                      padding: '4px 0',
                    }}>
                      {t.t}
                    </div>
                  )}
                  {t.sub && (
                    <div style={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: C.muted,
                    }}>
                      {t.sub}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          }

          return (
            <Reveal key={i} delay={20 + i * 10} from="zoom" style={{ ...card, borderTop: `10px solid ${col}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 28, textAlign: 'center' }}>
              <div style={{ fontSize: big, fontWeight: 900, color: th ? th.text : C.ink, lineHeight: 1.2 }}>{t.big}</div>
              {t.t && <div style={{ fontSize: cols >= 4 ? 38 : 48, fontWeight: 800, color: C.ink }}>{t.t}</div>}
              {t.sub && <div style={{ fontSize: 32, color: C.muted, fontWeight: 600 }}>{t.sub}</div>}
            </Reveal>
          );
        })}
      </div>
      {c.footer && (
        <Reveal delay={70} style={{ alignSelf: 'center' }}>
          <div style={{ background: C.ink, color: '#fff', padding: '16px 48px', borderRadius: 99, fontSize: 38, fontWeight: 900 }}>{c.footer}</div>
        </Reveal>
      )}
    </div>
  );
};

const Swing: React.FC<{ c: Ch }> = ({ c }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
      <SplitText text={c.heroTitle} size={74} delay={4} center />
      <div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'center', flex: 1, gap: 12 }}>
        {c.nodes.map((n: any, i: number) => {
          const q = !n.who;
          const t = q ? null : P[n.who as Who];
          const pulse = q ? 1 + Math.sin(frame * 0.1) * 0.03 : 1;
          return (
            <React.Fragment key={i}>
              <Reveal
                delay={18 + i * 18}
                from="zoom"
                style={{
                  ...card,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '24px 20px 22px',
                  border: q ? `4px dashed ${C.muted}` : `3.5px solid ${t!.main}`,
                  background: q ? C.white : t!.soft,
                  borderRadius: 32,
                  boxShadow: t ? `0 20px 50px ${t.main}30, 0 8px 24px rgba(15,23,42,0.06)` : undefined,
                  transform: `scale(${pulse})`,
                }}
              >
                {/* 1. Year Header */}
                <div style={{ fontSize: 68, fontWeight: 900, color: q ? C.muted : C.ink, lineHeight: 1.1, letterSpacing: 2 }}>
                  {n.y}
                </div>

                {/* 2. Large Square Photo */}
                {t ? (
                  <SquarePhoto src={t.img} ini={t.ini} color={t.main} size={300} />
                ) : (
                  <div style={{ width: 300, height: 300, borderRadius: 26, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 160, fontWeight: 900, color: C.muted }}>
                    ?
                  </div>
                )}

                {/* 3. Candidate Name */}
                {t && (
                  <div style={{
                    fontSize: 34,
                    fontWeight: 900,
                    color: C.ink,
                    lineHeight: 1.35,
                    padding: '4px 0',
                    whiteSpace: 'nowrap',
                    textAlign: 'center',
                  }}>
                    {t.name}
                  </div>
                )}

                {/* 4. Party Pill */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: '#FFFFFF',
                  padding: '6px 22px',
                  borderRadius: 999,
                  border: `2px solid ${t ? t.main : C.muted}44`,
                  boxShadow: '0 4px 14px rgba(15,23,42,0.06)',
                }}>
                  {t && <Sym k={t.sym} size={42} />}
                  <span style={{ fontSize: 28, fontWeight: 900, color: t ? t.text : C.muted }}>{n.t}</span>
                </div>
              </Reveal>
              {i < c.nodes.length - 1 && (
                <Reveal delay={26 + i * 18} style={{ width: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, fontWeight: 900, color: C.muted }}>
                  →
                </Reveal>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <Reveal delay={80}><div style={{ textAlign: 'center', fontSize: 50, fontWeight: 900, color: C.ink }}><Mark delay={86}>{c.foot}</Mark></div></Reveal>
    </div>
  );
};

const Quote: React.FC<{ c: Ch }> = ({ c }) => {
  const sides: (Who | null)[] = c.sides || [null, null];
  const cols = `${sides[0] ? '620px ' : ''}1fr${sides[1] ? ' 620px' : ''}`;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 36, height: '100%' }}>
      {sides[0] && <LeaderCard who={sides[0] as Who} w={620} h={940} delay={2} />}
      <div style={{ ...card, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '40px 60px', gap: 30, position: 'relative', overflow: 'hidden' }}>
        {c.bigYear && <div style={{ position: 'absolute', fontSize: 460, fontWeight: 900, color: 'rgba(15,23,42,.05)', lineHeight: 1 }}>{c.bigYear}</div>}
        {c.sub && <Reveal><div style={{ fontSize: 40, fontWeight: 800, color: C.muted, letterSpacing: 2, position: 'relative' }}>{c.sub}</div></Reveal>}
        <div style={{ position: 'relative' }}><SplitText text={c.text} size={c.size || 112} delay={8} center shadow="6px 6px 0 rgba(245,184,0,.5)" /></div>
        <Reveal delay={60}><div style={{ width: 360, height: 10, borderRadius: 9, background: `linear-gradient(90deg, ${C.yel}, ${C.blue})` }} /></Reveal>
      </div>
      {sides[1] && <LeaderCard who={sides[1] as Who} w={620} h={940} delay={10} />}
    </div>
  );
};

const CTA: React.FC<{ c: Ch }> = ({ c }) => {
  const frame = useCurrentFrame();
  const dark: React.CSSProperties = { ...card, background: C.ink, border: 0, color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 34, padding: 48, textAlign: 'center' };
  if (c.mode === 'comment') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 36, height: '100%' }}>
        <div style={dark}>
          <div style={{ fontSize: 220, transform: `scale(${1 + Math.sin(frame * 0.12) * 0.05})` }}>💬</div>
          <SplitText text={c.heroTitle} size={84} color="#fff" delay={6} center />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {c.prompts.map((p: string, i: number) => (
            <Reveal key={i} delay={30 + i * 20} from="right" style={{ ...card, flex: 1, padding: '0 44px', display: 'flex', alignItems: 'center', gap: 28 }}>
              <div style={{ width: 90, height: 90, borderRadius: '50%', background: i ? C.blue : C.yel, color: i ? '#fff' : C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50, fontWeight: 900, flex: 'none' }}>{i + 1}</div>
              <div style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.4 }}>{p}</div>
            </Reveal>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 36, height: '100%' }}>
      <div style={{ ...card, padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <SplitText text="మూడు ఎన్నికల స్కోర్‌కార్డ్" size={60} delay={4} />
        {ELECTIONS.map((e, i) => {
          const t = P[e.who];
          return (
            <Reveal key={e.y} delay={24 + i * 16} from="right" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 24, background: t.soft, borderRadius: 26, padding: '0 28px', border: `3px solid ${t.main}66` }}>
              <div style={{ fontSize: 76, fontWeight: 900, width: 190 }}>{e.y}</div>
              <Photo src={t.img} ini={t.ini} color={t.main} size={110} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 42, fontWeight: 900, color: t.text }}>{t.short}</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: C.muted }}>{e.v} ఓట్లు</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: C.muted }}>మెజారిటీ</div>
                <div style={{ fontSize: 56, fontWeight: 900, color: t.text }}>{e.m}</div>
              </div>
              <Sym k={t.sym} size={78} />
            </Reveal>
          );
        })}
      </div>
      <div style={dark}>
        <SplitText text={c.heroTitle} size={66} color="#fff" delay={6} center />
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['👍 లైక్', '↗ షేర్', '🔔 సబ్‌స్క్రైబ్'].map((t, i) => {
            const pulse = i === 2 ? 1 + Math.sin(frame * 0.18) * 0.06 : 1;
            return (
              <Reveal key={i} delay={40 + i * 12} from="zoom">
                <div style={{ transform: `scale(${pulse})`, padding: '18px 38px', borderRadius: 999, background: i === 2 ? C.yel : '#fff', color: C.ink, fontSize: 40, fontWeight: 900 }}>{t}</div>
              </Reveal>
            );
          })}
        </div>
        <Reveal delay={90}><div style={{ fontSize: 34, fontWeight: 700, opacity: 0.8 }}>ధన్యవాదాలు!</div></Reveal>
      </div>
    </div>
  );
};

const TEMPLATES: Record<string, React.FC<{ c: Ch }>> = {
  hero: Hero, faceoff: FaceOff, leader: LeaderSlide, era: Era, bars: Bars, bigstat: BigStat,
  mandal: Mandal, alliance: Alliance, chips: Chips, swing: Swing, quote: Quote, cta: CTA,
};

// ============================================================================
// 5. CHAPTER SCENE
// ============================================================================
export const ChapterScene: React.FC<{ ch: Ch; idx: number; start: number; dur: number; total: number }> = ({ ch, idx, start, dur, total }) => {
  const frame = useCurrentFrame();
  const gf = start + frame;
  const e = 1 - Math.pow(1 - fill(0, 20, frame), 3);
  const exit = 1 - fill(dur - 8, dur, frame);
  const v = idx % 3;
  const wrap: React.CSSProperties =
    v === 0 ? { clipPath: `inset(0 ${(1 - e) * 100}% 0 0)`, opacity: exit }
    : v === 1 ? { transform: `translateY(${(1 - e) * 70}px)`, opacity: e * exit }
    : { transform: `scale(${1.05 - 0.05 * e})`, filter: `blur(${(1 - e) * 10}px)`, opacity: e * exit };
  const actStart = idx > 0 && CHAPTERS[idx - 1].act !== ch.act;
  const T = TEMPLATES[ch.type];
  return (
    <AbsoluteFill>
      <StudioWhiteBackground gf={gf} />
      <BroadcastHUD ch={ch} gf={gf} total={total} />
      <AbsoluteFill style={{ padding: '44px 56px 40px', ...wrap }}>
        <T c={ch} />
      </AbsoluteFill>
      {actStart && (
        <div style={{
          position: 'absolute', top: 0, bottom: 0, width: 460, left: interpolate(frame, [0, 26], [-480, 1940], clamp), zIndex: 70, pointerEvents: 'none',
          background: 'linear-gradient(90deg, transparent, rgba(245,184,0,.7), rgba(0,102,204,.7), transparent)',
        }} />
      )}
    </AbsoluteFill>
  );
};

// ============================================================================
// MASTER TIMELINE COMPONENT (45-chapter Series)
// ============================================================================
export const NarasannapetaVideo: React.FC<{ timeScale?: number }> = ({ timeScale = 1 }) => {
  const { frames, starts, total } = buildTimeline(timeScale);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: `${fontAnek}, 'Anek Telugu', sans-serif` }}>
      {/* 1. Continuous Master Voice-Over Audio */}
      <Audio src={staticFile(MASTER_VO)} volume={1} />

      {/* 2. Subtle Background Beat */}
      <Audio src={staticFile(BG_MUSIC)} volume={0.1} loop />

      {/* 3. Sequential 45-Chapter Timeline */}
      <Series>
        {CHAPTERS.map((ch, i) => (
          <Series.Sequence key={ch.id} durationInFrames={frames[i]}>
            <ChapterScene ch={ch} idx={i} start={starts[i]} dur={frames[i]} total={total} />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
