'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema } from '@/schemas'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { CardWrapper } from './card-wrapper'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { FormError } from '../form-error'
import { FormSuccess } from '../form-success'
import { login } from '@/actions/login'
import { useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export const LoginForm = () => {
  const searchParams = useSearchParams()

  // yes, here we show an error instead of doing account linking
  // see https://authjs.dev/concepts/faq for more info
  const urlError = searchParams.get('error') === 'OAuthAccountNotLinked'
    ? 'Email already in use (maybe with different provider?).'
    : ''
  
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  // const [isPending, startTransition] = useTransition()
  const [pending, setPending] = useState(false)
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
      code: '',
    }
  })

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError('')
    setSuccess('')
    setPending(true)

      login(values)
        .then((data) => {
          if (data?.error) {
            form.reset()
            // form.reset({ ...form.getValues(), code: '' }); // Reset only the code field if necessary
            setError(data.error)
          }
          if (data?.success) {
            form.reset()
            setSuccess(data.success)   
          }
          if (data?.twoFactor) {
            setShowTwoFactor(true)
          }
        }) .catch(() => setError('Something went wrong'))
        .finally(() => setPending(false))

    
  }

  return (
    <CardWrapper
      headerLabel='Welcome to Auth App'
      backButtonLabel='No Account? Register here.'
      backButtonHref='/auth/register'
      showSocial
     >     
     <Form {...form} >
      <form 
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6'
      >
        <div className='space-y-4'>

          { showTwoFactor && (
            <FormField 
              control={form.control}
              name='code'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Authentication Code</FormLabel>
                  <FormControl >
                    <Input 
                      {...field}
                      disabled={pending}
                      placeholder='123456'
                    />
                  </FormControl> 
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          { !showTwoFactor && (
          <>          
          <FormField 
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl >
                  <Input 
                    {...field}
                    disabled={pending}
                    placeholder='john.doe@example.com'
                    type='email'
                  />
                </FormControl> 
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField 
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl >
                  <Input 
                    {...field}
                    disabled={pending}
                    placeholder='********'
                    type='password'
                  />
                </FormControl> 
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            size='sm'
            variant='link'
            asChild
            className='px-0 font-normal'
          >
            <Link href='/auth/reset-password'>
              Forgot password?
            </Link>
          </Button>
          </>
          )}
        </div>
      
        <FormError message={error || urlError} />
        <FormSuccess message={success} />
        <Button
          disabled={pending}
          type='submit'
          size='lg'       
          className='w-full' 
        >
          { showTwoFactor ? 'Confirm' : 'Login' }
        </Button>
      </form>
     </Form>
    </CardWrapper>
  )
}