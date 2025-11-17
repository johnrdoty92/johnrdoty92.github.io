import { ExtrudeGeometry, Shape, Vector2 } from "three";
import { mergeGeometries, toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export const brickHeight = 0.6;
const bevelSize = 0.01;
const bevelThickness = 0.01;
const depth = brickHeight - bevelThickness;
const bevelSegments = 3;
const bevelOffset = -bevelSize;
// One 2x2 brick is 1 THREE unit wide
const width = 1;
const length = 2;

const rectangle = new Shape()
  .moveTo(-width / 2, -length / 2)
  .lineTo(width / 2, -length / 2)
  .lineTo(width / 2, length / 2)
  .lineTo(-width / 2, length / 2)
  .closePath();

const studDepth = 0.1;
const studRadius = 0.15;
const studSpacingCenterToCenter = 0.5;
const studs = Array(8)
  .fill(0)
  .map((_, i) => {
    const x = (i % 2) * studSpacingCenterToCenter - width / 4;
    const y = Math.floor(i / 2) * studSpacingCenterToCenter - studSpacingCenterToCenter * 1.5;
    return new Shape().absellipse(x, y, studRadius, studRadius, 0, Math.PI * 2);
  });
const solidColorUV = new Vector2(0.9, 0.9);
const topUV = [solidColorUV, solidColorUV, solidColorUV];
const generateTopUV = () => topUV;
const solidColorSideUV = [solidColorUV, solidColorUV, solidColorUV, solidColorUV];

export const brickGeometry = mergeGeometries([
  new ExtrudeGeometry(rectangle, {
    bevelSegments,
    bevelOffset,
    bevelSize,
    bevelThickness,
    depth,
    UVGenerator: {
      generateTopUV,
      generateSideWallUV(_, vertices, indexA, indexB, indexC, _indexD) {
        // A, B, C, D starts at bottom left and moves around counter clockwise
        const a_x = vertices[indexA * 3];
        const b_x = vertices[indexB * 3];
        const b_z = vertices[indexB * 3 + 2];
        const c_z = vertices[indexC * 3 + 2];
        const isBevelSegment = Math.abs(b_z - c_z) < 0.01;
        if (isBevelSegment) {
          return solidColorSideUV;
        }
        const isShortSide = a_x + b_x === 0;
        if (isShortSide) {
          // TODO: replace magic numbers
          return [
            new Vector2(0, 0.6),
            new Vector2(0.6, 0.6),
            new Vector2(0.6, 1),
            new Vector2(0, 1),
          ];
        }
        return [new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 0.3), new Vector2(0, 0.3)];
      },
    },
  }),
  toCreasedNormals(
    new ExtrudeGeometry(studs, {
      bevelSegments,
      bevelOffset,
      bevelSize,
      bevelThickness,
      depth: studDepth,
      UVGenerator: {
        generateTopUV,
        generateSideWallUV: () => solidColorSideUV,
      },
    }).translate(0, 0, brickHeight),
    Math.PI / 2
  ),
]).rotateX(-Math.PI / 2);
