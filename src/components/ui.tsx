import React from "react";
import {
  AbsoluteFill,
  Html5Audio,
  interpolate,
  random,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, F } from "../theme";
import { hexA } from "./Code";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const usePop = (at: number, damping = 12, stiffness = 140) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, stiffness } });
};

/** 在 [from, to] 区间内淡入淡出，返回 0~1 */
export const useFade = (from: number, to = 1e9, len = 10) => {
  const frame = useCurrentFrame();
  return Math.min(
    interpolate(frame, [from, from + len], [0, 1], clamp),
    interpolate(frame, [to - len, to], [1, 0], clamp),
  );
};

/** 把「」里的词高亮，`xx` 渲染成代码字体 */
export const RichText: React.FC<{ text: string; accent?: string; codeColor?: string }> = ({
  text,
  accent = C.clayDark,
  codeColor = C.rose,
}) => {
  const parts = text.split(/(「[^」]*」|`[^`]*`)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("「"))
          return (
            <span key={i} style={{ color: accent, fontWeight: 800 }}>
              {p}
            </span>
          );
        if (p.startsWith("`"))
          return (
            <span
              key={i}
              style={{
                fontFamily: F.mono,
                color: codeColor,
                fontWeight: 600,
                padding: "0 6px",
                margin: "0 2px",
                background: hexA(codeColor, 0.1),
                borderRadius: 8,
              }}
            >
              {p.slice(1, -1)}
            </span>
          );
        return <span key={i}>{p}</span>;
      })}
    </>
  );
};

export type Cap = [number, number, string];

export const Captions: React.FC<{ caps: Cap[]; dark?: boolean; serif?: boolean; y?: number }> = ({
  caps,
  dark,
  serif,
  y = 968,
}) => {
  const frame = useCurrentFrame();
  const cur = caps.find(([a, b]) => frame >= a && frame < b);
  if (!cur) return null;
  const [a, b, text] = cur;
  const op = Math.min(interpolate(frame, [a, a + 8], [0, 1], clamp), interpolate(frame, [b - 8, b], [1, 0], clamp));
  const rise = interpolate(frame, [a, a + 10], [12, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        display: "flex",
        justifyContent: "center",
        opacity: op,
        transform: `translateY(${rise}px)`,
      }}
    >
      <div
        style={{
          fontFamily: serif ? F.serif : F.sans,
          fontSize: 38,
          fontWeight: serif ? 600 : 500,
          color: dark ? "#FFF6EC" : C.ink,
          background: dark ? "rgba(20,16,30,0.45)" : "rgba(255,252,247,0.92)",
          padding: "14px 40px",
          borderRadius: 999,
          boxShadow: dark ? "none" : "0 8px 24px rgba(80,50,20,0.12)",
          letterSpacing: 1,
          maxWidth: 1700,
          textAlign: "center",
        }}
      >
        <RichText text={text} accent={dark ? C.gold : C.clayDark} codeColor={dark ? C.pink : C.rose} />
      </div>
    </div>
  );
};

export const Paper: React.FC<{ tint?: string }> = ({ tint = C.bg }) => (
  <AbsoluteFill
    style={{
      background: tint,
      backgroundImage: `linear-gradient(${hexA("#C9B9A3", 0.18)} 1px, transparent 1px), linear-gradient(90deg, ${hexA("#C9B9A3", 0.18)} 1px, transparent 1px)`,
      backgroundSize: "48px 48px",
    }}
  />
);

/** 每一章的外壳：背景、章节卡片、页眉、首尾淡入淡出 */
export const Scene: React.FC<{
  no: string;
  title: string;
  duration: number;
  children: React.ReactNode;
  intro?: boolean;
}> = ({ no, title, duration, children, intro = true }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 12], [0, 1], clamp);
  const fadeOut = interpolate(frame, [duration - 14, duration], [1, 0], clamp);
  const cardIn = usePop(2, 14, 120);
  const cardOut = interpolate(frame, [46, 62], [1, 0], clamp);
  const headIn = interpolate(frame, [54, 70], [0, 1], clamp);
  const contentIn = intro ? interpolate(frame, [52, 66], [0, 1], clamp) : 1;
  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
      <Paper />
      <AbsoluteFill style={{ opacity: contentIn }}>{children}</AbsoluteFill>
      {/* 页眉 */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 22,
          display: "flex",
          alignItems: "center",
          gap: 14,
          opacity: headIn,
          transform: `translateX(${(1 - headIn) * -30}px)`,
          fontFamily: F.sans,
        }}
      >
        <div
          style={{
            background: C.clay,
            color: "#fff",
            fontWeight: 800,
            fontSize: 20,
            padding: "4px 14px",
            borderRadius: 999,
            letterSpacing: 2,
          }}
        >
          第 {no} 章
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{title}</div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 60,
          top: 26,
          fontFamily: F.mono,
          fontSize: 20,
          color: C.inkSoft,
          opacity: headIn * 0.8,
        }}
      >
        new Partner() <span style={{ color: C.rose }}>♥</span> 面向对象
      </div>
      {/* 章节卡片 */}
      {intro && cardOut > 0 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: cardOut,
            transform: `scale(${0.85 + cardIn * 0.15 - (1 - cardOut) * 0.1})`,
          }}
        >
          <div
            style={{
              fontFamily: F.sans,
              fontSize: 34,
              fontWeight: 800,
              color: C.clay,
              letterSpacing: 10,
              opacity: cardIn,
            }}
          >
            CHAPTER {no}
          </div>
          <div
            style={{
              fontFamily: F.serif,
              fontSize: 96,
              fontWeight: 800,
              color: C.ink,
              marginTop: 16,
              opacity: cardIn,
            }}
          >
            {title}
          </div>
          <div
            style={{
              width: 260 * cardIn,
              height: 6,
              borderRadius: 3,
              background: C.pink,
              marginTop: 28,
            }}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const Bubble: React.FC<{
  at: number;
  until?: number;
  text: string;
  x: number;
  y: number;
  tail?: "left" | "right" | "down" | "none";
  color?: string;
  textColor?: string;
  fontSize?: number;
  maxWidth?: number;
  speed?: number;
  mono?: boolean;
}> = ({
  at,
  until = 1e9,
  text,
  x,
  y,
  tail = "down",
  color = "#fff",
  textColor = C.ink,
  fontSize = 34,
  maxWidth = 560,
  speed = 0.7,
  mono,
}) => {
  const frame = useCurrentFrame();
  const pop = usePop(at, 11, 170);
  const out = interpolate(frame, [until - 8, until], [1, 0], clamp);
  if (frame < at || frame >= until) return null;
  const n = Math.floor((frame - at) * speed) + 1;
  const shown = Array.from(text).slice(0, n).join("");
  const origin = tail === "left" ? "0% 100%" : tail === "right" ? "100% 100%" : "50% 100%";
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -100%) scale(${pop * out})`,
        transformOrigin: origin,
        opacity: out,
      }}
    >
      <div
        style={{
          position: "relative",
          background: color,
          color: textColor,
          fontFamily: mono ? F.mono : F.sans,
          fontSize,
          fontWeight: 600,
          padding: "16px 28px",
          borderRadius: 26,
          boxShadow: "0 10px 28px rgba(80,50,20,0.16)",
          maxWidth,
          whiteSpace: "pre-wrap",
          width: "max-content",
          lineHeight: 1.45,
        }}
      >
        <span style={{ visibility: "hidden" }}>{text}</span>
        <span style={{ position: "absolute", left: 28, top: 16, right: 28 }}>{shown}</span>
        {tail !== "none" && (
          <div
            style={{
              position: "absolute",
              width: 0,
              height: 0,
              borderLeft: "14px solid transparent",
              borderRight: "14px solid transparent",
              borderTop: `20px solid ${color}`,
              bottom: -18,
              left: tail === "left" ? 34 : tail === "right" ? undefined : "50%",
              right: tail === "right" ? 34 : undefined,
              marginLeft: tail === "down" ? -14 : 0,
            }}
          />
        )}
      </div>
    </div>
  );
};

export const HeartShape: React.FC<{ size: number; color?: string; style?: React.CSSProperties }> = ({
  size,
  color = C.rose,
  style,
}) => (
  <svg width={size} height={size} viewBox="-10 -10 20 18" style={style}>
    <path d="M0 7 C -9 0, -9 -8, -4 -8 C -1.5 -8, 0 -5.5, 0 -4 C 0 -5.5, 1.5 -8, 4 -8 C 9 -8, 9 0, 0 7 Z" fill={color} />
  </svg>
);

export const HeartBurst: React.FC<{
  at: number;
  x: number;
  y: number;
  count?: number;
  seed?: string;
  spread?: number;
  colors?: string[];
}> = ({ at, x, y, count = 14, seed = "h", spread = 260, colors = [C.rose, C.pink, "#F6B1C3", C.clay] }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 70) return null;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const ang = random(`${seed}a${i}`) * Math.PI * 2;
        const dist = spread * (0.45 + random(`${seed}d${i}`) * 0.55);
        const p = interpolate(t, [0, 45], [0, 1], { ...clamp, easing: (v) => 1 - Math.pow(1 - v, 3) });
        const px = x + Math.cos(ang) * dist * p;
        const py = y + Math.sin(ang) * dist * p * 0.8 - t * 1.2;
        const sz = 22 + random(`${seed}s${i}`) * 30;
        const op = interpolate(t, [0, 6, 45, 70], [0, 1, 1, 0], clamp);
        return (
          <HeartShape
            key={i}
            size={sz}
            color={colors[i % colors.length]}
            style={{
              position: "absolute",
              left: px - sz / 2,
              top: py - sz / 2,
              opacity: op,
              transform: `rotate(${(random(`${seed}r${i}`) - 0.5) * 50}deg) scale(${0.6 + p * 0.5})`,
            }}
          />
        );
      })}
    </>
  );
};

export const Sparkles: React.FC<{ at: number; x: number; y: number; count?: number; seed?: string; r?: number }> = ({
  at,
  x,
  y,
  count = 12,
  seed = "s",
  r = 220,
}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 50) return null;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const ang = (i / count) * Math.PI * 2 + random(`${seed}${i}`) * 0.4;
        const p = interpolate(t, [0, 30], [0.2, 1], { ...clamp, easing: (v) => 1 - Math.pow(1 - v, 2) });
        const op = interpolate(t, [0, 5, 30, 50], [0, 1, 1, 0], clamp);
        const sz = 18 + random(`${seed}z${i}`) * 22;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.cos(ang) * r * p - sz / 2,
              top: y + Math.sin(ang) * r * p - sz / 2,
              width: sz,
              height: sz,
              opacity: op,
              transform: `rotate(${t * 6}deg)`,
            }}
          >
            <svg viewBox="-10 -10 20 20" width={sz} height={sz}>
              <path d="M0 -10 L2.4 -2.4 L10 0 L2.4 2.4 L0 10 L-2.4 2.4 L-10 0 L-2.4 -2.4 Z" fill={i % 2 ? C.gold : "#fff"} />
            </svg>
          </div>
        );
      })}
    </>
  );
};

export const StatBar: React.FC<{
  label: string;
  value: number;
  max?: number;
  color?: string;
  width?: number;
  x: number;
  y: number;
  icon?: string;
}> = ({ label, value, max = 100, color = C.rose, width = 420, x, y, icon }) => (
  <div style={{ position: "absolute", left: x, top: y, width, fontFamily: F.sans }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, fontWeight: 700, color: C.ink, marginBottom: 8 }}>
      <span>
        {icon && <span style={{ fontFamily: F.emoji, marginRight: 8 }}>{icon}</span>}
        {label}
      </span>
      <span style={{ fontFamily: F.mono, color }}>{Math.round(value)}</span>
    </div>
    <div style={{ height: 22, borderRadius: 11, background: "rgba(0,0,0,0.08)", overflow: "hidden" }}>
      <div
        style={{
          width: `${(value / max) * 100}%`,
          height: "100%",
          borderRadius: 11,
          background: `linear-gradient(90deg, ${hexA(color, 0.7)}, ${color})`,
        }}
      />
    </div>
  </div>
);

export const Sfx: React.FC<{ at: number; name: string; volume?: number }> = ({ at, name, volume = 0.6 }) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={120} layout="none">
    <Html5Audio src={staticFile(`sfx/${name}.wav`)} volume={Math.min(1, volume * 1.5)} />
  </Sequence>
);

export const Stage: React.FC<{ x?: number; y?: number; w?: number; h?: number; children: React.ReactNode; bg?: string }> = ({
  x = 1060,
  y = 90,
  w = 800,
  h = 850,
  children,
  bg = "rgba(255,252,247,0.75)",
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 28,
      background: bg,
      border: `2px solid ${hexA("#C9B9A3", 0.45)}`,
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);

export const Tag: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({
  children,
  color = C.clay,
  style,
}) => (
  <div
    style={{
      display: "inline-block",
      padding: "6px 18px",
      borderRadius: 999,
      background: hexA(color, 0.14),
      color,
      fontFamily: F.sans,
      fontWeight: 800,
      fontSize: 24,
      border: `2px solid ${hexA(color, 0.5)}`,
      ...style,
    }}
  >
    {children}
  </div>
);
