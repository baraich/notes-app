import { createTRPCRouter } from "../init";
import { conversationsRouter } from "./conversations-router";
import { streamingRouter } from "./streaming-router";

export const appRouter = createTRPCRouter({
  stream: streamingRouter,
  conversations: conversationsRouter,
});
export type AppRouter = typeof appRouter;
