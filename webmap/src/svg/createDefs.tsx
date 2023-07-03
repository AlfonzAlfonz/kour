import { Fragment } from "react";
import { createRoot } from "react-dom/client";
import { TEXTURE_GRID_COUNT, TILE_SIZE } from "../config";

export const tilePattern = (x: number, y: number) => `fog-${x}x${y}-pattern`;
export const tilePatternMask = (x: number, y: number) =>
  `fog-${x}x${y}-patternMask`;

export const createDefs = (root: HTMLDivElement) => {
  root.style.position = "absolute";
  createRoot(root).render(
    <svg>
      <defs>
        <radialGradient id="gradient">
          <stop offset="0" stopColor="black"></stop>
          <stop offset="100%" stopColor="transparent"></stop>
        </radialGradient>
        {[...count(TEXTURE_GRID_COUNT)].map((x) =>
          [...count(TEXTURE_GRID_COUNT)].map((y) => (
            <Fragment key={`${x};${y}`}>
              <pattern
                id={tilePattern(x, y)}
                x={0}
                y={0}
                patternUnits="userSpaceOnUse"
                height={TILE_SIZE}
                width={TILE_SIZE}
              >
                <image
                  x={0}
                  y={0}
                  href={`image${x + 1}x${y + 1}.png`}
                  width="100%"
                  height="100%"
                  imageRendering="optimizeSpeed"
                ></image>
              </pattern>
            </Fragment>
          ))
        )}
      </defs>
    </svg>
  );
};

function* count(max: number) {
  for (let i = 0; i < max; i++) {
    yield i;
  }
}
