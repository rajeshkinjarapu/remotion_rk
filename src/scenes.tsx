import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Background,
  Bar,
  Caption,
  CountUp,
  Flash,
  Particles,
  shake,
} from "./components";
import { COLORS, fontFamily, sec } from "./theme";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// Player cutout. Uses licensed cutouts from public/img/ if available, otherwise falls back to stylized initial box.
const PlayerCutout: React.FC<{
  name: string;
  team: string;
  color: string;
  x: number;
  y?: number;
}> = ({ name, team, color, x, y = 260 }) => {
  const isHardik = name.toLowerCase().includes("hardik");
  const isArshdeep = name.toLowerCase().includes("arshdeep");
  const imgPath = isHardik ? "img/hardik.png" : isArshdeep ? "img/arshdeep.png" : null;

  return (
    <div
      style={{
        position: "absolute",
        left: 960 + x,
        top: y,
        transform: "translateX(-50%)",
        textAlign: "center",
        fontFamily,
      }}
    >
      <div
        style={{
          width: 300,
          height: 300,
          borderRadius: 24,
          background: `linear-gradient(160deg, ${color}, #000)`,
          border: `4px solid ${COLORS.gold}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 110,
          color: COLORS.white,
          fontWeight: 900,
          overflow: "hidden",
          boxShadow: `0 20px 40px rgba(0,0,0,0.7), 0 0 30px ${color}80`,
        }}
      >
        {imgPath ? (
          <Img
            src={staticFile(imgPath)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          name
            .split(" ")
            .map((w) => w[0])
            .join("")
        )}
      </div>
      <div style={{ color: COLORS.white, fontSize: 38, fontWeight: 700, marginTop: 14 }}>
        {name}
      </div>
      <div style={{ color: COLORS.gold, fontSize: 28 }}>{team}</div>
    </div>
  );
};

/* ---------------- Scene 1: Hook & Breaking News (0:00 - 0:50) ---------------- */
export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inL = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const inR = spring({ frame: frame - 6, fps, config: { damping: 14, stiffness: 120 } });
  const banner = spring({ frame: frame - 2, fps, config: { damping: 9 } });
  const swap = spring({ frame: frame - 45, fps, config: { damping: 8, stiffness: 200 } });
  const glitch = frame < 15 ? random(`g${frame}`) * 14 - 7 : 0;

  return (
    <AbsoluteFill>
      <Background accent={COLORS.mi} />
      <Particles />
      <Flash at={40} />

      <AbsoluteFill style={{ transform: `translateX(${shake(frame, 40)}px)` }}>
        <PlayerCutout
          name="Hardik Pandya"
          team="MI → PBKS"
          color={COLORS.mi}
          x={interpolate(inL, [0, 1], [-900, -260])}
        />
        <PlayerCutout
          name="Arshdeep Singh"
          team="PBKS → MI"
          color={COLORS.pbks}
          x={interpolate(inR, [0, 1], [900, 260])}
        />
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          top: 90,
          width: "100%",
          textAlign: "center",
          fontFamily,
          fontSize: 112,
          fontWeight: 900,
          color: COLORS.gold,
          letterSpacing: 4,
          textShadow: "0 0 30px #FFD700",
          transform: `translateX(${glitch}px) scale(${banner})`,
        }}
      >
        BREAKING TRADE
      </div>

      <div
        style={{
          position: "absolute",
          top: 720,
          width: "100%",
          textAlign: "center",
          fontFamily,
          fontSize: 116,
          fontWeight: 900,
          color: COLORS.white,
          transform: `scale(${swap})`,
          textShadow: "0 10px 30px rgba(0,0,0,0.8)",
        }}
      >
        ₹<CountUp from={0} to={18} start={45} dur={25} /> CRORE MEGA SWAP
      </div>

      <Caption
        lines={[
          { from: 0, to: sec(3), text: "IPL 2027 మినీ ఆక్షన్ కు ముందే బిగ్ ట్రేడ్!" },
          { from: sec(3.5), to: sec(7.5), text: "హార్దిక్ పాండ్యా: MI → PBKS" },
          { from: sec(8), to: sec(12), text: "అర్ష్దీప్ సింగ్: PBKS → MI" },
          { from: sec(13), to: sec(18), text: "₹18 కోట్ల మెగా స్వాప్!" },
        ]}
      />
    </AbsoluteFill>
  );
};

/* ---------------- Scene 2: Trade Mechanics & Purse (0:50 - 1:50) ---------------- */
const FeeCard: React.FC<{
  player: string;
  from: string;
  to: string;
  badge: string;
  badgeColor: string;
  delay: number;
}> = ({ player, from, to, badge, badgeColor, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 16 } });
  return (
    <div
      style={{
        width: 620,
        padding: 40,
        borderRadius: 24,
        background: "rgba(255,255,255,0.06)",
        border: "2px solid rgba(255,255,255,0.15)",
        fontFamily,
        color: COLORS.white,
        transform: `translateY(${(1 - p) * 120}px)`,
        opacity: p,
        boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
      }}
    >
      <div style={{ fontSize: 42, fontWeight: 900, marginBottom: 22 }}>{player}</div>
      <div style={{ fontSize: 46 }}>
        <span style={{ color: COLORS.muted }}>{from}</span>
        <span style={{ margin: "0 18px", color: COLORS.gold }}>➔</span>
        <span style={{ fontWeight: 900 }}>{to}</span>
      </div>
      <div
        style={{
          display: "inline-block",
          marginTop: 22,
          padding: "8px 22px",
          borderRadius: 40,
          background: badgeColor,
          fontSize: 30,
          fontWeight: 700,
          boxShadow: `0 0 15px ${badgeColor}80`,
        }}
      >
        {badge}
      </div>
    </div>
  );
};

export const Scene2Mechanics: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const purseIn = spring({ frame: frame - 90, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill>
      <Background accent={COLORS.mi} />
      <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center", fontFamily, color: COLORS.gold, fontSize: 60, fontWeight: 900 }}>
        TRADE MONEY BREAKDOWN
      </div>

      <div style={{ position: "absolute", top: 200, width: "100%", display: "flex", justifyContent: "center", gap: 80 }}>
        <FeeCard
          player="Hardik Pandya"
          from="₹16.35 Cr"
          to="₹18.00 Cr"
          badge="+₹1.65 Cr HIKE"
          badgeColor={COLORS.pbks}
          delay={0}
        />
        <FeeCard
          player="Arshdeep Singh"
          from="₹18.00 Cr"
          to="₹18.00 Cr"
          badge="SAME FEE"
          badgeColor={COLORS.mi}
          delay={12}
        />
      </div>

      {/* Purse balances */}
      <div style={{ position: "absolute", top: 640, left: 360, right: 360, fontFamily, color: COLORS.white, opacity: purseIn }}>
        <div style={{ fontSize: 34, marginBottom: 10 }}>MI Purse</div>
        <div style={{ height: 22, background: "#222", borderRadius: 11, overflow: "hidden" }}>
          <Bar ratio={0.62} color={COLORS.mi} delay={100} />
        </div>
        <div style={{ fontSize: 34, margin: "30px 0 10px" }}>PBKS Purse</div>
        <div style={{ height: 22, background: "#222", borderRadius: 11, overflow: "hidden" }}>
          <Bar ratio={0.48} color={COLORS.pbks} delay={110} />
        </div>
      </div>

      <Caption
        lines={[
          { from: 0, to: sec(4), text: "హార్దిక్ ఫీజు ₹16.35 Cr → ₹18 Cr" },
          { from: sec(5), to: sec(12), text: "అర్ష్దీప్ ₹18 Cr… MI అదనంగా ₹1.65 Cr ఖర్చు" },
          { from: sec(14), to: sec(20), text: "MI అర్ష్దీప్ కోసం ఎంత సీరియస్గా ప్రయత్నించిందో!" },
        ]}
      />
    </AbsoluteFill>
  );
};

/* ---------------- Scene 3: Head-to-Head Stats (1:50 - 3:15) ---------------- */
const StatRow: React.FC<{
  label: string;
  l: number | null;
  r: number | null;
  delay: number;
}> = ({ label, l, r, delay }) => {
  const max = Math.max(l ?? 0, r ?? 0) || 1;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, fontFamily, color: COLORS.white, fontSize: 34, marginBottom: 28 }}>
      <div style={{ width: 170, textAlign: "right", fontWeight: 700 }}>{l ?? "—"}</div>
      <div style={{ flex: 1, height: 18, background: "#1d1f27", borderRadius: 9, display: "flex", justifyContent: "flex-end", overflow: "hidden" }}>
        {l !== null && <Bar ratio={l / max} color={COLORS.mi} delay={delay} />}
      </div>
      <div style={{ width: 380, textAlign: "center", color: COLORS.gold, fontWeight: 700 }}>{label}</div>
      <div style={{ flex: 1, height: 18, background: "#1d1f27", borderRadius: 9, overflow: "hidden" }}>
        {r !== null && <Bar ratio={r / max} color={COLORS.pbks} delay={delay} />}
      </div>
      <div style={{ width: 170, fontWeight: 700 }}>{r ?? "—"}</div>
    </div>
  );
};

export const Scene3Stats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = spring({ frame, fps, config: { damping: 200 } });

  const rows = [
    { label: "Matches", l: 162, r: 96 },
    { label: "IPL Runs", l: 2955, r: null },
    { label: "Strike Rate", l: 146.28, r: null },
    { label: "Wickets", l: 82, r: 111 },
    { label: "Economy", l: null, r: 9.19 },
    { label: "Recent Wkts (2026)", l: 4, r: 14 },
  ];

  return (
    <AbsoluteFill>
      <Background accent={COLORS.pbks} />
      <div style={{ position: "absolute", top: 50, width: "100%", display: "flex", justifyContent: "space-between", padding: "0 160px", boxSizing: "border-box", fontFamily, opacity: head }}>
        <div>
          <div style={{ fontSize: 60, fontWeight: 900, color: COLORS.white }}>Hardik Pandya</div>
          <div style={{ fontSize: 30, color: COLORS.mi }}>All-rounder</div>
        </div>
        <div style={{ fontSize: 60, fontWeight: 900, color: COLORS.gold }}>VS</div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 60, fontWeight: 900, color: COLORS.white }}>Arshdeep Singh</div>
          <div style={{ fontSize: 30, color: COLORS.pbks }}>Bowler</div>
        </div>
      </div>

      <div style={{ position: "absolute", top: 320, left: 160, right: 160 }}>
        {rows.map((row, i) => (
          <StatRow key={row.label} {...row} delay={20 + i * 12} />
        ))}
      </div>

      <div style={{ position: "absolute", bottom: 150, width: "100%", textAlign: "center", fontFamily, color: COLORS.muted, fontSize: 26 }}>
        Hardik IPL 2026: 206 runs, 4 wkts (10 matches) · Arshdeep 8 seasons, 96 matches
      </div>

      <Caption
        lines={[
          { from: 0, to: sec(10), text: "ఇద్దరి IPL కెరీర్ గణాంకాలు పక్కపక్కన" },
          { from: sec(12), to: sec(30), text: "హార్దిక్: 162 మ్యాచ్లు, 2,955 పరుగులు, 4 టైటిళ్లు" },
          { from: sec(32), to: sec(50), text: "అర్ష్దీప్: 111 వికెట్లు, పంజాబ్ చరిత్రలో టాప్ వికెట్ టేకర్" },
          { from: sec(52), to: sec(75), text: "2025 లో 21 వికెట్లు, 2026 లో 14 వికెట్లు" },
        ]}
      />
    </AbsoluteFill>
  );
};

/* ---------------- Scenes 4 & 5: Pros / Cons ---------------- */
const ImpactScene: React.FC<{
  headline: string;
  color: string;
  players: string[];
  pros: string[];
  cons: string[];
  captions: { from: number; to: number; text: string }[];
}> = ({ headline, color, players, pros, cons, captions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headIn = spring({ frame, fps, config: { damping: 200 } });

  const column = (title: string, items: string[], tint: string, startAt: number) => (
    <div style={{ width: 720, padding: 36, borderRadius: 24, background: "rgba(0,0,0,0.45)", border: `3px solid ${tint}`, fontFamily, color: COLORS.white }}>
      <div style={{ fontSize: 44, fontWeight: 900, color: tint, marginBottom: 24 }}>{title}</div>
      {items.map((item, i) => {
        const p = spring({ frame: frame - startAt - i * 18, fps, config: { damping: 18 } });
        return (
          <div key={i} style={{ fontSize: 32, marginBottom: 20, opacity: p, transform: `translateX(${(1 - p) * -60}px)` }}>
            {title.includes("PROS") ? "✅" : "⚠️"} {item}
          </div>
        );
      })}
    </div>
  );

  return (
    <AbsoluteFill>
      <Background accent={color} />
      <Particles color={color} />
      <div style={{ position: "absolute", top: 50, width: "100%", textAlign: "center", fontFamily, fontSize: 64, fontWeight: 900, color: COLORS.white, opacity: headIn }}>
        {headline}
      </div>

      <div style={{ position: "absolute", top: 170, width: "100%", display: "flex", justifyContent: "center", gap: 28, fontFamily, color: COLORS.gold, fontSize: 34, fontWeight: 700 }}>
        {players.map((p) => (
          <div key={p} style={{ padding: "10px 26px", border: `2px solid ${COLORS.gold}`, borderRadius: 40 }}>
            {p}
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", top: 290, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 60 }}>
        {column("PROS", pros, "#34D399", 40)}
        {column("CONS", cons, COLORS.pbks, 120)}
      </div>

      <Caption lines={captions} />
    </AbsoluteFill>
  );
};

export const Scene4MI: React.FC = () => (
  <ImpactScene
    headline="Mumbai Indians కు లాభమా? నష్టమా?"
    color={COLORS.mi}
    players={["Jasprit Bumrah", "Arshdeep Singh"]}
    pros={[
      "బుమ్రా + అర్ష్దీప్ డెత్ ఓవర్ కాంబో",
      "పవర్ప్లేలో కొత్త బంతితో స్వింగ్",
      "కెప్టెన్సీ గందరగోళానికి ఫుల్స్టాప్",
    ]}
    cons={[
      "హార్దిక్ లాంటి ఇండియన్ పేస్ ఆల్రౌండర్ లోటు",
      "డిసెంబర్ ఆక్షన్లో లోయర్-ఆర్డర్ హిట్టర్ అవసరం",
    ]}
    captions={[
      { from: 0, to: sec(10), text: "బుమ్రా + అర్ష్దీప్… టి20 వరల్డ్ కప్ కాంబో" },
      { from: sec(12), to: sec(25), text: "పవర్ప్లేలో స్వింగ్, మిడిల్ & డెత్లో 8 ఓవర్లు" },
      { from: sec(28), to: sec(40), text: "అయితే హార్దిక్ స్థానం భర్తీ చేయాలి" },
    ]}
  />
);

export const Scene5PBKS: React.FC = () => (
  <ImpactScene
    headline="Punjab Kings కు లాభమా? నష్టమా?"
    color={COLORS.pbks}
    players={["Hardik Pandya"]}
    pros={[
      "ట్రోఫీ గెలిచిన కెప్టెన్సీ అనుభవం",
      "146+ స్ట్రైక్ రేట్ ఫినిషర్",
      "మూడు ఓవర్లు వేయగల ఇండియన్ ఫాస్ట్ బౌలర్",
    ]}
    cons={[
      "8 ఏళ్ల బౌలింగ్ వెన్నెముక అర్ష్దీప్ లేని లోటు",
      "ముల్లన్పూర్ డెత్ ఓవర్ల కోసం భారీ ఆక్షన్ ఖర్చు",
    ]}
    captions={[
      { from: 0, to: sec(12), text: "పంజాబ్కు ప్రూవెన్ ఇండియన్ కెప్టెన్ కావాలి" },
      { from: sec(14), to: sec(30), text: "హార్దిక్ రాకతో మూడు సమస్యలకు పరిష్కారం" },
      { from: sec(32), to: sec(55), text: "అర్ష్దీప్ లేని లోటు భర్తీ చేయడం పెద్ద రిస్క్" },
    ]}
  />
);

/* ---------------- Scene 6: Verdict & Outro (5:45 - 6:30) ---------------- */
export const Scene6Verdict: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 1 + 0.05 * Math.sin(frame / 6);
  const splitIn = spring({ frame: frame - 120, fps, config: { damping: 200 } });

  const scoreRow = (label: string, score: number, color: string, delay: number) => {
    const p = spring({ frame: frame - delay, fps, config: { damping: 200 } });
    return (
      <div style={{ marginBottom: 36, fontFamily, color: COLORS.white }}>
        <div style={{ fontSize: 40, fontWeight: 700, marginBottom: 10 }}>
          {label}: <span style={{ color: COLORS.gold }}>{(score * p).toFixed(1)}/10</span>
        </div>
        <div style={{ height: 30, background: "#1d1f27", borderRadius: 15, overflow: "hidden" }}>
          <Bar ratio={score / 10} color={color} delay={delay} />
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill>
      <Background accent={COLORS.gold} />
      <Particles color={COLORS.gold} />

      <div style={{ position: "absolute", top: 80, left: 240, right: 240 }}>
        <div style={{ fontFamily, fontSize: 60, fontWeight: 900, color: COLORS.gold, textAlign: "center", marginBottom: 60 }}>
          FINAL VERDICT
        </div>
        {scoreRow("Mumbai Indians (Bowling Dominance)", 8.5, COLORS.mi, 10)}
        {scoreRow("Punjab Kings (Leadership & Balance)", 8.0, COLORS.pbks, 30)}

        <div style={{ opacity: splitIn, marginTop: 20, fontFamily, color: COLORS.white, fontSize: 36, textAlign: "center" }}>
          Edge: MI 55% · PBKS 45%
        </div>
        <div style={{ display: "flex", height: 30, borderRadius: 15, overflow: "hidden", marginTop: 16, opacity: splitIn }}>
          <div style={{ width: "55%", background: COLORS.mi }} />
          <div style={{ width: "45%", background: COLORS.pbks }} />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 130,
          width: "100%",
          textAlign: "center",
          transform: `scale(${pulse})`,
          fontFamily,
          fontSize: 48,
          fontWeight: 900,
          color: COLORS.white,
        }}
      >
        <span style={{ background: COLORS.pbks, padding: "18px 44px", borderRadius: 16, boxShadow: "0 10px 30px rgba(215, 25, 32, 0.6)" }}>
          🔔 SUBSCRIBE · RK CRICKET TELUGU
        </span>
      </div>

      <Caption
        lines={[
          { from: sec(3), to: sec(20), text: "మీ ఓటు ఎవరికి? కామెంట్లో చెప్పండి!" },
        ]}
      />
    </AbsoluteFill>
  );
};

