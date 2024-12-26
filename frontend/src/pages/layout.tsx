import DashboardHeader from '@/components/layout/header'
import MobileNavBar from '@/components/layout/mobile-nav-bar'
import TransactionDialog from '@/components/transaction/dialog'
import CategoriesProvider from '@/lib/expense-context'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <CategoriesProvider>
      <DashboardHeader />
      <MobileNavBar />
      <Outlet />
      <TransactionDialog />
    </CategoriesProvider>
  );
}
