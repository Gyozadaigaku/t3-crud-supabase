import ReactDom from "react-dom";
import type { FC } from "react";
import React from "react";

type INoteModal = {
  openNoteModal: boolean;
  setOpenNoteModal: (open: boolean) => void;
  children: React.ReactNode;
};

const NoteModal: FC<INoteModal> = ({
  openNoteModal,
  setOpenNoteModal,
  children,
}) => {
  if (!openNoteModal) return null;
  return ReactDom.createPortal(
    <>
      <div
        className="fixed inset-0 z-[1000] bg-[rgba(0,0,0,.5)]"
        onClick={() => setOpenNoteModal(false)}
      ></div>
      <div className="fixed top-[5%] left-1/2 z-[1001] w-full max-w-lg -translate-x-1/2 rounded-md bg-white p-6 xl:top-[10%]">
        {children}
      </div>
    </>,
    document.getElementById("note-modal") as HTMLElement
  );
};

export default NoteModal;
