import { useLoader, type ObjectMap } from "@react-three/fiber";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

const extensions = (loader: GLTFLoader) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco");
  loader.setDRACOLoader(dracoLoader);
};

const useGLTF = <T extends Partial<ObjectMap> = Partial<ObjectMap>>(path: string): GLTF & T =>
  useLoader(GLTFLoader, path, extensions) as GLTF & T;

useGLTF.preload = (path: string) => useLoader.preload(GLTFLoader, path, extensions);

export { useGLTF };
