import { lazy, Suspense } from "react";
import { Search } from "./Search";
import { CarouselButtons } from "./CarouselButtons";

const DownloadResumeButton = lazy(() => import("@/features/interaction/DownloadResumeButton"));

export const InteractionArea = () => {
  return (
    <div className="interaction-area">
      <Search />
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
