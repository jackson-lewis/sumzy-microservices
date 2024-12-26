import AddCategory from '@/components/categories/add'
import CategoriesList from '@/components/categories/list'
import useExpenses from '@/lib/use-expenses'

export default function IncomeCatgories() {
  const { categories, setCategories } = useExpenses()

  return (
    <main>
      <h1>Income categories</h1>
      <AddCategory setCategories={setCategories} direction="income" />
      <CategoriesList
        categories={categories}
        setCategories={setCategories}
        />
    </main>
  )
}