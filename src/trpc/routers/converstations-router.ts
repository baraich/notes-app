import { prismaClient } from "@/lib/prisma-client";
import { createTRPCRouter, protectedProcedure } from "../init";

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
});
