import Fuse from "fuse.js/min-basic";
import { brickHeight } from "../util/brickGeometry";
import { Brick } from "./Brick";
import { useSearchValue } from "../hooks/useSearchValue";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { MOBILE_BREAKPOINT_QUERY } from "../constants/styles";
import { SKILLS } from "../constants/skills";
import { MathUtils, type Group } from "three";
import { useMemo, useRef, type RefObject } from "react";
import { useAnimationHandle, type AnimationHandle } from "../hooks/useAnimationHandle";

const fuse = new Fuse(SKILLS, { keys: ["name", "tags"], threshold: 0.25 });

const STARTING_ROTATION = Math.PI / 3;
const TARGET_ROTATION = 0;
const STARTING_HEIGHT = 8;
const SPACING = 2;

export const Skills = ({ ref }: { ref: RefObject<AnimationHandle> }) => {
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

  // TODO: probably don't need memo here, just move to animation handler and update deps
  const targets = useMemo(
    () =>
      SKILLS.map((_, i) => {
        const column = Math.floor(i / columnHeight);
        const isLastColumn = column === columnCount - 1;
        const isOddColumn = column % 2 === 1;
        const rotation = isLastColumn || isOddColumn ? Math.PI / 2 : 0;
        const x = SPACING * column + wallOffset;
        const y = maxHeight - (i % columnHeight) * brickHeight;
        const z = maxDistance - x + wallOffset;
        return { x, y, z, rotation, column };
      }),
    [columnHeight, columnCount, wallOffset, maxDistance, maxHeight, brickHeight],
  );

  // TODO: sort skills so they appear from top to bottom in order of importance
  // TODO: handle placement if there's overflow. Currently starts by floating at the top

  const overlap = 0.1;
  useAnimationHandle(
    ref,
    (totalAlpha) => {
      const chunk = 1 / bricks.current.children.length;
      bricks.current.children.forEach((brick, i) => {
        const index = i;
        const { x, y, z, rotation, column } = targets[index];
        const columnTotal = (column + 1) * columnHeight - 1;
        const animationIndex = (columnTotal - i) * columnCount + column;
        const start = chunk * animationIndex - chunk * animationIndex * overlap;
        const stop = chunk * (animationIndex + 1) + (1 - chunk * (animationIndex + 1)) * overlap;
        const localAlpha = MathUtils.smoothstep(totalAlpha, start, stop);
        brick.position.set(x, MathUtils.lerp(y + STARTING_HEIGHT, y, localAlpha), z);
        brick.rotation.y = rotation;
        const rotationAlpha = MathUtils.smoothstep(localAlpha, 0.8, 1);
        brick.rotation.z = MathUtils.lerp(STARTING_ROTATION, TARGET_ROTATION, rotationAlpha);
      });
    },
    [targets],
  );

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
