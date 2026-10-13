import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, F } from "../theme";
import { clamp, usePop } from "./ui";

export type Field = {
  label: string;
  key: string;
  showAt: number;
  value?: string;
  valueAt?: number;
};

export const ProfileCard: React.FC<{
  x: number;
  y: number;
  w: number;
  title: string;
  fields: Field[];
  stamp?: { at: number; text: string; color: string; until?: number };
  appearAt?: number;
}> = ({ x, y, w, title, fields, stamp, appearAt = 0 }) => {
  const frame = useCurrentFrame();
  const pop = usePop(appearAt, 14, 120);
  const stampPop = usePop(stamp?.at ?? 1e9, 9, 200);
  const stampOut = stamp?.until
    ? interpolate(frame, [stamp.until - 10, stamp.until], [1, 0], clamp)
    : 1;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        background: "#FFFDF9",
        borderRadius: 24,
        boxShadow: "0 14px 40px rgba(80,50,20,0.14)",
        padding: "22px 30px 18px",
        fontFamily: F.sans,
        transform: `scale(${0.9 + pop * 0.1})`,
        opacity: pop,
        border: `2px dashed ${C.pink}`,
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 800, color: C.ink, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ color: C.rose }}>♥</span>
        {title}
      </div>
      <div style={{ height: 2, background: "#F1E6DA", margin: "12px 0 6px" }} />
      {fields.map((f) => {
        const a = interpolate(frame, [f.showAt, f.showAt + 10], [0, 1], clamp);
        if (a <= 0) return null;
        const has = f.valueAt !== undefined && frame >= f.valueAt;
        const n = has ? Math.floor((frame - (f.valueAt as number)) * 0.6) + 1 : 0;
        const shown = has ? Array.from(f.value ?? "").slice(0, n).join("") : "";
        return (
          <div
            key={f.key}
            style={{
              display: "flex",
              alignItems: "center",
              height: 58,
              opacity: a,
              transform: `translateX(${(1 - a) * 30}px)`,
            }}
          >
            <div style={{ width: 120, fontSize: 28, fontWeight: 700, color: C.inkSoft }}>{f.label}</div>
            <div style={{ width: 120, fontSize: 22, fontFamily: F.mono, color: C.clay }}>{f.key}</div>
            <div
              style={{
                flex: 1,
                height: 44,
                borderBottom: `3px ${has ? "solid" : "dotted"} ${has ? C.pink : "#D6C8B8"}`,
                fontSize: 30,
                fontWeight: 800,
                color: C.rose,
                display: "flex",
                alignItems: "center",
                paddingLeft: 12,
                fontFamily: F.sans,
              }}
            >
              {shown}
            </div>
          </div>
        );
      })}
      {stamp && frame >= stamp.at && (
        <div
          style={{
            position: "absolute",
            right: 24,
            bottom: 26,
            transform: `rotate(-12deg) scale(${2 - stampPop})`,
            opacity: Math.min(stampPop, stampOut),
            border: `4px solid ${stamp.color}`,
            color: stamp.color,
            borderRadius: 12,
            padding: "6px 16px",
            fontSize: 28,
            fontWeight: 900,
            letterSpacing: 2,
            background: "rgba(255,253,249,0.85)",
          }}
        >
          {stamp.text}
        </div>
      )}
    </div>
  );
};
