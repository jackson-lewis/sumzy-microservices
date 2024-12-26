import ExpenseDialog from '@/components/expenses/dialog'
import DashboardHeader from '@/components/layout/header'
import MobileNavBar from '@/components/layout/mobile-nav-bar'
import CategoriesProvider from '@/lib/expense-context'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <CategoriesProvider>
      <DashboardHeader />
      <MobileNavBar />
      <Outlet />
      <ExpenseDialog />
    </CategoriesProvider>
  );
}
