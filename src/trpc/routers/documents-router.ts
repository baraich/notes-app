import { prismaClient } from "@/lib/prisma-client";
import { createTRPCRouter, protectedProcedure } from "../init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const documentsRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const document = await prismaClient.document.create({
        data: {
          name: "Untitled Document",
          userId: ctx.auth.user.id,
        },
      });

      return document;
    } catch (error) {
      console.error("Failed to create document", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create document, please try again later.",
      });
    }
  }),
  listUserDocuments: protectedProcedure.query(async ({ ctx }) => {
    try {
      const documents = await prismaClient.document.findMany({
        where: {
          userId: ctx.auth.user.id,
        },
      });
      return documents;
    } catch (error) {
      console.error("Failed to list user documents", error);
      return [];
    }
  }),
  getById: protectedProcedure
    .input(z.object({ documentId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const document = await prismaClient.document.findFirst({
          where: {
            id: input.documentId,
            userId: ctx.auth.user.id,
          },
        });

        if (!document) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Document not found.",
          });
        }

        return document;
      } catch (error) {
        console.error("Failed to get document by id", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve document.",
        });
      }
    }),
  rename: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name } = input;
      try {
        const document = await prismaClient.document.update({
          where: {
            id,
            userId: ctx.auth.user.id,
          },
          data: {
            name,
          },
        });
        return document;
      } catch (error) {
        console.error("Failed to rename document", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to rename document.",
        });
      }
    }),
  save: protectedProcedure
    .input(z.object({ id: z.string().min(1), content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const document = await prismaClient.document.findFirst({
          where: {
            id: input.id,
            userId: ctx.auth.user.id,
          },
        });

        if (!document) {
          return new TRPCError({
            code: "NOT_FOUND",
            message: "Requested document does not access!",
          });
        }

        await prismaClient.document.update({
          data: {
            content: input.content,
          },
          where: {
            id: input.id,
            userId: ctx.auth.user.id,
          },
        });
      } catch (error) {
        console.error("Save mutation", error);
        return new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to save the document. Please try again later.",
        });
      }
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const document = await prismaClient.document.findFirst({
          where: {
            id: input.id,
            userId: ctx.auth.user.id,
          },
        });

        if (!document) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Requested document does not found.",
          });
        }

        await prismaClient.document.delete({
          where: {
            id: document.id,
            userId: ctx.auth.user.id,
          },
        });
      } catch (error) {
        console.error("Failed to delete document", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not delete the document, please try again later.",
        });
      }
    }),
});
