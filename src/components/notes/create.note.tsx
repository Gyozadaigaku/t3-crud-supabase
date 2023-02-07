import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import type { TypeOf } from "zod";
import { object, string } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "../LoadingButton";
import { toast } from "react-toastify";
import { api } from "@/utils/api";
import { useQueryClient } from "@tanstack/react-query";

type ICreateNoteProps = {
  setOpenNoteModal: (open: boolean) => void;
};

const createNoteSchema = object({
  title: string().min(1, "Title is required"),
  content: string().min(1, "Content is required"),
});

type CreateNoteInput = TypeOf<typeof createNoteSchema>;

const CreateNote: FC<ICreateNoteProps> = ({ setOpenNoteModal }) => {
  const queryClient = useQueryClient();
  const { isLoading, mutate: createNote } = api.note.createNote.useMutation({
    onSuccess() {
      queryClient.invalidateQueries([["getNotes"], { limit: 10, page: 1 }]);
      setOpenNoteModal(false);
      toast("Note created successfully", {
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
  const methods = useForm<CreateNoteInput>({
    resolver: zodResolver(createNoteSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmitHandler: SubmitHandler<CreateNoteInput> = async (data) => {
    createNote(data);
  };
  return (
    <section>
      <div className="mb-3 flex items-center justify-between border-b border-gray-200 pb-3">
        <h2 className="text-2xl font-semibold text-ct-dark-600">Create Note</h2>
        <div
          onClick={() => setOpenNoteModal(false)}
          className="ml-auto inline-flex cursor-pointer items-center rounded-lg p-1.5 text-2xl text-gray-400 hover:bg-gray-200 hover:text-gray-900"
        >
          <i className="bx bx-x"></i>
        </div>
      </div>
      <form className="w-full" onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="mb-2">
          <label className="mb-2 block text-lg text-gray-700" htmlFor="title">
            Title
          </label>
          <input
            className={twMerge(
              `mb-2 w-full appearance-none rounded border border-gray-400 py-3 px-3 leading-tight  text-gray-700 focus:outline-none`,
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
              `mb-2 w-full appearance-none rounded border border-gray-400 py-3 px-3 leading-tight text-gray-700 focus:outline-none`,
              `${errors.content && "border-red-500"}`
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
        <LoadingButton loading={isLoading}>Create Note</LoadingButton>
      </form>
    </section>
  );
};

export default CreateNote;
