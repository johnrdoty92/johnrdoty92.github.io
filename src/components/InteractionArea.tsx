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
      <Suspense fallback={<button disabled>Loading Resume...</button>}>
        <DownloadResumeButton />
      </Suspense>
    </div>
  );
};
