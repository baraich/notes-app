import { createTRPCRouter } from "../init";
import { messagesRouter } from "./messages-router";

export const streamingRouter = createTRPCRouter({
  messages: messagesRouter,
});
