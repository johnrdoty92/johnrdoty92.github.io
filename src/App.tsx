import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { Lighting, Fog, RotatingDisplay, type RotatingDisplayHandle } from "@/components";
import { Scene } from "@/features/scene";
import { Perf } from "r3f-perf";
import { cameraPosition as position, cameraFar as far } from "@/constants";

function App() {
  const rotatingDisplay = useRef<RotatingDisplayHandle>(null!);
  return (
    <Canvas
      camera={{ position, far }}
      onPointerLeave={() => rotatingDisplay.current?.onDragEnd()}
      onPointerDown={() => rotatingDisplay.current?.onDragStart()}
      onPointerMove={() => rotatingDisplay.current?.onDrag()}
      onPointerUp={() => rotatingDisplay.current?.onDragEnd()}
    >
      {import.meta.env.DEV && <Perf position="bottom-right" />}
      <Fog />
      <Lighting />
      <RotatingDisplay ref={rotatingDisplay}>
        <Scene />
      </RotatingDisplay>
    </Canvas>
  );
}

export default App;
