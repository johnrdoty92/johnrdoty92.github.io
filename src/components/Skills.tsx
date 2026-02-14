import Fuse from "fuse.js/min-basic";
import { brickHeight } from "../util/brickGeometry";
import { Brick } from "./Brick";
import { useSearchValue } from "../hooks/useSearchValue";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { MOBILE_BREAKPOINT_QUERY } from "../constants/styles";
import { SKILLS } from "../constants/skills";
import { MathUtils, type Group } from "three";
import { useRef, type RefObject } from "react";
import { useAnimationHandle, type AnimationHandle } from "../hooks/useAnimationHandle";
import { useRotatingDisplayContext } from "../contexts/RotatingDisplay";

const fuse = new Fuse(SKILLS, { keys: ["name", "tags"], threshold: 0.25 });

const STARTING_ROTATION = Math.PI / 3;
const TARGET_ROTATION = 0;
const HEIGHT_OFFSET = 2;

const roundUpToHalf = (input: number) => Math.ceil(input * 2) / 2;

export const Skills = ({ ref }: { ref: RefObject<AnimationHandle> }) => {
  const { height } = useRotatingDisplayContext();
  const bricks = useRef<Group>(null!);
  const searchValue = useSearchValue();
  const results = fuse.search(searchValue);
  const matches = new Set(results.map(({ item }) => item.name));

  const isMobileScreen = useMediaQuery(MOBILE_BREAKPOINT_QUERY);
  const columnCount = 3;
  const columnHeight = Math.floor(SKILLS.length / columnCount);
  const spacing = isMobileScreen ? 1.75 : 2;
  const wallOffset = isMobileScreen ? 1.5 : 3;
  const maxHeight = (columnHeight - 1) * brickHeight;

  // TODO: sort skills so they appear from top to bottom in order of importance
  // TODO: handle placement if there's overflow. Currently starts by floating at the top

  const overlap = 0.1;
  useAnimationHandle(
    ref,
    (totalAlpha) => {
      const chunk = 1 / bricks.current.children.length;
      bricks.current.children.forEach((brick, i) => {
        const column = Math.floor(i / columnHeight);
        const isLastColumn = column === columnCount - 1;
        const isOddColumn = column % 2 === 1;
        const rotation = isLastColumn || isOddColumn ? Math.PI / 2 : 0;
        const x = roundUpToHalf(wallOffset + column * spacing);
        const y = maxHeight - (i % columnHeight) * brickHeight;
        const columnReversed = columnCount - 1 - column;
        const z = roundUpToHalf(wallOffset + columnReversed * spacing);
        const columnTotal = (column + 1) * columnHeight - 1;
        const animationIndex = (columnTotal - i) * columnCount + column;
        const start = chunk * animationIndex - chunk * animationIndex * overlap;
        const stop = chunk * (animationIndex + 1) + (1 - chunk * (animationIndex + 1)) * overlap;
        const localAlpha = MathUtils.smoothstep(totalAlpha, start, stop);
        brick.position.set(x, MathUtils.lerp(y + height + HEIGHT_OFFSET, y, localAlpha), z);
        brick.rotation.y = rotation;
        const rotationAlpha = MathUtils.smoothstep(localAlpha, 0.8, 1);
        brick.rotation.z = MathUtils.lerp(STARTING_ROTATION, TARGET_ROTATION, rotationAlpha);
      });
    },
    [],
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
