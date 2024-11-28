import Money from '@/components/global/money'
import useExpenses from '@/lib/use-expenses'

export default function Category({
  categoryId,
  total
}: {
  categoryId: string
  total: number
}) {
  const { categories } = useExpenses()

  const category = categories.find((category) => {
    return category._id === categoryId
  })

  return (
    <div>
      <h2>{category?.name}</h2>
      <Money amount={total} />
    </div>
  )
}