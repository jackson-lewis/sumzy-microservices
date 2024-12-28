import Money from '@/components/global/money'
import useExpenses from '@/lib/use-transactions'

export default function Category({
  categoryId,
  total
}: {
  categoryId: number
  total: number
}) {
  const { categories } = useExpenses()

  const category = categories.find((category) => {
    return category.id === categoryId
  })

  return (
    <div>
      <h3>{category?.name}</h3>
      <Money amount={total} />
    </div>
  )
}