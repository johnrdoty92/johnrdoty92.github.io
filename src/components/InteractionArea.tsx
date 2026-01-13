import { Search } from "./Search";
import { SwipePrompt } from "./SwipePrompt";

export const InteractionArea = () => {
  return (
    <div className="interaction-area">
      <SwipePrompt />
      <Search />
    </div>
  );
};
