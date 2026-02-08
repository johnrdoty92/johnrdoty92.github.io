import { useRef } from "react";
import { useSectionsContext } from "../contexts/Sections";
import { IS_TOUCH_DEVICE } from "../constants/device";
import { getAssetUrl } from "../util/getAssetUrl";

export const SwipePrompt = () => {
  const { activeSection } = useSectionsContext();
  const isAcknowledged = useRef(false);
  if (activeSection !== 0) isAcknowledged.current = true;

  let className = "swipe-prompt";
  if (isAcknowledged.current) className += " acknowledged";

  return (
    <div className={className}>
      <p>{IS_TOUCH_DEVICE ? "Swipe" : "Drag"}...</p>
      <img className="pointer" src={getAssetUrl(IS_TOUCH_DEVICE ? "pointer" : "arrow", ".webp")} />
    </div>
  );
};
