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
  categories: Report['tCategories']
}) {
  const { categories: userCategories } = useExpenses()

  function getCategoriesWithAmount() {
    return userCategories
      .map((category) => {
        return {
          ...category,
          amount: categories[category.id] || 0
        }
      })
      .sort((a, b) => {
        return a.amount > b.amount ? -1 : 1
      })
  }
  const categoriesWithAmount = getCategoriesWithAmount()

  return (
    <div>
      <CategoryGroup categories={categoriesWithAmount} title="Categories" />
    </div>
  )
}