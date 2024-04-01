'use server'

import * as z from 'zod'
import bcrypt from 'bcryptjs'

import { NewPasswordSchema } from '@/schemas'
import { getPasswordResetTokenByToken } from '@/data/password-reset-token'
import { getUserByEmail } from '@/data/user'
import { db } from '@/lib/db'

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema> ,
  token?: string | null,
) => {
  if (!token) {
    return { error: 'Missing password reset token!' }
  }

  const validatedFields = NewPasswordSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { password } = validatedFields.data

  const existingToken = await getPasswordResetTokenByToken(token)

  if (!existingToken) {
    return { error: 'Invalid password reset token!' }
  }

  const hasExpired = new Date(existingToken.expires) < new Date()

  if (hasExpired) {
    return { error: 'Password reset token has expired!' }
  }

  const existingUser = await getUserByEmail(existingToken.email)

  if (!existingUser) {
    return { error: 'Email does not exist!' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  })


  if (process.env.NODE_ENV === 'production') {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id }
    })
  } else {  
    // dev: this action is called twice from new-password-form.tsx
    setTimeout(async () => {
      const existingToken = await getPasswordResetTokenByToken(token)
      if (existingToken)
        await db.passwordResetToken.delete({
          where: { id: existingToken.id }
        })
    }, 1_000)  // 1s
  }

  

  return { success: 'Password updated!' }
}