import type { NextAuthConfig } from "next-auth"
import bcrypt from "bcryptjs"
import Credentials from "next-auth/providers/credentials"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"

import { LoginSchema } from "@/schemas"
import { getUserByEmail } from "./data/user"

/*  "Edge Compatibility" 
    see https://authjs.dev/guides/upgrade-to-v5#edge-compatibility
    Middleware works on the edge, but we use Prisma which does not.
    So we need to seperate the auth config and use that file to trigger
    the middleware instead of the auth config,
    where we will use the Prisma client.
*/
export default {
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {     
        const validatedFields = LoginSchema.safeParse(credentials)

        if (!validatedFields.success) return null

        const { email, password } = validatedFields.data
        const user = await getUserByEmail(email)
        if (!user || !user.password) return null

        const pswdMatches = await bcrypt.compare(password, user.password)
        
        if (pswdMatches) return user

        return null
      }
    })
  ],
} satisfies NextAuthConfig