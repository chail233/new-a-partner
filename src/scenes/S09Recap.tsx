import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Clawdia } from "../components/Clawdia";
import { hexA } from "../components/Code";
import { Cap, Captions, clamp, HeartShape, Scene, Sfx, Sparkles, usePop } from "../components/ui";
import { C, F } from "../theme";

export const S09_DURATION = 720;

const caps: Cap[] = [
  [66, 200, "来，用一分钟复习今天的五个关键词。"],
  [200, 360, "「类」是设计图；「对象」是照着它 new 出来的、真实存在的实例。"],
  [360, 530, "「封装」守护秘密，「继承」复用共性，「多态」让同一句话有不同的回应。"],
  [530, 710, "这就是面向对象编程的核心思想。恭喜你——已经入门啦！"],
];

type CardDef = {
  at: number;
  term: string;
  en: string;
  code: string;
  love: string;
  color: string;
  icon: React.ReactNode;
};

const cards: CardDef[] = [
  {
    at: 210,
    term: "类",
    en: "Class",
    code: "class",
    love: "心中的「理想型」\n一张设计图",
    color: C.clay,
    icon: (
      <svg width={120} height={110} viewBox="-11 -10 22 19">
        <path
          d="M0 7 C -9 0, -9 -8, -4 -8 C -1.5 -8, 0 -5.5, 0 -4 C 0 -5.5, 1.5 -8, 4 -8 C 9 -8, 9 0, 0 7 Z"
          fill="none"
          stroke={C.clay}
          strokeWidth={0.8}
          strokeDasharray="1.2 0.9"
        />
      </svg>
    ),
  },
  {
    at: 270,
    term: "对象",
    en: "Object",
    code: "new",
    love: "照着设计图诞生的\n真实的她",
    color: C.rose,
    icon: <Clawdia size={124} expression="happy" />,
  },
  {
    at: 370,
    term: "封装",
    en: "Encapsulation",
    code: "private",
    love: "藏好小秘密\n尊重她的边界",
    color: C.mint,
    icon: <div style={{ fontFamily: F.emoji, fontSize: 84 }}>🔒</div>,
  },
  {
    at: 430,
    term: "继承",
    en: "Inheritance",
    code: "extends",
    love: "她首先是一个人\n共性写一次就够",
    color: C.sky,
    icon: <div style={{ fontFamily: F.emoji, fontSize: 84 }}>🌳</div>,
  },
  {
    at: 490,
    term: "多态",
    en: "Polymorphism",
    code: "sayLove()",
    love: "同一句「我爱你」\n千万种说法",
    color: C.violet,
    icon: (
      <div style={{ display: "flex", gap: 6 }}>
        {[C.violet, C.sky, C.gold].map((c) => (
          <HeartShape key={c} size={46} color={c} />
        ))}
      </div>
    ),
  },
];

const Card: React.FC<CardDef & { index: number }> = ({ at, term, en, code, love, color, icon, index }) => {
  const frame = useCurrentFrame();
  const pop = usePop(at, 12, 130);
  const party = frame >= 540 ? Math.max(0, Math.sin(((frame - 540 - index * 5) / 18) * Math.PI)) * (frame < 540 + index * 5 + 18 ? 30 : 0) : 0;
  if (frame < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 91 + index * 352,
        top: 160 - party,
        width: 330,
        height: 560,
        background: "#FFFDF9",
        borderRadius: 30,
        border: `4px solid ${hexA(color, 0.55)}`,
        boxShadow: "0 16px 40px rgba(80,50,20,0.12)",
        transform: `perspective(1200px) rotateY(${(1 - pop) * 90}deg)`,
        opacity: Math.min(1, pop * 2),
        overflow: "hidden",
        fontFamily: F.sans,
        textAlign: "center",
      }}
    >
      <div
        style={{
          height: 190,
          background: hexA(color, 0.13),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <div style={{ fontFamily: F.serif, fontSize: 76, fontWeight: 900, color, marginTop: 18 }}>{term}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.inkSoft, letterSpacing: 1 }}>{en}</div>
      <div
        style={{
          display: "inline-block",
          marginTop: 18,
          fontFamily: F.mono,
          fontSize: 28,
          fontWeight: 700,
          color: C.codeText,
          background: C.editor,
          padding: "6px 20px",
          borderRadius: 12,
        }}
      >
        {code}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: C.ink, marginTop: 22, whiteSpace: "pre-line", lineHeight: 1.5 }}>
        {love}
      </div>
    </div>
  );
};

export const S09Recap: React.FC = () => {
  const frame = useCurrentFrame();
  const hero = usePop(536, 10, 140);
  const jump = frame > 540 ? Math.abs(Math.sin((frame - 540) / 9)) * 30 * Math.max(0, 1 - (frame - 540) / 120) : 0;
  return (
    <Scene no="08" title="复习时间" duration={S09_DURATION}>
      {cards.map((c, i) => (
        <React.Fragment key={c.term}>
          <Card {...c} index={i} />
          <Sfx at={c.at} name="flip" volume={0.4} />
        </React.Fragment>
      ))}
      {frame >= 536 && (
        <div
          style={{
            position: "absolute",
            left: 860,
            top: 750 - jump,
            transform: `scale(${hero})`,
            opacity: interpolate(frame, [536, 546], [0, 1], clamp),
          }}
        >
          <Clawdia size={200} expression="happy" wave />
        </div>
      )}
      <Sparkles at={540} x={960} y={440} r={700} count={20} seed="recap" />
      <Sparkles at={556} x={960} y={440} r={520} count={16} seed="recap2" />
      <Sfx at={540} name="sparkle" volume={0.5} />
      <Captions caps={caps} />
    </Scene>
  );
};
