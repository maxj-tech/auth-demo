"use server"

import * as z from 'zod'

import { LoginSchema } from '@/schemas'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { AuthError } from 'next-auth'
import { signIn } from '@/auth'
import { getUserByEmail } from '@/data/user'
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/mail'

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { email, password } = validatedFields.data

  const existingUser = await getUserByEmail(email)

  if (!existingUser || !existingUser.email)
    return { error: "Invalid credentials!" }

  if (!existingUser.password)
    return { error: "Login via Github or Google!" }

  if (!existingUser.emailVerified){
    const verifyToken = await generateVerificationToken(
      existingUser.email
    )

    await sendVerificationEmail(verifyToken.email, verifyToken.token)

    return { error: "Email not yet verified! New verification email sent." }
  }
    

  

  try {
    const result = await signIn("credentials", {
      email,
      password,
      // explicit though redundant to middleware.ts and auth.config.ts
      redirectTo: DEFAULT_LOGIN_REDIRECT, 
    })
    return { success: result ? "Login successful!" : undefined }

  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" }
        default:
          return { error: "Something went wrong!" }
      }
    }

    // without this, it will not redirect
    throw error
  }
}

