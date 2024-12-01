import DateSelector from '@/components/expenses/dialog/date-selector'
import CurrencyInput from '@/components/global/currency-input'
import { getFormDataAs } from '@/lib/form-submit'
import { createIncome } from '@/lib/income'
import { sortTransactionsByDate } from '@/lib/shared'
import { Income, TransactionType } from '@/types'
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react'

export default function CreateIncome({
  setIncomes
} : {
  setIncomes: Dispatch<SetStateAction<Income[]>>
}) {
  const [type, setType] = useState<'one_time' | 'recurring'>('one_time')

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()

        const form = event.target as HTMLFormElement
        const data = getFormDataAs(form, 'income')

        const apiData = await createIncome(data)

        if (apiData instanceof Error) {
          console.error(apiData.message)
          return
        }

        setIncomes((incomes) => {
          const newIncomes: Income[] = [
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
              setType(event.target.value as TransactionType)
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
              setType(event.target.value as TransactionType)
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