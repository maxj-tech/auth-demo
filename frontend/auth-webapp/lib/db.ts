import { PrismaClient } from "@prisma/client"

/*  we do this to avoid running out of database connections
    during development, when next.js does hot reloading on every change */
declare global {  // global is not affected by hot reloading
  var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") 
  globalThis.prisma = db