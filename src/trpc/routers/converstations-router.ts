import { prismaClient } from "@/lib/prisma-client";
import { createTRPCRouter, protectedProcedure } from "../init";
import z from "zod";

export const conversationsRouter = createTRPCRouter({
  listUserConversations: protectedProcedure.query(async ({ ctx }) => {
    try {
      const conversations = await prismaClient.conversations.findMany(
        {
          where: {
            userId: ctx.auth.user.id,
          },
        }
      );

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
        .optional()
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
      const conversation =
        await prismaClient.conversations.findUnique({
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
