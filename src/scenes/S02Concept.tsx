import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { Clawdia } from "../components/Clawdia";
import { hexA } from "../components/Code";
import { Cap, Captions, clamp, HeartShape, Scene, Sfx, usePop, useFade } from "../components/ui";
import { C, F } from "../theme";

export const S02_DURATION = 1110;

const caps: Cap[] = [
  [66, 172, "在生活里，「对象」是你喜欢的那个人。"],
  [172, 292, "而在编程里，「对象」指的是：一个具体的「东西」。"],
  [292, 420, "它有自己的「特征」，也有自己能做的「行为」。"],
  [420, 540, "猫是对象，手机也是对象——世间万物，都可以看成对象。"],
  [540, 652, "用「对象」来组织程序的思路，就叫「面向对象编程」。"],
  [652, 762, "那对象从哪儿来？答案是：「类」（class）。"],
  [762, 872, "类就像一个模具、一张设计图——比如你心中的「理想型」。"],
  [872, 990, "照着它做出来的、真实存在的每一个，才叫「对象」。"],
  [990, 1100, "同一个类，可以造出许许多多的对象，而每一个都独一无二。"],
];

const Card: React.FC<{
  at: number;
  until: number;
  x: number;
  y: number;
  w: number;
  h: number;
  children: React.ReactNode;
  border?: string;
}> = ({ at, until, x, y, w, h, children, border = "#EADFD2" }) => {
  const pop = usePop(at, 13, 130);
  const out = useFade(at, until, 12);
  const frame = useCurrentFrame();
  if (frame < at || frame > until) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        background: "#FFFDF9",
        borderRadius: 30,
        border: `3px solid ${border}`,
        boxShadow: "0 16px 44px rgba(80,50,20,0.12)",
        transform: `translateY(${(1 - pop) * 60}px) scale(${0.92 + pop * 0.08})`,
        opacity: Math.min(pop, out),
        fontFamily: F.sans,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};

const Chip: React.FC<{ text: string; color: string; at: number; mono?: boolean }> = ({ text, color, at, mono }) => {
  const pop = usePop(at, 12, 170);
  return (
    <div
      style={{
        display: "inline-block",
        padding: "10px 24px",
        margin: "8px 12px 8px 0",
        borderRadius: 16,
        background: hexA(color, 0.12),
        border: `2px solid ${hexA(color, 0.4)}`,
        color,
        fontWeight: 700,
        fontSize: 36,
        fontFamily: mono ? F.mono : F.sans,
        transform: `scale(${pop})`,
        opacity: pop,
      }}
    >
      {text}
    </div>
  );
};

const ThingCard: React.FC<{
  at: number;
  x: number;
  emoji: string;
  name: string;
  attrs: string[];
  acts: string[];
}> = ({ at, x, emoji, name, attrs, acts }) => (
  <Card at={at} until={652} x={x} y={130} w={720} h={680}>
    <div style={{ padding: "40px 50px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <div style={{ fontFamily: F.emoji, fontSize: 120 }}>{emoji}</div>
        <div style={{ fontSize: 68, fontWeight: 900, color: C.ink }}>{name}</div>
      </div>
      <div style={{ marginTop: 44, fontSize: 36, fontWeight: 800, color: C.sky }}>特征 · 它「是什么样」</div>
      <div style={{ marginTop: 12 }}>
        {attrs.map((a, i) => (
          <Chip key={a} text={a} color={C.sky} at={at + 22 + i * 8} />
        ))}
      </div>
      <div style={{ marginTop: 40, fontSize: 36, fontWeight: 800, color: C.rose }}>行为 · 它「能做什么」</div>
      <div style={{ marginTop: 12 }}>
        {acts.map((a, i) => (
          <Chip key={a} text={a} color={C.rose} at={at + 46 + i * 8} />
        ))}
      </div>
    </div>
  </Card>
);

const Cookie: React.FC<{ at: number; x: number; y: number; icing: string; label: string; seed: string }> = ({
  at,
  x,
  y,
  icing,
  label,
  seed,
}) => {
  const pop = usePop(at, 9, 160);
  const frame = useCurrentFrame();
  const bob = Math.sin((frame + x) / 14) * 5;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + bob,
        transform: `scale(${pop})`,
        opacity: Math.min(1, pop * 1.5),
        textAlign: "center",
      }}
    >
      <svg width={300} height={270} viewBox="-11 -10 22 19">
        <path d="M0 7 C -9 0, -9 -8, -4 -8 C -1.5 -8, 0 -5.5, 0 -4 C 0 -5.5, 1.5 -8, 4 -8 C 9 -8, 9 0, 0 7 Z" fill="#E2A66B" />
        <path
          transform="scale(0.8) translate(0 -0.6)"
          d="M0 7 C -9 0, -9 -8, -4 -8 C -1.5 -8, 0 -5.5, 0 -4 C 0 -5.5, 1.5 -8, 4 -8 C 9 -8, 9 0, 0 7 Z"
          fill={icing}
        />
        {Array.from({ length: 9 }).map((_, i) => (
          <rect
            key={i}
            x={(random(`${seed}x${i}`) - 0.5) * 9}
            y={(random(`${seed}y${i}`) - 0.6) * 7}
            width={0.9}
            height={0.4}
            rx={0.2}
            fill={["#fff", C.gold, "#7FC8B4", "#fff"][i % 4]}
            transform={`rotate(${random(`${seed}r${i}`) * 180})`}
          />
        ))}
      </svg>
      <div style={{ fontFamily: F.sans, fontSize: 36, fontWeight: 800, color: C.ink, marginTop: -6 }}>{label}</div>
    </div>
  );
};

export const S02Concept: React.FC = () => {
  const frame = useCurrentFrame();
  const bigWord = useFade(60, 292, 14);
  const bigPop = usePop(60, 12, 120);
  const oopIn = usePop(548, 10, 150);
  const oopOut = useFade(548, 652, 12);
  const moldIn = usePop(668, 13, 120);
  const arrow = interpolate(frame, [880, 910], [0, 1], clamp);
  const sectionD = useFade(660, 1110, 14);

  return (
    <Scene no="01" title="什么是「对象」" duration={S02_DURATION}>
      {/* A：两种「对象」 */}
      <div
        style={{
          position: "absolute",
          top: 96,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: F.serif,
          fontSize: 120,
          fontWeight: 900,
          color: C.ink,
          opacity: bigWord,
          transform: `scale(${0.8 + bigPop * 0.2})`,
        }}
      >
        「对象」
      </div>
      <Card at={80} until={292} x={230} y={330} w={680} h={540} border={C.pinkSoft}>
        <div style={{ padding: 36, textAlign: "center" }}>
          <div style={{ fontSize: 44, fontWeight: 900, color: C.rose }}>生活里的对象</div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 10, marginTop: 40 }}>
            <Clawdia girl={false} size={200} expression="love" />
            <HeartShape size={80} style={{ marginBottom: 120 }} />
            <Clawdia size={200} expression="shy" lookX={-1} />
          </div>
          <div style={{ fontSize: 34, color: C.inkSoft, marginTop: 34, fontWeight: 600 }}>你喜欢的那个人 💕</div>
        </div>
      </Card>
      <Card at={184} until={292} x={1010} y={330} w={680} h={540} border="#CFE0F1">
        <div style={{ padding: 36, textAlign: "center" }}>
          <div style={{ fontSize: 44, fontWeight: 900, color: C.sky }}>编程里的对象</div>
          <div style={{ fontFamily: F.mono, fontSize: 30, color: C.ink, marginTop: 40, lineHeight: 1.6, textAlign: "left", display: "inline-block", background: "#F4F1EC", padding: "20px 34px", borderRadius: 18 }}>
            <div>📦 一个具体的东西</div>
            <div style={{ color: C.sky }}>&nbsp;&nbsp;├ 特征（是什么样）</div>
            <div style={{ color: C.rose }}>&nbsp;&nbsp;└ 行为（能做什么）</div>
          </div>
          <div style={{ fontSize: 34, color: C.inkSoft, marginTop: 34, fontWeight: 600 }}>程序世界里的一个「东西」</div>
        </div>
      </Card>
      <Sfx at={80} name="pop" volume={0.4} />
      <Sfx at={184} name="pop" volume={0.4} />

      {/* B：猫和手机 */}
      <ThingCard at={300} x={200} emoji="🐱" name="一只猫" attrs={["颜色：橘色", "体重：5kg", "名字：大橘"]} acts={["喵喵叫", "睡觉", "踩奶"]} />
      <ThingCard at={366} x={1000} emoji="📱" name="一部手机" attrs={["品牌：某果", "电量：85%", "颜色：白"]} acts={["打电话", "拍照", "刷视频"]} />
      <Sfx at={300} name="pop" volume={0.4} />
      <Sfx at={366} name="pop" volume={0.4} />

      {/* C：OOP 印章 */}
      {frame >= 548 && frame < 652 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 330,
            display: "flex",
            justifyContent: "center",
            opacity: oopOut,
          }}
        >
          <div
            style={{
              transform: `rotate(-6deg) scale(${2.2 - oopIn * 1.2})`,
              opacity: oopIn,
              background: "rgba(255,253,249,0.96)",
              border: `8px solid ${C.clay}`,
              borderRadius: 30,
              padding: "30px 70px",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(80,50,20,0.25)",
            }}
          >
            <div style={{ fontFamily: F.serif, fontSize: 104, fontWeight: 900, color: C.clay }}>面向对象编程</div>
            <div style={{ fontFamily: F.mono, fontSize: 40, color: C.inkSoft, marginTop: 6 }}>
              OOP · Object-Oriented Programming
            </div>
          </div>
        </div>
      )}
      <Sfx at={548} name="stamp" volume={0.6} />

      {/* D：模具与饼干 */}
      {frame >= 660 && (
        <div style={{ position: "absolute", inset: 0, opacity: sectionD }}>
          <div
            style={{
              position: "absolute",
              left: 130,
              top: 150,
              width: 640,
              textAlign: "center",
              transform: `scale(${moldIn})`,
            }}
          >
            <svg width={540} height={480} viewBox="-11 -10 22 19" style={{ overflow: "visible" }}>
              <path
                d="M0 7 C -9 0, -9 -8, -4 -8 C -1.5 -8, 0 -5.5, 0 -4 C 0 -5.5, 1.5 -8, 4 -8 C 9 -8, 9 0, 0 7 Z"
                fill={hexA(C.pink, 0.08)}
                stroke={C.clay}
                strokeWidth={0.35}
                strokeDasharray="0.8 0.6"
                strokeDashoffset={-frame * 0.03}
              />
              <text x={0} y={-3.4} textAnchor="middle" fontSize={1.6} fontFamily={F.mono} fill={C.codeKeyword} fontWeight={700}>
                class 理想型
              </text>
              {["温柔 ✓", "爱笑 ✓", "有趣 ✓"].map((t, i) => (
                <text key={t} x={0} y={-0.6 + i * 1.9} textAnchor="middle" fontSize={1.35} fontFamily={F.sans} fill={C.inkSoft} fontWeight={700}>
                  {t}
                </text>
              ))}
            </svg>
            <div style={{ fontFamily: F.sans, fontSize: 40, fontWeight: 900, color: C.clay, marginTop: 10 }}>
              类 class
            </div>
            <div style={{ fontFamily: F.sans, fontSize: 30, fontWeight: 600, color: C.inkSoft, marginTop: 6 }}>
              模具 / 设计图 / 理想型
            </div>
          </div>
          {/* 箭头 */}
          <svg style={{ position: "absolute", left: 790, top: 400 }} width={240} height={80}>
            <line x1={10} y1={40} x2={10 + 200 * arrow} y2={40} stroke={C.clay} strokeWidth={8} strokeLinecap="round" />
            {arrow > 0.95 && <path d="M200 18 L232 40 L200 62" stroke={C.clay} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
            <text x={110} y={22} textAnchor="middle" fontFamily={F.mono} fontSize={26} fill={C.codeKeyword} fontWeight={700} opacity={arrow}>
              new
            </text>
          </svg>
          <Cookie at={900} x={1060} y={110} icing={C.pink} label="对象 ①" seed="c1" />
          <Cookie at={930} x={1440} y={150} icing="#9FD7C6" label="对象 ②" seed="c2" />
          <Cookie at={960} x={1250} y={460} icing="#B9C9F0" label="对象 ③" seed="c3" />
          <div
            style={{
              position: "absolute",
              left: 1040,
              top: 850,
              width: 760,
              textAlign: "center",
              fontFamily: F.sans,
              fontSize: 34,
              fontWeight: 800,
              color: C.rose,
              opacity: interpolate(frame, [1000, 1020], [0, 1], clamp),
            }}
          >
            对象（object）= 真实存在的「实例」
          </div>
        </div>
      )}
      <Sfx at={668} name="whoosh" volume={0.4} />
      <Sfx at={900} name="pop" volume={0.5} />
      <Sfx at={930} name="pop" volume={0.5} />
      <Sfx at={960} name="pop" volume={0.5} />
      <Captions caps={caps} />
    </Scene>
  );
};
