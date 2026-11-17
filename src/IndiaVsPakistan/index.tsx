import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  random,
  staticFile,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/NotoSansTelugu";

const { fontFamily: teluguFont } = loadFont();

// ─── Constants ────────────────────────────────────────────────────────────────
const FPS = 30;
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const C = {
  bg: "#07080F",
  india: "#FF9933",
  indiaGreen: "#138808",
  indiaNavy: "#000080",
  pak: "#01411C",
  pakLight: "#00A651",
  gold: "#FFD700",
  white: "#FFFFFF",
  silver: "#C0C0C0",
  red: "#FF0000",
};

// ─── Shared Utilities ─────────────────────────────────────────────────────────

function sp(
  frame: number,
  fps: number,
  delay = 0,
  cfg: { damping?: number; stiffness?: number; mass?: number } = {}
) {
  return spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.8, ...cfg },
  });
}

function CountUp({
  to,
  start,
  dur = 45,
  prefix = "",
  suffix = "",
}: {
  to: number;
  start: number;
  dur?: number;
  prefix?: string;
  suffix?: string;
}) {
  const frame = useCurrentFrame();
  const val = interpolate(frame, [start, start + dur], [0, to], clamp);
  return (
    <span>
      {prefix}
      {Math.round(val)}
      {suffix}
    </span>
  );
}

function Particles({
  count = 60,
  color = "#FFD700",
  speed = 1.2,
}: {
  count?: number;
  color?: string;
  speed?: number;
}) {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => {
        const x = random(`px${i}`) * width;
        const baseY = random(`py${i}`) * height;
        const spd = speed * (0.4 + random(`ps${i}`) * 1.5);
        const y = ((baseY - frame * spd) % height + height) % height;
        const size = 1.5 + random(`pz${i}`) * 3.5;
        const opacity = 0.25 + random(`po${i}`) * 0.4;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: color,
              opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
}

function Flash({ at, dur = 15 }: { at: number; dur?: number }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [at, at + 3, at + dur],
    [0, 0.95, 0],
    clamp
  );
  return (
    <AbsoluteFill
      style={{ background: "#fff", opacity, pointerEvents: "none" }}
    />
  );
}

function BottomCaption({ text }: { text: string }) {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 12], [0, 1], clamp);
  const y = interpolate(frame, [0, 12], [15, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        bottom: 26,
        left: "50%",
        transform: `translateX(-50%) translateY(${y}px)`,
        opacity: op,
        background: "rgba(10, 15, 25, 0.85)",
        border: `1.5px solid ${C.gold}77`,
        borderRadius: 40,
        padding: "10px 40px",
        color: C.white,
        fontSize: 27,
        fontFamily: teluguFont,
        fontWeight: 700,
        boxShadow: `0 8px 30px rgba(0,0,0,0.9), 0 0 20px ${C.gold}22`,
        textAlign: "center",
        zIndex: 50,
      }}
    >
      {text}
    </div>
  );
}

// ─── Scene 1 · Hook (238 frames = ~7.9s) ─────────────────────────────────────
function SceneHook() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const indiaSlide = interpolate(frame, [0, 20], [-300, 0], clamp);
  const pakSlide = interpolate(frame, [0, 20], [300, 0], clamp);
  const indiaOp = interpolate(frame, [0, 18], [0, 1], clamp);
  const pakOp = interpolate(frame, [0, 18], [0, 1], clamp);

  const vsScale = sp(frame, fps, 12, { damping: 7, stiffness: 200, mass: 0.5 });

  const subOp = interpolate(frame, [22, 36], [0, 1], clamp);
  const subY = interpolate(frame, [22, 36], [40, 0], clamp);

  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse at 20% 50%, ${C.india}22 0%, transparent 55%),
            radial-gradient(ellipse at 80% 50%, ${C.pakLight}22 0%, transparent 55%)
          `,
        }}
      />

      <Particles count={70} color={C.gold} />

      {/* Horizontal center line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${C.india}66, ${C.gold}, ${C.pakLight}66, transparent)`,
          transform: "translateY(-50%)",
        }}
      />

      {/* INDIA side */}
      <div
        style={{
          position: "absolute",
          left: 70,
          top: "47%",
          transform: `translateY(-50%) translateX(${indiaSlide}px)`,
          opacity: indiaOp,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 300,
            height: 200,
            borderRadius: 14,
            overflow: "hidden",
            border: `4px solid ${C.india}`,
            boxShadow: `0 0 50px ${C.india}77`,
            display: "flex",
            flexDirection: "column",
            marginBottom: 20,
          }}
        >
          <div style={{ flex: 1, background: C.india }} />
          <div
            style={{
              flex: 1,
              background: C.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
              color: C.indiaNavy,
            }}
          >
            ⊕
          </div>
          <div style={{ flex: 1, background: C.indiaGreen }} />
        </div>
        <div
          style={{
            color: C.india,
            fontSize: 66,
            fontWeight: 900,
            fontFamily: "Arial Black, Impact, sans-serif",
            textShadow: `0 0 35px ${C.india}88`,
            letterSpacing: 2,
          }}
        >
          INDIA
        </div>
        <div
          style={{
            color: C.white,
            fontSize: 30,
            fontFamily: teluguFont,
            opacity: 0.9,
            marginTop: 4,
            fontWeight: 700,
          }}
        >
          భారతదేశం
        </div>
      </div>

      {/* VS Badge */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "47%",
          transform: `translate(-50%, -50%) scale(${vsScale})`,
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: 155,
            height: 155,
            borderRadius: "50%",
            background: `conic-gradient(${C.gold}, #FFA500, ${C.gold})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 70px ${C.gold}88, 0 0 140px ${C.gold}44`,
            border: `4px solid ${C.white}`,
          }}
        >
          <span
            style={{
              color: "#000",
              fontSize: 58,
              fontWeight: 900,
              fontFamily: "Arial Black, sans-serif",
            }}
          >
            VS
          </span>
        </div>
      </div>

      {/* PAKISTAN side */}
      <div
        style={{
          position: "absolute",
          right: 70,
          top: "47%",
          transform: `translateY(-50%) translateX(${-pakSlide}px)`,
          opacity: pakOp,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 300,
            height: 200,
            borderRadius: 14,
            overflow: "hidden",
            border: `4px solid ${C.pakLight}`,
            boxShadow: `0 0 50px ${C.pakLight}77`,
            display: "flex",
            marginBottom: 20,
          }}
        >
          <div style={{ width: "25%", background: C.white }} />
          <div
            style={{
              flex: 1,
              background: C.pak,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 64,
              color: C.white,
            }}
          >
            ☽
          </div>
        </div>
        <div
          style={{
            color: C.pakLight,
            fontSize: 66,
            fontWeight: 900,
            fontFamily: "Arial Black, Impact, sans-serif",
            textShadow: `0 0 35px ${C.pakLight}88`,
            letterSpacing: 2,
          }}
        >
          PAKISTAN
        </div>
        <div
          style={{
            color: C.white,
            fontSize: 30,
            fontFamily: teluguFont,
            opacity: 0.9,
            marginTop: 4,
            fontWeight: 700,
          }}
        >
          పాకిస్తాన్
        </div>
      </div>

      {/* Top branding */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: `linear-gradient(90deg, ${C.india}22, ${C.gold}44, ${C.pakLight}22)`,
            border: `2px solid ${C.gold}77`,
            borderRadius: 40,
            padding: "8px 45px",
          }}
        >
          <span
            style={{
              color: C.gold,
              fontSize: 26,
              fontWeight: 900,
              fontFamily: "Arial Black, sans-serif",
              letterSpacing: 4,
            }}
          >
            RK CRICKET TELUGU
          </span>
        </div>
      </div>

      {/* Main question */}
      <div
        style={{
          position: "absolute",
          bottom: 90,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: subOp,
          transform: `translateY(${subY}px)`,
        }}
      >
        <div
          style={{
            color: C.white,
            fontSize: 44,
            fontFamily: teluguFont,
            fontWeight: 800,
            textShadow: "0 2px 25px rgba(0,0,0,0.9)",
          }}
        >
          ICC ట్రోఫీల్లో ఎవరు ఎక్కువ గెలిచారు? 🏆
        </div>
      </div>

      <BottomCaption text="భారత్ వర్సెస్ పాకిస్తాన్ — ఐసీసీ ట్రోఫీల్లో ఎవరిది ఆధిపత్యం?" />
      <Flash at={8} />
    </AbsoluteFill>
  );
}

// ─── Scene 2 · India Trophies (488 frames = ~16.2s) ──────────────────────────
function SceneIndia() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const trophies = [
    { year: "1983", event: "ODI వరల్డ్ కప్ (కపిల్ దేవ్)", icon: "🏆" },
    { year: "2007", event: "T20 వరల్డ్ కప్ (ధోని)", icon: "⚡" },
    { year: "2011", event: "ODI వరల్డ్ కప్ (ధోని)", icon: "🏆" },
    { year: "2013", event: "ఛాంపియన్స్ ట్రోఫీ (ధోని)", icon: "🥇" },
    { year: "2024", event: "T20 వరల్డ్ కప్ (రోహిత్ శర్మ)", icon: "⚡" },
  ];

  const headerY = interpolate(frame, [0, 18], [-80, 0], clamp);
  const headerOp = interpolate(frame, [0, 18], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: "#060D08", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            linear-gradient(180deg,
              ${C.india}20 0%,
              transparent 25%,
              transparent 75%,
              ${C.indiaGreen}20 100%
            )
          `,
        }}
      />
      <Particles count={55} color={C.india} speed={0.8} />
      <Particles count={30} color={C.indiaGreen} speed={1.2} />

      {/* Top tri-color bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          height: 10,
        }}
      >
        <div style={{ flex: 1, background: C.india }} />
        <div style={{ flex: 1, background: C.white }} />
        <div style={{ flex: 1, background: C.indiaGreen }} />
      </div>

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 25,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `translateY(${headerY}px)`,
          opacity: headerOp,
        }}
      >
        <div style={{ fontSize: 75, lineHeight: 1 }}>🇮🇳</div>
        <div
          style={{
            color: C.india,
            fontSize: 68,
            fontWeight: 900,
            fontFamily: "Arial Black, sans-serif",
            textShadow: `0 0 45px ${C.india}88`,
            letterSpacing: 4,
          }}
        >
          TEAM INDIA
        </div>
        <div
          style={{
            color: C.white,
            fontSize: 28,
            fontFamily: teluguFont,
            opacity: 0.85,
            marginTop: 4,
            fontWeight: 600,
          }}
        >
          ఐసీసీ ట్రోఫీలు — 5 కప్పుల ప్రయాణం
        </div>
      </div>

      {/* Trophy cards */}
      <div
        style={{
          position: "absolute",
          top: 255,
          left: 140,
          right: 380,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {trophies.map((t, i) => {
          const delay = 25 + i * 55;
          const scale = sp(frame, fps, delay, { damping: 11, stiffness: 160 });
          const opacity = interpolate(frame, [delay, delay + 12], [0, 1], clamp);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                transform: `scale(${scale})`,
                opacity,
                transformOrigin: "left center",
                background:
                  "linear-gradient(90deg, rgba(255,153,51,0.14), rgba(19,136,8,0.10))",
                borderRadius: 16,
                padding: "16px 28px",
                border: `1.5px solid ${C.india}55`,
                boxShadow: `0 4px 20px rgba(0,0,0,0.5)`,
              }}
            >
              <div style={{ fontSize: 44, flexShrink: 0 }}>{t.icon}</div>
              <div
                style={{
                  color: C.india,
                  fontSize: 36,
                  fontWeight: 900,
                  fontFamily: "Arial Black, sans-serif",
                  flexShrink: 0,
                  width: 100,
                }}
              >
                {t.year}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    color: C.white,
                    fontSize: 26,
                    fontWeight: 700,
                    fontFamily: teluguFont,
                  }}
                >
                  {t.event}
                </div>
              </div>
              <div
                style={{
                  color: C.gold,
                  fontSize: 38,
                  fontWeight: 900,
                  fontFamily: "Arial Black, sans-serif",
                  textShadow: `0 0 15px ${C.gold}88`,
                }}
              >
                ✓
              </div>
            </div>
          );
        })}
      </div>

      {/* Total count display */}
      <div
        style={{
          position: "absolute",
          top: 360,
          right: 90,
          textAlign: "center",
          background: "rgba(255,215,0,0.06)",
          padding: "30px 40px",
          borderRadius: 24,
          border: `2px solid ${C.gold}66`,
          boxShadow: `0 0 50px ${C.gold}33`,
        }}
      >
        <div
          style={{
            color: C.gold,
            fontSize: 140,
            fontWeight: 900,
            fontFamily: "Arial Black, sans-serif",
            lineHeight: 1,
            textShadow: `0 0 60px ${C.gold}99, 0 0 120px ${C.gold}44`,
          }}
        >
          <CountUp to={5} start={35} dur={180} />
        </div>
        <div
          style={{
            color: C.white,
            fontSize: 32,
            fontFamily: teluguFont,
            fontWeight: 800,
            opacity: 0.95,
            marginTop: 10,
          }}
        >
          ICC ట్రోఫీలు 🏆
        </div>
      </div>

      <BottomCaption text="భారత్: 1983, 2007, 2011, 2013, 2024 — మొత్తం 5 ఐసీసీ టైటిల్స్!" />
    </AbsoluteFill>
  );
}

// ─── Scene 3 · Pakistan Trophies (482 frames = ~16.0s) ───────────────────────
function ScenePakistan() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const trophies = [
    { year: "1992", event: "ODI వరల్డ్ కప్ (ఇమ్రాన్ ఖాన్)", icon: "🏆" },
    { year: "2009", event: "T20 వరల్డ్ కప్ (యూనిస్ ఖాన్)", icon: "⚡" },
    { year: "2017", event: "ఛాంపియన్స్ ట్రోఫీ (సర్ఫరాజ్)", icon: "🥇" },
  ];

  const headerY = interpolate(frame, [0, 18], [-80, 0], clamp);
  const headerOp = interpolate(frame, [0, 18], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: "#031008", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 30%, ${C.pakLight}24 0%, transparent 60%)`,
        }}
      />
      <Particles count={60} color={C.pakLight} speed={1} />

      {/* Top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 10,
          background: `linear-gradient(90deg, ${C.pak}, ${C.pakLight}, ${C.pak})`,
        }}
      />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 25,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `translateY(${headerY}px)`,
          opacity: headerOp,
        }}
      >
        <div style={{ fontSize: 75, lineHeight: 1 }}>🇵🇰</div>
        <div
          style={{
            color: C.pakLight,
            fontSize: 68,
            fontWeight: 900,
            fontFamily: "Arial Black, sans-serif",
            textShadow: `0 0 45px ${C.pakLight}88`,
            letterSpacing: 4,
          }}
        >
          PAKISTAN
        </div>
        <div
          style={{
            color: C.white,
            fontSize: 28,
            fontFamily: teluguFont,
            opacity: 0.85,
            marginTop: 4,
            fontWeight: 600,
          }}
        >
          ఐసీసీ ట్రోఫీలు — 3 కప్పుల ప్రయాణం
        </div>
      </div>

      {/* Trophy cards */}
      <div
        style={{
          position: "absolute",
          top: 290,
          left: 140,
          right: 380,
          display: "flex",
          flexDirection: "column",
          gap: 26,
        }}
      >
        {trophies.map((t, i) => {
          const delay = 35 + i * 85;
          const scale = sp(frame, fps, delay, { damping: 11, stiffness: 160 });
          const opacity = interpolate(frame, [delay, delay + 12], [0, 1], clamp);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                transform: `scale(${scale})`,
                opacity,
                transformOrigin: "left center",
                background: "rgba(0,166,81,0.12)",
                borderRadius: 16,
                padding: "22px 32px",
                border: `1.5px solid ${C.pakLight}55`,
                boxShadow: `0 4px 20px rgba(0,0,0,0.5)`,
              }}
            >
              <div style={{ fontSize: 48, flexShrink: 0 }}>{t.icon}</div>
              <div
                style={{
                  color: C.pakLight,
                  fontSize: 36,
                  fontWeight: 900,
                  fontFamily: "Arial Black, sans-serif",
                  flexShrink: 0,
                  width: 100,
                }}
              >
                {t.year}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    color: C.white,
                    fontSize: 28,
                    fontWeight: 700,
                    fontFamily: teluguFont,
                  }}
                >
                  {t.event}
                </div>
              </div>
              <div
                style={{
                  color: C.gold,
                  fontSize: 38,
                  fontWeight: 900,
                  fontFamily: "Arial Black, sans-serif",
                  textShadow: `0 0 15px ${C.gold}88`,
                }}
              >
                ✓
              </div>
            </div>
          );
        })}
      </div>

      {/* Total count */}
      <div
        style={{
          position: "absolute",
          top: 360,
          right: 90,
          textAlign: "center",
          background: "rgba(0,166,81,0.06)",
          padding: "30px 40px",
          borderRadius: 24,
          border: `2px solid ${C.pakLight}66`,
          boxShadow: `0 0 50px ${C.pakLight}33`,
        }}
      >
        <div
          style={{
            color: C.pakLight,
            fontSize: 140,
            fontWeight: 900,
            fontFamily: "Arial Black, sans-serif",
            lineHeight: 1,
            textShadow: `0 0 60px ${C.pakLight}99, 0 0 120px ${C.pakLight}44`,
          }}
        >
          <CountUp to={3} start={35} dur={180} />
        </div>
        <div
          style={{
            color: C.white,
            fontSize: 32,
            fontFamily: teluguFont,
            fontWeight: 800,
            opacity: 0.95,
            marginTop: 10,
          }}
        >
          ICC ట్రోఫీలు 🏆
        </div>
      </div>

      <BottomCaption text="పాకిస్తాన్: 1992, 2009, 2017 — మొత్తం 3 ఐసీసీ టైటిల్స్ మాత్రమే!" />
    </AbsoluteFill>
  );
}

// ─── Scene 4 · Head-to-Head (373 frames = ~12.4s) ────────────────────────────
function SceneComparison() {
  const frame = useCurrentFrame();

  const stats = [
    { label: "ODI వరల్డ్ కప్స్ 🏆", india: 2, pak: 1, max: 3 },
    { label: "T20 వరల్డ్ కప్స్ ⚡", india: 2, pak: 1, max: 3 },
    { label: "ఛాంపియన్స్ ట్రోఫీ 🥇", india: 1, pak: 1, max: 2 },
    { label: "మొత్తం ICC ట్రోఫీలు 👑", india: 5, pak: 3, max: 6 },
  ];

  const hdrOp = interpolate(frame, [0, 15], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            linear-gradient(90deg,
              ${C.india}15 0%, ${C.india}06 30%,
              transparent 48%, transparent 52%,
              ${C.pakLight}06 70%, ${C.pakLight}15 100%
            )
          `,
        }}
      />
      <Particles count={35} color="#FFD70033" />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: hdrOp,
        }}
      >
        <div
          style={{
            color: C.gold,
            fontSize: 48,
            fontWeight: 900,
            fontFamily: "Arial Black, sans-serif",
            letterSpacing: 4,
            textShadow: `0 0 25px ${C.gold}66`,
          }}
        >
          HEAD TO HEAD
        </div>
        <div
          style={{
            color: C.white,
            fontSize: 28,
            fontFamily: teluguFont,
            opacity: 0.8,
            marginTop: 4,
            fontWeight: 700,
          }}
        >
          నేరుగా పోల్చి చూస్తే...
        </div>
      </div>

      {/* Column labels */}
      <div
        style={{
          position: "absolute",
          top: 145,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          paddingLeft: 80,
          paddingRight: 80,
          opacity: hdrOp,
        }}
      >
        <div
          style={{
            color: C.india,
            fontSize: 40,
            fontWeight: 900,
            fontFamily: "Arial Black, sans-serif",
            width: 220,
            textAlign: "center",
          }}
        >
          🇮🇳 INDIA
        </div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            color: C.pakLight,
            fontSize: 40,
            fontWeight: 900,
            fontFamily: "Arial Black, sans-serif",
            width: 220,
            textAlign: "center",
          }}
        >
          PAK 🇵🇰
        </div>
      </div>

      {/* Stat rows */}
      <div
        style={{
          position: "absolute",
          top: 220,
          left: 70,
          right: 70,
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        {stats.map((s, i) => {
          const delay = 15 + i * 40;
          const prog = interpolate(frame, [delay, delay + 45], [0, 1], clamp);
          const textOp = interpolate(frame, [delay, delay + 15], [0, 1], clamp);
          const indiaW = (s.india / s.max) * 100;
          const pakW = (s.pak / s.max) * 100;
          const indiaWins = s.india > s.pak;
          const pakWins = s.pak > s.india;

          return (
            <div key={i} style={{ opacity: textOp }}>
              {/* Category label */}
              <div
                style={{
                  textAlign: "center",
                  color: C.white,
                  fontSize: 25,
                  fontFamily: teluguFont,
                  opacity: 0.9,
                  marginBottom: 8,
                  fontWeight: 700,
                }}
              >
                {s.label}
              </div>

              {/* Bar row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                {/* India score */}
                <div
                  style={{
                    color: indiaWins ? C.gold : C.india,
                    fontSize: 58,
                    fontWeight: 900,
                    fontFamily: "Arial Black, sans-serif",
                    width: 70,
                    textAlign: "center",
                    textShadow: indiaWins ? `0 0 25px ${C.gold}99` : "none",
                  }}
                >
                  {s.india}
                </div>

                {/* India bar (RTL) */}
                <div
                  style={{
                    flex: 1,
                    height: 38,
                    background: "rgba(255,255,255,0.07)",
                    borderRadius: "10px 0 0 10px",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <div
                    style={{
                      width: `${indiaW * prog}%`,
                      background: indiaWins
                        ? `linear-gradient(90deg, ${C.india}99, ${C.gold})`
                        : `linear-gradient(90deg, ${C.india}66, ${C.india})`,
                      borderRadius: "10px 0 0 10px",
                      boxShadow: indiaWins ? `0 0 20px ${C.gold}88` : "none",
                    }}
                  />
                </div>

                {/* Center divider */}
                <div
                  style={{
                    width: 4,
                    height: 52,
                    background: `linear-gradient(180deg, ${C.gold}, ${C.silver})`,
                    borderRadius: 2,
                    flexShrink: 0,
                  }}
                />

                {/* Pakistan bar (LTR) */}
                <div
                  style={{
                    flex: 1,
                    height: 38,
                    background: "rgba(255,255,255,0.07)",
                    borderRadius: "0 10px 10px 0",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${pakW * prog}%`,
                      background: pakWins
                        ? `linear-gradient(90deg, ${C.gold}, ${C.pakLight})`
                        : `linear-gradient(90deg, ${C.pakLight}66, ${C.pakLight})`,
                      borderRadius: "0 10px 10px 0",
                    }}
                  />
                </div>

                {/* Pakistan score */}
                <div
                  style={{
                    color: pakWins ? C.gold : C.pakLight,
                    fontSize: 58,
                    fontWeight: 900,
                    fontFamily: "Arial Black, sans-serif",
                    width: 70,
                    textAlign: "center",
                    textShadow: pakWins ? `0 0 25px ${C.gold}99` : "none",
                  }}
                >
                  {s.pak}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <BottomCaption text="ODI: 2-1, T20: 2-1, ఛాంపియన్స్: 1-1 — భారత్ స్పష్టమైన ఆధిక్యం!" />
    </AbsoluteFill>
  );
}

// ─── Scene 5 · Verdict (271 frames = ~9.0s) ──────────────────────────────────
function SceneVerdict() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const trophyBounce = sp(frame, fps, 0, { damping: 5, stiffness: 200, mass: 0.5 });
  const titleSc = sp(frame, fps, 8, { damping: 8, stiffness: 180, mass: 0.6 });
  const subOp = interpolate(frame, [20, 35], [0, 1], clamp);
  const subY = interpolate(frame, [20, 35], [30, 0], clamp);
  const pulse = 1 + Math.sin(frame * 0.18) * 0.05;

  const confetti = [C.india, C.gold, C.pakLight, "#FF4444", C.white, "#00FF88"];

  return (
    <AbsoluteFill style={{ background: "#060608", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 35%, ${C.gold}35 0%, transparent 58%)`,
        }}
      />

      {/* Confetti */}
      {Array.from({ length: 80 }).map((_, i) => {
        const x = random(`cx${i}`) * 1920;
        const spd = 3 + random(`cs${i}`) * 7;
        const y = -60 + frame * spd;
        const rot = frame * (random(`cr${i}`) * 8 - 4);
        const col = confetti[Math.floor(random(`cc${i}`) * confetti.length)];
        const sz = 10 + random(`cz${i}`) * 18;
        const opacity = interpolate(y, [0, 700, 1080], [1, 1, 0], clamp);
        const isRect = random(`ct${i}`) > 0.5;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: sz,
              height: isRect ? sz * 0.4 : sz,
              background: col,
              borderRadius: isRect ? 2 : "50%",
              transform: `rotate(${rot}deg)`,
              opacity,
            }}
          />
        );
      })}

      {/* Big trophy */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 160,
          transform: `scale(${trophyBounce})`,
          transformOrigin: "center top",
          lineHeight: 1,
        }}
      >
        🏆
      </div>

      {/* INDIA WINS */}
      <div
        style={{
          position: "absolute",
          top: "33%",
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `scale(${titleSc})`,
        }}
      >
        <div
          style={{
            color: C.gold,
            fontSize: 98,
            fontWeight: 900,
            fontFamily: "Arial Black, sans-serif",
            letterSpacing: 4,
            textShadow: `0 0 60px ${C.gold}99, 0 0 120px ${C.gold}55`,
          }}
        >
          🇮🇳 INDIA WINS!
        </div>
      </div>

      {/* Stats summary */}
      <div
        style={{
          position: "absolute",
          top: "54%",
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: subOp,
          transform: `translateY(${subY}px)`,
        }}
      >
        <div
          style={{
            color: C.white,
            fontSize: 44,
            fontFamily: teluguFont,
            fontWeight: 800,
          }}
        >
          భారత్{" "}
          <span style={{ color: C.gold, fontSize: 56 }}>5</span> ICC ట్రోఫీలు
          {"   "}|{"   "}పాకిస్తాన్{" "}
          <span style={{ color: C.pakLight, fontSize: 56 }}>3</span> ICC
          ట్రోఫీలు
        </div>
        <div
          style={{
            color: C.silver,
            fontSize: 32,
            fontFamily: teluguFont,
            opacity: 0.9,
            marginTop: 12,
            fontWeight: 600,
          }}
        >
          భారత్ తిరుగులేని విజేత! 👑
        </div>
      </div>

      {/* Subscribe button */}
      <div
        style={{
          position: "absolute",
          bottom: 45,
          left: "50%",
          transform: `translateX(-50%) scale(${pulse})`,
          background: `linear-gradient(135deg, #CC0000, #FF0000)`,
          color: C.white,
          fontSize: 34,
          fontWeight: 900,
          fontFamily: "Arial Black, sans-serif",
          padding: "16px 70px",
          borderRadius: 50,
          letterSpacing: 2,
          boxShadow: "0 0 50px #FF000088, 0 4px 20px rgba(0,0,0,0.6)",
          whiteSpace: "nowrap",
        }}
      >
        🔔 SUBSCRIBE చేయండి
      </div>
    </AbsoluteFill>
  );
}

// ─── Main Composition ─────────────────────────────────────────────────────────
export const SCENES_IVP = [
  { id: "scene1", dur: 238, C: SceneHook, audio: "audio/ivp/scene1.wav" },
  { id: "scene2", dur: 488, C: SceneIndia, audio: "audio/ivp/scene2.wav" },
  { id: "scene3", dur: 482, C: ScenePakistan, audio: "audio/ivp/scene3.wav" },
  { id: "scene4", dur: 373, C: SceneComparison, audio: "audio/ivp/scene4.wav" },
  { id: "scene5", dur: 271, C: SceneVerdict, audio: "audio/ivp/scene5.wav" },
];

export const TOTAL_FRAMES_IVP = SCENES_IVP.reduce((a, s) => a + s.dur, 0); // 1852 frames = 61.73s

export function IndiaVsPakistan() {
  let offset = 0;
  return (
    <AbsoluteFill>
      {/* Background music */}
      <Audio src={staticFile("music/bg.mp3")} volume={0.07} loop />

      {/* Scene sequences with synced audio */}
      {SCENES_IVP.map(({ id, dur, C: Comp, audio }, i) => {
        const start = offset;
        offset += dur;
        return (
          <Sequence key={id} from={start} durationInFrames={dur}>
            <Comp />
            <Audio src={staticFile(audio)} volume={1.0} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
}
