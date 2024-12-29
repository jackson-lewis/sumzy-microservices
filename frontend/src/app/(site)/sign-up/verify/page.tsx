import VerifyMessage from '@/components/site/verify'
import styles from './page.module.scss'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verify your email ~ Sumzy',
  robots: 'noindex, nofollow'
}

export default function SignUpVerify() {
  return (
    <main className={styles.main}>
      <VerifyMessage />
    </main>
  )
}