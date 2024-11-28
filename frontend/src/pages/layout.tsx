import CategoriesProvider from '@/lib/expense-context'
import { isUserLoggedIn } from '@/lib/user'
import { Link, Outlet } from 'react-router-dom'

export default function Layout() {
    return (
        <CategoriesProvider>
            <header>
                <Link to="/">Finance Tracker</Link>
                <nav>
                    <ul>
                        <li>
                            <Link to="/expenses">Expenses</Link>
                            <ul>
                                <li>
                                    <Link to="/expenses/recurring">Recurring</Link>
                                </li>
                                <li>
                                    <Link to="/expenses/categories">Categories</Link>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <Link to="/reports">Reports</Link>
                        </li>
                        {isUserLoggedIn() ? (
                          <li>
                            <Link to="/account">Account</Link>
                          </li>
                        ) : (
                          <li>
                            <Link to="/login">Login</Link>
                          </li>
                        )}
                    </ul>
                </nav>
            </header>
            <Outlet />
        </CategoriesProvider>
    )
}