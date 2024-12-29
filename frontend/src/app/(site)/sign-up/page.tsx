import { Metadata } from 'next'
import SignUpForm from '@/components/site/sign-up/form'

export const metadata: Metadata = {
  title: 'Sign Up to Sumzy'
}

export default function SignUp() {
  return (
    <main style={{
      display: 'grid',
      alignItems: 'center'
    }}>
      <SignUpForm />
    </main>
  )
}