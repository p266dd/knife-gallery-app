import { PrismaClient } from "./prisma/client";

let prisma;

// * Singleton pattern.
function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

export default getPrismaClient();
