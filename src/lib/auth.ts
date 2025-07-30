import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prismaClient } from "./prisma-client";

export const auth = betterAuth({
  database: prismaAdapter(prismaClient, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [organization(), nextCookies()],
});
