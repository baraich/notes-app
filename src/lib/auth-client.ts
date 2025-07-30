import { organization } from "better-auth/plugins";
import { createAuthClient } from "better-auth/react";
import { env } from "../env";

export const authClient = createAuthClient({
  baseURL: process.env.VERCEL_URL ?? env.NEXT_PUBLIC_BASE_URL!,
  plugins: [organization()],
});
