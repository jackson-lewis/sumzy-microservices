import { ChangeEvent, useEffect, useState } from 'react'
import styles from './style.module.scss'

export default function DateSelector() {
  const [date, setDate] = useState<string>('')

  useEffect(() => {
    const date = new Date()

    setDate([
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    ].join('-'))
  }, [])

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