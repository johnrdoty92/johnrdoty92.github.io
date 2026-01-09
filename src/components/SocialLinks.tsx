import { Suspense } from "react";
import { SocialMediaMinifigure } from "./SocialMediaMinifigure";
import { useThree } from "@react-three/fiber";
import { useRotatingDisplayContext } from "../contexts/RotatingDisplay";
import { MathUtils } from "three";
import { SOCIAL_MEDIA_PROPS } from "../constants/socialMedia";

const MINIFIGURE_DIMENSIONS = {
  width: 2,
  depth: 1.5,
};

export const SocialLinks = () => {
  const originToCameraDistance = useThree(({ camera }) => camera).position.length();
  const screenWidth = useThree((state) => state.size.width);
  const wallWidth = useRotatingDisplayContext().dimensions.width;

  const isDown600 = screenWidth < 600;
  const origin = MathUtils.clamp(
    isDown600 ? wallWidth / 2 : wallWidth,
    MINIFIGURE_DIMENSIONS.depth,
    Math.floor(originToCameraDistance / 2)
  );

  return (
    // TODO: handle fallback
    <Suspense fallback={<></>}>
      {SOCIAL_MEDIA_PROPS.map((props, i) => {
        const isEven = i % 2 === 0;
        const rotationY = isEven ? 0 : -Math.PI / 2;
        const positionOffsetMultiplier = Math.floor(i / 2) + 1;
        const positionOffset = MINIFIGURE_DIMENSIONS.width * positionOffsetMultiplier - 1;
        const x = isEven ? -origin - positionOffset : -origin;
        const z = isEven ? origin : origin + positionOffset;
        return (
          <SocialMediaMinifigure key={i} {...props} position={[x, 0, z]} rotation-y={rotationY} />
        );
      })}
    </Suspense>
  );
};
