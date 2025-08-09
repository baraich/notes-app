import { createTRPCRouter } from "../init";
import { conversationsRouter } from "./conversations-router";
import { documentsRouter } from "./documents-router";
import { streamingRouter } from "./streaming-router";

export const appRouter = createTRPCRouter({
  stream: streamingRouter,
  conversations: conversationsRouter,
  documents: documentsRouter,
});
export type AppRouter = typeof appRouter;
