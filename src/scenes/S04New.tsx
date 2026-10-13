import React from "react";
import { interpolate, useCurrentFrame, Easing } from "remotion";
import { Clawdia } from "../components/Clawdia";
import { CodeLine, CodeWindow, ConsoleWindow, Mark, staticLines, typeLines } from "../components/Code";
import { ProfileCard } from "../components/ProfileCard";
import { Bubble, Cap, Captions, clamp, HeartBurst, Scene, Sfx, Sparkles, Stage, usePop } from "../components/ui";
import { C, F } from "../theme";

export const S04_DURATION = 1290;

const body = typeLines(290, [
  "    this.name = name;",
  "    this.age = age;",
  "    this.hobby = hobby;",
  "    this.mood = 60;   // 初始心情",
  "  }",
]);

const lines: CodeLine[] = [
  ...staticLines(["class Partner {", "  name: string;", "  age: number;", "  hobby: string;", "  mood: number;"]),
  { t: "", at: 140 },
  { t: "  constructor(name: string, age: number, hobby: string) {", at: 146 },
  ...body,
  ...staticLines(["}"]),
  { t: "", at: 694 },
  { t: 'const her = new Partner("小克", 22, "写诗");', at: 700, speed: 1 },
];

const marks: Mark[] = [
  { line: 6, text: "constructor", from: 184, to: 320, color: C.codeKeyword },
  ...[7, 8, 9, 10].map((l) => ({ line: l, text: "this", from: 452 + (l - 7) * 5, to: 560, color: C.codeThis })),
  { line: 7, text: "this.name = name", from: 562, to: 680, color: C.gold },
  { line: 14, text: "new", from: 784, to: 910, color: C.codeKeyword },
  { line: 14, text: "her", from: 1030, to: 1160, color: C.mint },
];

const caps: Cap[] = [
  [66, 180, "表格有了。怎么才能让她真正「出现」呢？"],
  [180, 320, "我们需要一个特殊的方法：「构造函数」`constructor`。"],
  [320, 450, "她诞生的那一刻，它会自动运行，把信息一项项填进表格。"],
  [450, 560, "`this` 的意思是「她自己」。"],
  [560, 680, "`this.name = name`：把传进来的名字，记成「她自己的名字」。"],
  [680, 790, "接下来，就是见证奇迹的时刻——"],
  [790, 910, "`new`！照着设计图，一个真实的「对象」诞生了！"],
  [910, 1030, "这个过程叫「实例化」：她，就是 Partner 类的一个「实例」。"],
  [1030, 1150, "`her` 是她的名字标签。加一个小圆点，就能读到她的属性。"],
  [1150, 1280, "`her.name` 是「小克」，`her.hobby` 是「写诗」。你好呀，小克！"],
];

const NEW_AT = 792;

const flights = [
  { text: "\"小克\"", from: [500, 674], to: [1455, 241], at: NEW_AT + 4 },
  { text: "22", from: [600, 674], to: [1440, 299], at: NEW_AT + 10 },
  { text: "\"写诗\"", from: [680, 674], to: [1455, 357], at: NEW_AT + 16 },
  { text: "60", from: [400, 530], to: [1440, 415], at: NEW_AT + 22 },
];
const FLY = 26;

export const S04New: React.FC = () => {
  const frame = useCurrentFrame();
  const ghost = interpolate(frame, [NEW_AT, NEW_AT + 24], [1, 0], clamp);
  const ring = interpolate(frame, [NEW_AT, NEW_AT + 30], [0, 1], clamp);
  const jump = Math.max(0, Math.sin(((frame - NEW_AT - 8) / 26) * Math.PI)) * (frame > NEW_AT + 8 && frame < NEW_AT + 34 ? 50 : 0);
  const thisTag = interpolate(frame, [456, 470, 676, 690], [0, 1, 1, 0], clamp);
  const herTag = usePop(1036, 10, 150);
  const expr =
    frame < NEW_AT
      ? "normal"
      : frame < NEW_AT + 50
        ? "surprised"
        : frame > 1150
          ? "happy"
          : "proud";

  return (
    <Scene no="03" title="实例化：new 一个她" duration={S04_DURATION}>
      <CodeWindow lines={lines} marks={marks} x={60} y={90} w={980} h={650} fontSize={24} lineHeight={36} />
      <ConsoleWindow
        x={60}
        y={760}
        w={980}
        h={180}
        entries={[
          { at: 1056, cmd: "her.name", out: '"小克"' },
          { at: 1106, cmd: "her.hobby", out: '"写诗"' },
        ]}
      />
      <Stage>
        <ProfileCard
          x={60}
          y={40}
          w={680}
          title="Partner 档案"
          fields={[
            { label: "名字", key: "name", showAt: -100, value: "小克", valueAt: flights[0].at + FLY },
            { label: "年龄", key: "age", showAt: -100, value: "22", valueAt: flights[1].at + FLY },
            { label: "爱好", key: "hobby", showAt: -100, value: "写诗", valueAt: flights[2].at + FLY },
            { label: "心情", key: "mood", showAt: -100, value: "60", valueAt: flights[3].at + FLY },
          ]}
          stamp={{ at: -100, text: "尚未实例化", color: C.error, until: NEW_AT + 6 }}
        />
        {/* 实例化光环 */}
        {ring > 0 && ring < 1 && (
          <div
            style={{
              position: "absolute",
              left: 400 - 360 * ring,
              top: 640 - 360 * ring,
              width: 720 * ring,
              height: 720 * ring,
              borderRadius: "50%",
              border: `${10 * (1 - ring)}px solid ${C.gold}`,
              opacity: 1 - ring,
            }}
          />
        )}
        <div style={{ position: "absolute", left: 230, top: 480 - jump }}>
          <Clawdia size={340} ghost={ghost} expression={expr} wave={frame > 1150 && frame < 1240} />
        </div>
        {/* this 指向她自己 */}
        <div
          style={{
            position: "absolute",
            left: 560,
            top: 470,
            opacity: thisTag,
            fontFamily: F.mono,
            fontSize: 34,
            color: C.codeThis,
            fontWeight: 700,
            transform: `translateX(${(1 - thisTag) * 30}px)`,
          }}
        >
          <div>this</div>
          <div style={{ fontFamily: F.sans, fontSize: 26, color: C.inkSoft }}>= 她自己</div>
          <svg width={120} height={60} style={{ marginLeft: -60 }}>
            <path d="M80 6 Q40 10 20 48" stroke={C.codeThis} strokeWidth={4} fill="none" strokeLinecap="round" />
            <path d="M12 36 L20 50 L32 40" stroke={C.codeThis} strokeWidth={4} fill="none" strokeLinecap="round" />
          </svg>
        </div>
        {/* her 名字标签 */}
        {frame >= 1036 && (
          <div
            style={{
              position: "absolute",
              left: 90,
              top: 520,
              transform: `rotate(${-10 + Math.sin(frame / 10) * 4}deg) scale(${herTag})`,
              transformOrigin: "100% 0%",
            }}
          >
            <div
              style={{
                background: C.mint,
                color: "#fff",
                fontFamily: F.mono,
                fontWeight: 700,
                fontSize: 40,
                padding: "8px 26px",
                borderRadius: 14,
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
              }}
            >
              her
            </div>
            <svg width={160} height={60} style={{ position: "absolute", left: 100, top: 20 }}>
              <path d="M0 10 Q70 0 150 46" stroke={C.mint} strokeWidth={3} fill="none" strokeDasharray="6 5" />
            </svg>
          </div>
        )}
        <Sparkles at={NEW_AT + 4} x={400} y={640} r={260} count={14} />
        <HeartBurst at={NEW_AT + 14} x={400} y={600} seed="born" />
        <Bubble at={1160} until={1290} text="你好呀～我是小克！" x={560} y={480} fontSize={32} color="#FFF5F7" />
      </Stage>
      {/* 代码里的值飞进档案卡 */}
      {flights.map((f) => {
        const p = interpolate(frame, [f.at, f.at + FLY], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
        if (frame < f.at || frame > f.at + FLY + 2) return null;
        const x = f.from[0] + (f.to[0] - f.from[0]) * p;
        const y = f.from[1] + (f.to[1] - f.from[1]) * p - Math.sin(p * Math.PI) * 120;
        return (
          <div
            key={f.text}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
              background: C.codeString,
              color: C.editor,
              fontFamily: F.mono,
              fontWeight: 700,
              fontSize: 28,
              padding: "6px 16px",
              borderRadius: 12,
              boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
            }}
          >
            {f.text}
          </div>
        );
      })}
      <Sfx at={146} name="typing" volume={0.3} />
      <Sfx at={290} name="typing" volume={0.3} />
      <Sfx at={700} name="typing" volume={0.3} />
      <Sfx at={NEW_AT - 4} name="magic" volume={0.65} />
      <Sfx at={NEW_AT + 14} name="sparkle" volume={0.45} />
      <Sfx at={1036} name="pop" volume={0.4} />
      <Sfx at={1160} name="ding" volume={0.4} />
      <Captions caps={caps} />
    </Scene>
  );
};
