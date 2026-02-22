import Fuse from "fuse.js/min-basic";
import { brickHeight } from "../util/brickGeometry";
import { Brick } from "./Brick";
import { useSearchValue } from "../hooks/useSearchValue";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { MOBILE_BREAKPOINT_QUERY } from "../constants/styles";
import { SKILLS } from "../constants/skills";
import { MathUtils, type Sprite, type Group, Vector3, SRGBColorSpace } from "three";
import { useMemo, useRef, useState, type RefObject } from "react";
import { useAnimationHandle, type AnimationHandle } from "../hooks/useAnimationHandle";
import { useRotatingDisplayContext } from "../contexts/RotatingDisplay";
import { useFrame } from "@react-three/fiber";
import type { WorkExperience } from "@johnrdoty92/resume-generator";
import { workExperience } from "../constants/workExperience";

const fuse = new Fuse(SKILLS, { keys: ["name", "tags"], threshold: 0.25 });

const STARTING_ROTATION = Math.PI / 3;
const TARGET_ROTATION = 0;
const HEIGHT_OFFSET = 2;

const roundUpToHalf = (input: number) => Math.ceil(input * 2) / 2;
const sumMonthsOfExperience = ({ start, end: _end }: WorkExperience) => {
  const end = _end === "Present" ? new Date() : _end;
  const yearDelta = end.getFullYear() - start.getFullYear();
  return end.getMonth() - start.getMonth() + 12 * yearDelta;
};

const target = new Vector3();

export const Skills = ({ ref }: { ref: RefObject<AnimationHandle> }) => {
  const { height } = useRotatingDisplayContext();
  const bricks = useRef<Group>(null!);
  const experience = useRef<Sprite>(null!);
  const searchValue = useSearchValue();
  const results = fuse.search(searchValue);
  const matches = new Set(results.map(({ item }) => item.name));

  const [focusedIndex, setFocusedIndex] = useState<undefined | number>();
  const canvas = useMemo(() => {
    const node = document.createElement("canvas");
    // TODO: remove magic numbers
    node.width = 128;
    node.height = 128;
    const ctx = node.getContext("2d")!;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 128 / 4, 128, 128 / 2);
    ctx.fillStyle = "black";
    ctx.fillRect(2, 128 / 4 + 2, 128 - 6, 128 / 2 - 6);
    ctx.font = `${128 / 5.75}px monospace`;
    ctx.fillStyle = "white";
    ctx.textBaseline = "bottom";
    ctx.textAlign = "center";
    if (focusedIndex !== undefined) {
      const skillName = SKILLS[focusedIndex].name;
      const totalMonthsOfExperience = Object.values(workExperience).reduce((total, current) => {
        if (current.skillsUsed.find((name) => name === skillName)) {
          total += sumMonthsOfExperience(current);
        }
        return total;
      }, 0);
      const years = Math.floor(totalMonthsOfExperience / 12);
      const suffix = years > 1 ? "yrs" : "yr";
      ctx.fillText(`${years}+ ${suffix}`, 128 / 2, 128 / 2, 128 - 8);
      ctx.fillText("experience", 128 / 2, (3 * 128) / 4 - 10, 128 - 8);
    }
    return node;
  }, [focusedIndex]);

  useFrame(({ camera }, delta) => {
    if (focusedIndex === undefined) return;
    if (bricks.current.children[focusedIndex]) {
      const { x, y, z } = experience.current.position;
      target.lerpVectors(bricks.current.children[focusedIndex].position, camera.position, 0.2);
      target.y += 1;
      experience.current.position.set(
        MathUtils.damp(x, target.x, 5, delta),
        MathUtils.damp(y, target.y, 5, delta),
        MathUtils.damp(z, target.z, 5, delta),
      );
    }
  });

  const isMobileScreen = useMediaQuery(MOBILE_BREAKPOINT_QUERY);
  const columnCount = 3;
  const columnHeight = Math.floor(SKILLS.length / columnCount);
  const spacing = isMobileScreen ? 1.75 : 2;
  const wallOffset = isMobileScreen ? 1.5 : 3;
  const maxHeight = (columnHeight - 1) * brickHeight;

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
    <>
      <sprite
        visible={focusedIndex !== undefined}
        ref={experience}
        scale={1.5}
        position={[wallOffset + spacing + 1, 1, wallOffset + spacing + 1]}
      >
        <spriteMaterial transparent>
          <canvasTexture attach="map" args={[canvas]} colorSpace={SRGBColorSpace} />
        </spriteMaterial>
      </sprite>
      <group ref={bricks} onPointerMissed={() => setFocusedIndex(undefined)}>
        {SKILLS.map(({ name, color, path }, i) => {
          const isMatch = matches.has(name) || searchValue === "";
          return (
            <Brick
              key={i}
              visibility={isMatch ? "normal" : "dimmed"}
              label={name}
              color={i === focusedIndex ? "white" : color}
              icon={path}
              onClick={(e) => {
                e.stopPropagation();
                setFocusedIndex(i);
              }}
            />
          );
        })}
      </group>
    </>
  );
};
