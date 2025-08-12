import { prismaClient } from "@/lib/prisma-client";
import { createTRPCRouter, protectedProcedure } from "../init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const documentsRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const document = await prismaClient.document.create({
      data: {
        name: "Untitled Document",
        userId: ctx.auth.user.id,
      },
    });

    return document;
  }),
  listUserDocuments: protectedProcedure.query(async ({ ctx }) => {
    const documents = await prismaClient.document.findMany({
      where: {
        userId: ctx.auth.user.id,
      },
      orderBy: { updatedAt: "desc" },
    });
    return documents;
  }),
  getById: protectedProcedure
    .input(z.object({ documentId: z.string() }))
    .query(async ({ ctx, input }) => {
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
      const updated = await prismaClient.$transaction(async (tx) => {
        const result = await tx.document.updateMany({
          where: { id, userId: ctx.auth.user.id },
          data: { name },
        });

        if (result.count === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Document not found.",
          });
        }

        return tx.document.findFirst({
          where: { id, userId: ctx.auth.user.id },
        });
      });

      return updated;
    }),
  save: protectedProcedure
    .input(z.object({ id: z.string().min(1), content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const result = await prismaClient.document.updateMany({
        data: {
          content: input.content,
        },
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });

      if (result.count === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Document not found.",
        });
      }
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const result = await prismaClient.document.deleteMany({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });

      if (result.count === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Document not found.",
        });
      }
    }),
});
