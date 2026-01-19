import { lazy, Suspense } from "react";
import { Search } from "./Search";
import { SwipePrompt } from "./SwipePrompt";
import { CarouselButtons } from "./CarouselButtons";

const DownloadResumeButton = lazy(() => import("../components/DownloadResumeButton"));

export const InteractionArea = () => {
  return (
    <div className="interaction-area">
      <Search />
      <SwipePrompt />
      <div className="actions">
        <CarouselButtons>
          <Suspense
            fallback={
              <button disabled className="download">
                Loading Resume...
              </button>
            }
          >
            <DownloadResumeButton />
          </Suspense>
        </CarouselButtons>
      </div>
    </div>
  );
};
