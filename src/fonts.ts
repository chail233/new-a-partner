import { continueRender, delayRender, staticFile } from "remotion";

const fonts: { family: string; file: string; weight: string }[] = [
  { family: "OOP Sans", file: "fonts/NotoSansSC-VF.ttf", weight: "100 900" },
  { family: "OOP Serif", file: "fonts/NotoSerifSC-VF.ttf", weight: "200 900" },
  { family: "OOP Mono", file: "fonts/CascadiaCode.ttf", weight: "200 700" },
];

let started = false;

export const loadFonts = () => {
  if (started || typeof document === "undefined") return;
  started = true;
  const handle = delayRender("加载字体", { timeoutInMilliseconds: 120000 });
  Promise.all(
    fonts.map(async (f) => {
      const face = new FontFace(f.family, `url(${staticFile(f.file)})`, {
        weight: f.weight,
      });
      await face.load();
      document.fonts.add(face);
    }),
  )
    .catch((err) => console.error("字体加载失败", err))
    .finally(() => continueRender(handle));
};
