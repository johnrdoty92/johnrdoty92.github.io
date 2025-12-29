import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { Walls } from "./components/Walls";
import { Environment } from "./components/Environment";
import { Floor } from "./components/Floor";
import { Stats } from "./components/Stats";
import { RotatingDisplay, type RotatingDisplayHandle } from "./components/RotatingDisplay";
import { WorkExperience } from "./components/WorkExperience";
import { WorkProjects } from "./components/WorkProjects";
import { SocialLinks } from "./components/SocialLinks";

function App() {
  const rotatingDisplay = useRef<RotatingDisplayHandle>(null!);
  return (
    <Canvas
      camera={{ position: [10, 2.5, 10] }}
      onPointerLeave={() => rotatingDisplay.current.onDragEnd()}
      onPointerDown={() => rotatingDisplay.current.onDragStart()}
      onPointerMove={() => rotatingDisplay.current.onDrag()}
      onPointerUp={() => rotatingDisplay.current.onDragEnd()}
    >
      {import.meta.env.DEV && <Stats />}
      <Environment />
      <RotatingDisplay ref={rotatingDisplay}>
        <WorkExperience />
        <WorkProjects />
        <SocialLinks />
        <Walls />
        <Floor />
      </RotatingDisplay>
      <axesHelper args={[1.5]} />
      <directionalLight args={["white"]} position={[3, 4, 5]} />
      <ambientLight />
    </Canvas>
  );
}

export default App;
