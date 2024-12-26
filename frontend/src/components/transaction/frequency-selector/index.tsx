import { TransactionDirection } from '@/types'
import { Link, useLocation } from 'react-router-dom'
import styles from './style.module.scss'

export default function FrequencySelector({
  direction
} : {
  direction: TransactionDirection
}) {
  const path = direction === 'expense' ? 'expenses' : 'income'
  const location = useLocation()

  return (
    <div className={styles.selector}>
      <Link
        to={`/${path}`}
        aria-current={location.pathname === `/${path}` ? 'page' : false}
      >
        One time
      </Link>
      <Link
        to={`/${path}/recurring`}
        aria-current={location.pathname === `/${path}/recurring` ? 'page' : false}
      >
        Recurring
      </Link>
    </div>
  )
}