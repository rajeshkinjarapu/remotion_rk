import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, fontFamily } from "./theme";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const Background: React.FC<{ accent?: string }> = ({
  accent = COLORS.mi,
}) => {
  const frame = useCurrentFrame();
  const hue = interpolate(frame, [0, 900], [0, 50]);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 35%, ${accent}66 0%, ${COLORS.bg} 65%)`,
        filter: `hue-rotate(${hue}deg)`,
      }}
    />
  );
};

export const Particles: React.FC<{ count?: number; color?: string }> = ({
  count = 70,
  color = "#FFFFFF",
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill>
      {Array.from({ length: count }).map((_, i) => {
        const x = random(`x${i}`) * width;
        const speed = 0.3 + random(`s${i}`) * 1.2;
        const y =
          (((random(`y${i}`) * height - frame * speed * 2) % height) + height) %
          height;
        const size = 2 + random(`z${i}`) * 4;
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
              opacity: 0.45,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// White flash at a given frame (impact effect)
export const Flash: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [at, at + 4, at + 18], [0, 0.9, 0], clamp);
  return <AbsoluteFill style={{ background: "#fff", opacity }} />;
};

// Horizontal shake offset in px, starts at `start`, lasts 20 frames
export const shake = (frame: number, start: number, power = 18) => {
  const t = frame - start;
  if (t < 0 || t > 20) return 0;
  return Math.sin(t * 2.3) * power * (1 - t / 20);
};

export const CountUp: React.FC<{
  from: number;
  to: number;
  start: number;
  dur?: number;
  decimals?: number;
  suffix?: string;
}> = ({ from, to, start, dur = 30, decimals = 0, suffix = "" }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [start, start + dur], [from, to], clamp);
  return (
    <span>
      {v.toFixed(decimals)}
      {suffix}
    </span>
  );
};

// Animated bar, grows with a spring. ratio is 0..1
export const Bar: React.FC<{ ratio: number; color: string; delay?: number }> = ({
  ratio,
  color,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });
  return (
    <div
      style={{
        height: "100%",
        width: `${Math.max(0, ratio) * p * 100}%`,
        background: color,
        borderRadius: 9,
        boxShadow: `0 0 18px ${color}`,
      }}
    />
  );
};

// Subtitle-style captions. Times are relative to the scene start (frames).
export const Caption: React.FC<{
  lines: { from: number; to: number; text: string }[];
}> = ({ lines }) => {
  const frame = useCurrentFrame();
  const active = lines.find((l) => frame >= l.from && frame < l.to);
  if (!active) return null;
  const opacity = interpolate(
    frame,
    [active.from, active.from + 8, active.to - 8, active.to],
    [0, 1, 1, 0],
    clamp,
  );
  return (
    <div
      style={{
        position: "absolute",
        bottom: 70,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily,
        fontSize: 46,
        fontWeight: 700,
        color: COLORS.white,
        opacity,
        textShadow: "0 4px 16px #000",
        padding: "0 120px",
      }}
    >
      {active.text}
    </div>
  );
};

