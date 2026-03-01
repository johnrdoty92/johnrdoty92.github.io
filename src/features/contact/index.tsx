import { Suspense } from "react";
import { SocialMediaMinifigure } from "./SocialMediaMinifigure";
import { useThree } from "@react-three/fiber";
import { useRotatingDisplayContext } from "@/contexts/RotatingDisplay";
import { MathUtils } from "three";
import { SOCIAL_MEDIA_PROPS } from "@/constants";
import { useMediaQuery } from "@/hooks";
import { MOBILE_BREAKPOINT_QUERY } from "@/theme";
import { ExternalLinkIndicator } from "./ExternalLinkIndicator";

const MINIFIGURE_DIMENSIONS = {
  width: 2.5,
  depth: 1.5,
};

const INDICATOR_HEIGHT = 3.15;

export const Contact = () => {
  const originToCameraDistance = useThree(({ camera }) => camera).position.length();
  const { width: wallWidth } = useRotatingDisplayContext();

  const isMobile = useMediaQuery(MOBILE_BREAKPOINT_QUERY);
  const origin = MathUtils.clamp(
    isMobile ? wallWidth / 2 : wallWidth,
    MINIFIGURE_DIMENSIONS.depth,
    Math.floor(originToCameraDistance / 2),
  );

  return (
    <>
      {SOCIAL_MEDIA_PROPS.map((props, i) => {
        const isEven = i % 2 === 0;
        const rotationY = isEven ? 0 : -Math.PI / 2;
        const positionOffsetMultiplier = Math.floor(i / 2) + 1;
        const positionOffset = MINIFIGURE_DIMENSIONS.width * positionOffsetMultiplier - 1;
        const x = isEven ? -origin - positionOffset : -origin;
        const z = isEven ? origin : origin + positionOffset;
        return (
          <Suspense key={i}>
            <ExternalLinkIndicator position={[x, INDICATOR_HEIGHT, z]} />
            <SocialMediaMinifigure {...props} position={[x, 0, z]} rotation-y={rotationY} />
          </Suspense>
        );
      })}
    </>
  );
};
