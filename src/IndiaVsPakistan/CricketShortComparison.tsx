import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  random,
  staticFile,
} from "remotion";
import { loadFont as loadRamabhadra } from "@remotion/google-fonts/Ramabhadra";
import { loadFont as loadAnekTelugu } from "@remotion/google-fonts/AnekTelugu";

// Load premier Telugu fonts
const { fontFamily: fontRamabhadra } = loadRamabhadra();
const { fontFamily: fontAnek } = loadAnekTelugu();

export const TOTAL_SHORT_FRAMES = 765; // 25.5s @ 30fps

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const ROWS_DATA = [
  {
    key: "asia_cup",
    icon: "cricket/trophies/asia_cup.png",
    telugu: "ఆసియా కప్",
    eng: "Asia Cup",
    ind: 8,
    pak: 2,
    rowFrame: 90,
    indFrame: 120,
    pakFrame: 155,
  },
  {
    key: "odi_wc",
    icon: "cricket/trophies/odi_wc.png",
    telugu: "వన్డే వరల్డ్ కప్",
    eng: "ODI World Cup",
    ind: 2,
    pak: 1,
    rowFrame: 195,
    indFrame: 225,
    pakFrame: 260,
  },
  {
    key: "t20_wc",
    icon: "cricket/trophies/t20_wc.png",
    telugu: "టీ20 వరల్డ్ కప్",
    eng: "T20 World Cup",
    ind: 2,
    pak: 1,
    rowFrame: 295,
    indFrame: 325,
    pakFrame: 355,
  },
  {
    key: "champions",
    icon: "cricket/trophies/champions.png",
    telugu: "ఛాంపియన్స్ ట్రోఫీ",
    eng: "Champions Trophy",
    ind: 2,
    pak: 1,
    rowFrame: 395,
    indFrame: 425,
    pakFrame: 455,
  },
  {
    key: "u19_wc",
    icon: "cricket/trophies/u19_wc.png",
    telugu: "అండర్-19 వరల్డ్ కప్",
    eng: "U19 World Cup",
    ind: 5,
    pak: 2,
    rowFrame: 490,
    indFrame: 520,
    pakFrame: 550,
  },
  {
    key: "head_to_head",
    icon: "cricket/trophies/head_to_head.png",
    telugu: "వరల్డ్ కప్ రికార్డు",
    eng: "World Cup Record",
    ind: 8,
    pak: 0,
    rowFrame: 585,
    indFrame: 615,
    pakFrame: 645,
  },
];

export function CricketShortComparison() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Top header slide-in
  const headerSlide = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  // Flags slide-in
  const flagsSlide = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 12, stiffness: 160 },
  });

  // VS pulse
  const vsScale = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: { damping: 8, stiffness: 220, mass: 0.6 },
  });

  // Winner section trigger at frame 675
  const isWinnerPhase = frame >= 675;
  const winnerScale = spring({
    frame: Math.max(0, frame - 675),
    fps,
    config: { damping: 10, stiffness: 180, mass: 0.7 },
  });
  const subscribePulse = 1 + Math.sin(frame * 0.25) * 0.05;

  return (
    <AbsoluteFill
      style={{
        background: "#F5F5F7",
        width: 1080,
        height: 1920,
        overflow: "hidden",
      }}
    >
      {/* Audio Voiceover */}
      <Audio src={staticFile("audio/ivp/short_vo.wav")} volume={1.0} />

      {/* Subtle Background Music */}
      <Audio src={staticFile("music/bg.mp3")} volume={0.06} loop />

      {/* ─── 1. TOP HEADER SECTION ─────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 225,
          background: "#FFFFFF",
          borderBottom: "3px solid #E5E7EB",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 10,
          transform: `translateY(${(1 - headerSlide) * -120}px)`,
          opacity: headerSlide,
          boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 900,
            fontFamily: "Arial Black, Impact, sans-serif",
            color: "#111827",
            letterSpacing: 2,
            lineHeight: 1.1,
          }}
        >
          CRICKET COMPARISON
        </div>
        <div
          style={{
            fontSize: 40,
            fontFamily: fontRamabhadra,
            color: "#1E40AF",
            marginTop: 4,
            fontWeight: 800,
            letterSpacing: 1,
          }}
        >
          భారత్ <span style={{ color: "#E11D48" }}>VS</span> పాకిస్తాన్
        </div>
      </div>

      {/* ─── 2. FLAGS & TEAMS SECTION ──────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 245,
          left: 40,
          right: 40,
          height: 235,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transform: `scale(${flagsSlide})`,
          opacity: flagsSlide,
          zIndex: 10,
        }}
      >
        {/* India Side */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 410,
          }}
        >
          <div
            style={{
              fontSize: 38,
              fontFamily: fontRamabhadra,
              fontWeight: 800,
              color: "#C2410C",
              marginBottom: 10,
              textShadow: "0 2px 8px rgba(194,65,12,0.15)",
            }}
          >
            భారత్ (India)
          </div>
          <div
            style={{
              width: 370,
              height: 175,
              borderRadius: 14,
              overflow: "hidden",
              border: "3.5px solid #1E293B",
              boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
              background: "#FFF",
            }}
          >
            <Img
              src={staticFile("cricket/trophies/ind_flag.png")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>

        {/* Center VS Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${vsScale})`,
            zIndex: 15,
          }}
        >
          <div
            style={{
              fontSize: 54,
              fontWeight: 900,
              fontFamily: "Arial Black, sans-serif",
              color: "#0F172A",
              fontStyle: "italic",
              letterSpacing: -1,
              background: "#FFFFFF",
              padding: "10px 18px",
              borderRadius: 16,
              border: "3px solid #0F172A",
              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
            }}
          >
            VS
          </div>
        </div>

        {/* Pakistan Side */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 410,
          }}
        >
          <div
            style={{
              fontSize: 38,
              fontFamily: fontRamabhadra,
              fontWeight: 800,
              color: "#065F46",
              marginBottom: 10,
              textShadow: "0 2px 8px rgba(6,95,70,0.15)",
            }}
          >
            పాకిస్తాన్ (Pak)
          </div>
          <div
            style={{
              width: 370,
              height: 175,
              borderRadius: 14,
              overflow: "hidden",
              border: "3.5px solid #1E293B",
              boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
              background: "#FFF",
            }}
          >
            <Img
              src={staticFile("cricket/trophies/pak_flag.png")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>

      {/* ─── 3. COMPARISON GRID TABLE ───────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 505,
          left: 45,
          right: 45,
          height: 1070,
          background: "#FFFFFF",
          borderRadius: 20,
          border: "4px solid #1E293B",
          overflow: "hidden",
          boxShadow: "0 14px 40px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {ROWS_DATA.map((row, idx) => {
          const rowOpacity = interpolate(
            frame,
            [row.rowFrame, row.rowFrame + 10],
            [0, 1],
            clamp
          );
          const rowX = interpolate(
            frame,
            [row.rowFrame, row.rowFrame + 10],
            [-20, 0],
            clamp
          );

          // India number pop
          const indScale = spring({
            frame: Math.max(0, frame - row.indFrame),
            fps,
            config: { damping: 9, stiffness: 220, mass: 0.5 },
          });
          const hasInd = frame >= row.indFrame;

          // Pakistan number pop
          const pakScale = spring({
            frame: Math.max(0, frame - row.pakFrame),
            fps,
            config: { damping: 9, stiffness: 220, mass: 0.5 },
          });
          const hasPak = frame >= row.pakFrame;

          const indWon = row.ind > row.pak;

          return (
            <div
              key={row.key}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                borderBottom:
                  idx < ROWS_DATA.length - 1 ? "2.5px solid #CBD5E1" : "none",
                background: idx % 2 === 0 ? "#FFFFFF" : "#F8FAFC",
                opacity: rowOpacity,
                transform: `translateX(${rowX}px)`,
              }}
            >
              {/* Col 1: Trophy Icon + Telugu Title + English */}
              <div
                style={{
                  width: 500,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 25,
                  gap: 18,
                  borderRight: "3px solid #1E293B",
                }}
              >
                <div
                  style={{
                    width: 78,
                    height: 105,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Img
                    src={staticFile(row.icon)}
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontSize: 34,
                      fontFamily: fontRamabhadra,
                      fontWeight: 800,
                      color: "#0F172A",
                      lineHeight: 1.2,
                    }}
                  >
                    {row.telugu}
                  </span>
                  <span
                    style={{
                      fontSize: 22,
                      fontFamily: fontAnek,
                      fontWeight: 700,
                      color: "#64748B",
                      marginTop: 2,
                    }}
                  >
                    {row.eng}
                  </span>
                </div>
              </div>

              {/* Col 2: India Score */}
              <div
                style={{
                  width: 245,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRight: "3px solid #1E293B",
                  background:
                    hasInd && indWon ? "rgba(234, 88, 12, 0.08)" : "transparent",
                }}
              >
                {hasInd && (
                  <div
                    style={{
                      transform: `scale(${indScale})`,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 82,
                        fontFamily: fontRamabhadra,
                        fontWeight: 900,
                        color: "#DC2626", // bold marker red
                        lineHeight: 1,
                        textShadow: "0 3px 10px rgba(220,38,38,0.25)",
                      }}
                    >
                      {row.ind}
                    </span>
                    {hasPak && indWon && (
                      <span
                        style={{
                          fontSize: 32,
                          color: "#16A34A",
                          fontWeight: 900,
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Col 3: Pakistan Score */}
              <div
                style={{
                  width: 245,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    hasPak && !indWon && row.pak > row.ind
                      ? "rgba(16, 185, 129, 0.08)"
                      : "transparent",
                }}
              >
                {hasPak && (
                  <div
                    style={{
                      transform: `scale(${pakScale})`,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 82,
                        fontFamily: fontRamabhadra,
                        fontWeight: 900,
                        color: "#4338CA", // bold marker indigo/purple
                        lineHeight: 1,
                        textShadow: "0 3px 10px rgba(67,56,202,0.25)",
                      }}
                    >
                      {row.pak}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── 4. BOTTOM TOTAL OR WINNER BANNER ───────────────────────── */}
      {!isWinnerPhase ? (
        // Standard Live Status Box
        <div
          style={{
            position: "absolute",
            bottom: 45,
            left: 45,
            right: 45,
            height: 250,
            background: "#FFFFFF",
            borderRadius: 22,
            border: "3.5px solid #1E293B",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            padding: "0 30px",
          }}
        >
          {/* India Total */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 30,
                fontFamily: fontRamabhadra,
                color: "#C2410C",
                fontWeight: 800,
              }}
            >
              భారత్ మొత్తం టైటిల్స్
            </span>
            <span
              style={{
                fontSize: 88,
                fontFamily: fontRamabhadra,
                color: "#DC2626",
                fontWeight: 900,
                lineHeight: 1,
                marginTop: 6,
              }}
            >
              19 🏆
            </span>
          </div>

          <div
            style={{ width: 3, height: 160, background: "#CBD5E1" }}
          />

          {/* Pakistan Total */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 30,
                fontFamily: fontRamabhadra,
                color: "#065F46",
                fontWeight: 800,
              }}
            >
              పాకిస్తాన్ మొత్తం
            </span>
            <span
              style={{
                fontSize: 88,
                fontFamily: fontRamabhadra,
                color: "#4338CA",
                fontWeight: 900,
                lineHeight: 1,
                marginTop: 6,
              }}
            >
              7 🏆
            </span>
          </div>
        </div>
      ) : (
        // Grand Winner Reveal Card
        <div
          style={{
            position: "absolute",
            bottom: 35,
            left: 45,
            right: 45,
            height: 275,
            background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
            borderRadius: 24,
            border: "4px solid #D97706",
            boxShadow: "0 16px 50px rgba(217,119,6,0.35)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${winnerScale})`,
            zIndex: 20,
          }}
        >
          {/* Confetti particles */}
          {Array.from({ length: 30 }).map((_, i) => {
            const cx = random(`cfx${i}`) * 900;
            const cy = random(`cfy${i}`) * 250;
            const col = ["#DC2626", "#D97706", "#2563EB", "#16A34A"][i % 4];
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: cx,
                  top: cy,
                  width: 10,
                  height: 10,
                  borderRadius: i % 2 === 0 ? "50%" : 2,
                  background: col,
                  opacity: 0.6,
                }}
              />
            );
          })}

          <div
            style={{
              fontSize: 50,
              fontFamily: fontRamabhadra,
              color: "#92400E",
              fontWeight: 900,
              lineHeight: 1.1,
              textShadow: "0 2px 10px rgba(217,119,6,0.2)",
            }}
          >
            👑 విజేత: టీమ్ ఇండియా 🇮🇳
          </div>
          <div
            style={{
              fontSize: 32,
              fontFamily: fontRamabhadra,
              color: "#B45309",
              marginTop: 6,
              fontWeight: 800,
            }}
          >
            భారత్ 19 — పాకిస్తాన్ 7 (స్పష్టమైన ఆధిపత్యం!)
          </div>

          {/* Subscribe Button */}
          <div
            style={{
              marginTop: 14,
              transform: `scale(${subscribePulse})`,
              background: "#DC2626",
              color: "#FFFFFF",
              fontSize: 30,
              fontFamily: "Arial Black, sans-serif",
              fontWeight: 900,
              padding: "10px 48px",
              borderRadius: 30,
              boxShadow: "0 6px 20px rgba(220,38,38,0.45)",
              letterSpacing: 1,
            }}
          >
            🔔 SUBSCRIBE · ఆర్కే క్రికెట్ తెలుగు
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
}
