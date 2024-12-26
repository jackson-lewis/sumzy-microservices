import DateSelector from '@/components/expenses/dialog/date-selector'
import CurrencyInput from '@/components/global/currency-input'
import { getFormData } from '@/lib/form-submit'
import { createIncome } from '@/lib/income'
import { sortTransactionsByDate } from '@/lib/shared'
import { Transaction, TransactionFrequency } from '@/types'
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react'

export default function CreateIncome({
  setIncomes
} : {
  setIncomes: Dispatch<SetStateAction<Transaction[]>>
}) {
  const [type, setType] = useState<'one_time' | 'recurring'>('one_time')

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()

        const form = event.target as HTMLFormElement
        const data = getFormData(form)

        const apiData = await createIncome(data)

        if (apiData instanceof Error) {
          console.error(apiData.message)
          return
        }

        setIncomes((incomes) => {
          const newIncomes: Transaction[] = [
            ...incomes,
            apiData
          ]

          return newIncomes.sort(sortTransactionsByDate)
        })
      }}
    >
      <div>
        <div>
          <input
            type="radio"
            name="type"
            value="one_time"
            id="type-one_time"
            checked={type === 'one_time'}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setType(event.target.value as TransactionFrequency)
            }}
          />
          <label htmlFor="type-one_time">One-time</label>
        </div>
        <div>
          <input
            type="radio"
            name="type"
            value="recurring"
            id="type-recurring"
            checked={type === 'recurring'}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setType(event.target.value as TransactionFrequency)
            }}
          />
          <label htmlFor="type-recurring">Recurring</label>
        </div>
      </div>
      <CurrencyInput />
      <DateSelector />
      <button>Add</button>
    </form>
  )
}