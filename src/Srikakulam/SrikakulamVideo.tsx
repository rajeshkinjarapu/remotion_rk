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
import srikakulamTimings from './srikakulam_timings.json';

const { fontFamily: fontAnek } = loadAnek();

// ============================================================================
// SRIKAKULAM POLITICAL ANALYSIS · 32 CHAPTERS · 16:9 (1920x1080) · 30 FPS
// Gondu Shankar (TDP)  vs  Dharmana Prasada Rao (YSRCP) · 2024
// ============================================================================

// ---------- IMAGE PATHS (public/images/srikakulam/) -------------------------
const IMG = (p: string) => staticFile(`images/srikakulam/${p}`);

export const LEADER_IMAGES = {
  shankar: IMG('gondu_shankar_main.jpg'),
  shankarGrassroots: IMG('gondu_shankar_grassroots.jpg'),
  dharmana: IMG('dharmana_prasada_rao_main.jpg'),
  dharmanaWebp: IMG('dharmana_prasad.webp'),
};
export const OTHER_IMAGES = {
  gundaAppala: IMG('gunda_appala_suryanarayana.png'),
  gundaLakshmi: IMG('gunda_lakshmi_devi.png'),
  rammohan: IMG('rammohan_naidu.jpg'),
};
export const PARTY_SYMBOLS = {
  tdp: IMG('symbols/tdp_cycle.png'),
  ysrcp: IMG('symbols/ysrcp_fan.png'),
  jsp: IMG('symbols/jsp_glass.png'),
  bjp: IMG('symbols/bjp_lotus.png'),
  inc: IMG('symbols/inc_hand.png'),
};

// ---------- AUDIO ------------------------------------------------------------
const MASTER_VO = 'audio/srikakulam/master_complete_audio.wav';
const BG_MUSIC = 'Youtube Free Musics/Beat Your Competition - Vibe Tracks.mp3';

// ---------- PALETTE ----------------------------------------------------------
const C = {
  bg: '#F8FAFC', white: '#FFFFFF', line: 'rgba(15, 23, 42, 0.09)', ink: '#0F172A', body: '#334155', muted: '#64748B',
  yel: '#F5B800', yel2: '#FFD84D', yelText: '#9A6F00', blue: '#0066CC', sky: '#0EA5E9', green: '#16A34A', red: '#DC2626',
};

type SymKey = keyof typeof PARTY_SYMBOLS;
type PartyKey = 'tdp' | 'ysrcp' | 'inc';
type Who = 'shankar' | 'dharmana' | 'rammohan';

const PC: Record<PartyKey, { main: string; sub: string; text: string; soft: string; on: string }> = {
  tdp: { main: C.yel, sub: C.yel2, text: C.yelText, soft: 'rgba(245,184,0,0.14)', on: C.ink },
  ysrcp: { main: C.blue, sub: C.sky, text: C.blue, soft: 'rgba(0,102,204,0.09)', on: '#FFFFFF' },
  inc: { main: C.green, sub: '#4ADE80', text: '#15803D', soft: 'rgba(22,163,74,0.12)', on: '#FFFFFF' },
};
const PARTY_TE: Record<PartyKey, string> = { tdp: 'తెలుగుదేశం', ysrcp: 'వైఎస్సార్సీపీ', inc: 'కాంగ్రెస్' };

const P: Record<Who, any> = {
  shankar: {
    ...PC.tdp,
    name: 'గొండు శంకర్',
    short: 'శంకర్',
    party: PARTY_TE.tdp,
    partyFull: 'తెలుగుదేశం పార్టీ (TDP)',
    sym: 'tdp' as SymKey,
    img: LEADER_IMAGES.shankar,
    ini: 'శం',
    partyBg: '#FFD800',
    partyText: '#0F172A',
  },
  dharmana: {
    ...PC.ysrcp,
    name: 'ధర్మాన ప్రసాదరావు',
    short: 'ధర్మాన',
    party: PARTY_TE.ysrcp,
    partyFull: 'వైఎస్సార్ కాంగ్రెస్ పార్టీ (YSRCP)',
    sym: 'ysrcp' as SymKey,
    img: LEADER_IMAGES.dharmana,
    ini: 'ధ',
    partyBg: '#0066CC',
    partyText: '#FFFFFF',
  },
  rammohan: {
    ...PC.tdp,
    name: 'కింజరాపు రామ్మోహన్ నాయుడు',
    short: 'రామ్మోహన్ నాయుడు',
    party: PARTY_TE.tdp,
    partyFull: 'శ్రీకాకుళం ఎంపీ (కేంద్ర మంత్రి)',
    sym: 'tdp' as SymKey,
    img: OTHER_IMAGES.rammohan,
    ini: 'రా',
    partyBg: '#FFD800',
    partyText: '#0F172A',
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
const card: React.CSSProperties = { background: C.white, border: `2px solid ${C.line}`, borderRadius: 34, boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08)' };

const FPS = 30;

// ---------- SYNC CONTEXT -----------------------------------------------------
const Sync = React.createContext({ scale: 1, dur: 300 });
const useD = () => {
  const { scale, dur } = React.useContext(Sync);
  return (d: number) => Math.round(Math.min(d * scale, dur * 0.7));
};

// ---------- ACTS -------------------------------------------------------------
export const ACTS = [
  { key: 'HOOK', te: 'హుక్ & పరిచయం' },
  { key: 'HISTORY', te: 'చారిత్రక పోరు' },
  { key: 'SHANKAR', te: 'గొండు శంకర్ ప్రస్థానం' },
  { key: 'NUMBERS', te: 'ఎన్నికల గణాంకాలు' },
  { key: 'REASONS', te: 'ఓటమికి కారణాలు' },
  { key: 'VERDICT', te: 'తీర్పు & భవిష్యత్తు' },
];

// ---------- ERAS (timeline) --------------------------------------------------
export type Era = { y: string; party: PartyKey; fam: 'gunda' | 'dharmana' | 'shankar'; n: number; name: string; img: string; ini: string; note?: string };
export const ERAS: Era[] = [
  { y: '1985–99', party: 'tdp', fam: 'gunda', n: 4, name: 'గుండ అప్పల సూర్యనారాయణ', img: OTHER_IMAGES.gundaAppala, ini: 'గు', note: '1985 · 1989 · 1994 · 1999' },
  { y: '2004', party: 'inc', fam: 'dharmana', n: 1, name: 'ధర్మాన ప్రసాదరావు', img: LEADER_IMAGES.dharmana, ini: 'ధ', note: 'నరసన్నపేట నుంచి శ్రీకాకుళానికి' },
  { y: '2009', party: 'inc', fam: 'dharmana', n: 1, name: 'ధర్మాన ప్రసాదరావు', img: LEADER_IMAGES.dharmana, ini: 'ధ', note: 'వరుసగా రెండోసారి' },
  { y: '2014', party: 'tdp', fam: 'gunda', n: 1, name: 'గుండ లక్ష్మీదేవి', img: OTHER_IMAGES.gundaLakshmi, ini: 'ల', note: 'మెజారిటీ 24,131' },
  { y: '2019', party: 'ysrcp', fam: 'dharmana', n: 1, name: 'ధర్మాన ప్రసాదరావు', img: LEADER_IMAGES.dharmana, ini: 'ధ', note: 'మెజారిటీ 5,777' },
  { y: '2024', party: 'tdp', fam: 'shankar', n: 1, name: 'గొండు శంకర్', img: LEADER_IMAGES.shankar, ini: 'శం', note: 'మెజారిటీ 52,521' },
];

export const ELECTIONS = [
  { y: '2014', era: 3, m: '24,131' },
  { y: '2019', era: 4, m: '5,777' },
  { y: '2024', era: 5, m: '52,521' },
];

// ============================================================================
// CHAPTERS (32 Chapters across 6 Acts)
// ============================================================================
export type Ch = { id: number; act: number; sec: number; title: string; type: string; [k: string]: any };

const RAW: Omit<Ch, 'id'>[] = [
  // ───────────── ACT 1 · HOOK ─────────────
  { act: 1, sec: 12, title: 'శ్రీకాకుళం – చారిత్రాత్మక తీర్పు', type: 'hero',
    eyebrow: 'శ్రీకాకుళం జిల్లా కేంద్రం · అసెంబ్లీ నియోజకవర్గం', heroTitle: 'శ్రీకాకుళం', tagline: 'ఒక తరం ఆధిపత్యానికి ముగింపు!',
    chips: ['2024 ఎన్నికలు', 'గొండు శంకర్', 'ధర్మాన ప్రసాదరావు'], stat: { value: 52521, label: 'భారీ మెజారిటీ' } },
  { act: 1, sec: 11, title: 'ధర్మాన ప్రసాదరావు – రాజకీయ దిగ్గజం', type: 'leader', who: 'dharmana',
    eyebrow: 'ఒకవైపు…', heroTitle: 'ధర్మాన ప్రసాదరావు',
    items: [{ t: 'దాదాపు నాలుగు దశాబ్దాల రాజకీయ అనుభవం' }, { t: 'ఉమ్మడి ఏపీ నుంచి నవ్యాంధ్ర వరకు మంత్రి' }, { t: 'రెవెన్యూ, రోడ్లు భవనాల శాఖల మంత్రి' }] },
  { act: 1, sec: 12, title: 'గొండు శంకర్ – సర్పంచ్ నుంచి అభ్యర్థిగా', type: 'leader', who: 'shankar',
    eyebrow: 'మరోవైపు…', heroTitle: 'గొండు శంకర్',
    items: [{ t: 'కృష్ణాప్పపేట సర్పంచ్ గా ప్రస్థానం' }, { t: 'సర్పంచుల సంఘం అధ్యక్షుడు' }, { t: 'తొలిసారి అసెంబ్లీ టికెట్' }] },
  { act: 1, sec: 14, title: 'కొత్త అభ్యర్థి నిలబడగలడా?', type: 'faceoff',
    leftNote: 'తొలిసారి బరిలో', rightNote: 'సీనియర్ మంత్రి', centerTitle: 'కొత్త అభ్యర్థి నిలబడగలడా?',
    items: ['విశ్లేషకుల సందేహం: హేమాహేమీ ముందు కొత్త ముఖం', 'జూన్ 4, 2024 – ఫలితాలు'],
    stat: { value: 52521, label: 'శంకర్ సంచలన మెజారిటీ' } },
  { act: 1, sec: 10, title: '52,521 – కనీవినీ ఎరుగని విజయం', type: 'bigstat', who: 'shankar',
    label: 'గొండు శంకర్ మెజారిటీ', value: 52521, chips: ['శ్రీకాకుళం చరిత్రలో రికార్డు', 'జూన్ 4, 2024'] },
  { act: 1, sec: 14, title: 'ఈ వీడియోలో ఏముంది?', type: 'chips', cols: 3,
    heroTitle: 'ఈ రోజు మనం చూడబోయేది',
    tiles: [{ big: '❓', t: 'అసలు ఏం జరిగింది?' }, { big: '⚔️', t: '35 ఏళ్ల గుండ–ధర్మాన రాజకీయం' }, { big: '📊', t: 'డేటా · గణాంకాలు · గ్రౌండ్ రియాలిటీ' }] },

  // ───────────── ACT 2 · HISTORY ─────────────
  { act: 2, sec: 14, title: '1985–1999 – గుండ అప్పల సూర్యనారాయణ', type: 'era', focus: [0],
    cap: 'వరుసగా నాలుగుసార్లు గెలిచి శ్రీకాకుళాన్ని టీడీపీకి కంచుకోటగా మార్చారు' },
  { act: 2, sec: 13, title: '2004 & 2009 – ధర్మాన ఎంట్రీ', type: 'era', focus: [1, 2],
    cap: 'వైఎస్సార్, కిరణ్ కుమార్ రెడ్డి మంత్రివర్గాల్లో శక్తివంతమైన మంత్రి' },
  { act: 2, sec: 13, title: '2014 – గుండ లక్ష్మీదేవి విజయం', type: 'era', focus: [3],
    cap: 'రాష్ట్ర విభజన తర్వాత ధర్మానపై 24,131 ఓట్ల మెజారిటీ' },
  { act: 2, sec: 12, title: '2019 – జనసేన చీలిక, స్వల్ప మెజారిటీ', type: 'era', focus: [4],
    cap: 'ధర్మాన గెలిచి వైసీపీ ప్రభుత్వంలో రెవెన్యూ మంత్రి అయ్యారు' },
  { act: 2, sec: 13, title: '7,557 చీలిక vs 5,777 మెజారిటీ', type: 'twin', heroTitle: '2019లో జనసేన విడిగా పోటీ చేయడంతో…',
    l: { v: 7557, label: 'చీలిపోయిన ఓట్లు', col: C.yelText, sub: 'జనసేన' },
    r: { v: 5777, label: 'ధర్మాన మెజారిటీ', col: C.blue, sub: 'వైసీపీ' }, mid: '>',
    foot: 'చీలిన ఓట్లే మెజారిటీ కంటే ఎక్కువ!' },
  { act: 2, sec: 12, title: '40 ఏళ్ల గుండ vs ధర్మాన రాజకీయం', type: 'swing',
    heroTitle: 'దాదాపు 40 ఏళ్లు… రెండే కుటుంబాలు!',
    nodes: [{ era: 3, t: 'టీడీపీ' }, { era: 4, t: 'వైసీపీ' }, { era: 5, t: 'టీడీపీ' }],
    foot: 'కానీ 2024లో సీన్ మారింది!' },
  { act: 2, sec: 13, title: 'చంద్రబాబు సాహసోపేత నిర్ణయం', type: 'leader', who: 'shankar',
    eyebrow: 'టీడీపీ అధినేత చంద్రబాబు నాయుడు', heroTitle: 'సాహసోపేత నిర్ణయం',
    items: [{ t: 'దశాబ్దాలుగా ఆశిస్తున్న గుండ కుటుంబాన్ని కాదని' }, { t: 'గ్రౌండ్ లెవల్ మాస్ లీడర్ గొండు శంకర్ కు టికెట్', ok: true }] },

  // ───────────── ACT 3 · SHANKAR ─────────────
  { act: 3, sec: 13, title: 'అసలు ఎవరీ గొండు శంకర్?', type: 'leader', who: 'shankar',
    eyebrow: 'అత్యంత సాధారణంగా మొదలైన ప్రస్థానం', heroTitle: 'గొండు శంకర్ ప్రస్థానం',
    items: [{ t: 'శ్రీకాకుళం మండలం – కృష్ణాప్పపేట సర్పంచ్' }, { t: 'శ్రీకాకుళం జిల్లా సర్పంచుల సంఘం అధ్యక్షుడు' }] },
  { act: 3, sec: 14, title: 'పంచాయతీ నిధుల కోసం పోరాటం', type: 'leader', who: 'shankar',
    eyebrow: '2019 – 2024', heroTitle: 'సర్పంచుల పోరాటం',
    items: [{ t: 'పంచాయతీ నిధుల మళ్లింపుపై నిరసన', ok: true }, { t: 'పార్టీలకు అతీతంగా సర్పంచులను ఏకం చేశారు', ok: true }, { t: 'రాష్ట్రవ్యాప్తంగా సంచలనం', ok: true }] },
  { act: 3, sec: 13, title: 'టికెట్ ఎలా దక్కింది?', type: 'chips', cols: 3,
    heroTitle: 'శంకర్ కు టికెట్ ఎందుకు దక్కింది?',
    tiles: [
      { img: LEADER_IMAGES.shankarGrassroots, t: 'ప్రజల మధ్య నిరంతరం', color: 'tdp' },
      { img: LEADER_IMAGES.shankar, t: 'యువతలో క్రేజ్', color: 'tdp' },
      { img: OTHER_IMAGES.rammohan, t: 'రామ్మోహన్ నాయుడు & అచ్చెన్నాయుడు మద్దతు', color: 'tdp' },
    ] },
  { act: 3, sec: 10, title: 'అసమ్మతిని కలుపుకున్న శంకర్', type: 'quote', sides: ['shankar', null],
    sub: 'టికెట్ ప్రకటించిన కొత్తలో…', text: 'అసమ్మతి ఉన్నా… కలుపుగోలుతనంతో అందరినీ కలుపుకున్నారు!', size: 80 },

  // ───────────── ACT 4 · NUMBERS ─────────────
  { act: 4, sec: 13, title: '2024 పోలింగ్ – 70%', type: 'chips', cols: 3,
    heroTitle: 'మే 13, 2024 – శ్రీకాకుళం పోలింగ్',
    tiles: [{ big: '2,74,523', t: 'మొత్తం ఓట్లు' }, { big: '1,92,168', t: 'ఓటు వేసినవారు' }, { big: '70%', t: 'పోలింగ్ శాతం', color: 'tdp' }] },
  { act: 4, sec: 20, title: '2024 ఫలితం – 1,17,091 ఓట్లు', type: 'bars', year: '2024',
    b: { v: 117091, s: 60.93 }, d: { v: 64570, s: 33.6 }, winner: 'shankar', margin: 52521, note: 'ఓట్ షేర్ తేడా 27.3%' },
  { act: 4, sec: 16, title: 'పదేళ్లలో ఒక్క ఓటు పెరగలేదు!', type: 'twin', heroTitle: 'ధర్మాన ప్రసాదరావు ఓట్లు',
    l: { v: 64683, label: '2014 – ఓడినప్పుడు', col: C.blue, sub: 'ప్రతిపక్షంలో' },
    r: { v: 64570, label: '2024 – సిట్టింగ్ రెవెన్యూ మంత్రి', col: C.blue, sub: 'అధికార పక్షం' }, mid: '≈',
    foot: 'పదేళ్లలో కొత్తగా ఒక్క ఓటు కూడా పెరగలేదు!' },
  { act: 4, sec: 12, title: 'ఓట్ షేర్ 14% పతనం', type: 'bigstat', who: 'dharmana',
    label: 'ధర్మాన ఓట్ షేర్ పతనం (2019తో పోలిస్తే)', value: 14, prefix: '−', suffix: '%', chips: ['సిట్టింగ్ మంత్రి అయినా పతనం'] },
  { act: 4, sec: 12, title: 'ఎంపీ ఆధిక్యం – 68,413', type: 'bigstat', who: 'rammohan',
    label: 'ఈ సెగ్మెంట్ లో ఎంపీ రామ్మోహన్ నాయుడు ఆధిక్యం', value: 68413, chips: ['అర్బన్ + రూరల్ ఏకపక్షం'] },

  // ───────────── ACT 5 · REASONS ─────────────
  { act: 5, sec: 12, title: 'ఓటమికి నాలుగు కారణాలు', type: 'chips', cols: 4,
    heroTitle: 'ధర్మాన ఓటమికి నాలుగు ప్రధాన కారణాలు',
    tiles: [{ big: '1', t: 'అర్బన్ తిరుగుబాటు' }, { big: '2', t: 'గార & రూరల్' }, { big: '3', t: 'ల్యాండ్ టైటిలింగ్' }, { big: '4', t: 'అందుబాటులో ఉండటం' }] },
  { act: 5, sec: 15, title: 'కారణం 1 – శ్రీకాకుళం అర్బన్ తిరుగుబాటు', type: 'reason', n: '1', icon: '🏙️', col: C.red,
    name: 'శ్రీకాకుళం అర్బన్ తిరుగుబాటు',
    points: ['ఉద్యోగులు, వ్యాపారులు, మధ్యతరగతి ఓటర్లు అధికం', 'డ్రైనేజీ, తాగునీరు, రోడ్లు ఆశించిన స్థాయిలో లేవు', 'ఆస్తి పన్ను, చెత్త పన్ను పెంపుపై వ్యతిరేకత'] },
  { act: 5, sec: 14, title: 'కారణం 2 – గార & శ్రీకాకుళం రూరల్', type: 'reason', n: '2', icon: '🌊', col: '#0891B2',
    name: 'గార & శ్రీకాకుళం రూరల్',
    points: ['మత్స్యకార, కళింగ, కాపు, బీసీ ఓటర్లు కీలకం', 'జనసేన–టీడీపీ పొత్తుతో కాపు, యువత ఓట్లు కూటమి వైపు'],
    syms: ['tdp', 'jsp', 'bjp'] },
  { act: 5, sec: 12, title: 'కారణం 3 – ల్యాండ్ టైటిలింగ్ యాక్ట్', type: 'reason', n: '3', icon: '📜', col: '#EA580C',
    name: 'ల్యాండ్ టైటిలింగ్ యాక్ట్',
    points: ['ధర్మాన స్వయంగా రాష్ట్ర రెవెన్యూ మంత్రి', 'చట్టంపై ప్రజల భయాలు నేరుగా ఆయనపైనే ప్రభావం'] },
  { act: 5, sec: 13, title: 'కారణం 4 – అందుబాటులో ఉండటం', type: 'reason', n: '4', icon: '📞', col: C.green,
    name: 'అందుబాటులో ఉండటం',
    points: ['మంత్రిగా బిజీ – కార్యకర్తలకు దూరమయ్యారనే భావన', '“మా ఇంటి అబ్బాయి” – 24 గంటలూ శంకర్ అందుబాటులో', 'యువత, మహిళలను ఆకట్టుకున్నారు'] },

  // ───────────── ACT 6 · VERDICT ─────────────
  { act: 6, sec: 12, title: 'శాశ్వతం కాదు – ప్రజల మధ్య ఉండేవాడే నాయకుడు', type: 'quote', sides: ['shankar', 'dharmana'],
    sub: 'శంకర్ విజయం నిరూపించింది', text: 'పెద్ద పేర్లు, దశాబ్దాల పదవులు శాశ్వతం కాదు!', size: 74 },
  { act: 6, sec: 13, title: 'ధర్మాన అనుభవాన్ని తక్కువ చేయలేం', type: 'leader', who: 'dharmana',
    eyebrow: 'అయినప్పటికీ…', heroTitle: 'ధర్మాన ప్రసాదరావు',
    items: [{ t: 'రాజకీయ అనుభవాన్ని ఎవరూ తక్కువ చేయలేరు' }, { t: 'జిల్లా అభివృద్ధిలో గతంలో కీలక పాత్ర' }, { t: 'మారుతున్న తరానికి అనుగుణంగా వ్యూహాలు మారాలి' }] },
  { act: 6, sec: 13, title: 'శంకర్ ముందున్న బాధ్యతలు', type: 'leader', who: 'shankar',
    eyebrow: '52,521 మెజారిటీ తర్వాత…', heroTitle: 'శంకర్ ముందున్న బాధ్యత',
    items: [{ t: 'శ్రీకాకుళం నగర ఆధునీకరణ' }, { t: 'గార తీర ప్రాంత మత్స్యకారుల సమస్యల పరిష్కారం' }, { t: 'యువతకు స్థానికంగా ఉపాధి కల్పన' }] },
  { act: 6, sec: 14, title: 'మీ అభిప్రాయం కామెంట్ చేయండి', type: 'cta', mode: 'comment',
    heroTitle: 'మీ అభిప్రాయం కామెంట్ చేయండి!',
    prompts: ['ఎమ్మెల్యేగా గొండు శంకర్ పనితీరు ఎలా ఉంది?', 'శ్రీకాకుళంలో ధర్మాన కుటుంబం మళ్లీ పుంజుకోగలదా?'] },
  { act: 6, sec: 14, title: 'లైక్ · షేర్ · సబ్స్క్రైబ్', type: 'cta', mode: 'subscribe',
    heroTitle: 'డేటా-డ్రివెన్ పొలిటికల్ అనాలిసిస్ కోసం సబ్స్క్రైబ్ చేయండి' },
];

export const CHAPTERS: Ch[] = RAW.map((c, i) => {
  const timing = (srikakulamTimings as any)?.chapters?.[i];
  return {
    ...c,
    id: i + 1,
    exactFrames: timing ? timing.durationFrames : Math.round(c.sec * FPS),
    exactSec: timing ? timing.totalSec : c.sec,
    audioPath: timing ? timing.audioPath : `audio/srikakulam/chapters/ch_${String(i + 1).padStart(2, '0')}.wav`,
  };
});

// ============================================================================
// TIMELINE MATH
// ============================================================================
export const SRIKAKULAM_FPS = FPS;
export const SRIKAKULAM_TOTAL_FRAMES = (srikakulamTimings as any)?.totalFrames || 15540;
const BASE_SECONDS = SRIKAKULAM_TOTAL_FRAMES / FPS;

export const buildTimeline = (_scale: number = 1, secs?: number[]) => {
  const base = secs && secs.length === CHAPTERS.length
    ? secs.map((s) => Math.round(s * FPS))
    : CHAPTERS.map((c) => (c as any).exactFrames || Math.round(c.sec * FPS));
  const starts: number[] = [];
  let s = 0;
  base.forEach((f) => { starts.push(s); s += f; });
  return { frames: base, starts, total: s };
};

export const getTotalFrames = (scale = 1, secs?: number[]) => buildTimeline(scale, secs).total;

const ACT_TICKS = ACTS.map((_, a) => {
  const first = CHAPTERS.findIndex((c) => c.act === a + 1);
  const before = CHAPTERS.slice(0, first).reduce((x, c) => x + (c as any).exactFrames, 0);
  return (before / SRIKAKULAM_TOTAL_FRAMES) * 100;
}).slice(1);

// ============================================================================
// 1. TEXT & MOTION HELPERS
// ============================================================================
const graphemes = (t: string): string[] => {
  const Seg = (Intl as any).Segmenter;
  return Seg ? Array.from(new Seg('te', { granularity: 'grapheme' }).segment(t), (x: any) => x.segment as string) : Array.from(t);
};

const SplitText: React.FC<{ text: string; size: number; delay?: number; color?: string; shadow?: string; center?: boolean; weight?: number }> = ({ text, size, delay = 0, color = C.ink, shadow, center, weight = 900 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = useD();
  let n = 0;
  return (
    <div style={{ fontSize: size, fontWeight: weight, color, lineHeight: 1.45, textShadow: shadow, textAlign: center ? 'center' : 'left', perspective: 900 }}>
      {text.split(' ').map((w, wi) => (
        <span key={wi} style={{ display: 'inline-block', whiteSpace: 'nowrap', marginRight: size * 0.24 }}>
          {graphemes(w).map((g, gi) => {
            const p = spring({ frame: frame - d(delay) - n++ * 2, fps, config: { damping: 14, stiffness: 120 } });
            return (
              <span key={gi} style={{ display: 'inline-block', opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 70}px) rotateX(${(1 - p) * -80}deg)`, filter: `blur(${(1 - p) * 12}px)` }}>{g}</span>
            );
          })}
        </span>
      ))}
    </div>
  );
};

const Mark: React.FC<{ children: React.ReactNode; delay?: number; color?: string }> = ({ children, delay = 20, color = C.yel2 }) => {
  const frame = useCurrentFrame();
  const d = useD();
  const w = interpolate(frame, [d(delay), d(delay) + 24], [0, 100], clamp);
  return <span style={{ backgroundImage: `linear-gradient(${color},${color})`, backgroundRepeat: 'no-repeat', backgroundPosition: '0 90%', backgroundSize: `${w}% 46%` }}>{children}</span>;
};

const Reveal: React.FC<{ children: React.ReactNode; delay?: number; from?: 'up' | 'left' | 'right' | 'zoom'; style?: React.CSSProperties }> = ({ children, delay = 0, from = 'up', style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = useD();
  const p = spring({ frame: frame - d(delay), fps, config: { damping: 15, stiffness: 110 } });
  const tr = from === 'up' ? `translateY(${(1 - p) * 50}px)` : from === 'left' ? `translateX(${(1 - p) * -120}px)` : from === 'right' ? `translateX(${(1 - p) * 120}px)` : `scale(${0.6 + 0.4 * p})`;
  return <div style={{ opacity: Math.min(1, p * 1.4), transform: tr, ...style }}>{children}</div>;
};

const AnimatedCounter: React.FC<{ target: number; startFrame: number; duration?: number; decimals?: number; suffix?: string; prefix?: string; color?: string; fontSize?: number }> = ({ target, startFrame, duration = 40, decimals = 0, suffix = '', prefix = '', color = C.ink, fontSize = 44 }) => {
  const frame = useCurrentFrame();
  const d = useD();
  const s0 = d(startFrame);
  const progress = interpolate(frame, [s0, s0 + duration], [0, 1], clamp);
  const eased = 1 - Math.pow(1 - progress, 3);
  const raw = target * eased;
  const formatted = decimals > 0 ? raw.toFixed(decimals) : Math.round(raw).toLocaleString('en-IN');
  return <span style={{ fontSize, fontWeight: 900, color, fontVariantNumeric: 'tabular-nums' }}>{prefix}{formatted}{suffix}</span>;
};

const Pill: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.ink }) => (
  <div style={{ padding: '12px 30px', border: `2px solid ${C.line}`, borderRadius: 999, fontSize: 34, fontWeight: 800, color, background: C.white, boxShadow: '0 8px 20px rgba(15,23,42,.06)' }}>{children}</div>
);

const Row: React.FC<{ t: string; ok?: boolean; delay: number; size?: number; color: string }> = ({ t, ok, delay, size = 46, color }) => {
  const len = t.length;
  const responsiveSize = len > 44 ? Math.min(size, 38) : len > 30 ? Math.min(size, 44) : size;
  return (
    <Reveal delay={delay} from="right" style={{ display: 'flex', alignItems: 'center', gap: 24, width: '100%', minWidth: 0 }}>
      <div style={{
        width: Math.round(responsiveSize * 1.25),
        height: Math.round(responsiveSize * 1.25),
        borderRadius: '50%',
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 900,
        fontSize: Math.round(responsiveSize * 0.75),
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
// 2. IMAGE COMPONENTS
// ============================================================================
const Sym: React.FC<{ k: SymKey; size?: number }> = ({ k, size = 90 }) => {
  const [err, setErr] = useState(false);
  const m = SYM_META[k];
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: '#fff', border: `${Math.max(3, size / 20)}px solid ${m.c}`, boxShadow: '0 8px 20px rgba(15,23,42,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flex: 'none' }}>
      {err ? <span style={{ fontSize: size * 0.26, fontWeight: 900, color: m.c }}>{m.t}</span> : <img src={PARTY_SYMBOLS[k]} onError={() => setErr(true)} style={{ width: '68%', height: '68%', objectFit: 'contain' }} />}
    </div>
  );
};

const Photo: React.FC<{ src: string; ini: string; color: string; size: number }> = ({ src, ini, color, size }) => {
  const [err, setErr] = useState(false);
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', border: '7px solid #fff', boxShadow: `0 16px 40px ${color}55, 0 0 0 4px ${color}`, background: `${color}22`, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
      {err ? <span style={{ fontSize: size * 0.5, fontWeight: 900, color }}>{ini}</span> : <img src={src} onError={() => setErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }} />}
    </div>
  );
};

const SquarePhoto: React.FC<{ src: string; ini: string; color: string; size?: number }> = ({ src, ini, color, size = 320 }) => {
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
            objectPosition: 'center 12%',
          }}
        />
      )}
    </div>
  );
};

const LeaderCard: React.FC<{ who: Who; w: number; h: number; delay?: number; sub?: string }> = ({ who, w, h, delay = 0, sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = useD();
  const t = P[who];
  const [err, setErr] = useState(false);
  const pop = spring({ frame: frame - d(delay), fps, config: { damping: 14, stiffness: 120 } });
  const floatY = Math.sin(frame * 0.06 + (who === 'dharmana' ? 2 : 0)) * 4;

  return (
    <div style={{
      width: w,
      height: h,
      position: 'relative',
      flex: 'none',
      overflow: 'hidden',
      borderRadius: 34,
      transform: `translateY(${floatY}px) scale(${Math.min(1, 0.7 + 0.3 * pop)})`,
      opacity: Math.min(1, pop * 1.5),
      background: '#FFFFFF',
      border: `3.5px solid ${t.main}`,
      boxShadow: `0 20px 50px ${t.main}33, 0 10px 25px rgba(15,23,42,0.08)`,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    }}>
      {/* 1. TOP: Dedicated Photo Frame */}
      <div style={{
        flex: 1,
        margin: '16px 16px 0 16px',
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
        background: `linear-gradient(180deg, #F8FAFC 0%, ${t.soft} 100%)`,
        border: '2px solid rgba(15,23,42,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {err ? (
          <span style={{ fontSize: w * 0.45, fontWeight: 900, color: t.main }}>{t.ini}</span>
        ) : (
          <img
            src={t.img}
            onError={() => setErr(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 15%',
            }}
          />
        )}
        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
          <Sym k={t.sym} size={w < 400 ? 70 : 86} />
        </div>
        <div style={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 10,
          background: t.partyBg,
          color: t.partyText,
          padding: '6px 20px',
          borderRadius: 999,
          fontSize: w < 400 ? 17 : 21,
          fontWeight: 900,
          boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
          border: '2px solid #FFFFFF',
        }}>
          {t.party}
        </div>
      </div>

      {/* 2. BOTTOM: Clean White Nameplate Panel */}
      <div style={{
        flex: 'none',
        minHeight: sub ? (w < 400 ? 140 : 156) : (w < 400 ? 116 : 130),
        padding: '12px 18px 22px',
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
          fontSize: t.name.length > 20 ? (w < 400 ? 22 : 28) : t.name.length > 14 ? (w < 400 ? 25 : 32) : (w < 380 ? 28 : w < 460 ? 34 : 40),
          fontWeight: 900,
          color: C.ink,
          lineHeight: 1.25,
          whiteSpace: 'nowrap',
          maxWidth: '100%',
        }}>
          {t.name}
        </div>
        <div style={{
          padding: '4px 22px',
          borderRadius: 999,
          background: t.partyBg,
          color: t.partyText,
          fontSize: w < 380 ? 15 : 18,
          fontWeight: 800,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          {t.partyFull || t.party}
        </div>
        {sub && (
          <div style={{
            fontSize: w < 380 ? 15 : 18,
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

const VsBadge: React.FC<{ delay?: number; abs?: boolean; label?: string }> = ({ delay = 0, abs, label = 'VS' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = useD();
  const pop = spring({ frame: frame - d(delay), fps, config: { damping: 9, stiffness: 150 } });
  return (
    <div style={{ width: 100, height: 100, borderRadius: '50%', background: C.ink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: label.length > 2 ? 40 : 52, fontWeight: 900, boxShadow: '0 0 0 12px #fff, 0 16px 40px rgba(15,23,42,.3)', zIndex: 5, flex: 'none', ...(abs ? { position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) scale(${pop})` } : { transform: `scale(${pop})` }) }}>{label}</div>
  );
};

// ============================================================================
// 3. BACKGROUND + HUD
// ============================================================================
const StudioWhiteBackground: React.FC<{ gf: number }> = ({ gf }) => {
  const gridOffset = (gf * 1.2) % 80;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -320, left: -200, width: 1100, height: 1100, borderRadius: '50%', background: `radial-gradient(circle, ${C.yel}33 0%, transparent 68%)`, filter: 'blur(70px)', transform: `translate(${Math.sin(gf * 0.01) * 60}px, ${Math.cos(gf * 0.012) * 40}px)` }} />
      <div style={{ position: 'absolute', bottom: -320, right: -200, width: 1100, height: 1100, borderRadius: '50%', background: `radial-gradient(circle, ${C.blue}2B 0%, transparent 68%)`, filter: 'blur(70px)', transform: `translate(${Math.cos(gf * 0.011) * 60}px, ${Math.sin(gf * 0.013) * 40}px)` }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(to right, rgba(15,23,42,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.045) 1px, transparent 1px)', backgroundSize: '80px 80px', backgroundPosition: `0px ${gridOffset}px`, transform: 'perspective(900px) rotateX(60deg) scale(1.7)', transformOrigin: 'center bottom', opacity: 0.75 }} />
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
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, backgroundColor: 'rgba(15,23,42,0.08)' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: `linear-gradient(90deg, ${C.yel}, ${C.yel2}, ${C.sky}, ${C.blue})` }} />
        {ACT_TICKS.map((t, i) => <div key={i} style={{ position: 'absolute', left: `${t}%`, top: 0, width: 3, height: 6, background: '#fff' }} />)}
      </div>
    </div>
  );
};

// ============================================================================
// 4. CHAPTER TEMPLATES
// ============================================================================
const Hero: React.FC<{ c: Ch }> = ({ c }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '740px 1fr', gap: 40, height: '100%' }}>
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Reveal delay={4}><div style={{ fontSize: 34, fontWeight: 700, color: C.muted }}>{c.eyebrow}</div></Reveal>
      <SplitText text={c.heroTitle} size={150} delay={10} shadow="8px 8px 0 rgba(245,184,0,.55)" />
      <Reveal delay={46}><div style={{ fontSize: 64, fontWeight: 900, color: C.ink }}><Mark delay={52}>{c.tagline}</Mark></div></Reveal>
      <div style={{ display: 'flex', gap: 16, margin: '30px 0', flexWrap: 'wrap' }}>
        {c.chips.map((t: string, i: number) => <Reveal key={t} delay={76 + i * 7} from="zoom"><Pill>{t}</Pill></Reveal>)}
      </div>
      <Reveal delay={110}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
          <AnimatedCounter target={c.stat.value} startFrame={114} duration={55} fontSize={120} color={C.blue} />
          <span style={{ fontSize: 36, fontWeight: 700, color: C.muted }}>{c.stat.label}</span>
        </div>
      </Reveal>
    </div>
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <LeaderCard who="shankar" w={460} h={880} delay={20} />
      <LeaderCard who="dharmana" w={460} h={880} delay={32} />
      <VsBadge delay={60} abs />
    </div>
  </div>
);

const FaceOff: React.FC<{ c: Ch }> = ({ c }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '440px minmax(0, 1fr) 440px', gap: 28, height: '100%', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
    <LeaderCard who="shankar" w={440} h={880} delay={4} sub={c.leftNote} />
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 22, textAlign: 'center', minWidth: 0, overflow: 'hidden' }}>
      <SplitText text={c.centerTitle} size={54} delay={8} center />
      <VsBadge delay={36} />
      {c.items.map((t: string, i: number) => (
        <Reveal key={i} delay={46 + i * 14} style={{ ...card, padding: '16px 28px', fontSize: 30, fontWeight: 700, width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t}</Reveal>
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
    <LeaderCard who="dharmana" w={440} h={880} delay={14} sub={c.rightNote} />
  </div>
);

const LeaderSlide: React.FC<{ c: Ch }> = ({ c }) => {
  const t = P[c.who as Who];
  const left = c.who === 'shankar';
  const cardEl = <LeaderCard who={c.who} w={540} h={920} delay={2} />;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: left ? '540px 1fr' : '1fr 540px', gap: 36, height: '100%' }}>
      {left && cardEl}
      <div style={{ ...card, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: `linear-gradient(90deg, ${t.main}, ${t.sub})`, padding: '32px 48px' }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: t.on, opacity: 0.9, letterSpacing: 1.5 }}>{c.eyebrow}</div>
          <SplitText text={c.heroTitle} size={68} color={t.on} delay={6} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', padding: '32px 48px' }}>
          {c.items.map((it: any, i: number) => <Row key={i} t={it.t} ok={it.ok} delay={26 + i * 16} size={50} color={t.text} />)}
        </div>
      </div>
      {!left && cardEl}
    </div>
  );
};

const EraSlide: React.FC<{ c: Ch }> = ({ c }) => {
  const frame = useCurrentFrame();
  const d = useD();
  const f: number[] = c.focus;
  const maxI = Math.max(...f);
  const upto = ERAS.slice(0, maxI + 1);
  const prog = (fill(0, d(60), frame) * maxI) / (ERAS.length - 1);
  const fams = [
    { k: 'gunda', name: 'గుండ కుటుంబం', pc: PC.tdp },
    { k: 'dharmana', name: 'ధర్మాన కుటుంబం', pc: PC.ysrcp },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateRows: '1fr 160px', gap: 24, height: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.45fr .55fr', gap: 32, minHeight: 0 }}>
        <div style={{ ...card, padding: '24px 36px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
          {f.length === 1 ? (() => {
            const e = ERAS[f[0]];
            const t = PC[e.party];
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
                    <Sym k={e.party as SymKey} size={44} />
                    <span style={{ fontSize: 30, fontWeight: 800, color: t.text }}>{PARTY_TE[e.party]}</span>
                  </div>
                  {e.note && (
                    <div style={{
                      fontSize: 32,
                      fontWeight: 900,
                      color: '#FFFFFF',
                      background: `linear-gradient(135deg, ${t.main}, ${t.text})`,
                      borderRadius: 999,
                      padding: '8px 26px',
                      boxShadow: `0 8px 20px ${t.main}44`,
                      marginTop: 4,
                    }}>
                      {e.note}
                    </div>
                  )}
                </Reveal>
              </div>
            );
          })() : (
            <div style={{ display: 'flex', gap: 24, justifyContent: 'space-around', alignItems: 'center', flex: 1 }}>
              {f.map((i, k) => {
                const e = ERAS[i];
                const t = PC[e.party];
                return (
                  <Reveal key={i} delay={6 + k * 14} from="zoom" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
                    <SquarePhoto src={e.img} ini={e.ini} color={t.main} size={210} />
                    <div style={{ fontSize: 72, fontWeight: 900, lineHeight: 1.1, color: C.ink }}>{e.y}</div>
                    <div style={{ fontSize: 34, fontWeight: 900, color: t.text, lineHeight: 1.35, padding: '2px 0' }}>{e.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Sym k={e.party as SymKey} size={44} />
                      <span style={{ fontSize: 26, fontWeight: 700, color: C.muted }}>{PARTY_TE[e.party]}</span>
                    </div>
                    {e.note && <div style={{ fontSize: 24, fontWeight: 800, color: t.text, background: t.soft, borderRadius: 99, padding: '4px 18px' }}>{e.note}</div>}
                  </Reveal>
                );
              })}
            </div>
          )}
          <Reveal delay={50}><div style={{ fontSize: 32, fontWeight: 800, color: C.body, textAlign: 'center', borderTop: `2px solid ${C.line}`, paddingTop: 14, lineHeight: 1.35 }}>{c.cap}</div></Reveal>
        </div>
        <div style={{ ...card, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 30, fontWeight: 900, textAlign: 'center' }}>కుటుంబాల విజయాలు</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
            {fams.map((fm) => {
              const items = upto.filter((e) => e.fam === fm.k);
              const wins = items.reduce((a, e) => a + e.n, 0);
              return (
                <div key={fm.k} style={{ flex: 1, background: fm.pc.soft, borderRadius: 22, padding: '12px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: fm.pc.text }}>{fm.name}</div>
                  <div style={{ fontSize: 84, fontWeight: 900, color: fm.pc.text, lineHeight: 1 }}>{wins}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {items.map((e, i) => (
                      <Reveal key={e.y} delay={10 + i * 5} from="zoom">
                        <div style={{ background: fm.pc.main, color: fm.pc.on, fontWeight: 800, fontSize: 22, borderRadius: 99, padding: '3px 14px' }}>{e.y}</div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ ...card, padding: '20px 40px', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 94, right: 94, top: 40, height: 8, background: C.line, borderRadius: 9 }} />
        <div style={{ position: 'absolute', left: 94, top: 40, height: 8, borderRadius: 9, width: `calc((100% - 188px) * ${prog})`, background: `linear-gradient(90deg, ${C.yel}, ${C.blue})` }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
          {ERAS.map((e, i) => {
            const on = f.includes(i);
            const t = PC[e.party];
            const reached = i <= maxI;
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 90 }}>
                <div style={{ height: 46, display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: on ? 46 : 30, height: on ? 46 : 30, borderRadius: '50%', background: reached ? t.main : '#fff', border: `5px solid ${reached ? '#fff' : C.line}`, boxShadow: on ? `0 0 0 5px ${t.main}, 0 0 25px ${t.main}` : 'none' }} />
                </div>
                <div style={{ fontSize: 24, fontWeight: on ? 900 : 600, color: on ? C.ink : C.muted, whiteSpace: 'nowrap' }}>{e.y}</div>
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
  const d = useD();
  const maxH = 370;
  const bars: { who: Who; v: number; s: number }[] = [{ who: 'shankar', ...c.b }, { who: 'dharmana', ...c.d }];
  const wt = P[c.winner as Who];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '430px 1fr 430px', gap: 32, height: '100%' }}>
      <LeaderCard who="shankar" w={430} h={920} delay={2} sub={c.winner === 'shankar' ? 'విజేత 👑' : undefined} />
      <div style={{ ...card, padding: '26px 36px', display: 'flex', flexDirection: 'column' }}>
        <SplitText text={c.year} size={110} delay={4} center />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', padding: '0 24px' }}>
          {bars.map((b, i) => {
            const grow = spring({ frame: frame - d(16 + i * 4), fps, config: { damping: 18, stiffness: 70 } });
            const t = P[b.who];
            const dec = (String(b.s).split('.')[1] || '').length;
            return (
              <div key={b.who} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: '40%' }}>
                <AnimatedCounter target={b.v} startFrame={18} duration={60} fontSize={56} color={t.text} />
                <div style={{ width: '100%', height: Math.max(0, (b.v / 120000) * maxH * grow), borderRadius: '22px 22px 0 0', background: `linear-gradient(${t.sub}, ${t.main})`, boxShadow: `0 14px 40px ${t.main}55`, position: 'relative', overflow: 'hidden' }}>
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
      <LeaderCard who="dharmana" w={430} h={920} delay={10} sub={c.winner === 'dharmana' ? 'విజేత 👑' : undefined} />
    </div>
  );
};

const BigStat: React.FC<{ c: Ch }> = ({ c }) => {
  const frame = useCurrentFrame();
  const t = P[(c.who as Who) || 'shankar'];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 520px', gap: 36, height: '100%' }}>
      <div style={{ ...card, padding: '44px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28, position: 'relative', overflow: 'hidden' }}>
        <Reveal delay={4}><div style={{ fontSize: 42, fontWeight: 800, color: C.muted }}>{c.label}</div></Reveal>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <AnimatedCounter target={c.value} prefix={c.prefix || ''} suffix={c.suffix || ''} startFrame={10} duration={50} fontSize={250} color={t.text} />
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {(c.chips || []).map((x: string, i: number) => <Reveal key={i} delay={60 + i * 10} from="zoom"><Pill>{x}</Pill></Reveal>)}
        </div>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: ((frame * 14) % 2400) - 300, width: 160, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.7), transparent)', transform: 'skewX(-20deg)' }} />
      </div>
      <LeaderCard who={(c.who as Who) || 'shankar'} w={520} h={920} delay={6} />
    </div>
  );
};

const Twin: React.FC<{ c: Ch }> = ({ c }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 28, height: '100%' }}>
    <SplitText text={c.heroTitle} size={72} delay={4} center />
    <div style={{ display: 'flex', alignItems: 'stretch', flex: 1, gap: 24 }}>
      {[c.l, c.r].map((x: any, i: number) => (
        <React.Fragment key={i}>
          <Reveal delay={16 + i * 22} from="zoom" style={{ ...card, flex: 1, borderTop: `12px solid ${x.col}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 30, textAlign: 'center' }}>
            <div style={{ fontSize: 44, fontWeight: 800, color: C.muted }}>{x.label}</div>
            <AnimatedCounter target={x.v} startFrame={20 + i * 22} duration={55} fontSize={190} color={x.col} />
            {x.sub && <Pill color={x.col}>{x.sub}</Pill>}
          </Reveal>
          {i === 0 && <div style={{ display: 'flex', alignItems: 'center' }}><VsBadge delay={30} label={c.mid} /></div>}
        </React.Fragment>
      ))}
    </div>
    <Reveal delay={90}><div style={{ textAlign: 'center', fontSize: 54, fontWeight: 900, color: C.ink }}><Mark delay={96}>{c.foot}</Mark></div></Reveal>
  </div>
);

const Chips: React.FC<{ c: Ch }> = ({ c }) => {
  const cols: number = c.cols || 3;
  const big = cols >= 4 ? 120 : cols === 3 ? 150 : 110;
  const accents = [C.blue, C.yel, C.green, '#EA580C', '#0891B2'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, height: '100%' }}>
      <SplitText text={c.heroTitle} size={72} delay={4} center />
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 28, flex: 1 }}>
        {c.tiles.map((t: any, i: number) => {
          const th = t.color ? PC[t.color as PartyKey] : null;
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
                      <Sym k={t.color as SymKey} size={52} />
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

          const bs = String(t.big).length > 5 ? Math.min(big, 100) : big;
          return (
            <Reveal key={i} delay={20 + i * 10} from="zoom" style={{ ...card, borderTop: `10px solid ${col}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 28, textAlign: 'center' }}>
              <div style={{ fontSize: bs, fontWeight: 900, color: th ? th.text : C.ink, lineHeight: 1.2 }}>{t.big}</div>
              {t.t && <div style={{ fontSize: cols >= 4 ? 38 : 46, fontWeight: 800, color: C.ink, lineHeight: 1.4 }}>{t.t}</div>}
            </Reveal>
          );
        })}
      </div>
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
          const e = ERAS[n.era];
          const t = PC[e.party];
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
                  border: `3.5px solid ${t.main}`,
                  background: t.soft,
                  borderRadius: 32,
                  boxShadow: `0 20px 50px ${t.main}30, 0 8px 24px rgba(15,23,42,0.06)`,
                  transform: `scale(${1 + Math.sin(frame * 0.05 + i) * 0.01})`,
                }}
              >
                {/* 1. Year Header */}
                <div style={{ fontSize: 68, fontWeight: 900, color: C.ink, lineHeight: 1.1, letterSpacing: 2 }}>
                  {e.y}
                </div>

                {/* 2. Large Square Photo */}
                <SquarePhoto src={e.img} ini={e.ini} color={t.main} size={300} />

                {/* 3. Candidate Name */}
                <div style={{
                  fontSize: 34,
                  fontWeight: 900,
                  color: C.ink,
                  lineHeight: 1.35,
                  padding: '4px 0',
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                }}>
                  {e.name}
                </div>

                {/* 4. Party Pill */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: '#FFFFFF',
                  padding: '6px 22px',
                  borderRadius: 999,
                  border: `2px solid ${t.main}44`,
                  boxShadow: '0 4px 14px rgba(15,23,42,0.06)',
                }}>
                  <Sym k={e.party as SymKey} size={42} />
                  <span style={{ fontSize: 28, fontWeight: 900, color: t.text }}>{n.t}</span>
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

const Reason: React.FC<{ c: Ch }> = ({ c }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '460px 1fr', gap: 36, height: '100%' }}>
      <Reveal from="zoom" delay={2} style={{ ...card, background: `linear-gradient(160deg, ${c.col}, ${c.col}BB)`, border: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 4, opacity: 0.9 }}>కారణం</div>
        <div style={{ fontSize: 380, fontWeight: 900, lineHeight: 1 }}>{c.n}</div>
        <div style={{ fontSize: 140, transform: `scale(${1 + Math.sin(frame * 0.12) * 0.06})` }}>{c.icon}</div>
      </Reveal>
      <div style={{ ...card, padding: '40px 52px', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', borderLeft: `14px solid ${c.col}` }}>
        <SplitText text={c.name} size={76} color={c.col} delay={6} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          {c.points.map((p: string, i: number) => <Row key={i} t={p} delay={30 + i * 18} size={42} color={c.col} />)}
        </div>
        {c.syms && (
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            {c.syms.map((k: SymKey, i: number) => (
              <Reveal key={k} delay={90 + i * 10} from="zoom">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: `3px solid ${SYM_META[k].c}`, borderRadius: 99, padding: '6px 22px 6px 6px' }}>
                  <Sym k={k} size={60} /><span style={{ fontSize: 32, fontWeight: 900, color: SYM_META[k].c }}>{SYM_META[k].t}</span>
                </div>
              </Reveal>
            ))}
            <Reveal delay={125}><span style={{ fontSize: 38, fontWeight: 900, color: C.green }}>= కూటమి ✓</span></Reveal>
          </div>
        )}
      </div>
    </div>
  );
};

const Quote: React.FC<{ c: Ch }> = ({ c }) => {
  const sides: (Who | null)[] = c.sides || [null, null];
  const cols = `${sides[0] ? '460px ' : ''}1fr${sides[1] ? ' 460px' : ''}`;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 36, height: '100%' }}>
      {sides[0] && <LeaderCard who={sides[0] as Who} w={460} h={920} delay={2} />}
      <div style={{ ...card, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '40px 60px', gap: 30, position: 'relative', overflow: 'hidden' }}>
        {c.sub && <Reveal><div style={{ fontSize: 40, fontWeight: 800, color: C.muted, letterSpacing: 1 }}>{c.sub}</div></Reveal>}
        <SplitText text={c.text} size={c.size || 86} delay={8} center shadow="6px 6px 0 rgba(245,184,0,.5)" />
        <Reveal delay={60}><div style={{ width: 360, height: 10, borderRadius: 9, background: `linear-gradient(90deg, ${C.yel}, ${C.blue})` }} /></Reveal>
      </div>
      {sides[1] && <LeaderCard who={sides[1] as Who} w={460} h={920} delay={10} />}
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
          <div style={{ fontSize: 200, transform: `scale(${1 + Math.sin(frame * 0.12) * 0.05})` }}>💬</div>
          <SplitText text={c.heroTitle} size={76} color="#fff" delay={6} center />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          {c.prompts.map((p: string, i: number) => (
            <Reveal key={i} delay={30 + i * 20} from="right" style={{ ...card, flex: 1, padding: '0 40px', display: 'flex', alignItems: 'center', gap: 26 }}>
              <div style={{ width: 84, height: 84, borderRadius: '50%', background: i ? C.blue : C.yel, color: i ? '#fff' : C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, fontWeight: 900, flex: 'none' }}>{i + 1}</div>
              <div style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.4 }}>{p}</div>
            </Reveal>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 36, height: '100%' }}>
      <div style={{ ...card, padding: '30px 38px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <SplitText text="మూడు ఎన్నికల స్కోర్కార్డ్" size={56} delay={4} />
        {ELECTIONS.map((el, i) => {
          const e = ERAS[el.era];
          const t = PC[e.party];
          return (
            <Reveal key={el.y} delay={24 + i * 16} from="right" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 22, background: t.soft, borderRadius: 24, padding: '0 26px', border: `3px solid ${t.main}66` }}>
              <div style={{ fontSize: 68, fontWeight: 900, width: 170 }}>{el.y}</div>
              <Photo src={e.img} ini={e.ini} color={t.main} size={100} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: t.text }}>{e.name}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: C.muted }}>{PARTY_TE[e.party]}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 26, fontWeight: 700, color: C.muted }}>మెజారిటీ</div>
                <div style={{ fontSize: 52, fontWeight: 900, color: t.text }}>{el.m}</div>
              </div>
              <Sym k={e.party as SymKey} size={70} />
            </Reveal>
          );
        })}
      </div>
      <div style={dark}>
        <SplitText text={c.heroTitle} size={54} color="#fff" delay={6} center />
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['👍 లైక్', '↗ షేర్', '🔔 సబ్స్క్రైబ్'].map((t, i) => (
            <Reveal key={i} delay={40 + i * 12} from="zoom">
              <div style={{ transform: `scale(${i === 2 ? 1 + Math.sin(frame * 0.18) * 0.06 : 1})`, padding: '16px 36px', borderRadius: 999, background: i === 2 ? C.yel : '#fff', color: C.ink, fontSize: 38, fontWeight: 900 }}>{t}</div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={90}><div style={{ fontSize: 34, fontWeight: 700, opacity: 0.85 }}>జై హింద్!</div></Reveal>
      </div>
    </div>
  );
};

const TEMPLATES: Record<string, React.FC<{ c: Ch }>> = {
  hero: Hero, faceoff: FaceOff, leader: LeaderSlide, era: EraSlide, bars: Bars, bigstat: BigStat,
  twin: Twin, chips: Chips, swing: Swing, reason: Reason, quote: Quote, cta: CTA,
};

// ============================================================================
// 5. CHAPTER SCENE
// ============================================================================
const ChapterScene: React.FC<{ ch: Ch; idx: number; start: number; dur: number; total: number }> = ({ ch, idx, start, dur, total }) => {
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
  const audioFile = (ch as any).audioPath || `audio/srikakulam/chapters/ch_${String(ch.id).padStart(2, '0')}.wav`;
  return (
    <Sync.Provider value={{ scale: 1, dur }}>
      <AbsoluteFill>
        <Audio src={staticFile(audioFile)} volume={1} />
        <StudioWhiteBackground gf={gf} />
        <BroadcastHUD ch={ch} gf={gf} total={total} />
        <AbsoluteFill style={{ padding: '44px 56px 40px', ...wrap, overflow: 'hidden' }}>
          <T c={ch} />
        </AbsoluteFill>
        {actStart && (
          <div style={{ position: 'absolute', top: 0, bottom: 0, width: 460, left: interpolate(frame, [0, 26], [-480, 1940], clamp), zIndex: 70, pointerEvents: 'none', background: 'linear-gradient(90deg, transparent, rgba(245,184,0,.7), rgba(0,102,204,.7), transparent)' }} />
        )}
      </AbsoluteFill>
    </Sync.Provider>
  );
};

// ============================================================================
// MASTER TIMELINE
// ============================================================================
export const SrikakulamVideo: React.FC<{ timeScale?: number; chapterSeconds?: number[] }> = ({ chapterSeconds }) => {
  const { frames, starts, total } = buildTimeline(1, chapterSeconds);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: `${fontAnek}, 'Anek Telugu', 'Noto Sans Telugu', sans-serif` }}>
      {BG_MUSIC ? <Audio src={staticFile(BG_MUSIC)} volume={0.1} loop /> : null}
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
