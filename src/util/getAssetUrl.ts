export const getAssetUrl = (filename: string, extension = ".glb") => {
  return new URL(`/src/assets/${filename}${extension}`, import.meta.url).href;
};
