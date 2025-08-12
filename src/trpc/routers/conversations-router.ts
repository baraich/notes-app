import { prismaClient } from "@/lib/prisma-client";
import { createTRPCRouter, protectedProcedure } from "../init";
import z from "zod";
import { TRPCError } from "@trpc/server";

export const conversationsRouter = createTRPCRouter({
  rename: protectedProcedure
    .input(z.object({ name: z.string().min(1), id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const updated = await prismaClient.$transaction(async (tx) => {
        const result = await tx.conversations.updateMany({
          where: { id: input.id, userId: ctx.auth.user.id },
          data: { name: input.name },
        });

        if (result.count === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Conversation not found.",
          });
        }

        return tx.conversations.findFirst({
          where: { id: input.id, userId: ctx.auth.user.id },
        });
      });

      return updated;
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const conversation = await prismaClient.conversations.findFirst({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });

      if (!conversation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found.",
        });
      }

      return conversation;
    }),

  listUserConversations: protectedProcedure.query(async ({ ctx }) => {
    const conversations = await prismaClient.conversations.findMany({
      where: {
        userId: ctx.auth.user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return conversations;
  }),

  create: protectedProcedure.mutation(async ({ ctx }) => {
    const conversation = await prismaClient.conversations.create({
      data: {
        name: "Untitled chat",
        labels: [].join(","),
        userId: ctx.auth.user.id,
      },
    });

    return conversation;
  }),

  listConversationWithMessages: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const conversation = await prismaClient.conversations.findFirst({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
        select: {
          id: true,
          name: true,
          labels: true,
          createdAt: true,
          updatedAt: true,
          Message: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

      if (!conversation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found.",
        });
      }

      return conversation;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const result = await prismaClient.conversations.deleteMany({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });

      if (result.count === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found.",
        });
      }
    }),
});
