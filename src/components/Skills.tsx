import Fuse from "fuse.js/min-basic";
import { brickHeight } from "../util/brickGeometry";
import { Brick } from "./Brick";
import { useSearchValue } from "../hooks/useSearchValue";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { MOBILE_BREAKPOINT_QUERY } from "../constants/styles";
import { SKILLS } from "../constants/skills";
import { MathUtils, type Group } from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const fuse = new Fuse(SKILLS, { keys: ["name", "tags"], threshold: 0.25 });

const STARTING_ROTATION = Math.PI / 3;
const TARGET_ROTATION = 0;
const STARTING_HEIGHT = 8;
const SPACING = 2;

export const Skills = () => {
  const bricks = useRef<Group>(null!);
  const searchValue = useSearchValue();
  const results = fuse.search(searchValue);
  const matches = new Set(results.map(({ item }) => item.name));

  const isMobileScreen = useMediaQuery(MOBILE_BREAKPOINT_QUERY);
  const columnCount = isMobileScreen ? 2 : 3;
  const columnHeight = Math.floor(SKILLS.length / columnCount);
  const wallOffset = isMobileScreen ? 2 : 3;
  const maxDistance = (columnCount - 1) * SPACING + wallOffset;
  const maxHeight = (columnHeight - 1) * brickHeight;

  const targets = SKILLS.map((_, i) => {
    const column = Math.floor(i / columnHeight);
    const isLastColumn = column === columnCount - 1;
    const isOddColumn = column % 2 === 1;
    const rotation = isLastColumn || isOddColumn ? Math.PI / 2 : 0;
    const x = SPACING * column + wallOffset;
    const y = maxHeight - (i % columnHeight) * brickHeight;
    const z = maxDistance - x + wallOffset;
    return { x, y, z, rotation, column };
  });

  // TODO: sort skills so they appear from top to bottom in order of importance
  // TODO: handle placement if there's overflow. Currently starts by floating at the top

  const progress = useRef(0);
  const overlap = 0.1;
  const duration = 2.5;

  useFrame((_, delta) => {
    progress.current = MathUtils.clamp(progress.current + delta, 0, duration);
    const totalAlpha = progress.current / duration;
    const chunk = 1 / bricks.current.children.length;
    bricks.current.children.forEach((brick, i) => {
      const index = i;
      const { x, y, z, rotation, column } = targets[index];
      const columnTotal = (column + 1) * columnHeight - 1;
      const animationIndex = (columnTotal - i) * columnCount + column;
      const start = chunk * animationIndex - chunk * animationIndex * overlap;
      const stop = chunk * (animationIndex + 1) + (1 - chunk * (animationIndex + 1)) * overlap;
      const alpha = MathUtils.smoothstep(totalAlpha, start, stop);
      brick.position.set(x, MathUtils.lerp(y + STARTING_HEIGHT, y, alpha), z);
      brick.rotation.y = rotation;
      const rotationAlpha = MathUtils.smoothstep(alpha, 0.8, 1);
      brick.rotation.z = MathUtils.lerp(STARTING_ROTATION, TARGET_ROTATION, rotationAlpha);
    });
  });

  return (
    <group ref={bricks}>
      {SKILLS.map(({ name, color, path }, i) => {
        const isMatch = matches.has(name) || searchValue === "";
        return (
          <Brick
            key={i}
            visibility={isMatch ? "normal" : "dimmed"}
            label={name}
            color={color}
            icon={path}
          />
        );
      })}
    </group>
  );
};
