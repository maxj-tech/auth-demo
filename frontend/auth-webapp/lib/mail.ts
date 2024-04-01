import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendTwoFactorTokenEmail = 
  async (email: string, token: string) => {
    
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Auth Demo - Two Factor Authentication Code',
    html: `<p>Your 2 factor authentication code: ${token}</p>`
  })
}

export const sendVerificationEmail = 
  async (email: string, token: string) => {

    const confirmLink = 
      `http://localhost:3000/auth/new-verification?token=${token}`

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Auth Demo - Verify your email',
      html: `<p>Click <a href='${confirmLink}'>here</a> to confirm email.</p>`,
    })
  }

  export const sendPasswordResetEmail = 
    async ( email: string, token: string ) => {

    const resetLink = 
      `http://localhost:3000/auth/new-password?token=${token}`
  
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Auth Demo - Reset your password',
      html: `<p>Click <a href='${resetLink}'>here</a> to reset your password.</p>`
    })
  }