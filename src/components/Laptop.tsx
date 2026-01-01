import { useLoader, type ThreeElements } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import {
  type Mesh,
  type MeshPhysicalMaterial,
  type MeshStandardMaterial,
  TextureLoader,
} from "three";
import { useEffect, useMemo } from "react";

type GLTFResult = ReturnType<typeof useLoader<string, typeof GLTFLoader>> & {
  nodes: { laptop: Mesh; stool: Mesh };
  materials: { laptop: MeshPhysicalMaterial; black: MeshStandardMaterial };
};

const laptopModelPath = new URL(`../assets/Laptop.glb`, import.meta.url).href;
const extensions = (loader: GLTFLoader) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco");
  loader.setDRACOLoader(dracoLoader);
};

export function Laptop({ screen, ...props }: ThreeElements["group"] & { screen: string }) {
  const { nodes, materials } = useLoader(GLTFLoader, laptopModelPath, extensions) as GLTFResult;
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

useLoader.preload(GLTFLoader, laptopModelPath, extensions);
