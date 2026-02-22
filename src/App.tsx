import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { RotatingDisplay, type RotatingDisplayHandle } from "./components/RotatingDisplay";
import { Modal } from "./components/Modal";
import { SectionsProvider } from "./components/SectionsProvider";
import { InteractionArea } from "./components/InteractionArea";
import { Lighting } from "./components/Lighting";
import { Fog } from "./components/Fog";
import { Scene } from "./components/Scene";
import { Perf } from "r3f-perf";
import { cameraPosition as position, cameraFar as far } from "./constants/cameraProps";

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
