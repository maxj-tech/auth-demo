import React from 'react'
import { CardWrapper } from './card-wrapper'

export const LoginForm = () => {
  return (
    <CardWrapper
      headerLabel='Welcome to Auth App'
      backButtonLabel='No Account? Sign Up.'
      backButtonHref='/auth/signup'
      showSocial
     >     
     Login Form 
    </CardWrapper>
  )
}