import { ChangeEvent, Dispatch, SetStateAction } from 'react'

export default function MonthlySelector({
  activeYM,
  setActiveYM
}: {
  activeYM: [number, number]
  setActiveYM: Dispatch<SetStateAction<[number, number]>>
}) {
  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const { value } = event.target
    const valueAsNumber = Number(value)

    setActiveYM((ym) => {
      if (value.length === 4) {
        return [
          valueAsNumber,
          ym[1]
        ]
      } else if (valueAsNumber > 0 && valueAsNumber <= 12) {
        return [
          ym[0],
          valueAsNumber
        ]
      }
      return ym
    })
  }

  return (
    <div>
      <select
        name="year"
        id="year"
        value={activeYM[0]}
        onChange={handleChange}
      >
        <option>2023</option>
        <option>2024</option>
      </select>
      <select
        name="month"
        id="month"
        value={activeYM[1]}
        onChange={handleChange}
      >
        <option>9</option>
        <option>10</option>
        <option>11</option>
        <option>12</option>
      </select>
    </div>
  )
}