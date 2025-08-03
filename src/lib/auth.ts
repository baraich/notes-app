import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prismaClient } from "./prisma-client";
import { env } from "@/env";

export const auth = betterAuth({
  database: prismaAdapter(prismaClient, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
  },
  baseURL: !!process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : env.NEXT_PUBLIC_BASE_URL!,
  plugins: [organization(), nextCookies()],
});
