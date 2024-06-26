import NextAuth from 'next-auth'
import authConfig from '@/auth.config'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'
import { getUserById } from '@/data/user'
import { UserRole } from '@prisma/client'
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation'


export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
    // see https://authjs.dev/guides/basics/callbacks
    callbacks: {
      async jwt({ token }) {
        console.info('jwt callback:', { token })

        if (token.sub) {

  // due to such db calls in the callbacks using prismas adapter, we had
  // to split auth.ts / auth.config.ts as prisma does not work on the edge
          const existingUser = await getUserById(token.sub)
          if (existingUser) {
            token.role = existingUser.role
            token.isTwoFactorAuthEnabled = existingUser.isTwoFactorAuthEnabled
          }         
        }        
        return token // always return what goes in from the callback
      },

      async session({ token, session }) {
        console.info('session callback:', { session }, { sessionToken: token })
        
        if (session.user) {

          if (token.sub) {
            session.user.id = token.sub // added to session.user
          }

          if (token.role) {
            // fixme we need to add the role to the session type       
            session.user.role = token.role as UserRole
          }

          session.user.isTwoFactorAuthEnabled = token.isTwoFactorAuthEnabled as boolean
        }        

        return session // always return what goes in from the callback
      },

      // even though we check this in the login action already,
      // we should also check here if a user is allowed to sign in
      async signIn({ user, account }) {
        console.info('signIn callback:', { user, account })

        // Allow OAuth without email verification
        if (account?.provider !== 'credentials') return true
  
        const existingUser = await getUserById(user.id ?? '')
  
        // Prevent sign in without email verification
        if (!existingUser?.emailVerified) return false
  

        if (existingUser.isTwoFactorAuthEnabled) {
          // todo don't bother the user with 2FA on every sign in
          const twoFactorConfirmation = 
            await getTwoFactorConfirmationByUserId(existingUser.id)
  
          console.debug('twoFactorConfirmation:', twoFactorConfirmation)
          
          if (!twoFactorConfirmation) return false
  
          // Delete two factor confirmation for next sign in
          await db.twoFactorConfirmation.delete({
            where: { id: twoFactorConfirmation.id }
          })
        }
        
        return true
      },
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
      signIn: '/auth/login',
      error: '/auth/error',
    },
    adapter: PrismaAdapter(db),
    // with Prisma we cannot use the default session adapter as it uses a database
    // to store the session, which does not work on the edge
    session: { strategy: 'jwt' }, 
    ...authConfig,
})