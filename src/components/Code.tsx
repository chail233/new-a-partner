import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, F } from "../theme";

export type CodeLine = { t: string; at: number; speed?: number };
export type Mark = {
  line: number;
  text: string;
  from: number;
  to?: number;
  color?: string;
};
export type Highlight = {
  lines: [number, number];
  from: number;
  to?: number;
  color?: string;
};

export const DEFAULT_SPEED = 1.3;
const ALWAYS = -99999;

/** 生成一组连续打字的代码行：每一行在上一行打完后开始 */
export const typeLines = (
  start: number,
  texts: string[],
  opts: { speed?: number; gap?: number } = {},
): CodeLine[] => {
  const speed = opts.speed ?? DEFAULT_SPEED;
  const gap = opts.gap ?? 4;
  let t = start;
  return texts.map((text) => {
    const line = { t: text, at: t, speed };
    t += Math.ceil(text.trimStart().length / speed) + (text.trim() ? gap : 2);
    return line;
  });
};

export const staticLines = (texts: string[]): CodeLine[] =>
  texts.map((t) => ({ t, at: ALWAYS }));

/** 一组代码行全部打完的时刻 */
export const doneAt = (lines: CodeLine[]) =>
  Math.max(
    ...lines.map(
      (l) => l.at + Math.ceil(l.t.trimStart().length / (l.speed ?? DEFAULT_SPEED)),
    ),
  );

export const visibleText = (frame: number, l: CodeLine) => {
  if (frame < l.at) return null;
  const indent = l.t.length - l.t.trimStart().length;
  const n = Math.floor((frame - l.at) * (l.speed ?? DEFAULT_SPEED));
  return l.t.slice(0, indent + Math.max(0, n));
};

const KEYWORDS = new Set([
  "class", "constructor", "new", "const", "let", "return", "private", "public",
  "protected", "extends", "super", "if", "else", "for", "of", "while", "interface",
  "implements", "readonly", "true", "false", "function", "import", "export",
]);
const TYPES = new Set(["string", "number", "boolean", "void", "any"]);

export const colorize = (line: string): string[] => {
  const colors: string[] = new Array(line.length).fill(C.codeText);
  const re =
    /(\/\/.*$)|("(?:[^"\\]|\\.)*"?)|(`[^`]*`?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$一-龥][\w$一-龥]*)|(\S)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    let col = C.codeText;
    if (m[1]) col = C.codeComment;
    else if (m[2] || m[3]) col = C.codeString;
    else if (m[4]) col = C.codeNumber;
    else if (m[5]) {
      const w = m[5];
      const after = line.slice(m.index + w.length).trimStart();
      const before = line.slice(0, m.index).trimEnd();
      if (w === "this") col = C.codeThis;
      else if (KEYWORDS.has(w)) col = C.codeKeyword;
      else if (TYPES.has(w)) col = C.codeType;
      else if (/^[A-Z]/.test(w)) col = C.codeClass;
      else if (after.startsWith("(")) col = C.codeFunc;
      else if (before.endsWith(".")) col = "#F0D9C8";
    } else if (m[6]) {
      col = "#BDB4AA";
    }
    for (let i = m.index; i < m.index + m[0].length; i++) colors[i] = col;
  }
  return colors;
};

type Run = { text: string; color: string; mark: number };

const RenderLine: React.FC<{
  text: string;
  marks: { start: number; end: number; alpha: number; color: string }[];
}> = ({ text, marks }) => {
  const colors = colorize(text);
  const markOf = (i: number) => marks.findIndex((m) => i >= m.start && i < m.end);
  const runs: Run[] = [];
  for (let i = 0; i < text.length; i++) {
    const mk = markOf(i);
    const last = runs[runs.length - 1];
    if (last && last.color === colors[i] && last.mark === mk) last.text += text[i];
    else runs.push({ text: text[i], color: colors[i], mark: mk });
  }
  // 同一个标记里的多个颜色片段，包进同一个高亮框
  const groups: { mark: number; runs: Run[] }[] = [];
  for (const r of runs) {
    const g = groups[groups.length - 1];
    if (g && g.mark === r.mark) g.runs.push(r);
    else groups.push({ mark: r.mark, runs: [r] });
  }
  return (
    <>
      {groups.map((g, i) => {
        const m = g.mark >= 0 ? marks[g.mark] : null;
        const inner = g.runs.map((r, j) => (
          <span key={j} style={{ color: r.color }}>
            {r.text}
          </span>
        ));
        if (!m) return <React.Fragment key={i}>{inner}</React.Fragment>;
        return (
          <span
            key={i}
            style={{
              background: hexA(m.color, 0.3 * m.alpha),
              boxShadow: `0 0 0 3px ${hexA(m.color, 0.9 * m.alpha)}`,
              borderRadius: 6,
            }}
          >
            {inner}
          </span>
        );
      })}
    </>
  );
};

export const hexA = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a))})`;
};

const fadeWindow = (frame: number, from: number, to?: number, len = 8) => {
  const a = interpolate(frame, [from, from + len], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const b =
    to === undefined
      ? 1
      : interpolate(frame, [to - len, to], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  return Math.min(a, b);
};

export const WindowChrome: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ x, y, w, h, title, children, style }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      background: C.editor,
      borderRadius: 18,
      boxShadow: "0 24px 60px rgba(60,40,20,0.28), 0 4px 12px rgba(0,0,0,0.15)",
      overflow: "hidden",
      ...style,
    }}
  >
    <div
      style={{
        height: 44,
        background: C.editorBar,
        display: "flex",
        alignItems: "center",
        padding: "0 18px",
        gap: 10,
        position: "relative",
      }}
    >
      {["#F2605A", "#F5BE4F", "#5BC46A"].map((c) => (
        <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
      ))}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          textAlign: "center",
          color: "#A79E94",
          fontFamily: F.mono,
          fontSize: 19,
        }}
      >
        {title}
      </div>
    </div>
    <div style={{ position: "absolute", top: 44, left: 0, right: 0, bottom: 0 }}>{children}</div>
  </div>
);

export const CodeWindow: React.FC<{
  lines: CodeLine[];
  marks?: Mark[];
  highlights?: Highlight[];
  x: number;
  y: number;
  w: number;
  h: number;
  title?: string;
  fontSize?: number;
  lineHeight?: number;
  lineNumbers?: boolean;
}> = ({
  lines,
  marks = [],
  highlights = [],
  x,
  y,
  w,
  h,
  title = "partner.ts",
  fontSize = 26,
  lineHeight = 40,
  lineNumbers = true,
}) => {
  const frame = useCurrentFrame();
  const padTop = 18;
  const viewH = h - 44 - padTop * 2;

  const heights = lines.map((l) =>
    l.at === ALWAYS
      ? lineHeight
      : interpolate(frame, [l.at - 6, l.at], [0, lineHeight], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
  );
  const tops: number[] = [];
  let acc = 0;
  for (const hh of heights) {
    tops.push(acc);
    acc += hh;
  }
  const scroll = Math.max(0, acc - viewH);

  // 光标位于最近开始打字的那一行
  let cursorLine = -1;
  let latest = -Infinity;
  lines.forEach((l, i) => {
    if (l.at <= frame && l.at >= latest && l.at !== ALWAYS) {
      latest = l.at;
      cursorLine = i;
    }
  });

  let shown = 0;
  return (
    <WindowChrome x={x} y={y} w={w} h={h} title={title}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          fontFamily: F.mono,
          fontSize,
        }}
      >
        <div style={{ position: "absolute", left: 0, right: 0, top: padTop - scroll }}>
          {highlights.map((hl, i) => {
            const a = fadeWindow(frame, hl.from, hl.to);
            if (a <= 0) return null;
            const t0 = tops[hl.lines[0]] ?? 0;
            const t1 = (tops[hl.lines[1]] ?? 0) + (heights[hl.lines[1]] ?? 0);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 8,
                  right: 8,
                  top: t0 - 2,
                  height: t1 - t0 + 4,
                  borderRadius: 10,
                  background: hexA(hl.color ?? C.gold, 0.14 * a),
                  borderLeft: `5px solid ${hexA(hl.color ?? C.gold, a)}`,
                }}
              />
            );
          })}
          {lines.map((l, i) => {
            const text = visibleText(frame, l);
            if (text === null) return null;
            shown++;
            const lineMarks = marks
              .filter((m) => m.line === i)
              .map((m) => {
                const start = l.t.indexOf(m.text);
                return {
                  start,
                  end: start + m.text.length,
                  alpha: fadeWindow(frame, m.from, m.to),
                  color: m.color ?? C.gold,
                };
              })
              .filter((m) => m.start >= 0 && m.alpha > 0);
            const typing = text.length < l.t.length;
            const isCursor = i === cursorLine;
            const cursorOn = typing || Math.floor(frame / 15) % 2 === 0;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: tops[i],
                  height: lineHeight,
                  left: 0,
                  right: 0,
                  display: "flex",
                  alignItems: "center",
                  whiteSpace: "pre",
                  opacity: heights[i] / lineHeight,
                }}
              >
                {lineNumbers && (
                  <div
                    style={{
                      width: 64,
                      textAlign: "right",
                      paddingRight: 22,
                      color: "#5E5751",
                      fontSize: fontSize * 0.75,
                      flexShrink: 0,
                    }}
                  >
                    {shown}
                  </div>
                )}
                <div style={{ paddingLeft: lineNumbers ? 0 : 24 }}>
                  <RenderLine text={text} marks={lineMarks} />
                  {isCursor && cursorOn && (
                    <span
                      style={{
                        display: "inline-block",
                        width: fontSize * 0.55,
                        height: fontSize * 1.15,
                        background: C.clay,
                        verticalAlign: "middle",
                        marginLeft: 2,
                        opacity: 0.9,
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </WindowChrome>
  );
};

export type ConsoleEntry = {
  at: number;
  cmd: string;
  out?: string;
  outAt?: number;
  kind?: "ok" | "error" | "info";
};

export const consoleOutAt = (e: ConsoleEntry) =>
  e.outAt ?? e.at + Math.ceil(e.cmd.length / DEFAULT_SPEED) + 12;

export const ConsoleWindow: React.FC<{
  entries: ConsoleEntry[];
  x: number;
  y: number;
  w: number;
  h: number;
  fontSize?: number;
  lineHeight?: number;
  title?: string;
}> = ({ entries, x, y, w, h, fontSize = 24, lineHeight = 38, title = "控制台 · 运行结果" }) => {
  const frame = useCurrentFrame();
  type Row = { kind: "cmd" | "ok" | "error" | "info"; text: string; at: number; full: string };
  const rows: Row[] = [];
  for (const e of entries) {
    if (frame < e.at) continue;
    const n = Math.floor((frame - e.at) * DEFAULT_SPEED);
    rows.push({ kind: "cmd", text: e.cmd.slice(0, n), at: e.at, full: e.cmd });
    const oa = consoleOutAt(e);
    if (e.out !== undefined && frame >= oa) {
      e.out.split("\n").forEach((o) => rows.push({ kind: e.kind ?? "ok", text: o, at: oa, full: o }));
    }
  }
  const viewH = h - 44 - 24;
  const heights = rows.map((r) =>
    interpolate(frame, [r.at - 1, r.at + 4], [0, lineHeight], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const total = heights.reduce((a, b) => a + b, 0);
  const scroll = Math.max(0, total - viewH);
  let acc = 0;
  return (
    <WindowChrome x={x} y={y} w={w} h={h} title={title} style={{ background: "#161513" }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", fontFamily: F.mono, fontSize }}>
        <div style={{ position: "absolute", left: 24, right: 24, top: 12 - scroll }}>
          {rows.map((r, i) => {
            const top = acc;
            acc += heights[i];
            const colorMap = { ok: C.codeString, error: C.error, info: "#A9C7A0" } as const;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top,
                  height: lineHeight,
                  display: "flex",
                  alignItems: "center",
                  whiteSpace: "pre",
                  opacity: heights[i] / lineHeight,
                }}
              >
                {r.kind === "cmd" ? (
                  <>
                    <span style={{ color: C.mint, marginRight: 14 }}>❯</span>
                    <RenderLine text={r.text} marks={[]} />
                  </>
                ) : (
                  <span style={{ color: colorMap[r.kind], paddingLeft: 4 }}>
                    {r.kind === "error" ? "✖ " : "← "}
                    {r.text}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </WindowChrome>
  );
};
