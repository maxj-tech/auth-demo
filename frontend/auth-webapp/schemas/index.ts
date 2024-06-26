import * as z from 'zod'

export const NewPasswordSchema = z.object({
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long'
  }),
})



export const ResetSchema = z.object({
  email: z.string().email({
    message: 'Valid Email address is required'
  }),
})

export const LoginSchema = z.object({  
  email: z.string().email({
    message: 'Valid Email address is required'
  }),
  password: z.string().min(1, {
    message: 'Password is required' 
  }),
  code: z.optional(z.string()),
})

export const RegisterSchema = z.object({  
  email: z.string().email({
    message: 'Valid Email address is required'
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long' 
  }),
  name: z.string().min(1, {
    message: 'Name is required' 
  }),
})