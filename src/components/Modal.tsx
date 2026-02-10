import {
  useCallback,
  useRef,
  useState,
  type PropsWithChildren,
  type TransitionEventHandler,
} from "react";
import { ModalContext, type ModalContextValue } from "../contexts/Modal";
import { workExperience, type JobTitle } from "../constants/workExperience";
import { workProjects, type ProjectName } from "../constants/workProjects";
import type { WorkExperience } from "@johnrdoty92/resume-generator";

const MODAL_CLASSNAMES = {
  VISIBLE: "modal-visible",
} as const;

type Entry = (typeof workExperience)[JobTitle] | (typeof workProjects)[ProjectName];

const formatWorkExperienceDateDelta = ({ start, end: _end }: WorkExperience) => {
  const end = _end === "Present" ? new Date() : _end;
  const yearDelta = end.getFullYear() - start.getFullYear();
  const monthDelta = end.getMonth() - start.getMonth() + 12 * yearDelta;
  const years = Math.floor(monthDelta / 12);
  const months = monthDelta % 12;
  const yearLabel = years > 0 ? `${years} year${years > 1 ? "s" : ""}` : "";
  const monthLabel = months > 0 ? `${months} month${months > 1 ? "s" : ""}` : "";
  return "(" + `${yearLabel} ${monthLabel}`.trim() + ")";
};

const ExternalLink = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
};

export const Modal = ({ children }: PropsWithChildren) => {
  const modal = useRef<HTMLDialogElement>(null!);
  const onCloseRef = useRef<(() => void) | undefined>(undefined);
  const [entry, setEntry] = useState<Entry | null>(null);

  const open: ModalContextValue["open"] = useCallback((key, onClose) => {
    const relevantEntry = workExperience[key as JobTitle] || workProjects[key as ProjectName];
    setEntry(relevantEntry);
    modal.current.showModal();
    modal.current.classList.add(MODAL_CLASSNAMES.VISIBLE);
    onCloseRef.current = onClose;
  }, []);

  const close: ModalContextValue["close"] = useCallback(() => {
    modal.current.classList.remove(MODAL_CLASSNAMES.VISIBLE);
    onCloseRef.current?.();
  }, []);

  const handleTransitionEnd: TransitionEventHandler<HTMLDialogElement> = (e) => {
    const { propertyName, target } = e;
    if (propertyName !== "opacity" || !(target instanceof HTMLDialogElement)) return;
    e.stopPropagation();
    const isExited = !(target as HTMLDialogElement).classList.contains(MODAL_CLASSNAMES.VISIBLE);
    if (isExited) modal.current.close();
  };

  return (
    <ModalContext.Provider value={{ open, close }}>
      {children}
      <dialog ref={modal} onTransitionEnd={handleTransitionEnd}>
        {entry &&
          ("company" in entry ? (
            <>
              <h2 slot="title">{entry.title}</h2>
              <div className="stack">
                <a href={entry.companyUrl} target="_blank" className="company-logo">
                  <img src={entry.logoSrc} alt={`${entry.company} logo`} />
                </a>
                <p className="company">
                  <a href={entry.companyUrl} target="_blank">
                    {entry.company}
                  </a>
                  <span>({entry.location})</span>
                </p>
                <p className="duration">
                  <span className="dates">
                    {entry.start.toLocaleDateString()} -{" "}
                    {entry.end === "Present" ? entry.end : entry.end.toLocaleDateString()}{" "}
                  </span>
                  <span className="delta">{formatWorkExperienceDateDelta(entry)}</span>
                </p>
                <ul className="achievements">
                  {entry.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
                <button aria-label="Close" onClick={close}>
                  X
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="dialog-title">
                <h2 slot="title">{entry.projectName}</h2>
                <button aria-label="Close" onClick={close}>
                  X
                </button>
              </div>
              <p>
                <span>{entry.description}</span>{" "}
                <a href={entry.url} target="_blank" className="project-link">
                  <span>View Project</span>
                  <ExternalLink />
                </a>
              </p>
              <ul className="achievements">
                {entry.achievements.map((achievement, i) => (
                  <li key={i}>{achievement}</li>
                ))}
              </ul>
            </>
          ))}
      </dialog>
    </ModalContext.Provider>
  );
};
