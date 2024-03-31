import { v4 as uuidv4 } from "uuid"

import { db } from "@/lib/db"
import { getVerificationTokenByEmail } from "@/data/verification-token"

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4()

  // expires in 1 hour from now
  const expires = new Date(new Date().getTime() + 3_600 * 1_000)

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

  return verficationToken
}