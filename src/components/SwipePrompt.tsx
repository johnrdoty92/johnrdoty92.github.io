import { useRef } from "react";
import { useSectionsContext } from "../contexts/Sections";
import { IS_TOUCH_DEVICE } from "../constants/device";

export const SwipePrompt = () => {
  const { activeSection } = useSectionsContext();
  const isAcknowledged = useRef(false);
  if (activeSection !== 0) isAcknowledged.current = true;

  if (!IS_TOUCH_DEVICE) return null;

  let className = "swipe-prompt";
  if (isAcknowledged.current) className += " acknowledged";

  return <p className={className}>Swipe...</p>;
};
