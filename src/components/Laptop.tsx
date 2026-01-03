import { useLoader, type ThreeElements } from "@react-three/fiber";
import {
  type Mesh,
  type MeshPhysicalMaterial,
  type MeshStandardMaterial,
  TextureLoader,
} from "three";
import { useEffect, useMemo } from "react";
import { useGLTF } from "../hooks/useGLTF";

type GLTFResult = ReturnType<typeof useGLTF> & {
  nodes: { laptop: Mesh; stool: Mesh };
  materials: { laptop: MeshPhysicalMaterial; black: MeshStandardMaterial };
};

const laptopModelPath = new URL(`../assets/Laptop.glb`, import.meta.url).href;

export function Laptop({ screen, ...props }: ThreeElements["group"] & { screen: string }) {
  const { nodes, materials } = useGLTF(laptopModelPath) as GLTFResult;
  const laptopMaterial = useMemo(() => materials.laptop.clone(), [materials]);
  useEffect(() => () => laptopMaterial.dispose(), [laptopMaterial]);

  const screenTexture = useLoader(
    TextureLoader,
    new URL(`../assets/${screen}.png`, import.meta.url).href
  );

  // TODO: orient the laptops to always face the camera

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.laptop.geometry}
        material={laptopMaterial}
        material-map={screenTexture}
        material-map-flipY={false}
        position={[0, 1.888, 0.168]}
        scale={0.623}
      />
      <mesh
        geometry={nodes.stool.geometry}
        material={materials.black}
        position={[0, 0.704, 0]}
        scale={0.703}
      />
    </group>
  );
}

useGLTF.preload(laptopModelPath);
