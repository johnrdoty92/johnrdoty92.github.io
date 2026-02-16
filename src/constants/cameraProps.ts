import { Vector3 } from "three";

export const cameraPosition = new Vector3(10, 2.5, 10);

export const cameraFar = cameraPosition.length() + 1;
