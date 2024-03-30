import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
    adapter: PrismaAdapter(db),
    // with Prisma we cannot use the default session adapter as it uses a database
    // to store the session, which does not work on the edge
    session: { strategy: "jwt" }, 
    ...authConfig,
})