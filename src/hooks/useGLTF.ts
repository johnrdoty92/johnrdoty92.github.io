import { useLoader } from "@react-three/fiber";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const extensions = (loader: GLTFLoader) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco");
  loader.setDRACOLoader(dracoLoader);
};

const useGLTF = (path: string) => useLoader(GLTFLoader, path, extensions);

useGLTF.preload = (path: string) => useLoader.preload(GLTFLoader, path, extensions);

export { useGLTF };
