import { ChangeEvent, useEffect, useState } from 'react'
import styles from './style.module.scss'

export default function DateSelector({
  value
} : {
  value?: Date
}) {
  const [date, setDate] = useState<string>()

  useEffect(() => {
    const today = value ? new Date(value) : new Date()
    const dayOfTheMonth = today.getDate()

    setDate([
      today.getFullYear(),
      today.getMonth() + 1,
      dayOfTheMonth > 10 ? dayOfTheMonth : `0${dayOfTheMonth}`
    ].join('-'))
  }, [value])

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setDate(event.target.value)
  }

  return (
    <div className={styles.field}>
      <label htmlFor="date">Date</label>
      <input
        type="date" 
        name="date"
        id="date"
        value={date}
        onChange={handleChange}
      />
    </div>
  )
}