import { UserRole } from '@prisma/client'
import NextAuth, { type Session } from 'next-auth'

// Module augmentation to solve typescript errors
// see https://authjs.dev/getting-started/typescript#module-augmentation
declare module 'next-auth' {
  interface Session {
    user: ExtendedUser
  }
}

export type ExtendedUser = Session['user'] & {
  role: UserRole
  image: sring
  isTwoFactorAuthEnabled: boolean
}