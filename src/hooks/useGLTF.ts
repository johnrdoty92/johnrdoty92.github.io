import { useLoader, useThree, type ObjectMap } from "@react-three/fiber";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { WebGLRenderer } from "three";

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
dracoLoader.preload();

const ktx2Loader = new KTX2Loader();
ktx2Loader.setTranscoderPath("/basis/");

const extensions = (renderer: WebGLRenderer) => (loader: GLTFLoader) => {
  loader.setDRACOLoader(dracoLoader);
  loader.setKTX2Loader(ktx2Loader.detectSupport(renderer));
};
``;

const useGLTF = <T extends Partial<ObjectMap> = Partial<ObjectMap>>(path: string): GLTF & T => {
  const { gl } = useThree();
  return useLoader(GLTFLoader, path, extensions(gl)) as GLTF & T;
};

useGLTF.preload = (path: string) =>
  useLoader.preload(GLTFLoader, path, extensions(new WebGLRenderer()));

export { useGLTF };
