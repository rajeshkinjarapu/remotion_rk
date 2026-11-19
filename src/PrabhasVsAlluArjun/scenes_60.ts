import { staticFile } from 'remotion';

export interface SceneData {
  id: number;
  chapter: number;
  chapterTitle: string;
  sec: number;
  type: 'TITLE_CARD' | 'SINGLE_MOVIE_CARD' | 'VS_BAR_RACE' | 'MAP_HIGHLIGHT' | 'ROI_GAUGE_METER' | 'SCOREBOARD_UPDATE';
  title: string;
  sub?: string;
  hero?: 'prabhas' | 'allu_arjun' | 'both';
  movie?: {
    name: string;
    year: string;
    poster: string;
    budget?: string;
    gross: number;
    grossStr: string;
    verdict?: string;
    verdictColor?: string;
    note?: string;
  };
  comparison?: {
    leftLabel: string;
    leftValue: number;
    leftStr: string;
    leftNote?: string;
    rightLabel: string;
    rightValue: number;
    rightStr: string;
    rightNote?: string;
    metric: string;
    winner?: 'prabhas' | 'allu_arjun' | 'tie';
  };
  mapData?: {
    territory: string;
    prabhasShare: string;
    bunnyshare: string;
    highlight: string;
    details: { area: string; pVal: string; bVal: string }[];
  };
  roiData?: {
    movieName: string;
    hero: 'prabhas' | 'allu_arjun';
    poster: string;
    preBiz: string;
    recovery: number; // percentage
    profitStatus: 'PROFIT' | 'LOSS' | 'BREAK-EVEN';
    zoneColor: string;
    note: string;
  };
  scoreboard?: {
    round: number;
    roundTitle: string;
    pScore: number;
    bScore: number;
    summary: string;
    winner: 'prabhas' | 'allu_arjun' | 'tie';
  };
  chips?: string[];
}

const POSTER = (name: string) => staticFile(`images/prabhas_vs_allu_arjun/movies/${name}`);
const HERO = (name: string) => staticFile(`images/prabhas_vs_allu_arjun/${name}`);

export const SCENES_60: SceneData[] = [
  // ─────────────────────────────────────────────────────────────
  // చాప్టర్ 1: ఇంట్రో & ఆరంభం (0:00 – 0:45 | 6 సీన్లు)
  // ─────────────────────────────────────────────────────────────
  {
    id: 1, chapter: 1, chapterTitle: 'ఇంట్రో & ఆరంభం', sec: 7, type: 'TITLE_CARD',
    title: 'పాన్-ఇండియా బాక్సాఫీస్ కింగ్ ఎవరు?',
    sub: 'ప్రభాస్ vs అల్లు అర్జున్ · అసలైన బాక్సాఫీస్ లెక్కల పోరు',
    hero: 'both',
    chips: ['100% ఖచ్చితమైన డేటా', 'బాక్సాఫీస్ నివేదిక', '2015 – 2026'],
  },
  {
    id: 2, chapter: 1, chapterTitle: 'ఇంట్రో & ఆరంభం', sec: 8, type: 'SINGLE_MOVIE_CARD',
    title: 'రెబల్ స్టార్ ప్రభాస్ – పాన్-ఇండియా ఆద్యుడు',
    hero: 'prabhas',
    movie: {
      name: 'ప్రభాస్ (2015 – 2026)', year: '11 ఏళ్ల ప్రయాణం', poster: HERO('prabhas_hero.jpg'),
      gross: 5300, grossStr: '₹5,300+ కోట్లు', verdict: '8 పాన్-ఇండియా సినిమాలు', verdictColor: '#F59E0B',
      note: 'సౌత్ సినిమా సరిహద్దులు చెరిపేసిన గ్లోబల్ స్టార్',
    },
  },
  {
    id: 3, chapter: 1, chapterTitle: 'ఇంట్రో & ఆరంభం', sec: 8, type: 'SINGLE_MOVIE_CARD',
    title: 'ఐకాన్ స్టార్ అల్లు అర్జున్ – పుష్ప ప్రభంజనం',
    hero: 'allu_arjun',
    movie: {
      name: 'అల్లు అర్జున్ (పుష్ప సిరీస్)', year: '2021 – 2026', poster: HERO('allu_arjun_hero.jpg'),
      gross: 2100, grossStr: '₹2,100+ కోట్లు', verdict: '100% సక్సెస్ రేట్', verdictColor: '#10B981',
      note: 'నార్త్ ఇండియాలో తిరుగులేని మాస్ ఫీవర్ సృష్టించిన కింగ్',
    },
  },
  {
    id: 4, chapter: 1, chapterTitle: 'ఇంట్రో & ఆరంభం', sec: 7, type: 'TITLE_CARD',
    title: 'ఈ విశ్లేషణలో 5 కీలక పారామీటర్లు',
    sub: '1. కన్సిస్టెన్సీ · 2. పీక్ గ్రాస్ · 3. హిందీ మార్కెట్ · 4. థియేట్రికల్ ROI · 5. అప్‌కమింగ్ లైనప్',
    hero: 'both',
    chips: ['వాల్యూమ్', 'రికార్డులు', 'నార్త్ మార్కెట్', 'బయ్యర్ల లాభాలు', 'లైనప్'],
  },
  {
    id: 5, chapter: 1, chapterTitle: 'ఇంట్రో & ఆరంభం', sec: 8, type: 'VS_BAR_RACE',
    title: 'తొలి పాన్-ఇండియా అడుగు: బాహుబలి 1 vs పుష్ప 1',
    hero: 'both',
    comparison: {
      leftLabel: 'బాహుబలి 1 (2015)', leftValue: 650, leftStr: '₹650 Cr', leftNote: 'పాన్-ఇండియా ట్రెండ్‌కు శ్రీకారం',
      rightLabel: 'పుష్ప 1 (2021)', rightValue: 360, rightStr: '₹360 Cr', rightNote: 'కరోనా తర్వాత నార్త్ సంచలనం',
      metric: 'వరల్డ్‌వైడ్ గ్రాస్ వసూళ్లు', winner: 'prabhas',
    },
  },
  {
    id: 6, chapter: 1, chapterTitle: 'ఇంట్రో & ఆరంభం', sec: 7, type: 'SCOREBOARD_UPDATE',
    title: 'రౌండ్ 1: పాన్-ఇండియా సినిమాల సంఖ్య & కన్సిస్టెన్సీ',
    scoreboard: {
      round: 1, roundTitle: 'పాన్-ఇండియా సినిమాల సంఖ్య', pScore: 1, bScore: 0,
      summary: 'ప్రభాస్ ఖాతాలో 8 సినిమాలు · అల్లు అర్జున్ 2 సినిమాలు', winner: 'prabhas',
    },
  },

  // ─────────────────────────────────────────────────────────────
  // చాప్టర్ 2: ప్రభాస్ పాన్-ఇండియా సినిమాల గ్రాఫ్ (0:45 – 2:00 | 10 సీన్లు)
  // ─────────────────────────────────────────────────────────────
  {
    id: 7, chapter: 2, chapterTitle: 'ప్రభాస్ పాన్-ఇండియా గ్రాఫ్', sec: 8, type: 'SINGLE_MOVIE_CARD',
    title: 'బాహుబలి: ది బిగినింగ్ (2015)',
    hero: 'prabhas',
    movie: {
      name: 'బాహుబలి 1 (2015)', year: '2015', poster: POSTER('baahubali1.jpg'),
      budget: '₹180 Cr', gross: 650, grossStr: '₹650 Cr', verdict: 'ఇండస్ట్రీ రికార్డ్ బ్లాక్‌బస్టర్', verdictColor: '#10B981',
      note: 'తెలుగు సినిమా స్థాయిని ప్రపంచానికి చాటిన దృశ్యకావ్యం',
    },
  },
  {
    id: 8, chapter: 2, chapterTitle: 'ప్రభాస్ పాన్-ఇండియా గ్రాఫ్', sec: 8, type: 'SINGLE_MOVIE_CARD',
    title: 'బాహుబలి 2: ది కన్‌క్లూజన్ (2017)',
    hero: 'prabhas',
    movie: {
      name: 'బాహుబలి 2 (2017)', year: '2017', poster: POSTER('baahubali2.jpg'),
      budget: '₹250 Cr', gross: 1810, grossStr: '₹1,810 Cr', verdict: 'ఆల్-టైమ్ ఇండస్ట్రీ హిట్ 👑', verdictColor: '#F59E0B',
      note: 'భారతీయ సినీ చరిత్రలోనే తిరుగులేని మైలురాయి',
    },
  },
  {
    id: 9, chapter: 2, chapterTitle: 'ప్రభాస్ పాన్-ఇండియా గ్రాఫ్', sec: 7, type: 'SINGLE_MOVIE_CARD',
    title: 'సాహో (2019) – హిందీ బెల్ట్‌లో సంచలనం',
    hero: 'prabhas',
    movie: {
      name: 'సాహో (2019)', year: '2019', poster: POSTER('saaho.jpg'),
      budget: '₹350 Cr', gross: 451, grossStr: '₹451 Cr', verdict: 'హిందీలో సూపర్ హిట్ · సౌత్ యావరేజ్', verdictColor: '#3B82F6',
      note: 'హిందీలోనే ₹150+ కోట్ల నెట్ సాధించి ప్రభాస్ స్టామినా నిరూపించింది',
    },
  },
  {
    id: 10, chapter: 2, chapterTitle: 'ప్రభాస్ పాన్-ఇండియా గ్రాఫ్', sec: 7, type: 'SINGLE_MOVIE_CARD',
    title: 'రాధే శ్యామ్ (2022) – క్లాసిక్ లవ్ స్టోరీ',
    hero: 'prabhas',
    movie: {
      name: 'రాధే శ్యామ్ (2022)', year: '2022', poster: POSTER('radhe_shyam.jpg'),
      budget: '₹300 Cr', gross: 149.5, grossStr: '₹149.5 Cr', verdict: 'బాక్సాఫీస్ డిజాస్టర్', verdictColor: '#EF4444',
      note: 'భారీ బడ్జెట్ వల్ల బయ్యర్లకు భారీ నష్టాలు తెచ్చిన సినిమా',
    },
  },
  {
    id: 11, chapter: 2, chapterTitle: 'ప్రభాస్ పాన్-ఇండియా గ్రాఫ్', sec: 7, type: 'SINGLE_MOVIE_CARD',
    title: 'ఆదిపురుష్ (2023) – మైథలాజికల్ రికార్డ్స్',
    hero: 'prabhas',
    movie: {
      name: 'ఆదిపురుష్ (2023)', year: '2023', poster: POSTER('adipurush.jpg'),
      budget: '₹500 Cr', gross: 393, grossStr: '₹393 Cr', verdict: 'యావరేజ్ కలెక్షన్లు', verdictColor: '#F97316',
      note: 'మిశ్రమ స్పందన వచ్చినప్పటికీ మొదటి 3 రోజుల్లో ₹340 Cr+ సాధించింది',
    },
  },
  {
    id: 12, chapter: 2, chapterTitle: 'ప్రభాస్ పాన్-ఇండియా గ్రాఫ్', sec: 8, type: 'SINGLE_MOVIE_CARD',
    title: 'సలార్: పార్ట్ 1 – సీజ్‌ఫైర్ (2023)',
    hero: 'prabhas',
    movie: {
      name: 'సలార్: సీజ్‌ఫైర్ (2023)', year: '2023', poster: POSTER('salaar.jpg'),
      budget: '₹270 Cr', gross: 617.75, grossStr: '₹617.75 Cr', verdict: 'భారీ బ్లాక్‌బస్టర్', verdictColor: '#10B981',
      note: 'డంకీతో పోటీ పడి కూడా రికార్డు వసూళ్లు కొల్లగొట్టింది',
    },
  },
  {
    id: 13, chapter: 2, chapterTitle: 'ప్రభాస్ పాన్-ఇండియా గ్రాఫ్', sec: 8, type: 'SINGLE_MOVIE_CARD',
    title: 'కల్కి 2898 AD (2024) – ₹1000 కోట్ల క్లబ్',
    hero: 'prabhas',
    movie: {
      name: 'కల్కి 2898 AD (2024)', year: '2024', poster: POSTER('kalki.webp'),
      budget: '₹600 Cr', gross: 1042.25, grossStr: '₹1,042.25 Cr', verdict: 'గ్లోబల్ మెగా బ్లాక్‌బస్టర్ 🚀', verdictColor: '#F59E0B',
      note: 'భారతదేశంలో రెండో ₹1000 కోట్ల సినిమా సాధించిన ఏకైక హీరో',
    },
  },
  {
    id: 14, chapter: 2, chapterTitle: 'ప్రభాస్ పాన్-ఇండియా గ్రాఫ్', sec: 8, type: 'SINGLE_MOVIE_CARD',
    title: 'ది రాజా సాబ్ (జనవరి 2026)',
    hero: 'prabhas',
    movie: {
      name: 'ది రాజా సాబ్ (2026)', year: '2026', poster: POSTER('raja_saab.jpg'),
      budget: '₹400 Cr', gross: 208.38, grossStr: '₹208.38 Cr', verdict: 'హారర్-కామెడీ విజువల్ వండర్', verdictColor: '#8B5CF6',
      note: 'సంక్రాంతి బరిలో ప్రభాస్ సరికొత్త మాస్ ఎంటర్‌టైనర్',
    },
  },
  {
    id: 15, chapter: 2, chapterTitle: 'ప్రభాస్ పాన్-ఇండియా గ్రాఫ్', sec: 7, type: 'VS_BAR_RACE',
    title: 'ప్రభాస్ 8 పాన్-ఇండియా సినిమాల మొత్తం వసూళ్లు',
    hero: 'prabhas',
    comparison: {
      leftLabel: 'ప్రభాస్ 8 సినిమాలు', leftValue: 5321, leftStr: '₹5,321 Cr', leftNote: 'మొత్తం కలెక్షన్లు',
      rightLabel: 'సగటు కలెక్షన్', rightValue: 665, rightStr: '₹665 Cr', rightNote: 'సినిమాకి సగటు గ్రాస్',
      metric: 'బాక్సాఫీస్ టోటల్ రికార్డు', winner: 'prabhas',
    },
  },
  {
    id: 16, chapter: 2, chapterTitle: 'ప్రభాస్ పాన్-ఇండియా గ్రాఫ్', sec: 7, type: 'TITLE_CARD',
    title: 'ఇక అల్లు అర్జున్ పాన్-ఇండియా సునామీని చూద్దాం!',
    sub: 'రెండు సినిమాలతోనే ప్రపంచ రికార్డులను తిరగరాసిన పుష్పరాజ్ ప్రస్థానం',
    hero: 'allu_arjun',
    chips: ['పుష్ప 1: ది రైజ్', 'పుష్ప 2: ది రూల్', '100% స్ట్రైక్ రేట్'],
  },

  // ─────────────────────────────────────────────────────────────
  // చాప్టర్ 3: అల్లు అర్జున్ పాన్-ఇండియా & టోటల్ పోలిక (2:00 – 3:00 | 8 సీన్లు)
  // ─────────────────────────────────────────────────────────────
  {
    id: 17, chapter: 3, chapterTitle: 'అల్లు అర్జున్ పాన్-ఇండియా & పోలిక', sec: 8, type: 'SINGLE_MOVIE_CARD',
    title: 'పుష్ప: ది రైజ్ (2021) – దేశవ్యాప్త ఊపు',
    hero: 'allu_arjun',
    movie: {
      name: 'పుష్ప 1: ది రైజ్ (2021)', year: '2021', poster: POSTER('pushpa1.jpg'),
      budget: '₹170 Cr', gross: 360, grossStr: '₹360 Cr', verdict: 'ఆల్-ఇండియా సెన్సేషనల్ హిట్', verdictColor: '#10B981',
      note: 'హిందీలో జీరో ప్రమోషన్స్‌తో ₹108 కోట్ల నెట్ వసూళ్లు సాధించింది',
    },
  },
  {
    id: 18, chapter: 3, chapterTitle: 'అల్లు అర్జున్ పాన్-ఇండియా & పోలిక', sec: 10, type: 'SINGLE_MOVIE_CARD',
    title: 'పుష్ప 2: ది రూల్ (2024) – సరికొత్త రికార్డుల రారాజు',
    hero: 'allu_arjun',
    movie: {
      name: 'పుష్ప 2: ది రూల్ (2024)', year: '2024', poster: POSTER('pushpa2.jpg'),
      budget: '₹500 Cr', gross: 1742, grossStr: '₹1,742 Cr', verdict: 'ఆల్-టైమ్ గ్లోబల్ మాన్స్టర్ హిట్ 💥', verdictColor: '#F59E0B',
      note: 'హిందీ బెల్ట్ చరిత్రలోనే ₹800+ కోట్ల నెట్ సాధించిన తొలి సినిమా',
    },
  },
  {
    id: 19, chapter: 3, chapterTitle: 'అల్లు అర్జున్ పాన్-ఇండియా & పోలిక', sec: 8, type: 'VS_BAR_RACE',
    title: 'అల్లు అర్జున్ 2 సినిమాల టోటల్ గ్రాస్',
    hero: 'allu_arjun',
    comparison: {
      leftLabel: 'పుష్ప 1', leftValue: 360, leftStr: '₹360 Cr', leftNote: '2021 కలెక్షన్లు',
      rightLabel: 'పుష్ప 2', rightValue: 1742, rightStr: '₹1,742 Cr', rightNote: '2024 వరల్డ్‌వైడ్ గ్రాస్',
      metric: 'పుష్ప ఫ్రాంచైజ్ టోటల్: ₹2,102 Cr', winner: 'allu_arjun',
    },
  },
  {
    id: 20, chapter: 3, chapterTitle: 'అల్లు అర్జున్ పాన్-ఇండియా & పోలిక', sec: 9, type: 'VS_BAR_RACE',
    title: 'టోటల్ పాన్-ఇండియా గ్రాస్: ప్రభాస్ vs అల్లు అర్జున్',
    hero: 'both',
    comparison: {
      leftLabel: 'ప్రభాస్ (8 సినిమాలు)', leftValue: 5321, leftStr: '₹5,321 Cr', leftNote: 'భారీ సినిమాల లైబ్రరీ',
      rightLabel: 'అల్లు అర్జున్ (2 సినిమాలు)', rightValue: 2102, rightStr: '₹2,102 Cr', rightNote: 'పుష్ప 1 & 2 మాత్రమే',
      metric: 'మొత్తం పాన్-ఇండియా వసూళ్లు', winner: 'prabhas',
    },
  },
  {
    id: 21, chapter: 3, chapterTitle: 'అల్లు అర్జున్ పాన్-ఇండియా & పోలిక', sec: 9, type: 'VS_BAR_RACE',
    title: 'యావరేజ్ కలెక్షన్ పర్ మూవీ (Average Per Movie)',
    hero: 'both',
    comparison: {
      leftLabel: 'ప్రభాస్ సగటు', leftValue: 665, leftStr: '₹665 Cr', leftNote: '8 సినిమాల సగటు',
      rightLabel: 'అల్లు అర్జున్ సగటు', rightValue: 1051, rightStr: '₹1,051 Cr', rightNote: '2 సినిమాల సగటు (టాప్)',
      metric: 'సినిమాకి సగటు వసూళ్లు', winner: 'allu_arjun',
    },
  },
  {
    id: 22, chapter: 3, chapterTitle: 'అల్లు అర్జున్ పాన్-ఇండియా & పోలిక', sec: 8, type: 'VS_BAR_RACE',
    title: '₹100 కోట్ల ఓపెనింగ్ డే సాధించిన సినిమాల సంఖ్య',
    hero: 'both',
    comparison: {
      leftLabel: 'ప్రభాస్', leftValue: 6, leftStr: '6 సినిమాలు', leftNote: 'బాహుబలి 2, సాహో, ఆదిపురుష్, సలార్, కల్కి, రాజా సాబ్',
      rightLabel: 'అల్లు అర్జున్', rightValue: 1, leftStr: '1 సినిమా', rightNote: 'పుష్ప 2 (₹294 Cr డే-1)',
      metric: 'డే-1 ₹100 Cr+ ఓపెనర్స్', winner: 'prabhas',
    },
  },
  {
    id: 23, chapter: 3, chapterTitle: 'అల్లు అర్జున్ పాన్-ఇండియా & పోలిక', sec: 8, type: 'SCOREBOARD_UPDATE',
    title: 'రౌండ్ 1 స్కోర్‌బోర్డ్: వాల్యూమ్ vs యావరేజ్',
    scoreboard: {
      round: 1, roundTitle: 'వాల్యూమ్ vs యావరేజ్ స్ట్రైక్', pScore: 1, bScore: 1,
      summary: 'వాల్యూమ్‌లో ప్రభాస్ ముందంజ · సగటు వసూళ్లలో అల్లు అర్జున్ టాప్', winner: 'tie',
    },
  },

  // ─────────────────────────────────────────────────────────────
  // చాప్టర్ 4: పీక్ బాక్సాఫీస్ — బాహుబలి 2 vs పుష్ప 2 (3:00 – 4:15 | 10 సీన్లు)
  // ─────────────────────────────────────────────────────────────
  {
    id: 24, chapter: 4, chapterTitle: 'పీక్ బాక్సాఫీస్: బాహుబలి 2 vs పుష్ప 2', sec: 6, type: 'TITLE_CARD',
    title: 'రౌండ్ 2: అత్యధిక వసూళ్లు సాధించిన సింగిల్ మూవీ',
    sub: 'బాహుబలి 2 (₹1,810 Cr) vs పుష్ప 2 (₹1,742 Cr) – ముఖాముఖి పోరు',
    hero: 'both',
    chips: ['ఆల్-టైమ్ నంబర్ 1', 'హిందీ బెల్ట్', 'ఓవర్సీస్', 'సౌత్ ఇండియా'],
  },
  {
    id: 25, chapter: 4, chapterTitle: 'పీక్ బాక్సాఫీస్: బాహుబలి 2 vs పుష్ప 2', sec: 8, type: 'VS_BAR_RACE',
    title: 'డే-1 వరల్డ్‌వైడ్ ఓపెనింగ్ రికార్డ్',
    hero: 'both',
    comparison: {
      leftLabel: 'బాహుబలి 2 (2017)', leftValue: 217, leftStr: '₹217 Cr', leftNote: '2017లో అసాధ్యమైన రికార్డ్',
      rightLabel: 'పుష్ప 2 (2024)', rightValue: 294, rightStr: '₹294 Cr', rightNote: 'భారతీయ సినీ చరిత్రలో ఆల్-టైమ్ రికార్డ్',
      metric: 'డే-1 వరల్డ్‌వైడ్ గ్రాస్', winner: 'allu_arjun',
    },
  },
  {
    id: 26, chapter: 4, chapterTitle: 'పీక్ బాక్సాఫీస్: బాహుబలి 2 vs పుష్ప 2', sec: 8, type: 'VS_BAR_RACE',
    title: 'మొదటి వీకెండ్ (First Weekend) కలెక్షన్లు',
    hero: 'both',
    comparison: {
      leftLabel: 'బాహుబలి 2', leftValue: 510, leftStr: '₹510 Cr', leftNote: '3 రోజుల్లో వరల్డ్‌వైడ్',
      rightLabel: 'పుష్ప 2', rightValue: 660, rightStr: '₹660 Cr', rightNote: 'మొదటి 4 రోజుల వీకెండ్',
      metric: 'ఓపెనింగ్ వీకెండ్ గ్రాస్', winner: 'allu_arjun',
    },
  },
  {
    id: 27, chapter: 4, chapterTitle: 'పీక్ బాక్సాఫీస్: బాహుబలి 2 vs పుష్ప 2', sec: 8, type: 'MAP_HIGHLIGHT',
    title: 'తెలుగు రాష్ట్రాల (AP/TG) షేర్ వసూళ్లు',
    hero: 'both',
    mapData: {
      territory: 'ఆంధ్రప్రదేశ్ & తెలంగాణ (AP/TG)', prabhasShare: '₹200+ Cr (బాహుబలి 2)', bunnyshare: '₹225+ Cr (పుష్ప 2)',
      highlight: 'పుష్ప 2 సరికొత్త నాన్‌-రాజమౌళి ఆల్-టైమ్ రికార్డ్ సృష్టించింది',
      details: [
        { area: 'నైజాం (Nizam)', pVal: '₹68 Cr', bVal: '₹95+ Cr' },
        { area: 'సీడెడ్ (Ceeded)', pVal: '₹35 Cr', bVal: '₹38+ Cr' },
        { area: 'ఆంధ్రా (Andhra)', pVal: '₹97 Cr', bVal: '₹92+ Cr' },
      ],
    },
  },
  {
    id: 28, chapter: 4, chapterTitle: 'పీక్ బాక్సాఫీస్: బాహుబలి 2 vs పుష్ప 2', sec: 8, type: 'MAP_HIGHLIGHT',
    title: 'సౌత్ ఇండియా (కర్ణాటక, తమిళనాడు, కేరళ)',
    hero: 'both',
    mapData: {
      territory: 'కర్ణాటక · తమిళనాడు · కేరళ', prabhasShare: '₹230+ Cr', bunnyshare: '₹185+ Cr',
      highlight: 'బాహుబలి 2 తమిళనాడు & కర్ణాటకలో ఇప్పటికీ ప్రభాస్ డామినెన్స్',
      details: [
        { area: 'కర్ణాటక', pVal: '₹125 Cr', bVal: '₹85 Cr' },
        { area: 'తమిళనాడు', pVal: '₹152 Cr', bVal: '₹75 Cr' },
        { area: 'కేరళ', pVal: '₹73 Cr', bVal: '₹25 Cr' },
      ],
    },
  },
  {
    id: 29, chapter: 4, chapterTitle: 'పీక్ బాక్సాఫీస్: బాహుబలి 2 vs పుష్ప 2', sec: 8, type: 'VS_BAR_RACE',
    title: 'హిందీ బెల్ట్ నెట్ కలెక్షన్లు (Hindi Net)',
    hero: 'both',
    comparison: {
      leftLabel: 'బాహుబలి 2 (2017)', leftValue: 511, leftStr: '₹511 Cr', leftNote: '7 ఏళ్ల పాటు నంబర్ 1 రికార్డు',
      rightLabel: 'పుష్ప 2 (2024)', rightValue: 812, rightStr: '₹812 Cr', rightNote: 'హిందీ చరిత్రలోనే బిగ్గెస్ట్ నెట్ కలెక్షన్',
      metric: 'హిందీ నెట్ వసూళ్లు', winner: 'allu_arjun',
    },
  },
  {
    id: 30, chapter: 4, chapterTitle: 'పీక్ బాక్సాఫీస్: బాహుబలి 2 vs పుష్ప 2', sec: 8, type: 'VS_BAR_RACE',
    title: 'నార్త్ అమెరికా (USA) లైఫ్‌టైమ్ వసూళ్లు',
    hero: 'both',
    comparison: {
      leftLabel: 'బాహుబలి 2', leftValue: 20.8, leftStr: '$20.8 Million', leftNote: '~₹135 కోట్లు (2017 ఎక్స్ఛేంజ్)',
      rightLabel: 'పుష్ప 2', rightValue: 15.5, rightStr: '$15.5 Million', rightNote: '~₹130 కోట్లు (2024 ఎక్స్ఛేంజ్)',
      metric: 'USA & కెనడా గ్రాస్ డాలర్స్', winner: 'prabhas',
    },
  },
  {
    id: 31, chapter: 4, chapterTitle: 'పీక్ బాక్సాఫీస్: బాహుబలి 2 vs పుష్ప 2', sec: 8, type: 'MAP_HIGHLIGHT',
    title: 'రెస్ట్ ఆఫ్ వరల్డ్ (జపాన్, గల్ఫ్, యూరప్)',
    hero: 'both',
    mapData: {
      territory: 'జపాన్ · గల్ఫ్ · యూరప్ · ఆస్ట్రేలియా', prabhasShare: '₹180+ Cr', bunnyshare: '₹110+ Cr',
      highlight: 'జపాన్ మరియు యూరప్‌లో బాహుబలి 2 ప్రభాస్‌కు తిరుగులేని మార్కెట్ కల్పించింది',
      details: [
        { area: 'జపాన్', pVal: '₹35 Cr+', bVal: '₹5 Cr' },
        { area: 'గల్ఫ్ (Middle East)', pVal: '₹75 Cr', bVal: '₹60 Cr' },
        { area: 'ఆస్ట్రేలియా / NZ', pVal: '₹30 Cr', bVal: '₹28 Cr' },
      ],
    },
  },
  {
    id: 32, chapter: 4, chapterTitle: 'పీక్ బాక్సాఫీస్: బాహుబలి 2 vs పుష్ప 2', sec: 7, type: 'VS_BAR_RACE',
    title: 'ఇండియా నెట్ టోటల్ (India Net All Languages)',
    hero: 'both',
    comparison: {
      leftLabel: 'బాహుబలి 2', leftValue: 1030, leftStr: '₹1,030 Cr', leftNote: 'భారతదేశంలో తొలి ₹1000 Cr నెట్',
      rightLabel: 'పుష్ప 2', rightValue: 1195, rightStr: '₹1,195 Cr', rightNote: 'సరికొత్త ఆల్-టైమ్ ఇండియా నెట్ రికార్డ్',
      metric: 'భారతదేశ నెట్ కలెక్షన్లు', winner: 'allu_arjun',
    },
  },
  {
    id: 33, chapter: 4, chapterTitle: 'పీక్ బాక్సాఫీస్: బాహుబలి 2 vs పుష్ప 2', sec: 6, type: 'SCOREBOARD_UPDATE',
    title: 'రౌండ్ 2 స్కోర్‌బోర్డ్: సింగిల్ మూవీ పీక్ రికార్డులు',
    scoreboard: {
      round: 2, roundTitle: 'సింగిల్ మూవీ పీక్ రికార్డులు', pScore: 2, bScore: 2,
      summary: 'ఓవర్సీస్, బాహుబలి 2 లో ప్రభాస్ · హిందీ నెట్, ఓపెనింగ్స్‌లో అల్లు అర్జున్ పైచేయి', winner: 'tie',
    },
  },

  // ─────────────────────────────────────────────────────────────
  // చాప్టర్ 5: హిందీ మార్కెట్ ఆధిపత్యం (4:15 – 5:15 | 8 సీన్లు)
  // ─────────────────────────────────────────────────────────────
  {
    id: 34, chapter: 5, chapterTitle: 'హిందీ మార్కెట్ ఆధిపత్యం', sec: 6, type: 'TITLE_CARD',
    title: 'రౌండ్ 3: నార్త్ ఇండియా & హిందీ మార్కెట్ పవర్',
    sub: 'సౌత్ హీరోల హిందీ మార్కెట్ పుల్ — అసలైన గణాంకాలు',
    hero: 'both',
    chips: ['హిందీ నెట్', 'మల్టీప్లెక్స్ చైన్స్', 'సింగిల్ స్క్రీన్స్', 'ఓపెనింగ్ స్టామినా'],
  },
  {
    id: 35, chapter: 5, chapterTitle: 'హిందీ మార్కెట్ ఆధిపత్యం', sec: 8, type: 'MAP_HIGHLIGHT',
    title: 'ఇండియా మ్యాప్: హిందీ బెల్ట్ మార్కెట్ పరిమాణం',
    hero: 'both',
    mapData: {
      territory: 'నార్త్ ఇండియా / హిందీ సర్క్యూట్స్', prabhasShare: '₹1,450+ Cr (టోటల్)', bunnyshare: '₹920+ Cr (టోటల్)',
      highlight: 'మొత్తం హిందీ కలెక్షన్లలో 6 సినిమాలతో ప్రభాస్ తిరుగులేని రికార్డు',
      details: [
        { area: 'ముంబై / మహారాష్ట్ర', pVal: 'హైయెస్ట్ పుల్', bVal: 'హైయెస్ట్ పుల్' },
        { area: 'ఢిల్లీ / UP / బీహార్', pVal: 'మాస్ సెంటర్స్', bVal: 'సంచలన రికార్డులు' },
        { area: 'ఈస్ట్ పంజాబ్ / రాజస్థాన్', pVal: 'స్ట్రాంగ్ హోల్డ్', bVal: 'బ్లాక్‌బస్టర్ రన్' },
      ],
    },
  },
  {
    id: 36, chapter: 5, chapterTitle: 'హిందీ మార్కెట్ ఆధిపత్యం', sec: 8, type: 'VS_BAR_RACE',
    title: 'హిందీలో ₹100 Cr+ నెట్ సాధించిన సినిమాలు',
    hero: 'both',
    comparison: {
      leftLabel: 'ప్రభాస్ (6 సినిమాలు)', leftValue: 6, leftStr: '6 సినిమాలు', leftNote: 'బాహుబలి 1 & 2, సాహో, ఆదిపురుష్, సలార్, కల్కి',
      rightLabel: 'అల్లు అర్జున్ (2 సినిమాలు)', rightValue: 2, rightStr: '2 సినిమాలు', rightNote: 'పుష్ప 1 & పుష్ప 2',
      metric: '₹100 Cr+ హిందీ నెట్ క్లబ్', winner: 'prabhas',
    },
  },
  {
    id: 37, chapter: 5, chapterTitle: 'హిందీ మార్కెట్ ఆధిపత్యం', sec: 8, type: 'SINGLE_MOVIE_CARD',
    title: 'సాహో & ఆదిపురుష్: టాక్‌తో సంబంధం లేని ఓపెనింగ్',
    hero: 'prabhas',
    movie: {
      name: 'ప్రభాస్ హిందీ ఓపెనింగ్ పుల్', year: '2019 – 2024', poster: POSTER('saaho.jpg'),
      gross: 1500, grossStr: '₹1,500+ Cr Hindi Net', verdict: 'నార్త్‌లో తిరుగులేని బ్రాండ్', verdictColor: '#3B82F6',
      note: 'నెగటివ్ టాక్ వచ్చిన సాహో కూడా హిందీలో ₹150 కోట్ల నెట్ సాధించింది',
    },
  },
  {
    id: 38, chapter: 5, chapterTitle: 'హిందీ మార్కెట్ ఆధిపత్యం', sec: 8, type: 'SINGLE_MOVIE_CARD',
    title: 'అల్లు అర్జున్ హిందీ క్రేజ్: పుష్ప 1 నుండి పుష్ప 2 జంప్',
    hero: 'allu_arjun',
    movie: {
      name: 'పుష్ప 2 హిందీ సునామీ', year: '2024', poster: POSTER('pushpa2.jpg'),
      gross: 812, grossStr: '₹812 Cr Hindi Net', verdict: 'ఆల్-టైమ్ నంబర్ 1 హిందీ మూవీ', verdictColor: '#F59E0B',
      note: 'జవాన్, పఠాన్, బాహుబలి 2 రికార్డులను చెరిపివేసి నంబర్ 1 గా నిలిచింది',
    },
  },
  {
    id: 39, chapter: 5, chapterTitle: 'హిందీ మార్కెట్ ఆధిపత్యం', sec: 8, type: 'VS_BAR_RACE',
    title: 'హిందీ డే-1 ఓపెనింగ్ రికార్డ్ పోలిక',
    hero: 'both',
    comparison: {
      leftLabel: 'బాహుబలి 2 / కల్కి', leftValue: 41, leftStr: '₹41 Cr (డే-1)', leftNote: 'ప్రభాస్ టాప్ హిందీ ఓపెనింగ్',
      rightLabel: 'పుష్ప 2 (2024)', rightValue: 72, rightStr: '₹72 Cr (డే-1)', rightNote: 'హిందీలో బిగ్గెస్ట్ డే-1 ఓపెనింగ్',
      metric: 'డే-1 హిందీ నెట్ వసూళ్లు', winner: 'allu_arjun',
    },
  },
  {
    id: 40, chapter: 5, chapterTitle: 'హిందీ మార్కెట్ ఆధిపత్యం', sec: 7, type: 'MAP_HIGHLIGHT',
    title: 'మల్టీప్లెక్స్ చైన్స్ (PVR/INOX) vs మాస్ సింగిల్ స్క్రీన్స్',
    hero: 'both',
    mapData: {
      territory: 'PVR-INOX-Cinepolis & సింగిల్ స్క్రీన్స్', prabhasShare: 'మల్టీప్లెక్స్ కింగ్', bunnyshare: 'మాస్ బెల్ట్ సునామీ',
      highlight: 'ప్రభాస్ అర్బన్ & మల్టీప్లెక్స్‌లలో స్థిరమైన పుల్ · బన్నీ మాస్ బెల్ట్‌లో అన్‌స్టాపబుల్',
      details: [
        { area: 'సింగిల్ స్క్రీన్స్', pVal: 'హై డిమాండ్', bVal: '100% ఆక్యుపెన్సీ' },
        { area: 'మల్టీప్లెక్స్ చైన్స్', pVal: 'రికార్డ్ బుకింగ్స్', bVal: 'భారీ అడ్వాన్స్ సేల్స్' },
      ],
    },
  },
  {
    id: 41, chapter: 5, chapterTitle: 'హిందీ మార్కెట్ ఆధిపత్యం', sec: 7, type: 'SCOREBOARD_UPDATE',
    title: 'రౌండ్ 3 స్కోర్‌బోర్డ్: హిందీ మార్కెట్ తీర్పు',
    scoreboard: {
      round: 3, roundTitle: 'హిందీ మార్కెట్ ఆధిపత్యం', pScore: 3, bScore: 3,
      summary: 'కన్సిస్టెంట్ ₹100 Cr+ సినిమాల్లో ప్రభాస్ · సింగిల్ మూవీ హైయెస్ట్ నంబర్లలో బన్నీ', winner: 'tie',
    },
  },

  // ─────────────────────────────────────────────────────────────
  // చాప్టర్ 6: థియేట్రికల్ రికవరీ & బయ్యర్ల లాభాలు - ROI (5:15 – 7:00 | 12 సీన్లు)
  // ─────────────────────────────────────────────────────────────
  {
    id: 42, chapter: 6, chapterTitle: 'థియేట్రికల్ రికవరీ & బయ్యర్ల లాభాలు', sec: 7, type: 'TITLE_CARD',
    title: 'రౌండ్ 4: థియేట్రికల్ రికవరీ % (ROI & లాభనష్టాలు)',
    sub: 'గ్రాస్ ఎంతైనా రికవరీ లేకపోతే బయ్యర్లు నష్టపోతారు — అసలైన బిజినెస్ లెక్క',
    hero: 'both',
    chips: ['ప్రీ-రిలీజ్ బిజినెస్', 'డిస్ట్రిబ్యూటర్ షేర్', 'రికవరీ %', 'సక్సెస్ రేషియో'],
  },
  {
    id: 43, chapter: 6, chapterTitle: 'థియేట్రికల్ రికవరీ & బయ్యర్ల లాభాలు', sec: 8, type: 'TITLE_CARD',
    title: 'థియేట్రికల్ బిజినెస్ vs షేర్ అంటే ఏమిటి?',
    sub: 'ఒక సినిమాను బయ్యర్లు కొన్న ధర (Pre-Release) కంటే వచ్చిన షేర్ ఎక్కువ ఉంటే లాభం, తక్కువైతే నష్టం!',
    hero: 'both',
    chips: ['100% దాటితే: లాభం (Profit)', '100% కంటే తక్కువైతే: నష్టం (Loss)'],
  },
  {
    id: 44, chapter: 6, chapterTitle: 'థియేట్రికల్ రికవరీ & బయ్యర్ల లాభాలు', sec: 9, type: 'ROI_GAUGE_METER',
    title: 'బాహుబలి 1 & 2 రికవరీ మీటర్',
    roiData: {
      movieName: 'బాహుబలి సిరీస్ (1 & 2)', hero: 'prabhas', poster: POSTER('baahubali2.jpg'),
      preBiz: '₹470 Cr (మొత్తం బిజినెస్)', recovery: 220, profitStatus: 'PROFIT', zoneColor: '#10B981',
      note: 'బయ్యర్లకు 200%+ రికవరీ ఇచ్చి హిస్టారికల్ లాభాలు తెచ్చిపెట్టింది',
    },
  },
  {
    id: 45, chapter: 6, chapterTitle: 'థియేట్రికల్ రికవరీ & బయ్యర్ల లాభాలు', sec: 9, type: 'ROI_GAUGE_METER',
    title: 'సాహో & రాధే శ్యామ్ రికవరీ మీటర్',
    roiData: {
      movieName: 'సాహో & రాధే శ్యామ్', hero: 'prabhas', poster: POSTER('radhe_shyam.jpg'),
      preBiz: '₹500+ Cr (భారీ బిజినెస్)', recovery: 62, profitStatus: 'LOSS', zoneColor: '#EF4444',
      note: 'భారీ రేట్లకు అమ్మడం వల్ల సౌత్ బయ్యర్లకు భారీ నష్టాలు మిగిలాయి',
    },
  },
  {
    id: 46, chapter: 6, chapterTitle: 'థియేట్రికల్ రికవరీ & బయ్యర్ల లాభాలు', sec: 9, type: 'ROI_GAUGE_METER',
    title: 'ఆదిపురుష్ & ది రాజా సాబ్ రికవరీ %',
    roiData: {
      movieName: 'ఆదిపురుష్ & రాజా సాబ్', hero: 'prabhas', poster: POSTER('adipurush.jpg'),
      preBiz: '₹400+ Cr', recovery: 78, profitStatus: 'LOSS', zoneColor: '#F97316',
      note: 'నాన్-థియేట్రికల్ రైట్స్‌తో నిర్మాతలు సేఫ్ అయినా థియేటర్లలో నష్టాలు వచ్చాయి',
    },
  },
  {
    id: 47, chapter: 6, chapterTitle: 'థియేట్రికల్ రికవరీ & బయ్యర్ల లాభాలు', sec: 9, type: 'ROI_GAUGE_METER',
    title: 'సలార్ & కల్కి 2898 AD రికవరీ మీటర్',
    roiData: {
      movieName: 'సలార్ & కల్కి 2898 AD', hero: 'prabhas', poster: POSTER('kalki.webp'),
      preBiz: '₹550 Cr', recovery: 135, profitStatus: 'PROFIT', zoneColor: '#10B981',
      note: 'రెండు సినిమాలు బ్రేక్-ఈవెన్ సాధించి బయ్యర్లకు మంచి లాభాలు ఇచ్చాయి',
    },
  },
  {
    id: 48, chapter: 6, chapterTitle: 'థియేట్రికల్ రికవరీ & బయ్యర్ల లాభాలు', sec: 9, type: 'ROI_GAUGE_METER',
    title: 'ప్రభాస్ 8 సినిమాల సగటు రికవరీ శాతం',
    roiData: {
      movieName: 'ప్రభాస్ సగటు రికవరీ (8 సినిమాలు)', hero: 'prabhas', poster: HERO('prabhas_hero.jpg'),
      preBiz: '₹2,500+ Cr Total Pre-Biz', recovery: 104, profitStatus: 'PROFIT', zoneColor: '#3B82F6',
      note: 'ఎక్కువ సినిమాలు చేయడం వల్ల కొన్ని ఫెయిల్యూర్స్ వచ్చినా ఓవరాల్‌గా లాభాల్లో ఉంది',
    },
  },
  {
    id: 49, chapter: 6, chapterTitle: 'థియేట్రికల్ రికవరీ & బయ్యర్ల లాభాలు', sec: 9, type: 'ROI_GAUGE_METER',
    title: 'పుష్ప 1: ది రైజ్ థియేట్రికల్ రికవరీ',
    roiData: {
      movieName: 'పుష్ప: ది రైజ్ (2021)', hero: 'allu_arjun', poster: POSTER('pushpa1.jpg'),
      preBiz: '₹145 Cr', recovery: 140, profitStatus: 'PROFIT', zoneColor: '#10B981',
      note: 'తక్కువ రేట్లకు అమ్ముడై అన్ని ప్రాంతాల్లో బయ్యర్లకు లాభాలు పంచింది',
    },
  },
  {
    id: 50, chapter: 6, chapterTitle: 'థియేట్రికల్ రికవరీ & బయ్యర్ల లాభాలు', sec: 9, type: 'ROI_GAUGE_METER',
    title: 'పుష్ప 2: ది రూల్ థియేట్రికల్ రికవరీ',
    roiData: {
      movieName: 'పుష్ప 2: ది రూల్ (2024)', hero: 'allu_arjun', poster: POSTER('pushpa2.jpg'),
      preBiz: '₹620 Cr (హైయెస్ట్ బిజినెస్)', recovery: 145, profitStatus: 'PROFIT', zoneColor: '#10B981',
      note: 'భారతదేశంలోనే అత్యధిక ధరలకు అమ్ముడై కూడా 145% రికవరీతో సంచలనం సృష్టించింది',
    },
  },
  {
    id: 51, chapter: 6, chapterTitle: 'థియేట్రికల్ రికవరీ & బయ్యర్ల లాభాలు', sec: 9, type: 'ROI_GAUGE_METER',
    title: 'అల్లు అర్జున్ సగటు రికవరీ శాతం (100% సక్సెస్)',
    roiData: {
      movieName: 'అల్లు అర్జున్ సగటు రికవరీ', hero: 'allu_arjun', poster: HERO('allu_arjun_hero.jpg'),
      preBiz: '₹765 Cr Total Pre-Biz', recovery: 144, profitStatus: 'PROFIT', zoneColor: '#10B981',
      note: 'పాన్-ఇండియాలో చేసిన రెండు సినిమాల్లో బయ్యర్లు 100% లాభాలు పొందారు',
    },
  },
  {
    id: 52, chapter: 6, chapterTitle: 'థియేట్రికల్ రికవరీ & బయ్యర్ల లాభాలు', sec: 9, type: 'VS_BAR_RACE',
    title: 'థియేట్రికల్ సక్సెస్ రేట్ (Success Ratio)',
    hero: 'both',
    comparison: {
      leftLabel: 'ప్రభాస్ (8 సినిమాలు)', leftValue: 62.5, leftStr: '62.5%', leftNote: '5 హిట్లు · 3 ఫ్లాపులు',
      rightLabel: 'అల్లు అర్జున్ (2 సినిమాలు)', rightValue: 100, rightStr: '100%', rightNote: '2 హిట్లు · 0 ఫ్లాపులు',
      metric: 'బయ్యర్ల ప్రాఫిట్ సక్సెస్ రేట్', winner: 'allu_arjun',
    },
  },
  {
    id: 53, chapter: 6, chapterTitle: 'థియేట్రికల్ రికవరీ & బయ్యర్ల లాభాలు', sec: 9, type: 'SCOREBOARD_UPDATE',
    title: 'రౌండ్ 4 స్కోర్‌బోర్డ్: బయ్యర్ల రికవరీ & సేఫ్టీ',
    scoreboard: {
      round: 4, roundTitle: 'థియేట్రికల్ రికవరీ & ROI', pScore: 3, bScore: 4,
      summary: '100% ప్రాఫిటబుల్ సక్సెస్ రేట్‌తో అల్లు అర్జున్ ఆధిక్యం సాధించాడు', winner: 'allu_arjun',
    },
  },

  // ─────────────────────────────────────────────────────────────
  // చాప్టర్ 7: అప్‌కమింగ్ లైనప్ & ఫైనల్ తీర్పు (7:00 – 8:00 | 7 సీన్లు)
  // ─────────────────────────────────────────────────────────────
  {
    id: 54, chapter: 7, chapterTitle: 'అప్‌కమింగ్ లైనప్ & ఫైనల్ తీర్పు', sec: 8, type: 'SINGLE_MOVIE_CARD',
    title: 'ప్రభాస్ అప్‌కమింగ్ లైనప్ – మోస్ట్ పవర్‌ఫుల్',
    hero: 'prabhas',
    movie: {
      name: 'ప్రభాస్ క్రేజీ లైనప్', year: '2025 – 2028', poster: POSTER('salaar.jpg'),
      gross: 8000, grossStr: '₹8,000+ Cr ప్రాజెక్ట్స్', verdict: 'ఫౌజీ · స్పిరిట్ · కల్కి 2 · సలార్ 2', verdictColor: '#F59E0B',
      note: 'సందీప్ వంగా, హను రాఘవపూడి, నాగ్ అశ్విన్, ప్రశాంత్ నీల్ క్రేజీ కాంబినేషన్స్',
    },
  },
  {
    id: 55, chapter: 7, chapterTitle: 'అప్‌కమింగ్ లైనప్ & ఫైనల్ తీర్పు', sec: 8, type: 'SINGLE_MOVIE_CARD',
    title: 'అల్లు అర్జున్ అప్‌కమింగ్ లైనప్ – మాస్టర్ ప్లాన్',
    hero: 'allu_arjun',
    movie: {
      name: 'అల్లు అర్జున్ క్రేజీ లైనప్', year: '2025 – 2028', poster: POSTER('pushpa2.jpg'),
      gross: 4000, grossStr: '₹4,000+ Cr ప్రాజెక్ట్స్', verdict: 'AA22 అట్లీ · త్రివిక్రమ్ · పుష్ప 3', verdictColor: '#10B981',
      note: 'అట్లీ కాంబినేషన్‌లో పాన్-ఇండియా మెగా ప్రాజెక్ట్ సిద్ధమవుతోంది',
    },
  },
  {
    id: 56, chapter: 7, chapterTitle: 'అప్‌కమింగ్ లైనప్ & ఫైనల్ తీర్పు', sec: 9, type: 'TITLE_CARD',
    title: '5 రౌండ్ల సారాంశం పట్టిక (Summary Matrix)',
    sub: 'ఓపెనింగ్స్, వాల్యూమ్, పీక్ రికార్డులు, మార్కెట్, ROI పోలిక',
    hero: 'both',
    chips: ['ఓపెనింగ్స్: ప్రభాస్', 'పీక్ కలెక్షన్స్: బన్నీ', 'హిందీ మార్కెట్: టై', 'ROI రికవరీ: బన్నీ', 'లైనప్: ప్రభాస్'],
  },
  {
    id: 57, chapter: 7, chapterTitle: 'అప్‌కమింగ్ లైనప్ & ఫైనల్ తీర్పు', sec: 10, type: 'TITLE_CARD',
    title: 'ప్రభాస్ గెలిచిన రికార్డులు (Prabhas Strengths)',
    sub: '1. పాన్-ఇండియా మార్కెట్ ఆద్యుడు · 2. ఆరు ₹100 Cr ఓపెనింగ్స్ · 3. ఎనిమిది పాన్-ఇండియా సినిమాలు · 4. ఆరు ₹100 Cr హిందీ నెట్ సినిమాలు',
    hero: 'prabhas',
    chips: ['బాక్సాఫీస్ టైటాన్', 'హిందీలో తిరుగులేని క్రేజ్', 'భారీ వాల్యూమ్'],
  },
  {
    id: 58, chapter: 7, chapterTitle: 'అప్‌కమింగ్ లైనప్ & ఫైనల్ తీర్పు', sec: 10, type: 'TITLE_CARD',
    title: 'అల్లు అర్జున్ గెలిచిన రికార్డులు (Allu Arjun Strengths)',
    sub: '1. 100% సక్సెస్ రేట్ · 2. సింగిల్ మూవీ ₹812 Cr హిందీ నెట్ రికార్డ్ · 3. సినిమాకి ₹1,050 Cr సగటు · 4. డే-1 ₹294 Cr ఆల్-టైమ్ రికార్డ్',
    hero: 'allu_arjun',
    chips: ['100% ప్రాఫిటబుల్', 'హిందీ నంబర్ 1 గ్రాసర్', 'మాస్ సునామీ'],
  },
  {
    id: 59, chapter: 7, chapterTitle: 'అప్‌కమింగ్ లైనప్ & ఫైనల్ తీర్పు', sec: 8, type: 'SCOREBOARD_UPDATE',
    title: 'ఫైనల్ స్కోర్‌బోర్డ్ & తుది తీర్పు',
    scoreboard: {
      round: 5, roundTitle: 'పాన్-ఇండియా కింగ్ ఎవరు?', pScore: 4, bScore: 4,
      summary: 'వాల్యూమ్ & ఓపెనింగ్స్‌లో ప్రభాస్ కింగ్ · స్ట్రైక్ రేట్ & ప్రాఫిట్స్‌లో అల్లు అర్జున్ కింగ్!', winner: 'tie',
    },
  },
  {
    id: 60, chapter: 7, chapterTitle: 'అప్‌కమింగ్ లైనప్ & ఫైనల్ తీర్పు', sec: 7, type: 'TITLE_CARD',
    title: 'మీ అభిప్రాయం ప్రకారం అసలైన కింగ్ ఎవరు?',
    sub: 'కామెంట్ సెక్షన్‌లో ప్రభాస్ నా? అల్లు అర్జున్ నా? చెప్పండి! లైక్ & సబ్‌స్క్రైబ్ చేసుకోండి!',
    hero: 'both',
    chips: ['#Prabhas', '#AlluArjun', '#Pushpa2', '#Kalki2898AD', '#Salaar'],
  },
];

export const TOTAL_PRABHAS_ALLU_FRAMES = SCENES_60.reduce((acc, s) => acc + s.sec * 30, 0);
