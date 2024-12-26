import Money from '@/components/global/money'
import useExpenses from '@/lib/use-expenses'
import { Category, Report, TransactionFrequency } from '@/types'
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
            <Fragment key={category.id}>
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
  categories: Report['tExpenseCats']
}) {
  const { categories: userCategories } = useExpenses()

  function getCategoriesByType(type: TransactionFrequency) {
    return userCategories
      .map((category) => {
        return {
          ...category,
          amount: categories[category.id] || 0
        }
      })
  }

  const recurringCategories = getCategoriesByType('recurring')
  const oneTimeCategories = getCategoriesByType('one_time')

  return (
    <div>
      <CategoryGroup categories={oneTimeCategories} title="One Time Expenses" />
      <CategoryGroup categories={recurringCategories} title="Recurring Expenses" />
    </div>
  )
}