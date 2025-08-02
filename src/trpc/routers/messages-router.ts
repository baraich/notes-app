import { stepCountIs, streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { createTRPCRouter, protectedProcedure } from "../init";
import z from "zod";
import { prismaClient } from "@/lib/prisma-client";

export const messagesRouter = createTRPCRouter({
  completion: protectedProcedure
    .input(
      z.object({
        query: z.string(),
        conversationId: z.string(),
        messages: z.array(
          z.object({
            id: z.string(),
            content: z.string(),
          })
        ),
      })
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
        stopWhen: stepCountIs(5),
        tools: {
          map: tool({
            description:
              "This tool should be used when talking about a location. It can be used to display a map at that location",
            inputSchema: z.object({
              location: z
                .string()
                .describe(
                  "The location to use as a center point for the map. Do not provide address, just the location name or structure name."
                ),
            }),
            execute: async ({ location }) => {
              const response = await fetch(
                `https://www.gps-coordinates.net/geoproxy?q=${location}&key=9416bf2c8b1d4751be6a9a9e94ea85ca&no_annotations=1&language=en`
              );
              const json = (await response.json()) as {
                results: {
                  geometry: {
                    lat: number;
                    lng: number;
                  };
                }[];
              };

              if (json.results?.length === 0) {
                throw new Error(
                  "Failed to display map for the requested location."
                );
              }

              return {
                latitude: json.results[0]?.geometry?.lat,
                longitude: json.results[0]?.geometry?.lng,
              };
            },
          }),
        },
      });

      let messageContent = "";
      const toolCalls: unknown[] = [];
      for await (const chunk of response.fullStream) {
        if (chunk.type === "text-start") {
          messageContent = "";
        }

        if (chunk.type === "text-delta") {
          yield chunk.text;
          messageContent += chunk.text;
        }

        if (chunk.type === "tool-result") {
          const toolCall = {
            type: chunk.type,
            toolName: chunk.toolName,
            input: chunk.input,
            output: chunk.output,
          };
          toolCalls.push(toolCall);
          console.log(toolCalls);
          yield toolCall;
        }
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
            toolCalls: JSON.stringify(toolCalls),
            conversationsId: input.conversationId,
          },
        }),
      ]);
    }),
});
