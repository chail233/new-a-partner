import React from "react";
import { Composition } from "remotion";
import { TOTAL_FRAMES, Video } from "./Video";
import { FPS, H, W } from "./theme";

export const Root: React.FC = () => (
  <Composition id="OOPLove" component={Video} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} />
);
