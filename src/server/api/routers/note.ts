import {
  createNoteController,
  deleteNoteController,
  findAllNotesController,
  findNoteController,
  updateNoteController,
} from "./note.controller";
import {
  createNoteSchema,
  filterQuery,
  params,
  updateNoteSchema,
} from "./note.schema";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const noteRouter = createTRPCRouter({
  createNote: publicProcedure
    .input(createNoteSchema)
    .mutation(({ input }) => createNoteController({ input })),
  updateNote: publicProcedure
    .input(updateNoteSchema)
    .mutation(({ input }) =>
      updateNoteController({ paramsInput: input.params, input: input.body })
    ),
  deleteNote: publicProcedure
    .input(params)
    .mutation(({ input }) => deleteNoteController({ paramsInput: input })),
  getNote: publicProcedure
    .input(params)
    .query(({ input }) => findNoteController({ paramsInput: input })),
  getNotes: publicProcedure
    .input(filterQuery)
    .query(({ input }) => findAllNotesController({ filterQuery: input })),
});
