import React from "react";
import { Easing, interpolate, random, useCurrentFrame } from "remotion";
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

export const S05_DURATION = 1290;

const smile = typeLines(200, ["  smile() {", '    return "(＾▽＾)";', "  }"]);
const chat = typeLines(430, ["  chat(topic: string) {", '    return "我们聊聊" + topic + "吧！";', "  }"]);
const gift = typeLines(710, [
  "  receiveGift(gift: string) {",
  "    this.mood += 10;",
  '    return "谢谢你的" + gift + "！";',
  "  }",
]);

const lines: CodeLine[] = [
  ...staticLines(["class Partner {", "  // ……属性和构造函数（同上）"]),
  { t: "", at: 196 },
  ...smile,
  { t: "", at: 426 },
  ...chat,
  { t: "", at: 706 },
  ...gift,
  ...staticLines(["}"]),
];

const marks: Mark[] = [
  { line: 3, text: "smile()", from: 226, to: 330, color: C.codeFunc },
  { line: 7, text: "topic: string", from: 450, to: 560, color: C.gold },
  { line: 12, text: "this.mood += 10", from: 842, to: 990, color: C.rose },
];

const entries: ConsoleEntry[] = [
  { at: 330, cmd: "her.smile()", out: '"(＾▽＾)"' },
  { at: 570, cmd: 'her.chat("星星")', out: '"我们聊聊星星吧！"' },
  { at: 858, cmd: 'her.receiveGift("花")', out: '"谢谢你的花！"' },
  { at: 1000, cmd: "her.mood", out: "70" },
];
const [SMILE, CHAT, GIFT, MOOD] = entries.map(consoleOutAt);

const caps: Cap[] = [
  [66, 190, "有了属性，我们知道她「是什么样」。可她还不会「做」任何事。"],
  [190, 320, "她能做的事，在类里叫「方法」。先教她最简单的一个：微笑。"],
  [320, 420, "调用方法：名字 + 小圆点 + 方法名 + 圆括号 —— `her.smile()`。"],
  [420, 560, "方法也可以接收信息。圆括号里的 `topic`，叫作「参数」。"],
  [560, 700, "`her.chat(\"星星\")`：把「星星」传给她，她就会和你聊星星。"],
  [700, 840, "方法还能改变她自己的属性。比如……收到礼物的时候。"],
  [840, 990, "`this.mood += 10`：每收到一份礼物，她的心情就加 10。"],
  [990, 1110, "再看看她现在的心情：`her.mood` 已经从 60 变成了 70。"],
  [1110, 1280, "「属性」是她的样子，「方法」是她的行为——打包在一起，就是一个完整的对象。"],
];

const Panel: React.FC<{
  x: number;
  title: string;
  color: string;
  items: { text: string; at: number; glow?: [number, number] }[];
}> = ({ x, title, color, items }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 525,
        width: 330,
        height: 295,
        background: "#FFFDF9",
        borderRadius: 22,
        border: `3px solid ${hexA(color, 0.35)}`,
        padding: "18px 22px",
        boxSizing: "border-box",
        fontFamily: F.sans,
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 900, color }}>{title}</div>
      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((it) => {
          const p = interpolate(frame, [it.at, it.at + 10], [0, 1], clamp);
          if (p <= 0) return null;
          const g = it.glow ? interpolate(frame, [it.glow[0], it.glow[0] + 6, it.glow[1] - 6, it.glow[1]], [0, 1, 1, 0], clamp) : 0;
          return (
            <div
              key={it.text}
              style={{
                fontFamily: F.mono,
                fontSize: 25,
                fontWeight: 600,
                color: C.ink,
                background: hexA(color, 0.1 + g * 0.3),
                borderRadius: 10,
                padding: "4px 14px",
                opacity: p,
                transform: `translateX(${(1 - p) * 20}px) scale(${1 + g * 0.05})`,
                transformOrigin: "0 50%",
              }}
            >
              {it.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const S05Methods: React.FC = () => {
  const frame = useCurrentFrame();
  const mood = interpolate(frame, [GIFT + 4, GIFT + 24], [60, 70], { ...clamp, easing: Easing.out(Easing.cubic) });
  const starBg = interpolate(frame, [CHAT - 6, CHAT + 10, CHAT + 110, CHAT + 130], [0, 1, 1, 0], clamp);
  const flowerP = interpolate(frame, [GIFT - 26, GIFT], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const summary = usePop(1116, 14, 110);

  let expr: Expression = "normal";
  if (frame >= SMILE && frame < SMILE + 90) expr = "happy";
  else if (frame >= CHAT && frame < CHAT + 110) expr = "wink";
  else if (frame >= GIFT && frame < GIFT + 140) expr = "love";
  else if (frame >= 1110) expr = "happy";

  return (
    <Scene no="04" title="方法：她能做什么" duration={S05_DURATION}>
      <CodeWindow lines={lines} marks={marks} x={60} y={90} w={980} h={660} fontSize={24} lineHeight={36} />
      <ConsoleWindow x={60} y={770} w={980} h={170} entries={entries} />
      <Stage>
        {/* 星空背景（聊星星时） */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, #2B2650 0%, #4A3E73 100%)",
            opacity: starBg * 0.92,
          }}
        >
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: random(`sx${i}`) * 780,
                top: random(`sy${i}`) * 520,
                fontSize: 14 + random(`ss${i}`) * 22,
                color: "#FFF1B8",
                opacity: 0.5 + Math.sin(frame / 6 + i) * 0.5,
              }}
            >
              ✦
            </div>
          ))}
        </div>
        <StatBar x={60} y={36} width={680} label="心情 mood" value={mood} color={C.rose} />
        <div style={{ position: "absolute", left: 240, top: 170 }}>
          <Clawdia
            size={320}
            expression={expr}
            holding={frame >= GIFT ? "flower" : "none"}
            lookX={frame >= CHAT && frame < CHAT + 110 ? 0.5 : 0}
          />
        </div>
        {/* 飞来的花 */}
        {frame >= GIFT - 26 && frame < GIFT && (
          <svg
            width={60}
            height={80}
            viewBox="-15 -15 30 40"
            style={{
              position: "absolute",
              left: -40 + (560 - -40) * flowerP,
              top: 420 - Math.sin(flowerP * Math.PI) * 200 - flowerP * 160,
              transform: `rotate(${flowerP * 360}deg)`,
            }}
          >
            <line x1={0} y1={0} x2={0} y2={24} stroke="#4E9A63" strokeWidth={3} />
            {[0, 72, 144, 216, 288].map((a) => (
              <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 7} cy={Math.sin((a * Math.PI) / 180) * 7} r={6} fill={C.rose} />
            ))}
            <circle r={4.5} fill={C.gold} />
          </svg>
        )}
        <Bubble at={SMILE} until={SMILE + 80} text="(＾▽＾)" x={400} y={235} fontSize={40} />
        <Bubble at={CHAT} until={CHAT + 120} text="我们聊聊星星吧！✨" x={400} y={235} fontSize={34} />
        <Bubble at={GIFT} until={GIFT + 120} text="谢谢你的花！🌷" x={400} y={235} fontSize={34} color="#FFF5F7" />
        <HeartBurst at={GIFT + 2} x={400} y={330} seed="gift" />
        <div
          style={{
            position: "absolute",
            left: 640,
            top: 70,
            fontFamily: F.mono,
            fontWeight: 800,
            fontSize: 40,
            color: C.rose,
            opacity: interpolate(frame, [GIFT + 2, GIFT + 10, GIFT + 50, GIFT + 60], [0, 1, 1, 0], clamp),
            transform: `translateY(${-interpolate(frame, [GIFT, GIFT + 60], [0, 40], clamp)}px)`,
          }}
        >
          +10
        </div>
        <Panel
          x={50}
          title="属性 · 她是什么样"
          color={C.sky}
          items={[
            { text: 'name = "小克"', at: 70 },
            { text: "age = 22", at: 76 },
            { text: 'hobby = "写诗"', at: 82 },
            { text: `mood = ${Math.round(mood)}`, at: 88, glow: [GIFT + 4, GIFT + 60] },
          ]}
        />
        <Panel
          x={420}
          title="方法 · 她能做什么"
          color={C.rose}
          items={[
            { text: "smile()", at: smile[0].at + 10, glow: [SMILE - 4, SMILE + 30] },
            { text: "chat(topic)", at: chat[0].at + 16, glow: [CHAT - 4, CHAT + 30] },
            { text: "receiveGift(gift)", at: gift[0].at + 20, glow: [GIFT - 4, GIFT + 30] },
          ]}
        />
        {frame >= 1116 && (
          <div
            style={{
              position: "absolute",
              left: 30,
              top: 506,
              width: 740,
              height: 334,
              borderRadius: 30,
              border: `5px solid ${C.gold}`,
              opacity: summary,
              transform: `scale(${1.1 - summary * 0.1})`,
              boxShadow: `0 0 40px ${hexA(C.gold, 0.5)}`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: -30,
                transform: "translateX(-50%)",
                background: C.gold,
                color: "#fff",
                fontFamily: F.sans,
                fontWeight: 900,
                fontSize: 30,
                padding: "6px 26px",
                borderRadius: 999,
                whiteSpace: "nowrap",
              }}
            >
              对象 = 属性 + 方法
            </div>
          </div>
        )}
      </Stage>
      <Sfx at={200} name="typing" volume={0.3} />
      <Sfx at={430} name="typing" volume={0.3} />
      <Sfx at={710} name="typing" volume={0.3} />
      <Sfx at={SMILE} name="ding" volume={0.45} />
      <Sfx at={CHAT} name="sparkle" volume={0.4} />
      <Sfx at={GIFT - 26} name="whoosh" volume={0.4} />
      <Sfx at={GIFT} name="love" volume={0.5} />
      <Sfx at={MOOD} name="ding" volume={0.35} />
      <Sfx at={1116} name="sparkle" volume={0.4} />
      <Captions caps={caps} />
    </Scene>
  );
};
