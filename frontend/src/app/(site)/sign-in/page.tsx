import { Metadata } from 'next'
import SignInForm from '@/components/site/sign-in/form'

export const metadata: Metadata = {
  title: 'Sign In to Sumzy'
}

export default function SignIn() {
  return (
    <main>
      <SignInForm />
    </main>
  )
}