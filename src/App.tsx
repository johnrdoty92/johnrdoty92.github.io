import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { RotatingDisplay, type RotatingDisplayHandle } from "./components/RotatingDisplay";
import { Modal, InteractionArea } from "@/features/interaction";
import { SectionsProvider } from "./components/SectionsProvider";
import { Lighting } from "./components/Lighting";
import { Fog } from "./components/Fog";
import { Scene } from "./components/Scene";
import { Perf } from "r3f-perf";
import { cameraPosition as position, cameraFar as far } from "@/constants";

function App() {
  const rotatingDisplay = useRef<RotatingDisplayHandle>(null!);
  return (
    <SectionsProvider>
      <Modal>
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
        <InteractionArea />
      </Modal>
    </SectionsProvider>
  );
}

export default App;
