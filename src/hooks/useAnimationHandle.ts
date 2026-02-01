import { useCallback, useImperativeHandle, type RefObject } from "react";

export interface AnimationHandle {
  animate: (alpha: number) => void;
}

export const useAnimationHandle = (
  ref: RefObject<AnimationHandle>,
  callback: AnimationHandle["animate"],
  deps: unknown[] = [],
) => {
  const animate = useCallback(callback, deps);
  useImperativeHandle(ref, () => ({ animate }), [animate]);
};
