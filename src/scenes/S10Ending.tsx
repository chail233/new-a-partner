import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { Clawdia } from "../components/Clawdia";
import { hexA } from "../components/Code";
import { Cap, Captions, clamp, HeartShape, Paper, Sfx, Sparkles, usePop } from "../components/ui";
import { C, F } from "../theme";

export const S10_DURATION = 1440;

const caps: Cap[] = [
  [44, 170, "在代码里，「new 一个对象」，只需要一行。"],
  [170, 300, "可在现实里，没有哪一个「对象」，是 new 出来的。"],
  [300, 420, "她不是照着你的「理想型」，生成的实例。"],
  [420, 540, "她有自己的属性，不必符合你的「类型定义」；"],
  [540, 660, "她有自己的秘密，值得被温柔地「封装」；"],
  [660, 780, "她爱人的方式，也许和你想的不一样，需要你慢慢读懂。"],
  [780, 910, "面向对象，说到底，是学会看见每一个「独一无二」的个体。"],
  [910, 1030, "所以，在遇见那个对象之前——"],
  [1030, 1150, "先把自己，写成一个更好的对象吧。"],
];

const CODE = 'const her = new Partner("小克");';
const traits: [string, number, number, number][] = [
  ["爱写诗", 560, 300, 432],
  ["怕黑", 1240, 280, 446],
  ["笑点很低", 470, 560, 460],
  ["路痴", 1330, 540, 474],
  ["有自己的梦想", 860, 230, 488],
];

const Stars: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({ length: 90 }).map((_, i) => {
        const x = random(`x${i}`) * 1920;
        const y = random(`y${i}`) * 1000;
        const s = 1.5 + random(`s${i}`) * 3;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(frame / (18 + random(`t${i}`) * 30) + i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: s,
              height: s,
              borderRadius: s,
              background: "#FFF6DD",
              opacity: tw,
              boxShadow: `0 0 ${s * 3}px rgba(255,240,200,0.8)`,
            }}
          />
        );
      })}
      {Array.from({ length: 14 }).map((_, i) => {
        const x = random(`hx${i}`) * 1920;
        const speed = 0.4 + random(`hs${i}`) * 0.6;
        const y = 1100 - ((frame * speed + random(`hy${i}`) * 1200) % 1300);
        const sz = 14 + random(`hz${i}`) * 26;
        return (
          <HeartShape
            key={`h${i}`}
            size={sz}
            color={i % 2 ? "#F7A8BC" : "#E9B9F0"}
            style={{ position: "absolute", left: x + Math.sin(frame / 30 + i) * 20, top: y, opacity: 0.25 }}
          />
        );
      })}
    </>
  );
};

export const S10Ending: React.FC = () => {
  const frame = useCurrentFrame();
  const night = interpolate(frame, [0, 40], [0, 1], clamp);
  const typed = Math.max(0, Math.floor((frame - 50) * 0.8));
  const strike = interpolate(frame, [218, 236], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const shatter = interpolate(frame, [248, 300], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const heroIn = interpolate(frame, [300, 336], [0, 1], clamp);
  const heroX = interpolate(frame, [910, 960], [0, 300], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const heroX2 = interpolate(frame, [1150, 1200], [0, -80], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const boyIn = interpolate(frame, [930, 966], [0, 1], clamp);
  const boyX = interpolate(frame, [1150, 1200], [0, 80], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const traitsOut = interpolate(frame, [880, 905], [1, 0], clamp);
  const lockIn = usePop(552, 12, 120);
  const meCode = usePop(1040, 13, 120);
  const meOut = interpolate(frame, [1140, 1156], [1, 0], clamp);
  const grow = interpolate(frame, [1080, 1110], [1, 1.12], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const title1 = usePop(1160, 13, 110);
  const title2 = usePop(1190, 13, 110);
  const heartBeat = 1 + Math.max(0, Math.sin(frame / 7)) * 0.12;
  const heartIn = interpolate(frame, [1200, 1220], [0, 1], clamp);
  const endIn = interpolate(frame, [1300, 1325], [0, 1], clamp);
  const toBlack = interpolate(frame, [1405, 1440], [0, 1], clamp);
  const halo = 0.5 + Math.sin(frame / 15) * 0.15;
  const orbit = interpolate(frame, [664, 690, 760, 780], [0, 1, 1, 0], clamp);

  const heroExpr = frame < 420 ? "closed" : frame < 780 ? "normal" : frame < 1150 ? "happy" : "love";

  return (
    <AbsoluteFill>
      <Paper />
      <AbsoluteFill
        style={{
          opacity: night,
          background: "linear-gradient(180deg, #15132B 0%, #2A2148 55%, #4B2F55 85%, #6B3D52 100%)",
        }}
      >
        <Stars />
      </AbsoluteFill>

      {/* 一行代码，然后碎掉 */}
      {frame >= 44 && frame < 304 && (
        <div
          style={{
            position: "absolute",
            top: 400,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            fontFamily: F.mono,
            fontSize: 64,
            color: "#F3EDE4",
          }}
        >
          <div style={{ position: "relative" }}>
            {Array.from(CODE).map((ch, i) => {
              if (i >= typed) return null;
              const dx = (random(`dx${i}`) - 0.5) * 600 * shatter;
              const dy = (random(`dy${i}`) - 0.2) * 500 * shatter;
              const rot = (random(`dr${i}`) - 0.5) * 360 * shatter;
              const col = ["const", "new"].some((k) => CODE.indexOf(k) <= i && i < CODE.indexOf(k) + k.length)
                ? C.codeKeyword
                : CODE.indexOf("Partner") <= i && i < CODE.indexOf("Partner") + 7
                  ? C.codeClass
                  : CODE.indexOf('"') <= i && i <= CODE.lastIndexOf('"')
                    ? C.codeString
                    : "#F3EDE4";
              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    whiteSpace: "pre",
                    color: col,
                    transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`,
                    opacity: 1 - shatter,
                  }}
                >
                  {ch}
                </span>
              );
            })}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: "52%",
                height: 6,
                width: `${strike * 100}%`,
                background: C.rose,
                borderRadius: 3,
                opacity: 1 - shatter,
                boxShadow: `0 0 14px ${C.rose}`,
              }}
            />
          </div>
        </div>
      )}

      {/* 她 */}
      {frame >= 300 && (
        <div
          style={{
            position: "absolute",
            left: 790 + heroX + heroX2,
            top: 360,
            opacity: heroIn,
            transform: `translateY(${(1 - heroIn) * 40}px)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: -110,
              top: -120,
              width: 560,
              height: 560,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${hexA("#FFD9C2", halo)} 0%, rgba(255,200,180,0) 65%)`,
            }}
          />
          <div style={{ position: "relative" }}>
            <Clawdia size={340} expression={heroExpr} />
          </div>
        </div>
      )}

      {/* 她的特质 */}
      {traits.map(([t, x, y, at], i) => {
        const p = interpolate(frame, [at, at + 14], [0, 1], clamp);
        if (p <= 0 || traitsOut <= 0) return null;
        return (
          <div
            key={t}
            style={{
              position: "absolute",
              left: x,
              top: y + Math.sin(frame / 20 + i) * 8,
              transform: `translate(-50%, -50%) scale(${p})`,
              opacity: Math.min(p, traitsOut),
              fontFamily: F.serif,
              fontSize: 34,
              fontWeight: 700,
              color: "#FFF1E6",
              padding: "8px 24px",
              borderRadius: 999,
              border: "2px solid rgba(255,220,200,0.5)",
              background: "rgba(255,255,255,0.08)",
              whiteSpace: "nowrap",
            }}
          >
            {t}
          </div>
        );
      })}
      {frame >= 552 && traitsOut > 0 && (
        <div
          style={{
            position: "absolute",
            left: 1150,
            top: 400,
            fontSize: 70,
            fontFamily: F.emoji,
            transform: `scale(${lockIn})`,
            opacity: traitsOut,
            filter: `drop-shadow(0 0 ${16 + Math.sin(frame / 8) * 8}px rgba(255,190,210,0.9))`,
          }}
        >
          💝
        </div>
      )}
      {/* 环绕的心：不同的爱法 */}
      {orbit > 0 &&
        [C.violet, C.sky, C.gold, C.mint, C.rose].map((c, i) => {
          const a = frame / 22 + (i / 5) * Math.PI * 2;
          return (
            <HeartShape
              key={c}
              size={44}
              color={c}
              style={{
                position: "absolute",
                left: 960 + Math.cos(a) * 280 - 22,
                top: 520 + Math.sin(a) * 120 - 22,
                opacity: orbit,
              }}
            />
          );
        })}

      {/* 阿码：先成为更好的自己 */}
      {frame >= 930 && (
        <div
          style={{
            position: "absolute",
            left: 520 + boyX,
            top: 400,
            opacity: boyIn,
            transform: `scale(${grow})`,
            transformOrigin: "50% 100%",
          }}
        >
          <Clawdia size={300} girl={false} expression={frame > 1150 ? "love" : frame > 1080 ? "proud" : "normal"} lookX={0.8} />
        </div>
      )}
      <Sparkles at={1082} x={670} y={540} r={240} seed="grow" />
      {frame >= 1040 && meOut > 0 && (
        <div
          style={{
            position: "absolute",
            left: 220,
            top: 110,
            background: "rgba(20,18,30,0.75)",
            border: "2px solid rgba(255,255,255,0.15)",
            borderRadius: 20,
            padding: "26px 40px",
            fontFamily: F.mono,
            fontSize: 38,
            lineHeight: 1.55,
            whiteSpace: "pre",
            color: "#F3EDE4",
            opacity: Math.min(meCode, meOut),
            transform: `translateY(${(1 - meCode) * 30}px)`,
          }}
        >
          <div>
            <span style={{ color: C.codeKeyword }}>const</span> me = <span style={{ color: C.codeKeyword }}>new</span>{" "}
            <span style={{ color: C.codeClass }}>Me</span>();
          </div>
          <div>
            <span style={{ color: C.codeKeyword }}>while</span> (<span style={{ color: C.codeKeyword }}>true</span>) {"{"}
          </div>
          <div>
            {"  "}me.<span style={{ color: C.codeFunc }}>grow</span>();{"   "}
            <span style={{ color: C.codeComment }}>// 一直成长</span>
          </div>
          <div>{"}"}</div>
        </div>
      )}

      {/* 两人之间的心 */}
      {frame >= 1200 && (
        <div style={{ position: "absolute", left: 960 - 45, top: 470, opacity: heartIn, transform: `scale(${heartBeat})` }}>
          <HeartShape size={90} color={C.rose} style={{ filter: "drop-shadow(0 0 20px rgba(255,120,150,0.8))" }} />
        </div>
      )}

      {/* 标题 */}
      {frame >= 1160 && (
        <div style={{ position: "absolute", top: 100, left: 0, right: 0, textAlign: "center" }}>
          <div
            style={{
              fontFamily: F.serif,
              fontSize: 72,
              fontWeight: 800,
              color: "#FFF1E6",
              opacity: title1,
              transform: `translateY(${(1 - title1) * 30}px)`,
            }}
          >
            没有对象？
          </div>
          <div
            style={{
              fontFamily: F.serif,
              fontSize: 92,
              fontWeight: 900,
              color: "#FFD3B8",
              marginTop: 12,
              opacity: title2,
              transform: `translateY(${(1 - title2) * 30}px)`,
              textShadow: "0 0 30px rgba(255,180,150,0.45)",
            }}
          >
            先 <span style={{ fontFamily: F.mono, color: C.codeKeyword }}>new</span> 一个更好的自己。
          </div>
        </div>
      )}
      {frame >= 1300 && (
        <div style={{ position: "absolute", top: 870, left: 0, right: 0, textAlign: "center", opacity: endIn }}>
          <div style={{ fontFamily: F.serif, fontSize: 40, letterSpacing: 18, color: "#FFF1E6", fontWeight: 700 }}>— THE END —</div>
          <div style={{ fontFamily: F.mono, fontSize: 26, color: "#BFAFC9", marginTop: 14 }}>
            // 感谢观看 <span style={{ color: C.rose }}>♥</span> 愿你被温柔以待，也温柔待人
          </div>
        </div>
      )}
      <Captions caps={caps} dark serif />
      <AbsoluteFill style={{ background: "#000", opacity: toBlack }} />
      <Sfx at={50} name="typing" volume={0.3} />
      <Sfx at={218} name="whoosh" volume={0.35} />
      <Sfx at={248} name="shatter" volume={0.45} />
      <Sfx at={1082} name="sparkle" volume={0.4} />
      <Sfx at={1200} name="love" volume={0.5} />
    </AbsoluteFill>
  );
};
