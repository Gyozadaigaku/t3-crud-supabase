import type { FC } from "react";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";
import NoteModal from "../note.modal";
import UpdateNote from "./update.note";
import { toast } from "react-toastify";
import type { INote } from "@/type";
import { api } from "@/utils/api";
import { useQueryClient } from "@tanstack/react-query";

type NoteItemProps = {
  note: INote;
};

const NoteItem: FC<NoteItemProps> = ({ note }) => {
  const [openSettings, setOpenSettings] = useState(false);
  const [openNoteModal, setOpenNoteModal] = useState(false);

  const queryClient = useQueryClient();
  const { mutate: deleteNote } = api.note.deleteNote.useMutation({
    async onSuccess() {
      await queryClient.invalidateQueries([
        ["getNotes"],
        { limit: 10, page: 1 },
      ]);
      setOpenNoteModal(false);
      toast("Note deleted successfully", {
        type: "success",
        position: "top-right",
      });
    },
    onError(error) {
      setOpenNoteModal(false);
      toast(error.message, {
        type: "error",
        position: "top-right",
      });
    },
  });

  const onDeleteHandler = (noteId: string) => {
    if (window.confirm("Are you sure")) {
      deleteNote({ noteId: noteId });
    }
  };
  return (
    <>
      <div className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-md">
        <div className="details">
          <h4 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
            {note.title.length > 20
              ? note.title.substring(0, 20) + "..."
              : note.title}
          </h4>
          <p className="mb-3 font-normal text-ct-dark-200">
            {note.content.length > 210
              ? note.content.substring(0, 210) + "..."
              : note.content}
          </p>
        </div>
        <div className="relative flex items-center justify-between border-t border-slate-300">
          <span className="text-sm text-ct-dark-100">
            {format(parseISO(note.createdAt.toISOString()), "PPP")}
          </span>
          <div
            onClick={() => setOpenSettings(!openSettings)}
            className="cursor-pointer text-lg text-ct-dark-100"
          >
            <i className="bx bx-dots-horizontal-rounded"></i>
          </div>
          <div
            id="settings-dropdown"
            className={twMerge(
              `absolute right-0 bottom-3 z-10 w-28 list-none divide-y divide-gray-100 rounded bg-white text-base shadow`,
              `${openSettings ? "block" : "hidden"}`
            )}
          >
            <ul className="py-1" aria-labelledby="dropdownButton">
              <li
                onClick={() => {
                  setOpenSettings(false);
                  setOpenNoteModal(true);
                }}
                className="cursor-pointer py-2 px-4 text-sm text-gray-700 hover:bg-gray-100"
              >
                <i className="bx bx-pencil"></i> Edit
              </li>
              <li
                onClick={() => {
                  setOpenSettings(false);
                  onDeleteHandler(note.id);
                }}
                className="cursor-pointer py-2 px-4 text-sm text-red-600 hover:bg-gray-100"
              >
                <i className="bx bx-trash"></i> Delete
              </li>
            </ul>
          </div>
        </div>
      </div>
      <NoteModal
        openNoteModal={openNoteModal}
        setOpenNoteModal={setOpenNoteModal}
      >
        <UpdateNote note={note} setOpenNoteModal={setOpenNoteModal} />
      </NoteModal>
    </>
  );
};

export default NoteItem;
