import { PrismaClient } from "@/generated/prisma";

const globalPrismaClient = global as unknown as {
  prismaClient: PrismaClient;
};

export const prismaClient =
  globalPrismaClient.prismaClient || new PrismaClient();

if (process.env.NODE_ENV !== "production")
  globalPrismaClient.prismaClient = prismaClient;
