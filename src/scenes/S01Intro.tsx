import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Clawdia } from "../components/Clawdia";
import { hexA } from "../components/Code";
import { clamp, HeartBurst, Paper, Sfx, Sparkles, usePop } from "../components/ui";
import { C, F } from "../theme";

export const S01_DURATION = 600;

const chats: { at: number; side: "l" | "r"; text: string }[] = [
  { at: 34, side: "l", text: "阿码啊，今年有对象了没？" },
  { at: 104, side: "r", text: "有啊！我每天都在 new 对象。" },
  { at: 178, side: "l", text: "……new？啥意思？" },
  { at: 236, side: "r", text: "不信？我现场给您 new 一个！" },
];

const ChatRow: React.FC<{ at: number; side: "l" | "r"; text: string; index: number }> = ({
  at,
  side,
  text,
  index,
}) => {
  const frame = useCurrentFrame();
  const pop = usePop(at, 13, 160);
  if (frame < at) return null;
  const n = Math.floor((frame - at) * 0.75) + 1;
  const shown = Array.from(text).slice(0, n).join("");
  const isL = side === "l";
  return (
    <div
      style={{
        position: "absolute",
        top: 200 + index * 168,
        left: 300,
        right: 300,
        display: "flex",
        flexDirection: isL ? "row" : "row-reverse",
        alignItems: "center",
        gap: 26,
        opacity: pop,
        transform: `translateY(${(1 - pop) * 30}px)`,
      }}
    >
      {isL ? (
        <div
          style={{
            width: 112,
            height: 112,
            borderRadius: 56,
            background: "#F2C46D",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: F.serif,
            fontWeight: 900,
            fontSize: 54,
            color: "#7A4B12",
            boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
            flexShrink: 0,
          }}
        >
          姨
        </div>
      ) : (
        <div
          style={{
            width: 112,
            height: 112,
            borderRadius: 56,
            background: "#FFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
            flexShrink: 0,
          }}
        >
          <Clawdia girl={false} size={94} expression={index === 3 ? "proud" : "happy"} />
        </div>
      )}
      <div
        style={{
          background: isL ? "#FFFFFF" : C.clay,
          color: isL ? C.ink : "#fff",
          fontFamily: F.sans,
          fontSize: 52,
          fontWeight: 600,
          padding: "22px 38px",
          borderRadius: 30,
          borderTopLeftRadius: isL ? 6 : 30,
          borderTopRightRadius: isL ? 30 : 6,
          boxShadow: "0 10px 26px rgba(80,50,20,0.12)",
          position: "relative",
        }}
      >
        <span style={{ visibility: "hidden" }}>{text}</span>
        <span style={{ position: "absolute", left: 38, top: 22 }}>{shown}</span>
      </div>
    </div>
  );
};

export const S01Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const chatOut = interpolate(frame, [292, 312], [1, 0], clamp);
  const chatLift = interpolate(frame, [292, 312], [0, -80], clamp);
  const termIn = usePop(306, 15, 120);
  const codeText = "const 对象 = new Partner();";
  const typed = Array.from(codeText)
    .slice(0, Math.max(0, Math.floor((frame - 322) * 0.9)))
    .join("");
  const flash = interpolate(frame, [366, 372, 392], [0, 1, 0], clamp);
  const termOut = interpolate(frame, [370, 378], [1, 0], clamp);
  const titleIn = usePop(378, 12, 110);
  const heroIn = usePop(382, 10, 140);
  const subIn = interpolate(frame, [420, 440], [0, 1], clamp);
  const fadeOut = interpolate(frame, [580, 600], [1, 0], clamp);
  const fadeIn = interpolate(frame, [0, 14], [0, 1], clamp);
  const sceneTag = interpolate(frame, [8, 22], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
      <Paper />
      {/* 饭桌聊天 */}
      <AbsoluteFill style={{ opacity: chatOut, transform: `translateY(${chatLift}px)` }}>
        <div
          style={{
            position: "absolute",
            top: 76,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: F.serif,
            fontSize: 46,
            fontWeight: 800,
            color: C.clayDark,
            letterSpacing: 8,
            opacity: sceneTag,
          }}
        >
          🏮 春节 · 家庭聚餐 🏮
        </div>
        {chats.map((c, i) => (
          <ChatRow key={i} {...c} index={i} />
        ))}
      </AbsoluteFill>
      {chats.map((c, i) => (
        <Sfx key={i} at={c.at} name="pop" volume={0.45} />
      ))}

      {/* 终端：new 一个对象 */}
      {frame >= 300 && termOut > 0 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: termOut }}>
          <div
            style={{
              background: C.editor,
              borderRadius: 24,
              padding: "50px 70px",
              transform: `scale(${0.7 + termIn * 0.3})`,
              opacity: termIn,
              boxShadow: "0 30px 80px rgba(60,40,20,0.35)",
              fontFamily: F.mono,
              fontSize: 64,
              color: C.codeText,
              minWidth: 1000,
            }}
          >
            <span style={{ color: C.mint }}>❯ </span>
            <CodeSpan text={typed} />
            <span
              style={{
                display: "inline-block",
                width: 34,
                height: 70,
                background: C.clay,
                verticalAlign: "middle",
                marginLeft: 6,
                opacity: Math.floor(frame / 12) % 2 === 0 ? 1 : 0.2,
              }}
            />
          </div>
        </AbsoluteFill>
      )}
      <Sfx at={322} name="typing" volume={0.35} />
      <Sfx at={362} name="magic" volume={0.6} />

      {/* 标题 */}
      {frame >= 374 && (
        <AbsoluteFill>
          <div
            style={{
              position: "absolute",
              left: 230,
              top: 350,
              transform: `scale(${heroIn}) rotate(${(1 - heroIn) * -20}deg)`,
              transformOrigin: "50% 80%",
            }}
          >
            <Clawdia size={480} expression={frame > 440 ? "happy" : "surprised"} wave={frame > 450} />
          </div>
          <HeartBurst at={384} x={470} y={530} count={18} seed="title" spread={340} />
          <Sparkles at={378} x={470} y={530} r={300} />
          <div
            style={{
              position: "absolute",
              left: 840,
              top: 320,
              opacity: titleIn,
              transform: `translateX(${(1 - titleIn) * 80}px)`,
            }}
          >
            <div style={{ fontFamily: F.serif, fontSize: 120, fontWeight: 900, color: C.ink, lineHeight: 1.15 }}>
              没有对象？
            </div>
            <div
              style={{
                fontFamily: F.mono,
                fontSize: 128,
                fontWeight: 700,
                color: C.clay,
                lineHeight: 1.15,
                marginTop: 6,
              }}
            >
              <span style={{ color: C.codeKeyword }}>new</span>
              <span style={{ fontFamily: F.serif, color: C.ink, fontWeight: 900 }}> 一个！</span>
            </div>
            <div
              style={{
                marginTop: 38,
                fontFamily: F.sans,
                fontSize: 40,
                fontWeight: 500,
                color: C.inkSoft,
                opacity: subIn,
              }}
            >
              一部写给所有人的 <b style={{ color: C.clayDark }}>「面向对象编程」</b> 恋爱指南
            </div>
            <div style={{ marginTop: 22, display: "flex", gap: 16, opacity: subIn }}>
              {["TypeScript", "零基础友好", "恋爱版"].map((t, i) => (
                <div
                  key={t}
                  style={{
                    padding: "8px 22px",
                    borderRadius: 999,
                    fontFamily: F.sans,
                    fontWeight: 800,
                    fontSize: 26,
                    color: [C.sky, C.mint, C.rose][i],
                    background: hexA([C.sky, C.mint, C.rose][i], 0.12),
                    border: `2px solid ${hexA([C.sky, C.mint, C.rose][i], 0.45)}`,
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
      <Sfx at={384} name="sparkle" volume={0.5} />
    </AbsoluteFill>
  );
};

const CodeSpan: React.FC<{ text: string }> = ({ text }) => {
  // 简单着色：关键字 / 类名
  const parts = text.split(/(\bconst\b|\bnew\b|Partner)/g);
  return (
    <>
      {parts.map((p, i) => (
        <span
          key={i}
          style={{
            color:
              p === "const" || p === "new" ? C.codeKeyword : p === "Partner" ? C.codeClass : C.codeText,
          }}
        >
          {p}
        </span>
      ))}
    </>
  );
};
