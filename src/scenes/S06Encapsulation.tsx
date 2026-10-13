import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Clawdia, Expression } from "../components/Clawdia";
import {
  CodeLine,
  CodeWindow,
  ConsoleEntry,
  consoleOutAt,
  ConsoleWindow,
  hexA,
  Mark,
  staticLines,
  typeLines,
} from "../components/Code";
import { Bubble, Cap, Captions, clamp, HeartBurst, Scene, Sfx, Stage, StatBar, usePop } from "../components/ui";
import { C, F } from "../theme";

export const S06_DURATION = 1380;

const priv = typeLines(150, ['  private secret = "其实我早就喜欢你了";', "  private trust = 0;     // 信任值"]);
const methods = typeLines(470, [
  "  spendTime() {          // 陪伴她",
  "    this.trust += 30;",
  "  }",
  "",
  "  tellSecret() {",
  "    if (this.trust >= 90) {",
  "      return this.secret;",
  "    }",
  '    return "这是秘密哦~";',
  "  }",
]);

const lines: CodeLine[] = [
  ...staticLines(["class Partner {"]),
  ...priv,
  { t: "", at: 466 },
  ...methods,
  ...staticLines(["}"]),
];

const marks: Mark[] = [
  { line: 1, text: "private", from: 190, to: 330, color: C.codeKeyword },
  { line: 2, text: "private", from: 196, to: 330, color: C.codeKeyword },
  { line: 4, text: "spendTime()", from: 640, to: 700, color: C.codeFunc },
  { line: 8, text: "tellSecret()", from: 640, to: 700, color: C.codeFunc },
  { line: 9, text: "this.trust >= 90", from: 740, to: 800, color: C.gold },
  { line: 5, text: "this.trust += 30", from: 806, to: 960, color: C.rose },
];

const entries: ConsoleEntry[] = [
  { at: 330, cmd: "her.secret", out: "错误：secret 是私有属性，只能在 Partner 类内部访问", kind: "error" },
  { at: 704, cmd: "her.tellSecret()", out: '"这是秘密哦~"' },
  { at: 810, cmd: "her.spendTime()", out: "// 信任值：30", kind: "info" },
  { at: 862, cmd: "her.spendTime()", out: "// 信任值：60", kind: "info" },
  { at: 914, cmd: "her.spendTime()", out: "// 信任值：90", kind: "info" },
  { at: 990, cmd: "her.tellSecret()", out: '"其实我早就喜欢你了"' },
];
const [ERR, NOPE, T1, T2, T3, OPEN] = entries.map(consoleOutAt);

const caps: Cap[] = [
  [66, 180, "不过，每个人都有一些，不想被随便碰的东西。"],
  [180, 320, "比如她的小秘密。在前面加上 `private`，意思是「私有的」。"],
  [320, 440, "如果有人想直接偷看——"],
  [440, 560, "程序当场报错！「私有」的属性，在类的外面根本拿不到。"],
  [560, 700, "想知道秘密，只能通过她「愿意开放」的方法：陪伴，和倾诉。"],
  [700, 800, "直接问？她只会说：「这是秘密哦~」——信任还不够。"],
  [800, 980, "那就多陪陪她吧。每一次 `spendTime()`，信任都会多一点。"],
  [980, 1120, "信任满了，再问一次——"],
  [1120, 1240, "这就是「封装」：藏好内部细节，只通过约定好的方法与外界打交道。"],
  [1240, 1370, "在代码里，它让程序更安全；在感情里，它叫——「尊重边界」。"],
];

const SecretBox: React.FC<{ frame: number }> = ({ frame }) => {
  const shake = frame >= ERR && frame < ERR + 30 ? Math.sin((frame - ERR) * 1.6) * 14 * (1 - (frame - ERR) / 30) : 0;
  const unlock = interpolate(frame, [OPEN, OPEN + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const lid = interpolate(frame, [OPEN + 12, OPEN + 30], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const letter = interpolate(frame, [OPEN + 22, OPEN + 50], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const glow = 0.4 + Math.sin(frame / 7) * 0.2;
  return (
    <div style={{ position: "absolute", left: 440, top: 290, transform: `translateX(${shake}px)` }}>
      {/* 信 */}
      {letter > 0 && (
        <div
          style={{
            position: "absolute",
            left: -40,
            top: 40 - letter * 190,
            width: 340,
            padding: "22px 20px",
            background: "#FFFDF6",
            borderRadius: 14,
            boxShadow: `0 10px 30px rgba(0,0,0,0.15), 0 0 50px ${hexA(C.pink, glow)}`,
            fontFamily: F.serif,
            fontSize: 32,
            fontWeight: 700,
            color: C.rose,
            textAlign: "center",
            opacity: letter,
            transform: `rotate(${(1 - letter) * 10 - 3}deg)`,
            lineHeight: 1.5,
          }}
        >
          其实我
          <br />
          早就喜欢你了 ♥
        </div>
      )}
      <svg width={260} height={260} viewBox="0 0 260 260" style={{ overflow: "visible" }}>
        {/* 盖子 */}
        <g transform={`translate(20 70) rotate(${-lid * 35} 0 30) translate(-20 -70)`}>
          <rect x={20} y={70} width={220} height={50} rx={14} fill="#E57793" />
          <rect x={20} y={104} width={220} height={8} fill="#C95A78" />
        </g>
        <rect x={28} y={112} width={204} height={120} rx={14} fill={C.pink} />
        <path
          transform="translate(130 170) scale(3)"
          d="M0 7 C -9 0, -9 -8, -4 -8 C -1.5 -8, 0 -5.5, 0 -4 C 0 -5.5, 1.5 -8, 4 -8 C 9 -8, 9 0, 0 7 Z"
          fill="#fff"
          opacity={0.55}
        />
        {/* 锁 */}
        <g opacity={1 - lid}>
          <g transform={`translate(0 ${-unlock * 18}) rotate(${unlock * -25} 148 112)`}>
            <path d="M112 116 L112 96 A18 18 0 0 1 148 96 L148 116" stroke="#B58A2C" strokeWidth={9} fill="none" />
          </g>
          <rect x={100} y={110} width={60} height={50} rx={10} fill={C.gold} />
          <circle cx={130} cy={130} r={7} fill="#7A5A16" />
          <rect x={127} y={132} width={6} height={14} fill="#7A5A16" />
        </g>
      </svg>
      <div style={{ textAlign: "center", marginTop: -4, fontFamily: F.mono, fontSize: 28, color: C.inkSoft, fontWeight: 700 }}>
        private secret
      </div>
    </div>
  );
};

export const S06Encapsulation: React.FC = () => {
  const frame = useCurrentFrame();
  const trust =
    interpolate(frame, [T1, T1 + 14], [0, 30], clamp) +
    interpolate(frame, [T2, T2 + 14], [0, 30], clamp) +
    interpolate(frame, [T3, T3 + 14], [0, 30], clamp);
  const hand = interpolate(frame, [330, ERR, ERR + 4, ERR + 22], [0, 1, 1, 0], clamp);
  const deny = interpolate(frame, [ERR, ERR + 6, ERR + 70, ERR + 82], [0, 1, 1, 0], clamp);
  const lessons = usePop(1124, 14, 120);
  const border = usePop(1244, 12, 140);

  let expr: Expression = "normal";
  if (frame >= ERR && frame < ERR + 100) expr = "angry";
  else if (frame >= NOPE && frame < NOPE + 70) expr = "wink";
  else if (frame >= T1 && frame < OPEN) expr = "happy";
  else if (frame >= OPEN) expr = "shy";

  const dates: [number, string][] = [
    [T1, "☕ 一起喝咖啡"],
    [T2, "🎬 一起看电影"],
    [T3, "🌙 一起看月亮"],
  ];

  return (
    <Scene no="05" title="封装：她的小秘密" duration={S06_DURATION}>
      <CodeWindow lines={lines} marks={marks} x={60} y={90} w={980} h={600} fontSize={23} lineHeight={34} />
      <ConsoleWindow x={60} y={710} w={980} h={230} entries={entries} fontSize={22} lineHeight={34} />
      <Stage>
        <StatBar x={60} y={36} width={680} label="信任 trust" value={trust} color={C.mint} />
        <div style={{ position: "absolute", left: 60, top: 330 }}>
          <Clawdia size={300} expression={expr} lookX={frame > 300 && frame < 1000 ? 0.6 : 0} />
        </div>
        <SecretBox frame={frame} />
        {/* 想偷看的手 */}
        {hand > 0 && (
          <div
            style={{
              position: "absolute",
              left: 820 - hand * 260,
              top: 330,
              fontSize: 90,
              fontFamily: F.emoji,
            }}
          >
            👈
          </div>
        )}
        {deny > 0 && (
          <div
            style={{
              position: "absolute",
              left: 450,
              top: 230,
              transform: `rotate(-10deg) scale(${0.8 + deny * 0.2})`,
              opacity: deny,
              border: `5px solid ${C.error}`,
              color: C.error,
              background: "rgba(255,250,248,0.95)",
              padding: "8px 22px",
              borderRadius: 14,
              fontFamily: F.sans,
              fontWeight: 900,
              fontSize: 40,
            }}
          >
            ✖ 禁止访问
          </div>
        )}
        <Bubble at={ERR + 10} until={ERR + 100} text="不许偷看！" x={210} y={350} fontSize={34} color="#FFF0EE" />
        <Bubble at={NOPE} until={NOPE + 70} text="这是秘密哦~" x={210} y={350} fontSize={34} />
        {dates.map(([at, text], i) => {
          const p = interpolate(frame, [at, at + 10, at + 46, at + 56], [0, 1, 1, 0], clamp);
          return (
            <div
              key={text}
              style={{
                position: "absolute",
                left: 70 + i * 40,
                top: 250 - (frame - at) * 0.8,
                opacity: p,
                fontFamily: F.sans,
                fontSize: 32,
                fontWeight: 800,
                color: C.ink,
                background: "#fff",
                padding: "8px 20px",
                borderRadius: 999,
                boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
              }}
            >
              {text} <span style={{ color: C.mint }}>+30</span>
            </div>
          );
        })}
        <HeartBurst at={OPEN + 20} x={570} y={300} count={20} seed="secret" spread={320} />
        {/* 总结 */}
        {frame >= 1124 && (
          <div
            style={{
              position: "absolute",
              left: 40,
              right: 40,
              top: 712,
              display: "flex",
              gap: 18,
              opacity: lessons,
              transform: `translateY(${(1 - lessons) * 30}px)`,
            }}
          >
            {[
              ["🔒 private", "外面碰不到", C.error],
              ["🔑 方法", "唯一的正确入口", C.mint],
            ].map(([a, b, col]) => (
              <div
                key={a}
                style={{
                  flex: 1,
                  background: "#FFFDF9",
                  border: `3px solid ${hexA(col, 0.5)}`,
                  borderRadius: 20,
                  padding: "14px 20px",
                  fontFamily: F.sans,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 32, fontWeight: 900, color: col }}>{a}</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: C.inkSoft, marginTop: 4 }}>{b}</div>
              </div>
            ))}
          </div>
        )}
        {frame >= 1244 && (
          <div
            style={{
              position: "absolute",
              inset: 14,
              borderRadius: 24,
              border: `6px dashed ${C.rose}`,
              opacity: border,
              transform: `scale(${1.08 - border * 0.08})`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: 606,
                transform: "translateX(-50%)",
                background: C.rose,
                color: "#fff",
                fontFamily: F.serif,
                fontWeight: 900,
                fontSize: 36,
                padding: "6px 30px",
                borderRadius: 999,
                whiteSpace: "nowrap",
              }}
            >
              尊重边界 ♥
            </div>
          </div>
        )}
      </Stage>
      <Sfx at={150} name="typing" volume={0.3} />
      <Sfx at={470} name="typing" volume={0.3} />
      <Sfx at={ERR} name="error" volume={0.55} />
      <Sfx at={NOPE} name="pop" volume={0.4} />
      <Sfx at={T1} name="ding" volume={0.35} />
      <Sfx at={T2} name="ding" volume={0.4} />
      <Sfx at={T3} name="ding" volume={0.45} />
      <Sfx at={OPEN} name="unlock" volume={0.6} />
      <Sfx at={OPEN + 20} name="love" volume={0.5} />
      <Sfx at={1244} name="sparkle" volume={0.4} />
      <Captions caps={caps} />
    </Scene>
  );
};
