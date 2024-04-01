import { v4 as uuidv4 } from 'uuid'

import { db } from '@/lib/db'
import { getVerificationTokenByEmail } from '@/data/verification-token'
import { getPasswordResetTokenByEmail } from '@/data/password-reset-token'
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token'
import { randomInt } from 'crypto'

export const generateTwoFactorToken = async (email: string) => {
  const token = randomInt(100_000, 1_000_000).toString()

  // expires in 5 minutes from now
  const expires = new Date(new Date().getTime() + 5 * 60 * 1_000)

  const existingToken = await getTwoFactorTokenByEmail(email)

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      }
    })
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    }
  })

  return twoFactorToken
}

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4()

  // expires in 1 hour from now
  const expires = new Date(new Date().getTime() + 60 * 60 * 1_000)

  const existingToken = await getVerificationTokenByEmail(email)

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    })
  }

  const verficationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    }
  })

  console.debug('Generated verification token:', verficationToken)
  return verficationToken
}


export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4()
  
  // expires in 1 hour from now
  const expires = new Date(new Date().getTime() + 60 * 60 * 1_000)

  const existingToken = await getPasswordResetTokenByEmail(email)

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id }
    })
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires
    }
  })

  return passwordResetToken
}