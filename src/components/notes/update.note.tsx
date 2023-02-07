/* eslint-disable @typescript-eslint/restrict-template-expressions */
import type { FC } from "react";
import React, { useEffect } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import type { TypeOf } from "zod";
import { object, string } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "../LoadingButton";
import { toast } from "react-toastify";
import { api } from "@/utils/api";
import type { INote } from "../../type";
import { useQueryClient } from "@tanstack/react-query";

type IUpdateNoteProps = {
  note: INote;
  setOpenNoteModal: (open: boolean) => void;
};

const updateNoteSchema = object({
  title: string().min(1, "Title is required"),
  content: string().min(1, "Content is required"),
});

type UpdateNoteInput = TypeOf<typeof updateNoteSchema>;

const UpdateNote: FC<IUpdateNoteProps> = ({ note, setOpenNoteModal }) => {
  const queryClient = useQueryClient();
  const { isLoading, mutate: updateNote } = api.note.updateNote.useMutation({
    async onSuccess() {
      await queryClient.invalidateQueries([
        ["getNotes"],
        { limit: 10, page: 1 },
      ]);
      setOpenNoteModal(false);
      toast("Note updated successfully", {
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
  const methods = useForm<UpdateNoteInput>({
    resolver: zodResolver(updateNoteSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (note) {
      methods.reset(note);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmitHandler: SubmitHandler<UpdateNoteInput> = async (data) => {
    updateNote({ params: { noteId: note.id }, body: data });
  };
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-ct-dark-600">Update Note</h2>
        <div
          onClick={() => setOpenNoteModal(false)}
          className="ml-auto inline-flex cursor-pointer items-center rounded-lg p-1.5 text-2xl text-gray-400 hover:bg-gray-200 hover:text-gray-900"
        >
          <i className="bx bx-x"></i>
        </div>
      </div>{" "}
      <form className="w-full" onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="mb-2">
          <label className="mb-2 block text-lg text-gray-700" htmlFor="title">
            Title
          </label>
          <input
            className={twMerge(
              `mb-2 w-full appearance-none rounded border border-gray-400 py-3 px-3 leading-tight text-gray-700 focus:outline-none`,
              `${errors["title"] && "border-red-500"}`
            )}
            {...methods.register("title")}
          />
          <p
            className={twMerge(
              `invisible mb-2 text-xs italic text-red-500`,
              `${errors["title"] && "visible"}`
            )}
          >
            {errors["title"]?.message as string}
          </p>
        </div>
        <div className="mb-2">
          <label className="mb-2 block text-lg text-gray-700" htmlFor="title">
            Content
          </label>
          <textarea
            className={twMerge(
              `mb-2 w-full appearance-none rounded border py-3 px-3 leading-tight text-gray-700 focus:outline-none`,
              `${errors.content ? "border-red-500" : "border-gray-400"}`
            )}
            rows={6}
            {...register("content")}
          />
          <p
            className={twMerge(
              `mb-2 text-xs italic text-red-500`,
              `${errors.content ? "visible" : "invisible"}`
            )}
          >
            {errors.content && errors.content.message}
          </p>
        </div>
        <LoadingButton loading={isLoading}>Update Note</LoadingButton>
      </form>
    </section>
  );
};

export default UpdateNote;
