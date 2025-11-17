import { brickHeight } from "./brickGeometry";

export type CanvasDrawingOptions = { icon: string; label: string; color: string };

export const canvasTextureSize = 256;

export const drawCanvasTexture = (
  ctx: CanvasRenderingContext2D,
  { icon, label, color }: CanvasDrawingOptions
) => {
  // TODO: organize this better
  ctx.font = `${canvasTextureSize / 4}px serif`;
  ctx.fillStyle = color;
  const logoWidth = canvasTextureSize * (2 / 3);
  const logoHeight = brickHeight * logoWidth;
  const padding = 6;
  ctx.fillRect(0, 0, canvasTextureSize, canvasTextureSize);
  ctx.fillRect(0, 0, logoWidth, logoHeight);
  const height = (canvasTextureSize / 2) * brickHeight;
  const heightOffset = canvasTextureSize - height;
  ctx.fillRect(0, heightOffset, canvasTextureSize, height);
  ctx.fillStyle = "white";
  ctx.textBaseline = "middle";
  ctx.fillText(label, padding, canvasTextureSize - height / 2, canvasTextureSize - padding * 2);
  ctx.strokeStyle = "white";
  const path = new Path2D(icon);
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
