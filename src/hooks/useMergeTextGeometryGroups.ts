import { useCallback } from "react";
import type { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { mergeGroups } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export const useMergeTextGeometryGroups = () =>
  useCallback((node: TextGeometry | null) => {
    if (!node) return;
    node.dispose();
    node = mergeGroups(node) as TextGeometry;
  }, []);
