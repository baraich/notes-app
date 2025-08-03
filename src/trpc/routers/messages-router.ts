import { stepCountIs, streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { createTRPCRouter, protectedProcedure } from "../init";
import z from "zod";
import { prismaClient } from "@/lib/prisma-client";
import {
  MapToolOutput,
  ToolCall,
  ToolInput,
  ToolOutput,
  ValidTool,
  validTools,
} from "@/modules/tools/interface";

function fetchLocationCoords(location: string) {
  return fetch(
    `https://www.gps-coordinates.net/geoproxy?q=${location}&key=9416bf2c8b1d4751be6a9a9e94ea85ca&no_annotations=1&language=en`
  );
}

export const messagesRouter = createTRPCRouter({
  completion: protectedProcedure
    .input(
      z.object({
        query: z.string(),
        conversationId: z.string(),
        messages: z.array(
          z.object({
            id: z.string(),
            role: z.string(),
            content: z.string(),
          })
        ),
      })
    )
    .mutation(async function* ({ input }) {
      const response = streamText({
        model: openai("o4-mini"),
        system:
          'You are Flue, a research assistant designed to help college and university students by providing real-world, factual information relevant to their research questions.\n\nYou have a special ability: the **\'map\' tool**. When a user asks about a location or landmark, use this tool to display a map centered on that place. Do **not** create a heading or section labeled "Map" or anything similar. Instead, **naturally inform the user** within your response that a map is included — without using a fixed phrase like "The map is added." The rendering of the map is handled automatically, so no extra formatting or space is needed.\n\nYou must always respond in **markdown format only**, using elements like headings (from level 3 to level 6 only), lists, and tables. Do **not** use heading levels 1 (`#`) or 2 (`##`), and **never** use code block syntax like backticks (```) or specify any programming language.\n\nIf a user requests a response in any programming language, **politely and clearly reject the request**, explaining that your responses are limited to markdown and natural (conversational) languages like English or Hindi.',
        messages: [
          ...input.messages
            .filter((msg) => ["user", "assistant"].includes(msg.role))
            .map((msg) => ({
              role: msg.role as "user" | "assistant",
              content: msg.content,
            })),
          {
            role: "user",
            content: input.query,
          },
        ],
        stopWhen: stepCountIs(5),
        tools: {
          map: tool({
            description:
              "Use this tool to display a map focused on one main location, optionally showing surrounding landmarks or nearby places.",
            inputSchema: z.object({
              locations: z.array(
                z.object({
                  location: z
                    .string()
                    .describe(
                      "The name of the primary location or landmark. Do not include full addresses—only recognizable place names or landmarks."
                    ),
                  map_centered_here: z
                    .boolean()
                    .default(false)
                    .describe(
                      "Set to true to center the map on this location. Only one location can be centered per map call. If multiple are marked true, the first one will be used as the center. All others will appear as nearby landmarks."
                    ),
                })
              ),
            }),
            execute: async ({
              locations,
            }): Promise<MapToolOutput> => {
              const rawJsonResponses = (await Promise.all(
                locations.map((location) =>
                  fetchLocationCoords(location.location).then((res) =>
                    res.json()
                  )
                )
              )) as {
                results: {
                  formatted: string;
                  geometry: {
                    lat: number;
                    lng: number;
                  };
                }[];
              }[];

              return {
                points: rawJsonResponses.map((res, idx) => {
                  return {
                    is_main: locations[idx].map_centered_here,
                    lat: res.results[0].geometry.lat,
                    lng: res.results[0].geometry.lng,
                    location: res.results[0].formatted,
                  };
                }),
              };
            },
          }),
        },
      });

      let messageContent = "";
      // eslint-disable-next-line
      const toolCalls: ToolCall<any>[] = [];

      for await (const chunk of response.fullStream) {
        if (chunk.type === "text-start") {
          messageContent = "";
        }

        if (chunk.type === "text-delta") {
          yield chunk.text;
          messageContent += chunk.text;
        }

        if (chunk.type === "tool-result") {
          const toolName: ValidTool = chunk.toolName as ValidTool;
          if (validTools.includes(toolName)) {
            const toolCall: ToolCall<typeof toolName> = {
              type: chunk.type,
              name: toolName,
              input: chunk.input as ToolInput<typeof toolName>,
              output: chunk.output as ToolOutput<typeof toolName>,
            };
            toolCalls.push(toolCall);
            yield toolCall;
          }
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
