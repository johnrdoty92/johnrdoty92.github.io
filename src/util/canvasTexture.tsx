import { Color } from "three";
import { brickHeight } from "./brickGeometry";

export type CanvasDrawingOptions = { icon: string; label: string; color: string };

export const canvasTextureSize = 256;

export const drawCanvasTexture = (
  ctx: CanvasRenderingContext2D,
  { icon, label, color }: CanvasDrawingOptions
) => {
  // TODO: organize this better
  ctx.font = `${canvasTextureSize / 4}px sans-serif`;
  ctx.fillStyle = color;
  const logoWidth = canvasTextureSize * (2 / 3);
  const logoHeight = brickHeight * logoWidth;
  const padding = 6;
  ctx.fillRect(0, 0, canvasTextureSize, canvasTextureSize);
  ctx.fillRect(0, 0, logoWidth, logoHeight);
  const height = (canvasTextureSize / 2) * brickHeight;
  const heightOffset = canvasTextureSize - height;
  ctx.fillRect(0, heightOffset, canvasTextureSize, height);
  // TODO: need a better way to get contrast text
  const { r, g, b } = new Color(color);
  const textColor = (r + g + b) / 3 < 0.3 ? "white" : "black";
  ctx.fillStyle = textColor;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(
    label,
    canvasTextureSize / 2,
    canvasTextureSize - height / 2,
    canvasTextureSize - padding * 2
  );
  ctx.strokeStyle = "white";

  const ICON_PADDING = 16;
  const targetIconHeight = logoHeight - ICON_PADDING;
  const ICON_SIZE = 100;
  const matrix = new DOMMatrix()
    .scale(targetIconHeight / ICON_SIZE)
    .translate((logoWidth - targetIconHeight) / 2, ICON_PADDING / 2);
  const path = new Path2D();
  path.addPath(new Path2D(icon), matrix);
  ctx.stroke(path);
  ctx.fill(path);
};

export const DebugCanvasTexture = (props: CanvasDrawingOptions) => (
  <canvas
    style={{ position: "fixed", backgroundColor: "black", zIndex: 1 }}
    width={canvasTextureSize}
    height={canvasTextureSize}
    ref={(node) => {
      if (!node) return;
      node.width = canvasTextureSize;
      node.height = canvasTextureSize;
      const ctx = node.getContext("2d")!;
      drawCanvasTexture(ctx, props);
    }}
  />
);
