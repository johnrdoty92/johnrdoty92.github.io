import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { Environment } from "./components/Environment";
import { Stats } from "./components/Stats";
import { RotatingDisplay, type RotatingDisplayHandle } from "./components/RotatingDisplay";
import { Modal } from "./components/Modal";
import { SectionsProvider } from "./components/SectionsProvider";
import { InteractionArea } from "./components/InteractionArea";
import { Lighting } from "./components/Lighting";
import { Fog } from "./components/Fog";
import { Scene } from "./components/Scene";

function App() {
  const rotatingDisplay = useRef<RotatingDisplayHandle>(null!);
  return (
    <SectionsProvider>
      <Modal>
        <InteractionArea />
        <Canvas
          camera={{ position: [10, 2.5, 10] }}
          onPointerLeave={() => rotatingDisplay.current?.onDragEnd()}
          onPointerDown={() => rotatingDisplay.current?.onDragStart()}
          onPointerMove={() => rotatingDisplay.current?.onDrag()}
          onPointerUp={() => rotatingDisplay.current?.onDragEnd()}
        >
          {import.meta.env.DEV && <Stats />}
          <Fog />
          <Environment />
          <Lighting />
          <RotatingDisplay ref={rotatingDisplay}>
            <Scene />
          </RotatingDisplay>
        </Canvas>
      </Modal>
    </SectionsProvider>
  );
}

export default App;
