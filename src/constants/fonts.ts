import { FontLoader, type FontData } from "three/examples/jsm/loaders/FontLoader.js";
import subtitle from "@compai/font-roboto-condensed/data/typefaces/roboto-condensed-bold-normal-700.json";
import header from "@compai/font-kanit/data/typefaces/normal-700.json";

const loader = new FontLoader();

export const headerFont = loader.parse(header as unknown as FontData);

export const subtitleFont = loader.parse(subtitle as unknown as FontData);
