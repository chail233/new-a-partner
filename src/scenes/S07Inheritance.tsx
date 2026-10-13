import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Clawdia } from "../components/Clawdia";
import {
  CodeLine,
  CodeWindow,
  ConsoleEntry,
  consoleOutAt,
  ConsoleWindow,
  hexA,
  Mark,
  typeLines,
} from "../components/Code";
import { Bubble, Cap, Captions, clamp, Scene, Sfx, Stage, Tag, usePop } from "../components/ui";
import { C, F } from "../theme";

export const S07_DURATION = 1270;

const person = typeLines(150, ["class Person {", "  name: string;", '  eat()   { return "干饭！"; }', '  sleep() { return "Zzz…"; }', "}"]);
const partner = typeLines(330, ["class Partner extends Person {", '  date()  { return "约会去咯！"; }', "}"]);

const lines: CodeLine[] = [
  ...person,
  { t: "", at: 326 },
  ...partner,
  { t: "", at: 686 },
  { t: "const her = new Partner();", at: 690 },
];

const marks: Mark[] = [
  { line: 0, text: "Person", from: 196, to: 310, color: C.codeClass },
  { line: 6, text: "extends", from: 360, to: 450, color: C.codeKeyword },
  { line: 7, text: "date()", from: 584, to: 700, color: C.rose },
  { line: 6, text: "Person", from: 866, to: 990, color: C.sky },
  { line: 6, text: "Partner", from: 866, to: 990, color: C.rose },
];

const entries: ConsoleEntry[] = [
  { at: 716, cmd: "her.eat()", out: '"干饭！"' },
  { at: 766, cmd: "her.sleep()", out: '"Zzz…"' },
  { at: 818, cmd: "her.date()", out: '"约会去咯！"' },
];
const [EAT, SLEEP, DATE] = entries.map(consoleOutAt);

const caps: Cap[] = [
  [66, 180, "仔细想想：她是你的伴侣，但首先，她是一个「人」。"],
  [180, 310, "吃饭、睡觉、有名字——这是所有人都有的。先写一个更通用的类：`Person`。"],
  [310, 440, "然后，让 Partner「继承」Person，用的关键字是 `extends`。"],
  [440, 580, "继承之后，Person 有的属性和方法，Partner 自动全部拥有，一行都不用重写。"],
  [580, 700, "Partner 只需要专心写自己独有的部分，比如：`date()` 约会。"],
  [700, 860, "试试看：`eat()` 和 `sleep()` 明明没写在 Partner 里，她也会！"],
  [860, 990, "被继承的 Person 叫「父类」，继承别人的 Partner 叫「子类」。"],
  [990, 1130, "同一个父类，还能派生出很多子类：朋友、家人、同事……"],
  [1130, 1260, "共同的部分写一次，大家一起用——这就是「继承」。"],
];

const ClassBox: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  at: number;
  title: string;
  sub: string;
  color: string;
  avatar: React.ReactNode;
  children?: React.ReactNode;
}> = ({ x, y, w, h, at, title, sub, color, avatar, children }) => {
  const pop = usePop(at, 13, 140);
  const frame = useCurrentFrame();
  if (frame < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        background: "#FFFDF9",
        borderRadius: 22,
        border: `4px solid ${color}`,
        boxShadow: "0 12px 30px rgba(80,50,20,0.12)",
        transform: `scale(${pop})`,
        opacity: pop,
        fontFamily: F.sans,
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: hexA(color, 0.15), padding: "8px 16px" }}>
        {avatar}
        <div>
          <div style={{ fontFamily: F.mono, fontSize: 30, fontWeight: 700, color: C.ink }}>{title}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.inkSoft }}>{sub}</div>
        </div>
      </div>
      <div style={{ padding: "10px 18px" }}>{children}</div>
    </div>
  );
};

const Item: React.FC<{ text: string; at: number; color?: string; inherited?: boolean; glow?: [number, number] }> = ({
  text,
  at,
  color = C.ink,
  inherited,
  glow,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 8], [0, 1], clamp);
  const g = glow ? interpolate(frame, [glow[0], glow[0] + 5, glow[1] - 5, glow[1]], [0, 1, 1, 0], clamp) : 0;
  if (p <= 0) return null;
  return (
    <div
      style={{
        fontFamily: F.mono,
        fontSize: 26,
        fontWeight: 600,
        height: 40,
        display: "flex",
        alignItems: "center",
        gap: 10,
        color: inherited ? C.inkSoft : color,
        opacity: p,
        background: hexA(C.gold, g * 0.35),
        borderRadius: 8,
        paddingLeft: 6,
      }}
    >
      {text}
      {inherited && (
        <span style={{ fontFamily: F.sans, fontSize: 18, color: C.sky, border: `2px solid ${hexA(C.sky, 0.5)}`, borderRadius: 999, padding: "0 10px" }}>
          继承
        </span>
      )}
    </div>
  );
};

const FLY_AT = 452;

export const S07Inheritance: React.FC = () => {
  const frame = useCurrentFrame();
  const arrow = interpolate(frame, [362, 392], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const roles = usePop(866, 12, 150);
  const sib = interpolate(frame, [1010, 1040], [0, 1], clamp);
  const inheritedNames = ["name", "eat()", "sleep()"];

  return (
    <Scene no="06" title="继承：她首先是一个人" duration={S07_DURATION}>
      <CodeWindow lines={lines} marks={marks} highlights={[{ lines: [1, 3], from: 446, to: 580, color: C.sky }]} x={60} y={90} w={980} h={600} fontSize={26} lineHeight={42} />
      <ConsoleWindow x={60} y={710} w={980} h={230} entries={entries} />
      <Stage>
        <ClassBox
          x={230}
          y={40}
          w={340}
          h={280}
          at={170}
          title="Person"
          sub="人 · 父类"
          color={C.sky}
          avatar={<Clawdia size={80} girl={false} color="#B9A796" />}
        >
          <Item text="name" at={person[1].at + 6} />
          <Item text="eat()" at={person[2].at + 6} />
          <Item text="sleep()" at={person[3].at + 6} />
        </ClassBox>
        {/* 继承箭头（子类指向父类） */}
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={800} height={850}>
          <line x1={400} y1={480} x2={400} y2={480 - 140 * arrow} stroke={C.ink} strokeWidth={5} />
          {arrow > 0.9 && <path d="M400 322 L382 350 L418 350 Z" fill="#FFFDF9" stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />}
          {sib > 0 && (
            <g opacity={sib} stroke={C.ink} strokeWidth={4} fill="none" strokeDasharray="10 8">
              <path d={`M115 520 L115 ${420} L290 ${330}`} />
              <path d={`M685 520 L685 ${420} L510 ${330}`} />
            </g>
          )}
        </svg>
        <div
          style={{
            position: "absolute",
            left: 420,
            top: 380,
            fontFamily: F.mono,
            fontSize: 28,
            fontWeight: 700,
            color: C.codeKeyword,
            opacity: arrow,
          }}
        >
          extends <span style={{ fontFamily: F.sans, color: C.inkSoft, fontSize: 24 }}>继承</span>
        </div>
        <ClassBox
          x={230}
          y={480}
          w={340}
          h={330}
          at={344}
          title="Partner"
          sub="伴侣 · 子类"
          color={C.rose}
          avatar={<Clawdia size={80} expression={frame > DATE ? "love" : "happy"} />}
        >
          {inheritedNames.map((n, i) => (
            <Item key={n} text={n} at={FLY_AT + 26 + i * 8} inherited glow={i === 1 ? [EAT - 4, EAT + 30] : i === 2 ? [SLEEP - 4, SLEEP + 30] : undefined} />
          ))}
          <Item text="date() ♥" at={partner[1].at + 10} color={C.rose} glow={[DATE - 4, DATE + 30]} />
        </ClassBox>
        {/* 继承下来的方法飞下去 */}
        {inheritedNames.map((n, i) => {
          const s = FLY_AT + i * 8;
          const p = interpolate(frame, [s, s + 26], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
          if (frame < s || frame > s + 27) return null;
          const y0 = 40 + 104 + 10 + i * 40;
          const y1 = 480 + 104 + 10 + i * 40;
          return (
            <div
              key={n}
              style={{
                position: "absolute",
                left: 254 + Math.sin(p * Math.PI) * 60,
                top: y0 + (y1 - y0) * p,
                fontFamily: F.mono,
                fontSize: 26,
                fontWeight: 700,
                color: "#fff",
                background: C.sky,
                borderRadius: 8,
                padding: "2px 12px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
              }}
            >
              {n}
            </div>
          );
        })}
        <Bubble at={EAT} until={SLEEP - 2} text="干饭！🍚" x={690} y={600} fontSize={30} tail="down" />
        <Bubble at={SLEEP} until={DATE - 2} text="Zzz…😴" x={690} y={600} fontSize={30} tail="down" />
        <Bubble at={DATE} until={DATE + 70} text="约会去咯！💕" x={690} y={600} fontSize={30} tail="down" color="#FFF5F7" />
        {frame >= 866 && (
          <>
            <div style={{ position: "absolute", left: 590, top: 70, transform: `scale(${roles})` }}>
              <Tag color={C.sky}>父类</Tag>
            </div>
            <div style={{ position: "absolute", left: 590, top: 760, transform: `scale(${roles})` }}>
              <Tag color={C.rose}>子类</Tag>
            </div>
          </>
        )}
        <ClassBox x={15} y={520} w={200} h={210} at={1000} title="Friend" sub="朋友" color={C.mint} avatar={<Clawdia size={56} girl={false} color="#7FB89F" />}>
          <Item text="play()" at={1020} color={C.mint} />
        </ClassBox>
        <ClassBox x={585} y={520} w={200} h={210} at={1012} title="Family" sub="家人" color={C.gold} avatar={<Clawdia size={56} girl={false} color="#D9A85A" />}>
          <Item text="hug()" at={1032} color={C.gold} />
        </ClassBox>
      </Stage>
      <Sfx at={150} name="typing" volume={0.3} />
      <Sfx at={330} name="typing" volume={0.3} />
      <Sfx at={FLY_AT} name="whoosh" volume={0.4} />
      <Sfx at={EAT} name="pop" volume={0.4} />
      <Sfx at={SLEEP} name="pop" volume={0.4} />
      <Sfx at={DATE} name="love" volume={0.45} />
      <Sfx at={866} name="ding" volume={0.35} />
      <Sfx at={1000} name="pop" volume={0.4} />
      <Sfx at={1012} name="pop" volume={0.4} />
      <Captions caps={caps} />
    </Scene>
  );
};
