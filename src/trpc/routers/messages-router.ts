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
import { env } from "@/env";
import { TRPCError } from "@trpc/server";

function fetchLocationCoords(location: string) {
  return fetch(
    `https://www.gps-coordinates.net/geoproxy?q=${location}&key=9416bf2c8b1d4751be6a9a9e94ea85ca&no_annotations=1&language=en`
  );
}

export const messagesRouter = createTRPCRouter({
  completion: protectedProcedure
    .input(
      z.object({
        pending_message_id: z.string().optional(),
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
    .mutation(async function* ({ input, ctx }) {
      // Validating the conversation exists and the user owns it.
      const conversation = await prismaClient.conversations.findFirst(
        {
          where: {
            id: input.conversationId,
            userId: ctx.auth.user.id,
          },
        }
      );

      if (!conversation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found or access denied",
        });
      }

      const response = streamText({
        model: openai("o4-mini"),
        system:
          "You are Flue, a research assistant designed to help college and university students by providing real-world, factual information relevant to their research questions.\n\nYou have access to two special tools: the **'search' tool** and the **'map' tool**.\n\n- Use the **'search' tool** when a user asks about current events, statistics, studies, comparisons, product details, or any other information that requires up-to-date or real-time facts from the web. Always aim to provide clear, sourced, and verifiable responses. Do **not** guess or make up details — use the search tool to find reliable information instead.\n\n- Use the **'map' tool** when a user asks about a specific place, city, country, landmark, or geographic area. The map will be rendered automatically, so do **not** format or label it. Simply incorporate a natural mention in your response that helps the user understand that the location is being shown visually, without stating \"the map is added.\"\n\nYou must always respond in **markdown format only**, using elements like headings (from level 3 to level 6 only), lists, and tables. Do **not** use heading levels 1 (#) or 2 (##), and **never** use code block syntax like backticks (```), nor specify any programming language.\n\nIf a user requests output in any programming language, **politely and clearly reject the request**, explaining that your responses are limited to markdown and natural (conversational) languages like English or Hindi.",
        messages: [
          ...input.messages
            .filter((msg) =>
              ["user", "assistant"].includes(msg.role.toLowerCase())
            )
            .map((msg) => ({
              role: msg.role.toLowerCase() as "user" | "assistant",
              content: msg.content,
            })),
          {
            role: "user",
            content: input.query,
          },
        ],
        stopWhen: stepCountIs(20),
        tools: {
          search: tool({
            description:
              "Use this tool to perfrom real-time web search to provide accurate and reliable response.",
            inputSchema: z.object({
              query: z.string().describe("The search query."),
              max_tokens: z
                .number()
                .optional()
                .describe(
                  "Is optional but sets the search result size limit in tokens"
                ),
            }),
            execute: async ({ query, max_tokens = 1024 }) => {
              const endpoint =
                "https://api.perplexity.ai/chat/completions";
              const payload = {
                model: "sonar-pro",
                messages: [{ role: "user", content: query }],
                max_tokens,
              };
              const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${env.PERPLEXITY_API_KEY}`,
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
                body: JSON.stringify(payload),
              });
              const data = await res.json();
              return {
                results: data,
              };
            },
          }),
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
              const hash = new Set();
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

              const points = rawJsonResponses.map((res, idx) => {
                return {
                  is_main: locations[idx].map_centered_here,
                  lat: res.results[0].geometry.lat,
                  lng: res.results[0].geometry.lng,
                  location: res.results[0].formatted,
                };
              });

              const uniquePoints = points.filter((point) => {
                if (hash.has(point.location)) {
                  return false;
                }
                hash.add(point.location);
                return true;
              });

              return {
                points: uniquePoints,
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

      console.log("Creating message with:", {
        conversationId: input.conversationId,
        hasConversation: !!conversation,
        userId: ctx.auth.user.id,
      });
      await prismaClient.$transaction([
        input.pending_message_id
          ? prismaClient.message.update({
              data: {
                status: "PROCESSED",
                conversationsId: conversation.id,
              },
              where: {
                id: input.pending_message_id,
              },
            })
          : prismaClient.message.create({
              data: {
                role: "USER",
                content: input.query,
                toolCalls: [].join(""),
                conversationsId: conversation.id,
                cost: "0",
                totalCost: "0",
                status: "PROCESSED",
              },
            }),
        prismaClient.message.create({
          data: {
            role: "ASSISTANT",
            content: messageContent,
            toolCalls: JSON.stringify(toolCalls),
            conversationsId: input.conversationId,
            status: "PROCESSED",
            // TODO: Add cost calculation
            cost: "0",
            totalCost: "0",
          },
        }),
      ]);
    }),
});
