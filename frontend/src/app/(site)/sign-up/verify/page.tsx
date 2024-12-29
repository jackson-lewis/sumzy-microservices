import styles from './page.module.scss'

export default function SignUpVerify() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1>Verify your email</h1>
        <p>
          We&apos;ve sent you an email with a link to verify your email address. Click the link in the email to verify your email address.
        </p>
      </div>
    </main>
  )
}