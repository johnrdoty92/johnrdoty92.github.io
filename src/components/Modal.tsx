import {
  type ReactNode,
  useCallback,
  useRef,
  useState,
  type PropsWithChildren,
  type TransitionEventHandler,
} from "react";
import { ModalContext, type ModalContextValue } from "../contexts/Modal";

const MODAL_CLASSNAMES = {
  VISIBLE: "modal-visible",
} as const;

export const Modal = ({ children }: PropsWithChildren) => {
  const modal = useRef<HTMLDialogElement>(null!);
  const [content, setContent] = useState<ReactNode | null>(null);

  const open: ModalContextValue["open"] = useCallback((key) => {
    // TODO: use the key to set the content based on the resume data
    setContent(key);
    modal.current.showModal();
    modal.current.classList.add(MODAL_CLASSNAMES.VISIBLE);
  }, []);

  const close: ModalContextValue["close"] = useCallback(() => {
    modal.current.classList.remove(MODAL_CLASSNAMES.VISIBLE);
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
        <h2 slot="title">TODO: Add Title</h2>
        <button onClick={close}>Close</button>
        <p>{content}</p>
      </dialog>
    </ModalContext.Provider>
  );
};
