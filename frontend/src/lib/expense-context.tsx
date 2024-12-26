import { Category, Transaction, TransactionDialogSetup, TransactionDirection, TransactionFrequency } from '@/types'
import {
  createContext,
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from 'react'
import { getCategories } from './category'
import { getExpenses } from './expense'


export const ExpenseContext = createContext<{
  expenses: Transaction[]
  setExpenses: Dispatch<SetStateAction<Transaction[]>>
  transaction: Transaction | undefined
  setTransaction: Dispatch<SetStateAction<Transaction | undefined>>
  transactionSetup: TransactionDialogSetup
  setTransactionSetup: Dispatch<SetStateAction<TransactionDialogSetup>>
  categories: Category[]
  setCategories: Dispatch<SetStateAction<Category[]>>
  dialogRef: RefObject<HTMLDialogElement>
  showEditModal: (
    direction?: TransactionDirection,
    frequency?: TransactionFrequency,
    transaction?: Transaction
  ) => void
  closeEditModal: () => void
} | null>(null)

export default function ExpenseProvider({
  children
}: {
  children: ReactNode
}) {
  const [expenses, setExpenses] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const [transaction, setTransaction] = useState<Transaction>()
  const [transactionSetup, setTransactionSetup] = useState<
    TransactionDialogSetup
  >([undefined, undefined])

  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    async function getData() {
      const expenses = await getExpenses()
      if (Array.isArray(expenses)) {
        setExpenses(expenses)
      }

      if (expenses instanceof Error) {
        alert(expenses.message)
      }
    }
    getData()
  }, [])

  useEffect(() => {
    async function getData() {
      const local = localStorage.getItem('categories')

      if (local) {
        setCategories(JSON.parse(local))
        return
      }

      const categories = await getCategories()

      if (Array.isArray(categories)) {
        localStorage.setItem('categories', JSON.stringify(categories))
        setCategories(categories)
      }

      if (categories instanceof Error) {
        alert(categories.message)
      }
    }
    getData()
  }, [])

  function showEditModal(
    direction?: TransactionDirection,
    frequency?: TransactionFrequency,
    transaction?: Transaction
  ) {
    const dialog = dialogRef.current

    if (!dialog) {
      console.log('dialog not found')
      return
    }

    setTransactionSetup((setup) => {
      if (direction) {
        setup[0] = direction
      }
      if (frequency) {
        setup[1] = frequency
      }
      return [...setup]
    })

    setTransaction(transaction)

    dialog.showModal()
  }

  function closeEditModal() {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    dialog.close()
  }

  /**
   * Each time cateogories is modified, update the local storage
   */
  useEffect(() => {
    if (categories.length) {
      localStorage.setItem('categories', JSON.stringify(categories))
    }
  }, [categories])

  return (
    <ExpenseContext.Provider value={{
      transaction,
      setTransaction,
      transactionSetup,
      setTransactionSetup,
      expenses,
      setExpenses,
      categories,
      setCategories,
      dialogRef,
      showEditModal,
      closeEditModal
    }}>
      {children}
    </ExpenseContext.Provider>
  )
}