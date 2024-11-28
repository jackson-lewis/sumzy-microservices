import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom'
import Login from './pages/login'
import Layout from './pages/layout'
import Expenses from './pages/expenses'
import { isUserLoggedIn } from './lib/user'
import Account from './pages/account'
import ExpenseCatgories from './pages/expenses/categories'
import RecurringExpenses from './pages/expenses/recurring'
import Reports from './pages/reports'
import Income from './pages/income'
// import { promises } from 'fs'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// async function getPages() {
//   const entries = await promises.readdir('./src/pages', { withFileTypes: true })
//   const directories = entries
//     .filter((entry) => entry.isFile())
//     .map((entry) => entry.name)

//   console.log(directories)
// }

// getPages()

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'expenses',
        element: <Expenses />,
        loader: () => {
          if (!isUserLoggedIn()) {
            return redirect('/login?next=/expenses')
          }
          return null
        },
      },
      {
        path: 'expenses/recurring',
        element: <RecurringExpenses />,
        loader: () => {
          if (!isUserLoggedIn()) {
            return redirect('/login?next=/expenses/recurring')
          }
          return null
        }
      },
      {
        path: 'expenses/categories',
        element: <ExpenseCatgories />,
        loader: () => {
          if (!isUserLoggedIn()) {
            return redirect('/login?next=/expenses')
          }
          return null
        }
      },
      {
        path: 'income',
        element: <Income />,
        loader: () => {
          if (!isUserLoggedIn()) {
            return redirect('/login?next=/income')
          }
          return null
        },
      },
      {
        path: 'reports',
        element: <Reports />,
        loader: () => {
          if (!isUserLoggedIn()) {
            return redirect('/login?next=/reports')
          }
          return null
        }
      },
      {
        path: 'account',
        element: <Account />,
        loader: () => {
          if (!isUserLoggedIn()) {
            return redirect('/login?next=/account')
          }
          return null
        }
      },
      {
        path: 'login',
        element: <Login />
      }
    ]
  },
  
])

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export {}