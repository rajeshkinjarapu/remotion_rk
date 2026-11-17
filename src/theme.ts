import { loadFont } from "@remotion/google-fonts/NotoSansTelugu";

export const { fontFamily } = loadFont();

export const FPS = 30;
export const sec = (s: number) => Math.round(s * FPS);

export const COLORS = {
  bg: "#07090F",
  mi: "#004BA0",     // Mumbai Indians blue
  miGold: "#D1AB3E",
  pbks: "#D71920",   // Punjab Kings red
  silver: "#A7A9AC",
  gold: "#FFD700",
  white: "#FFFFFF",
  muted: "#8A8F9C",
};

