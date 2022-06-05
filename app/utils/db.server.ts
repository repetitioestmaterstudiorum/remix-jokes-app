import { PrismaClient } from "@prisma/client";

// note: because of the `.server.ts` ending of the filename, this will not be included in the build (esbuild specific)

const db: PrismaClient =
  process.env.NODE_ENV === "production" ? new PrismaClient() : getDevDb();

// unfortunately, this can't be run inside getDevDb() and will therefore also be run in production
declare global {
  var __db: PrismaClient | undefined;
}

function getDevDb() {
  if (!global.__db) {
    global.__db = new PrismaClient();
  }
  return global.__db;
}

export { db };
