import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Accessory, Clawdia, Expression, Holding } from "../components/Clawdia";
import { CodeLine, CodeWindow, ConsoleEntry, consoleOutAt, ConsoleWindow, hexA, Mark, typeLines } from "../components/Code";
import { Bubble, Cap, Captions, clamp, HeartBurst, Scene, Sfx, Stage, usePop } from "../components/ui";
import { C, F } from "../theme";

export const S08_DURATION = 1330;

const base = typeLines(150, ["class Partner extends Person {", '  sayLove() { return "我喜欢你"; }', "}"]);
const subs = typeLines(
  330,
  [
    "class PoetPartner extends Partner {",
    '  sayLove() { return "你是我写过最美的诗"; }',
    "}",
    "class CoderPartner extends Partner {",
    '  sayLove() { return "你是我不想修的 bug"; }',
    "}",
    "class ChefPartner extends Partner {",
    '  sayLove() { return "汤炖好了，趁热喝"; }',
    "}",
  ],
  { speed: 1.7, gap: 3 },
);

const lines: CodeLine[] = [
  ...base,
  { t: "", at: 326 },
  ...subs,
  { t: "", at: 566 },
  { t: "// poet、coder、chef：分别由它们 new 出来", at: 568, speed: 1.6 },
];

const marks: Mark[] = [
  { line: 1, text: "sayLove()", from: 190, to: 310, color: C.codeFunc },
  { line: 5, text: "sayLove()", from: 440, to: 560, color: C.gold },
  { line: 8, text: "sayLove()", from: 446, to: 560, color: C.gold },
  { line: 11, text: "sayLove()", from: 452, to: 560, color: C.gold },
];

const LOOP_CMD = "for (const p of 别人家的对象) p.sayLove()";
const entries: ConsoleEntry[] = [
  { at: 572, cmd: "poet.sayLove()", out: '"你是我写过最美的诗"' },
  { at: 640, cmd: "coder.sayLove()", out: '"你是我不想修的 bug"' },
  { at: 708, cmd: "chef.sayLove()", out: '"汤炖好了，趁热喝"' },
  { at: 892, cmd: LOOP_CMD, out: '"你是我写过最美的诗"\n"你是我不想修的 bug"\n"汤炖好了，趁热喝"' },
];
const [POET, CODER, CHEF, LOOP] = entries.map(consoleOutAt);

const caps: Cap[] = [
  [66, 180, "最后一个，也是最浪漫的概念：「多态」。"],
  [180, 310, "先给 Partner 写一个方法 `sayLove()`：说一句「我喜欢你」。"],
  [310, 450, "但每个人表达爱的方式都不一样。于是，子类可以「重写」这个方法。"],
  [450, 562, "诗人、程序员、厨师——都是 Partner，却各有各的说法。"],
  [562, 762, "同样一句 `sayLove()`，听听她们怎么说——"],
  [762, 882, "更妙的是：说话的人，根本不需要知道对方是哪一种。"],
  [882, 1030, "把「别人家的对象」放进一个列表，挨个说一句 `sayLove()`——"],
  [1030, 1170, "同一个指令，不同的对象，不同的表现。这就是「多态」。"],
  [1170, 1320, "就像「我爱你」这三个字，每个人，都有自己的说法。"],
];

const variants: {
  cx: number;
  name: string;
  zh: string;
  acc: Accessory;
  hold: Holding;
  line: string;
  at: number;
  out: number;
  color: string;
}[] = [
  { cx: 140, name: "PoetPartner", zh: "诗人", acc: "beret", hold: "book", line: "你是我写过\n最美的诗", at: 350, out: POET, color: C.violet },
  { cx: 400, name: "CoderPartner", zh: "程序员", acc: "glasses", hold: "laptop", line: "你是我\n不想修的 bug", at: 400, out: CODER, color: C.sky },
  { cx: 660, name: "ChefPartner", zh: "厨师", acc: "chef", hold: "pan", line: "汤炖好了，\n趁热喝", at: 450, out: CHEF, color: C.gold },
];

const COVER_AT = 772;

export const S08Polymorphism: React.FC = () => {
  const frame = useCurrentFrame();
  const baseIn = usePop(170, 12, 140);
  const baseOut = interpolate(frame, [336, 350], [1, 0], clamp);
  const callBanner = (at: number, len: number) =>
    interpolate(frame, [at - 24, at - 16, at + len - 8, at + len], [0, 1, 1, 0], clamp);
  const bannerOp = Math.max(
    callBanner(POET, 50),
    callBanner(CODER, 50),
    callBanner(CHEF, 50),
    callBanner(LOOP, 90),
  );
  const cover = interpolate(frame, [COVER_AT, COVER_AT + 14], [0, 1], clamp);
  const flip = (i: number) => interpolate(frame, [LOOP - 8 + i * 3, LOOP + 6 + i * 3], [0, 1], clamp);
  const summary = usePop(1034, 13, 120);
  const finale = usePop(1176, 13, 110);

  return (
    <Scene no="07" title="多态：一千种「我爱你」" duration={S08_DURATION}>
      <CodeWindow lines={lines} marks={marks} x={60} y={90} w={980} h={600} fontSize={23} lineHeight={34} />
      <ConsoleWindow x={60} y={710} w={980} h={230} entries={entries} fontSize={22} lineHeight={34} />
      <Stage>
        {/* 调用横幅 */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 60,
            display: "flex",
            justifyContent: "center",
            opacity: bannerOp,
            transform: `scale(${0.9 + bannerOp * 0.1})`,
          }}
        >
          <div
            style={{
              background: C.editor,
              color: C.codeFunc,
              fontFamily: F.mono,
              fontSize: 40,
              fontWeight: 700,
              padding: "12px 34px",
              borderRadius: 999,
              boxShadow: `0 0 0 6px ${hexA(C.codeFunc, 0.25)}`,
            }}
          >
            <span style={{ fontFamily: F.emoji }}>📣 </span>sayLove()
          </div>
        </div>
        {/* 基础版 Partner */}
        {frame < 350 && frame >= 170 && (
          <div style={{ position: "absolute", left: 250, top: 380, opacity: baseOut, transform: `scale(${baseIn})` }}>
            <Clawdia size={300} expression="shy" />
          </div>
        )}
        <Bubble at={220} until={340} text="我喜欢你" x={400} y={420} fontSize={34} color="#FFF5F7" />
        {variants.map((v, i) => {
          const pop = popAt(frame, v.at);
          let expr: Expression = "normal";
          if ((frame >= v.out && frame < v.out + 140) || frame >= LOOP) expr = i === 1 ? "wink" : "happy";
          if (frame >= 1170) expr = "love";
          return (
            <React.Fragment key={v.name}>
              {frame >= v.at && (
                <div
                  style={{
                    position: "absolute",
                    left: v.cx - 105,
                    top: 440,
                    transform: `scale(${pop}) translateY(${(1 - pop) * 60}px)`,
                  }}
                >
                  <Clawdia size={210} accessory={v.acc} holding={v.hold} expression={expr} blinkSeed={i * 5} />
                  <div style={{ textAlign: "center", fontFamily: F.mono, fontSize: 20, fontWeight: 700, color: v.color, marginTop: 4 }}>
                    {v.name}
                  </div>
                  <div style={{ textAlign: "center", fontFamily: F.sans, fontSize: 24, fontWeight: 800, color: C.inkSoft }}>{v.zh}</div>
                </div>
              )}
              {/* 遮住类型的卡片 */}
              {cover > 0 && flip(i) < 1 && (
                <div
                  style={{
                    position: "absolute",
                    left: v.cx - 118,
                    top: 420,
                    width: 236,
                    height: 300,
                    borderRadius: 22,
                    background: `repeating-linear-gradient(45deg, #EBDDCB, #EBDDCB 14px, #F3E8DA 14px, #F3E8DA 28px)`,
                    border: `4px solid ${C.clay}`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: cover,
                    transform: `translateY(${(1 - cover) * -40}px) rotateY(${flip(i) * 90}deg)`,
                    fontFamily: F.mono,
                  }}
                >
                  <div style={{ fontSize: 90, fontWeight: 800, color: C.clay }}>?</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: C.ink }}>Partner</div>
                </div>
              )}
              <Bubble at={v.out} until={COVER_AT} text={v.line} x={v.cx} y={430} fontSize={25} maxWidth={250} color="#FFFDF9" />
              <Bubble at={LOOP + i * 3} until={1170} text={v.line} x={v.cx} y={430} fontSize={25} maxWidth={250} color="#FFF5F7" />
            </React.Fragment>
          );
        })}
        <HeartBurst at={LOOP + 6} x={400} y={520} count={22} seed="poly" spread={380} />
        {/* 总结 */}
        {frame >= 1034 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 170,
              display: "flex",
              justifyContent: "center",
              gap: 14,
              opacity: frame < 1170 ? summary : interpolate(frame, [1170, 1180], [1, 0], clamp),
            }}
          >
            {["同一个指令", "不同的对象", "不同的表现"].map((t, i) => (
              <div
                key={t}
                style={{
                  fontFamily: F.sans,
                  fontWeight: 900,
                  fontSize: 30,
                  color: "#fff",
                  background: [C.codeFunc, C.violet, C.rose][i],
                  padding: "10px 22px",
                  borderRadius: 16,
                  transform: `translateY(${(1 - popAt(frame, 1034 + i * 8)) * 30}px)`,
                }}
              >
                {t}
              </div>
            ))}
          </div>
        )}
        {frame >= 1176 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 70,
              textAlign: "center",
              opacity: finale,
              transform: `scale(${0.8 + finale * 0.2})`,
            }}
          >
            <div style={{ fontFamily: F.serif, fontSize: 64, fontWeight: 900, color: C.rose }}>一千种「我爱你」</div>
            <div style={{ fontFamily: F.sans, fontSize: 28, fontWeight: 600, color: C.inkSoft, marginTop: 10 }}>
              Polymorphism · 多态
            </div>
          </div>
        )}
      </Stage>
      <Sfx at={150} name="typing" volume={0.3} />
      <Sfx at={330} name="typing" volume={0.3} />
      {variants.map((v) => (
        <React.Fragment key={v.name}>
          <Sfx at={v.at} name="pop" volume={0.4} />
          <Sfx at={v.out} name="ding" volume={0.35} />
        </React.Fragment>
      ))}
      <Sfx at={COVER_AT} name="whoosh" volume={0.35} />
      <Sfx at={LOOP - 8} name="flip" volume={0.5} />
      <Sfx at={LOOP + 6} name="love" volume={0.5} />
      <Sfx at={1176} name="sparkle" volume={0.45} />
      <Captions caps={caps} />
    </Scene>
  );
};

// 在 map 里不方便用 hook，这里用纯函数近似弹簧
const popAt = (frame: number, at: number) => {
  const t = Math.max(0, frame - at) / 30;
  if (frame < at) return 0;
  return 1 - Math.exp(-7 * t) * Math.cos(11 * t);
};
