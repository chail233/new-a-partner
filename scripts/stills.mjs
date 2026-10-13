// 批量渲染预览帧：node scripts/stills.mjs 450 900 1500 ...
// 帧号可以写成 "场景号:本地帧"，例如 4:792
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const durations = fs
  .readdirSync(path.join(ROOT, "src/scenes"))
  .filter((f) => /^S\d\d/.test(f))
  .sort()
  .map((f) => Number(fs.readFileSync(path.join(ROOT, "src/scenes", f), "utf8").match(/_DURATION\s*=\s*(\d+)/)[1]));
const starts = durations.map((_, i) => durations.slice(0, i).reduce((a, b) => a + b, 0));

const frames = process.argv.slice(2).map((a) => {
  if (a.includes(":")) {
    const [s, f] = a.split(":").map(Number);
    return { label: `s${String(s).padStart(2, "0")}_${f}`, frame: starts[s - 1] + f };
  }
  return { label: `f${a}`, frame: Number(a) };
});

const serveUrl = await bundle({ entryPoint: path.join(ROOT, "src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "OOPLove" });
fs.mkdirSync(path.join(ROOT, "out/stills"), { recursive: true });
for (const { label, frame } of frames) {
  const output = path.join(ROOT, "out/stills", `${label}.jpg`);
  await renderStill({ serveUrl, composition, frame, output, imageFormat: "jpeg", jpegQuality: 80, scale: 0.5 });
  console.log("✓", output);
}
