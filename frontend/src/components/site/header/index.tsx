import LinkButton from '@/components/shared/button'
import styles from './style.module.scss'
import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logolink}>
        <Image
          src="/sumzy.svg"
          alt="Sumzy logo"
          width={40}
          height={40}
          priority
        />
        <span>sumzy</span>
      </Link>
      <LinkButton href="/login">login</LinkButton>
    </header>
  )
}