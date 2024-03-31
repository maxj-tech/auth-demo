'use server'

import { db } from '@/lib/db'
import { getUserByEmail } from '@/data/user'
import { getVerificationTokenByToken } from '@/data/verification-token'

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token)

  if (!existingToken) {
    return { error: 'Verification Token does not exist.' }
  }

  const hasExpired = new Date(existingToken.expires) < new Date()

  if (hasExpired) {
    return { error: 'Verification Token has expired.' }
  }

  const existingUser = await getUserByEmail(existingToken.email)

  if (!existingUser) {
    return { error: 'Email does not exist.' }
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: { 
      emailVerified: new Date(),
      email: existingToken.email, // for later when a user changes his email
    }
  })

  if (process.env.NODE_ENV === 'production') {
    await db.verificationToken.delete({
      where: { id: existingToken.id }
    })
  } else {  
    // dev: this action is called twice from new-verification-form.tsx
    setTimeout(async () => {
      const existingToken = await getVerificationTokenByToken(token)
      if (existingToken)
        await db.verificationToken.delete({
          where: { id: existingToken.id }
        })
    }, 1_000)  // 1s
  }

  return { success: 'Email verified!' }
}
