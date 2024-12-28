import AddCategory from '@/components/categories/add'
import CategoriesList from '@/components/categories/list'

export default function TransactionCategories() {
  return (
    <>
      <h1>Categories</h1>
      <AddCategory />
      <CategoriesList />
    </>
  )
}