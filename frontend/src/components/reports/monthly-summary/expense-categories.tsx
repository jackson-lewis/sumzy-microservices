import Money from '@/components/global/money'
import { Category, Report } from '@/types'
import { Fragment } from 'react/jsx-runtime'
import styles from './style.module.scss'
import { useCategories } from '@/lib/swr'


function CategoryGroup({
  categories,
  title
} : {
  categories: Category[]
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
  categoryTotals
} : {
  categoryTotals: Report['tCategories']
}) {
  const { data: categories } = useCategories()

  if (!categories) {
    return <p>Failed to load categories.</p>
  }

  function getCategoriesWithAmount(): Category[] {
    if (!categories) {
      return []
    }
    
    return categories
      .map((category) => {
        return {
          ...category,
          amount: categoryTotals[category.id] || 0
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