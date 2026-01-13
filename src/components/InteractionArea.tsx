import { lazy, Suspense } from "react";
import { Search } from "./Search";
import { SwipePrompt } from "./SwipePrompt";

const DownloadResumeButton = lazy(() => import("../components/DownloadResumeButton"));

export const InteractionArea = () => {
  return (
    <div className="interaction-area">
      <SwipePrompt />
      <Search />
      {/* TODO: handle fallback and loading indicator */}
      <Suspense fallback={<></>}>
        <DownloadResumeButton />
      </Suspense>
    </div>
  );
};
