import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { Brick } from "./components/Brick";
import { Walls } from "./components/Walls";
import { Environment } from "./components/Environment";
import { Floor } from "./components/Floor";
import { Stats } from "./components/Stats";
import { RotatingDisplay, type RotatingDisplayHandle } from "./components/RotatingDisplay";

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
        <Brick
          label="JavaScript"
          icon="M34.4 4.4H120.8V90.8H34.4V4.4ZM113.6 70.2C112.8 66.4 110.4 63 102.8 59.8 100.2 58.8 97 57.6 96.4 55.8 96 54.8 96 54 96.4 53.4 96.6 51.2 99.6 50.4 101.8 50.8 103.2 51.2 104.6 52.2 105.4 54 109 51.6 109 51.6 111.8 50.2 110.8 48.6 110.4 48 109.6 47.2 107.4 44.8 104.2 43.2 99.6 43.6L97 44C94.6 44.8 92.4 45.8 91 47.6 87 52.2 88 60.2 93 63.8 98.2 67.4 105.4 68.2 106 71.8 106.8 76 102.8 77.2 98.8 76.8 96 76 94.2 74.6 92.4 72L85.8 76C86.6 77.8 87.6 78.6 88.8 80 94.8 86.4 110.8 86.2 113.6 76.4 113.6 76 114.4 73.8 114 70.6L114 71ZM81.2 44.4H73.2C73.2 51.2 73.2 58.4 73.2 65.2 73.2 69.6 73.6 73.8 73 75 71.8 77.4 68.6 77.2 67.2 76.8 65.8 76 65 75 64.2 73.6 64 73.2 64 72.8 64 72.8L57.4 76.8C58.6 79 60.4 81 62.2 82.2 65.4 84 69.4 84.6 73.6 83.6 76.6 82.8 79 81 80.2 78.6 82 75.4 81.6 71 81.6 66.6 81.6 59.2 81.6 52 81.6 44.4L81.6 44Z"
          color="#951ee5"
        />
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
