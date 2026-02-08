import { FontLoader, type FontData } from "three/examples/jsm/loaders/FontLoader.js";
import subtitle from "@compai/font-press-start-2-p/data/typefaces/normal-400.json";
import header from "@compai/font-karla/data/typefaces/karla-bold-normal-700.json";

const loader = new FontLoader();

export const headerFont = loader.parse(header as unknown as FontData);

export const subtitleFont = loader.parse(subtitle as unknown as FontData);
