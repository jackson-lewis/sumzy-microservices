import AddCategory from '@/components/categories/add'
import CategoriesList from '@/components/categories/list'
import useCategories from '@/lib/use-categories'

export default function ExpenseCatgories() {
  const { categories, setCategories } = useCategories()

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