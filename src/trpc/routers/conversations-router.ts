import { prismaClient } from "@/lib/prisma-client";
import { createTRPCRouter, protectedProcedure } from "../init";
import z from "zod";

export const conversationsRouter = createTRPCRouter({
  rename: protectedProcedure
    .input(z.object({ name: z.string().min(1), id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return prismaClient.conversations.update({
        where: {
          userId: ctx.auth.user.id,
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await prismaClient.conversations.findFirst({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });
    }),
  listUserConversations: protectedProcedure.query(async ({ ctx }) => {
    try {
      const conversations = await prismaClient.conversations.findMany({
        where: {
          userId: ctx.auth.user.id,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      return conversations || [];
    } catch {
      return [];
    }
  }),
  create: protectedProcedure
    .input(
      z
        .object({
          pending_message: z.string().min(1),
        })
        .optional(),
    )
    .mutation(async ({ ctx, input }) => {
      const conversation = await prismaClient.conversations.create({
        data: {
          name: "Untitled chat",
          labels: [].join(","),
          userId: ctx.auth.user.id,
          Message: !input?.pending_message
            ? undefined
            : {
                create: {
                  content: input.pending_message,
                  cost: "0",
                  role: "USER",
                  status: "PENDING",
                  toolCalls: JSON.stringify({}),
                  totalCost: "0",
                },
              },
        },
      });

      return conversation;
    }),
  listConversationWithMessages: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const conversation = await prismaClient.conversations.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
        select: {
          name: true,
          labels: true,
          createdAt: true,
          updatedAt: true,
          id: true,
          Message: true,
        },
      });

      return conversation;
    }),
});
