import { FontLoader, type FontData } from "three/examples/jsm/loaders/FontLoader.js";
import subtitle from "./robotoLight";
import header from "./kanitLight";

const loader = new FontLoader();

export const headerFont = loader.parse(header as unknown as FontData);

export const subtitleFont = loader.parse(subtitle as unknown as FontData);
