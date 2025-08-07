import "server-only";
import { cache } from "react";
import { makeQueryClient } from "./query-client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { createTRPCContext } from "./init";
import { appRouter } from "./routers/_app";
import { headers } from "next/headers";

export const getQueryClient = cache(makeQueryClient);
export const trpc = createTRPCOptionsProxy({
  router: appRouter,
  ctx: async () => createTRPCContext(await headers()),
  queryClient: getQueryClient,
});

export const caller = appRouter.createCaller(async () =>
  createTRPCContext(await headers()),
);
