import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import { getUserById } from "./data/user"
import { UserRole } from '@prisma/client';



// Module augmentation to solve typescript errors
// see https://authjs.dev/getting-started/typescript#module-augmentation
declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole  // add role to the session's user
    }
  }
}

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
          session.user.role = token.role as UserRole; 
        }

        return session // always return what goes in from the callback
      }
    },

    // see https://authjs.dev/guides/basics/events
    events: {

      // https://authjs.dev/guides/basics/events#linkaccount
      /*  idea
       *  if this event is triggered, we can assume that the user has just used
       *  a social login (i.e. OAuth provider) for which we don't actually need
       *  to verify the email address, as the OAuth provider has already done that.
       *  So we can just set the emailVerified field to the current date.
       */
      async linkAccount({ user }) {
        await db.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() }
        })
      }
    },
    pages: {
      signIn: "/auth/login",
      error: "/auth/error",
    },
    adapter: PrismaAdapter(db),
    // with Prisma we cannot use the default session adapter as it uses a database
    // to store the session, which does not work on the edge
    session: { strategy: "jwt" }, 
    ...authConfig,
})