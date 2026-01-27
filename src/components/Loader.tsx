import { useFrame, useThree, type ThreeElements } from "@react-three/fiber";
import { useRef } from "react";
import { Group, InstancedMesh, Matrix4, MeshBasicMaterial, SphereGeometry, Vector3 } from "three";
import { useWiggle, type WaveConfig } from "../hooks/useWiggle";

const geometry = new SphereGeometry(0.25);
const material = new MeshBasicMaterial();
const count = 8;
const mtx = new Matrix4();
const multiplier = new Matrix4();
const translate = new Vector3();

export const Loader = (props: ThreeElements["group"]) => {
  const cameraPosition = useThree((state) => state.camera).position;
  const axis = cameraPosition.clone().normalize();
  const wiggle = useWiggle({ amplitude: 1.5, frequency: 2 });
  const override: Partial<WaveConfig> = {};
  const instances = useRef<InstancedMesh>(null!);
  const groupRef = useRef<Group>(null!);

  useFrame((_, delta) => {
    instances.current.matrixAutoUpdate = false;
    for (let i = 0; i < count; i++) {
      const phase = (i / count) * Math.PI;
      override.phaseShift = phase / 2;
      const wave = wiggle(override);
      instances.current.getMatrixAt(i, mtx);
      const posWave = Math.abs(wave);
      mtx
        .makeScale(posWave, posWave, posWave)
        .multiply(multiplier.makeRotationAxis(axis, phase))
        .multiply(multiplier.makeTranslation(translate.set(0, wave, 0)));
      instances.current.setMatrixAt(i, mtx);
    }
    instances.current.instanceMatrix.needsUpdate = true;
    groupRef.current.rotateOnAxis(axis, delta);
  });
  return (
    <group {...props} ref={groupRef}>
      <instancedMesh ref={instances} args={[geometry, material, count]} />
    </group>
  );
};
