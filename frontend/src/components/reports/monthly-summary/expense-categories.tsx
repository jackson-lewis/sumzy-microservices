import Money from '@/components/global/money'
import useExpenses from '@/lib/use-expenses'
import { Category, Report } from '@/types'
import { Fragment } from 'react/jsx-runtime'
import styles from './style.module.scss'


function CategoryGroup({
  categories,
  title
} : {
  categories: (Category & { amount: number })[]
  title: string
}) {
  return (
    <>
      <h2>{title}</h2>
      <dl className={styles['expense-categories']}>
        {categories.map((category) => {
          if (category.amount === 0) {
            return null
          }

          return (
            <Fragment key={category._id}>
              <dt>{category?.name}</dt>
              <dd>
                <Money amount={category.amount} />
              </dd>
            </Fragment>
          )
        })}
      </dl>
    </>
  )
}

export default function ExpenseCategories({
  categories
} : {
  categories: Report['totals']['expenseCategories']
}) {
  const { categories: userCategories } = useExpenses()

  const groupedSpending = [
    '673a3a9a7ef89306638ade50',
    '673a3c42759f61937acce663'
  ]

  const recurringGroup = [
    '6742098453c7473c5b3c7f6b',
    '6742098853c7473c5b3c7f6d'
  ]

  const recurringCategories = userCategories
    .filter((category) => {
      return recurringGroup.indexOf(category._id) >= 0
    })
    .map((category) => {
      return {
        ...category,
        amount: categories[category._id] || 0
      }
    })

  const oneTimeCategories = userCategories
    .filter((category) => {
      return recurringGroup.indexOf(category._id) < 0
    })
    .map((category) => {
      return {
        ...category,
        amount: categories[category._id] || 0
      }
    })

  return (
    <div>
      <CategoryGroup categories={oneTimeCategories} title="One Time Expenses" />
      <CategoryGroup categories={recurringCategories} title="Recurring Expenses" />
    </div>
  )
}