import AddCategory from '@/components/categories/add'
import CategoriesList from '@/components/categories/list'
import useExpenses from '@/lib/use-expenses'

export default function ExpenseCatgories() {
  const { categories, setCategories } = useExpenses()

  return (
    <main>
      <h2>New expense category</h2>
      <AddCategory setCategories={setCategories} />
      <CategoriesList
        categories={categories}
        setCategories={setCategories}
        />
    </main>
  )
}