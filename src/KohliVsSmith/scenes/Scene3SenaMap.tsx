import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Video,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { THEME } from '../theme';
import { KineticTeluguTitle } from '../components/KineticTeluguTitle';
import { WorldMapSenaSVG } from '../components/WorldMapSenaSVG';
import { StatBarCompare } from '../components/StatBarCompare';

export const Scene3SenaMap: React.FC<{ hasAudio?: boolean }> = ({ hasAudio = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isOverview = frame < 450;
  const isAusSA = frame >= 450 && frame < 1300;
  const isEng = frame >= 1300 && frame < 2300;
  const isNZ = frame >= 2300;

  const activeCountry = isAusSA ? 'aus' : isEng ? 'eng' : isNZ ? 'nz' : 'all';

  // Smooth card switch transition
  const cardSwitchSpr = spring({
    frame: frame % 1000,
    fps,
    config: { damping: 18, stiffness: 80, mass: 1.1 },
  });

  return (
    <AbsoluteFill
      style={{
        background: THEME.bgGradient,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 40px',
        fontFamily: THEME.fontFamily,
      }}
    >
      {hasAudio && <Audio src={staticFile('audio/kohli_vs_smith/scene3_sena_records.wav')} volume={1} />}

      {/* Background Stadium Motion Video */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.08,
          filter: 'blur(4px) grayscale(50%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <Video
          src={staticFile('cricket/videos/stadium_crowd_trimmed.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          muted
          loop
        />
      </div>

      {/* Bigger Bold Heading */}
      <KineticTeluguTitle
        badge="ROUND 2: THE SENA ACID TEST"
        badgeColor="#EA580C"
        title="అసలైన సవాల్ — SENA దేశాల్లో రికార్డులు"
        subtitle="సౌతాఫ్రికా, ఇంగ్లాండ్, న్యూజిలాండ్, ఆస్ట్రేలియా పిచ్ లపై ఇద్దరి డామినేషన్"
        titleSize={76}
        subtitleSize={28}
        delay={10}
      />

      {/* Center Interactive World Map (Realistic Continents & Flight Trajectories) */}
      <div style={{ position: 'relative', marginTop: 2, zIndex: 10 }}>
        <WorldMapSenaSVG activeCountry={activeCountry} delay={20} />
      </div>

      {/* Dynamic Floating Country Details Card (Evolves dynamically with voiceover) */}
      <div
        style={{
          position: 'absolute',
          bottom: 18,
          width: '95%',
          maxWidth: 1440,
          background: '#FFFFFF',
          borderRadius: 28,
          border: '2.5px solid rgba(15, 23, 42, 0.1)',
          boxShadow: '0 25px 60px -10px rgba(15, 23, 42, 0.18)',
          padding: '18px 36px',
          zIndex: 20,
        }}
      >
        {/* Stage 1: Australia & South Africa Focus */}
        {isAusSA && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28 }}>🇦🇺 🇿🇦</span>
                <span style={{ color: '#D97706', fontSize: 24, fontWeight: 900 }}>
                  ఆస్ట్రేలియా & సౌతాఫ్రికా (Pace & Bouncy Tracks)
                </span>
              </div>
              <div
                style={{
                  background: '#E0F2FE',
                  color: '#0284C7',
                  padding: '6px 18px',
                  borderRadius: 20,
                  fontSize: 16,
                  fontWeight: 900,
                  border: '1.5px solid #0284C7',
                }}
              >
                🔥 2014 అడిలైడ్ ట్విన్ సెంచరీలు (Kohli Adelaide 2x 100s)
              </div>
            </div>

            <StatBarCompare
              label="ఆస్ట్రేలియాలో యావరేజ్ (AUS Average)"
              subLabel="కోహ్లీ 6 సెంచరీలు (54+ Avg) | స్మిత్ హోమ్ పిచ్ (62+ Avg)"
              valKohli={54.08}
              valSmith={62.3}
              format={(v) => v.toFixed(1)}
              maxVal={75}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, padding: '8px 16px', background: '#F8FAFC', borderRadius: 14, fontSize: 16, fontWeight: 800, color: '#334155' }}>
              <span>🇿🇦 సౌతాఫ్రికాలో కోహ్లీ: 50.00 యావరేజ్ & 3 సెంచరీలు</span>
              <span>🇿🇦 సౌతాఫ్రికాలో స్మిత్: 41.00 యావరేజ్ & 1 సెంచరీ</span>
            </div>
          </div>
        )}

        {/* Stage 2: England Swing Test Focus */}
        {isEng && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28 }}>🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
                <span style={{ color: '#0284C7', fontSize: 24, fontWeight: 900 }}>
                  ఇంగ్లాండ్ (The Swing Test - Anderson & Broad)
                </span>
              </div>
              <div
                style={{
                  background: '#FEF3C7',
                  color: '#B45309',
                  padding: '6px 18px',
                  borderRadius: 20,
                  fontSize: 16,
                  fontWeight: 900,
                  border: '1.5px solid #D97706',
                }}
              >
                ⚔️ 2018 కోహ్లీ (593 రన్స్) vs 2019 యాషెస్ స్మిత్ (774 రన్స్ - 110 Avg!)
              </div>
            </div>

            <StatBarCompare
              label="ఇంగ్లాండ్ లో యావరేజ్ (ENG Average)"
              subLabel="కోహ్లీ 2 సెంచరీలు (33.3 Avg) | స్మిత్ 7 సెంచరీలు (58+ Avg - Unreal!)"
              valKohli={33.32}
              valSmith={58.55}
              format={(v) => v.toFixed(1)}
              maxVal={70}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, padding: '8px 16px', background: '#F0F9FF', borderRadius: 14, fontSize: 16, fontWeight: 800, color: '#0369A1' }}>
              <span>👑 2014 వైఫల్యం తర్వాత 2018 లో కోహ్లీ కింగ్ కమ్‌బ్యాక్ (593 పరుగులు)</span>
              <span>🛡️ 2019 యాషెస్ లో స్టీవ్ స్మిత్ బ్యాన్ తర్వాత విధ్వంసం (774 పరుగులు - 110 యావరేజ్)</span>
            </div>
          </div>
        )}

        {/* Stage 3: New Zealand & SENA Final Summary */}
        {isNZ && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28 }}>🇳🇿</span>
                <span style={{ color: '#0F172A', fontSize: 24, fontWeight: 900 }}>
                  న్యూజిలాండ్ (Green Tops & Seam Movement)
                </span>
              </div>
              <div
                style={{
                  background: '#F1F5F9',
                  color: '#0F172A',
                  padding: '6px 18px',
                  borderRadius: 20,
                  fontSize: 16,
                  fontWeight: 900,
                  border: '1.5px solid #94A3B8',
                }}
              >
                సీమింగ్ కండిషన్స్ లో బ్యాటింగ్ రికార్డ్
              </div>
            </div>

            <StatBarCompare
              label="న్యూజిలాండ్ లో యావరేజ్ (NZ Average)"
              subLabel="స్వింగ్ & సీమ్ ట్రాక్స్ పై బ్యాటింగ్ స్థిరత్వం"
              valKohli={36.0}
              valSmith={53.2}
              format={(v) => v.toFixed(1)}
              maxVal={65}
            />

            <div style={{ textAlign: 'center', marginTop: 8, padding: '8px 16px', background: '#FFFBEB', borderRadius: 14, fontSize: 17, fontWeight: 900, color: '#92400E' }}>
              🏆 SENA దేశాల్లో స్మిత్ కన్సిస్టెన్సీ అద్భుతం అయితే, ఆస్ట్రేలియా & సౌతాఫ్రికాలో కోహ్లీ అగ్రెషన్ అనూహ్యం!
            </div>
          </div>
        )}

        {/* Stage 0: Initial Overview */}
        {isOverview && (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <span style={{ color: THEME.textDark, fontSize: 24, fontWeight: 900 }}>
              🌍 SENA దేశాల్లో పరుగులు సాధించిన వాడే టెస్ట్ క్రికెట్ లో అసలైన బాస్!
            </span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
