import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createTRPCRouter, protectedProcedure } from "../init";
import z from "zod";

export const messagesRouter = createTRPCRouter({
  completion: protectedProcedure
    .input(z.object({ query: z.string() }))
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

      for await (const chunk of response.textStream) {
        yield chunk;
      }
    }),
});
