import { env } from "@/env";
import { PrismaClient } from "@/generated/prisma";

const globalPrismaClient = global as unknown as {
  prismaClient: PrismaClient;
};

const makePrismaClient = (): PrismaClient => {
  return new PrismaClient();
};

export const prismaClient =
  globalPrismaClient.prismaClient || makePrismaClient();

if (process.env.NODE_ENV !== "production")
  globalPrismaClient.prismaClient = prismaClient;
