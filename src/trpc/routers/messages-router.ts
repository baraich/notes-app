import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createTRPCRouter, protectedProcedure } from "../init";
import z from "zod";
import { prismaClient } from "@/lib/prisma-client";

export const messagesRouter = createTRPCRouter({
  completion: protectedProcedure
    .input(
      z.object({ query: z.string(), conversationId: z.string() })
    )
    .mutation(async function* ({ input }) {
      const response = streamText({
        model: openai("o4-mini"),
        messages: [
          {
            role: "user",
            content: input.query,
          },
        ],
      });

      let messageContent = "";
      for await (const chunk of response.textStream) {
        yield chunk;
        messageContent += chunk;
      }

      await prismaClient.$transaction([
        prismaClient.message.create({
          data: {
            role: "USER",
            content: input.query,
            toolCalls: [].join(""),
            conversationsId: input.conversationId,
          },
        }),
        prismaClient.message.create({
          data: {
            role: "ASSISTANT",
            content: messageContent,
            toolCalls: [].join(""),
            conversationsId: input.conversationId,
          },
        }),
      ]);
    }),
});
