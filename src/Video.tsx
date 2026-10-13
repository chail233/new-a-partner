import React from "react";
import { AbsoluteFill, Html5Audio, interpolate, Series, staticFile } from "remotion";
import { S01Intro, S01_DURATION } from "./scenes/S01Intro";
import { S02Concept, S02_DURATION } from "./scenes/S02Concept";
import { S03Class, S03_DURATION } from "./scenes/S03Class";
import { S04New, S04_DURATION } from "./scenes/S04New";
import { S05Methods, S05_DURATION } from "./scenes/S05Methods";
import { S06Encapsulation, S06_DURATION } from "./scenes/S06Encapsulation";
import { S07Inheritance, S07_DURATION } from "./scenes/S07Inheritance";
import { S08Polymorphism, S08_DURATION } from "./scenes/S08Polymorphism";
import { S09Recap, S09_DURATION } from "./scenes/S09Recap";
import { S10Ending, S10_DURATION } from "./scenes/S10Ending";
import { loadFonts } from "./fonts";
import { C } from "./theme";

loadFonts();

export const SCENES: [React.FC, number][] = [
  [S01Intro, S01_DURATION],
  [S02Concept, S02_DURATION],
  [S03Class, S03_DURATION],
  [S04New, S04_DURATION],
  [S05Methods, S05_DURATION],
  [S06Encapsulation, S06_DURATION],
  [S07Inheritance, S07_DURATION],
  [S08Polymorphism, S08_DURATION],
  [S09Recap, S09_DURATION],
  [S10Ending, S10_DURATION],
];

export const TOTAL_FRAMES = SCENES.reduce((a, [, d]) => a + d, 0);

export const Video: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Series>
      {SCENES.map(([Comp, d], i) => (
        <Series.Sequence key={i} durationInFrames={d}>
          <Comp />
        </Series.Sequence>
      ))}
    </Series>
    <Html5Audio
      src={staticFile("bgm.wav")}
      volume={(f) => interpolate(f, [0, 30, TOTAL_FRAMES - 60, TOTAL_FRAMES], [0, 0.55, 0.55, 0], { extrapolateRight: "clamp" })}
    />
  </AbsoluteFill>
);
