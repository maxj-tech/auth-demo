'use server'

import { signOut } from '@/auth'

export const logout = async () => {
  // here you could do some server side logic before signing out
  await signOut()
}