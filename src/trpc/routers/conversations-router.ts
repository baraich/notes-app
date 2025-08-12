import { prismaClient } from "@/lib/prisma-client";
import { createTRPCRouter, protectedProcedure } from "../init";
import z from "zod";
import { TRPCError } from "@trpc/server";

export const conversationsRouter = createTRPCRouter({
  rename: protectedProcedure
    .input(z.object({ name: z.string().min(1), id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      try {
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

        return await prismaClient.conversations.update({
          where: { id: conversation.id, userId: ctx.auth.user.id },
          data: { name: input.name },
        });
      } catch (error) {
        console.error("Rename error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to rename conversation.",
        });
      }
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
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
      } catch (error) {
        console.error("GetById error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch conversation.",
        });
      }
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

      return conversations;
    } catch (error) {
      console.error("ListUserConversations error:", error);
      return [];
    }
  }),

  create: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const conversation = await prismaClient.conversations.create({
        data: {
          name: "Untitled chat",
          labels: [].join(","),
          userId: ctx.auth.user.id,
        },
      });

      return conversation;
    } catch (error) {
      console.error("Create conversation error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create conversation.",
      });
    }
  }),

  listConversationWithMessages: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const conversation = await prismaClient.conversations.findUnique({
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
      } catch (error) {
        console.error("ListConversationWithMessages error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch conversation and messages.",
        });
      }
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const conversation = await prismaClient.conversations.findFirst({
          where: {
            id: input.id,
            userId: ctx.auth.user.id,
          },
        });

        if (!conversation) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Requested conversation does not found.",
          });
        }

        await prismaClient.conversations.delete({
          where: {
            id: conversation.id,
            userId: ctx.auth.user.id,
          },
        });
      } catch (error) {
        console.error("Failed to delete conversation", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not delete the conversation, please try again later.",
        });
      }
    }),
});
