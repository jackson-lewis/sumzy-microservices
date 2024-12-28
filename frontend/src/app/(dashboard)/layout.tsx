import { SWRConfig } from 'swr'
import MobileNavBar from '@/components/layout/mobile-nav-bar'
import TransactionsProvider from '@/lib/transactions-context'
import TransactionDialog from '@/components/transaction/dialog'
import styles from './layout.module.scss'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SWRConfig>
      <TransactionsProvider>
        <main className={styles.main}>
          {children}
        </main>
        <TransactionDialog />
        <MobileNavBar />
      </TransactionsProvider>
    </SWRConfig>
  )
}