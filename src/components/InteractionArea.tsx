import { lazy, Suspense } from "react";
import { Search } from "./Search";
import { SwipePrompt } from "./SwipePrompt";
import { CarouselButtons } from "./CarouselButtons";

const DownloadResumeButton = lazy(() => import("../components/DownloadResumeButton"));

export const InteractionArea = () => {
  return (
    <div className="interaction-area">
      <SwipePrompt />
      <CarouselButtons />
      <Search />
      {/* TODO: handle fallback and loading indicator */}
      <Suspense fallback={<></>}>
        <DownloadResumeButton />
      </Suspense>
    </div>
  );
};
