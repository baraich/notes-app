import { createTRPCRouter } from "../init";
import { conversationsRouter } from "./converstations-router";

export const appRouter = createTRPCRouter({
  conversations: conversationsRouter,
});
export type AppRouter = typeof appRouter;
