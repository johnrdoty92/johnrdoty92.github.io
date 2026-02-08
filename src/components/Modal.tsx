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

const MODAL_CLASSNAMES = {
  VISIBLE: "modal-visible",
} as const;

type Entry = (typeof workExperience)[JobTitle] | (typeof workProjects)[ProjectName];

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
              <button onClick={close}>Close</button>
              {/* TODO: add rest of context */}
            </>
          ) : (
            <>
              <h2 slot="title">{entry.projectName}</h2>
              <button onClick={close}>Close</button>
              {/* TODO: add rest of context */}
            </>
          ))}
      </dialog>
    </ModalContext.Provider>
  );
};
