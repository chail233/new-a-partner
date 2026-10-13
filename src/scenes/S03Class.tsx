import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Clawdia } from "../components/Clawdia";
import { CodeLine, CodeWindow, Mark, typeLines } from "../components/Code";
import { ProfileCard } from "../components/ProfileCard";
import { Bubble, Cap, Captions, clamp, Scene, Sfx, Stage, usePop } from "../components/ui";
import { C } from "../theme";

export const S03_DURATION = 1090;

const props = typeLines(
  430,
  [
    "  name: string;     // 名字",
    "  age: number;      // 年龄",
    "  hobby: string;    // 爱好",
    "  mood: number;     // 心情值",
  ],
  { gap: 10 },
);

const lines: CodeLine[] = [
  { t: "class Partner {", at: 110 },
  ...props,
  { t: "}", at: 128 },
];

const marks: Mark[] = [
  { line: 0, text: "class", from: 196, to: 312, color: C.codeKeyword },
  { line: 0, text: "Partner", from: 312, to: 420, color: C.codeClass },
  ...[1, 2, 3, 4].map((l) => ({
    line: l,
    text: l % 2 ? "string" : "number",
    from: 566 + l * 6,
    to: 700,
    color: C.codeType,
  })),
  ...[1, 2, 3, 4].map((l) => ({
    line: l,
    text: "//",
    from: 704 + l * 6,
    to: 820,
    color: C.codeComment,
  })),
];

const caps: Cap[] = [
  [66, 190, "好，现在用 TypeScript，亲手写一张「设计图」。"],
  [190, 310, "`class` 是关键字，意思是：我要定义一个「类」，后面跟着它的名字。"],
  [310, 420, "`Partner` 就是「伴侣」。大括号 { } 里面，写下她的特征。"],
  [420, 560, "这些特征，在编程里叫「属性」：名字、年龄、爱好、心情……"],
  [560, 700, "冒号后面是「类型」：`string` 表示一段文字，`number` 表示一个数字。"],
  [700, 820, "`//` 后面是「注释」：写给人看的备注，电脑会直接忽略它。"],
  [820, 950, "不过注意：这只是一张空白表格，什么都还没有填。"],
  [950, 1080, "她现在还不存在——只活在你的想象里。"],
];

export const S03Class: React.FC = () => {
  const frame = useCurrentFrame();
  const ghostIn = usePop(830, 14, 100);
  const pulse = 0.75 + Math.sin(frame / 8) * 0.25;
  const typeTip = interpolate(frame, [566, 586, 690, 700], [0, 1, 1, 0], clamp);
  return (
    <Scene no="02" title="定义类：她的属性" duration={S03_DURATION}>
      <CodeWindow lines={lines} marks={marks} x={60} y={90} w={960} h={850} fontSize={30} lineHeight={50} />
      <Stage>
        <ProfileCard
          x={60}
          y={40}
          w={680}
          title="Partner 档案（设计图）"
          appearAt={130}
          fields={[
            { label: "名字", key: "name", showAt: props[0].at + 12 },
            { label: "年龄", key: "age", showAt: props[1].at + 12 },
            { label: "爱好", key: "hobby", showAt: props[2].at + 12 },
            { label: "心情", key: "mood", showAt: props[3].at + 12 },
          ]}
          stamp={{ at: 846, text: "尚未实例化", color: C.error }}
        />
        {/* 类型说明 */}
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 470,
            width: 680,
            display: "flex",
            gap: 20,
            opacity: typeTip,
            transform: `translateY(${(1 - typeTip) * 20}px)`,
          }}
        >
          {[
            ["string", "文字", "\"小克\"", C.codeType],
            ["number", "数字", "22", C.codeNumber],
          ].map(([k, zh, eg, col]) => (
            <div
              key={k}
              style={{
                flex: 1,
                background: "#1E1C1A",
                borderRadius: 20,
                padding: "20px 26px",
                fontFamily: "'OOP Mono', monospace",
                color: col,
                fontSize: 32,
              }}
            >
              {k}
              <div style={{ fontFamily: "'OOP Sans', sans-serif", fontSize: 26, color: "#E8E2D9", marginTop: 8 }}>
                {zh}，比如 <span style={{ color: col }}>{eg}</span>
              </div>
            </div>
          ))}
        </div>
        {frame >= 830 && (
          <div
            style={{
              position: "absolute",
              left: 230,
              top: 480,
              opacity: ghostIn * pulse,
              transform: `scale(${ghostIn})`,
            }}
          >
            <Clawdia size={340} ghost={1} />
          </div>
        )}
        <Bubble at={960} text="她……会是什么样子呢？" x={400} y={500} fontSize={32} tail="down" color="#FFF5F7" />
      </Stage>
      <Sfx at={110} name="typing" volume={0.3} />
      <Sfx at={430} name="typing" volume={0.3} />
      <Sfx at={846} name="stamp" volume={0.55} />
      <Captions caps={caps} />
    </Scene>
  );
};
