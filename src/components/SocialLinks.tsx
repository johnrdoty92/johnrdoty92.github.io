import { useRotatingDisplayContext } from "../contexts/RotatingDisplay";
import { Suspense } from "react";
import { SocialMediaMinifigure } from "./SocialMediaMinifigure";

export const SocialLinks = () => {
  const { width } = useRotatingDisplayContext().dimensions;
  console.log(width);
  // TODO: position responsively

  return (
    <Suspense fallback={<></>}>
      <SocialMediaMinifigure minifigure="Overalls" position={[6.5, 0, 5.5]} />
      <SocialMediaMinifigure minifigure="Knight" position={[8, 0, 5]} />
      <SocialMediaMinifigure
        minifigure="Spaceman"
        position={[5.5, 0, 6.5]}
        rotation-y={Math.PI / 2}
      />
      <SocialMediaMinifigure minifigure="Pirate" position={[5, 0, 8]} rotation-y={Math.PI / 2} />
    </Suspense>
  );
};
