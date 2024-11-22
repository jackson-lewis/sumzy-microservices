import { ChangeEvent, useEffect, useState } from 'react'

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

  return <input
    type="date" 
    name="date"
    value={date}
    onChange={handleChange}
  />
}