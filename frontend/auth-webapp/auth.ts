import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import { getUserById } from "./data/user"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
    // see https://authjs.dev/guides/basics/callbacks
    callbacks: {
      async jwt({ token }) {
        console.info("jwt callback:", { token })
        if (token.sub) {

  // due to such db calls in the callbacks using prismas adapter, we had
  // to split auth.ts / auth.config.ts as prisma does not work on the edge
          const existingUser = await getUserById(token.sub)
          if (existingUser)
            token.role = existingUser.role
          token.id = token.sub // added to token
        }        
        return token // always return what goes in from the callback
      },
      async session({ token, session }) {
        console.info("session callback:", { session }, { sessionToken: token })
        
        if (token.sub && session.user) {
          session.user.id = token.sub // added to session.user
        }

        if (token.role && session.user) {
          // fixme we need to add the role to the session type       
          session.user.role = token.role  
        }

        return session // always return what goes in from the callback
      }
    },
    adapter: PrismaAdapter(db),
    // with Prisma we cannot use the default session adapter as it uses a database
    // to store the session, which does not work on the edge
    session: { strategy: "jwt" }, 
    ...authConfig,
})