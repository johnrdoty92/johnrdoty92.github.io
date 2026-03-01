import { useFrame, useLoader, type ThreeElements } from "@react-three/fiber";
import { Sprite, TextureLoader } from "three";
import { getAssetUrl } from "@/util";
import { useRef } from "react";
import { useWiggle } from "@/hooks";

export const ExternalLinkIndicator = (props: ThreeElements["group"]) => {
  const externalLinkTexture = useLoader(TextureLoader, getAssetUrl("external_link", ".webp"));
  const ref = useRef<Sprite>(null!);
  const wiggle = useWiggle({ frequency: 2, amplitude: 0.0625 });

  useFrame(() => {
    ref.current.position.y = wiggle();
  });

  return (
    <group {...props}>
      <sprite ref={ref} material-map={externalLinkTexture} scale={0.3} />
    </group>
  );
};
