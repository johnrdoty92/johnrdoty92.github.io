import { Color } from "three";
import { brickHeight } from "./brickGeometry";

export type CanvasDrawingOptions = { icon: string; label: string; color: string };

export const canvasTextureSize = 256;

// https://www.w3.org/WAI/GL/wiki/Relative_luminance
const getLuminance = (r: number, g: number, b: number) => {
  const R = r <= 0.03928 ? r / 12.92 : ((r + 0.055) / 1.055) ** 2.4;
  const G = g <= 0.03928 ? g / 12.92 : ((g + 0.055) / 1.055) ** 2.4;
  const B = b <= 0.03928 ? b / 12.92 : ((b + 0.055) / 1.055) ** 2.4;
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

const getContrastText = ({ r, g, b }: Color) => {
  const foregroundLuminance = getLuminance(1, 1, 1);
  const backgroundLuminance = getLuminance(r, g, b);
  const contrast = (foregroundLuminance + 0.05) / (backgroundLuminance + 0.05);
  const threshold = 4.5;
  return contrast >= threshold ? "white" : "black";
};

const backgroundColor = new Color();

export const drawCanvasTexture = (
  ctx: CanvasRenderingContext2D,
  { icon, label, color }: CanvasDrawingOptions,
) => {
  // TODO: organize this better
  ctx.font = `${canvasTextureSize / 5.75}px monospace`;
  ctx.fillStyle = color;
  const logoWidth = canvasTextureSize * (2 / 3);
  const logoHeight = brickHeight * logoWidth;
  const padding = 6;
  ctx.fillRect(0, 0, canvasTextureSize, canvasTextureSize);
  ctx.fillRect(0, 0, logoWidth, logoHeight);
  const height = (canvasTextureSize / 2) * brickHeight;
  const heightOffset = canvasTextureSize - height;
  ctx.fillRect(0, heightOffset, canvasTextureSize, height);
  const textColor = getContrastText(backgroundColor.set(color));
  ctx.fillStyle = textColor;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(
    label,
    canvasTextureSize / 2,
    canvasTextureSize - height / 2,
    canvasTextureSize - padding * 2,
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
