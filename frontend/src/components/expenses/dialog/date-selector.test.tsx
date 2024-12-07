import React from 'react'
import { render, screen } from '@testing-library/react'
import DateSelector from './date-selector'

describe('Date selector component', () => {
  test('should default to todays date', () => {
    const today = new Date()
    const dayOfTheMonth = today.getDate()

    const formatted = [
      today.getFullYear(),
      today.getMonth() + 1,
      dayOfTheMonth > 10 ? dayOfTheMonth : `0${dayOfTheMonth}`
    ].join('-')
    render(<DateSelector />)

    const input = screen.getByTestId<HTMLInputElement>('date_selector_input')
    expect(input.value).toBe(formatted)
  })

  test('should render value provided in prop', () => {
    const value = '2024-01-01'

    render(<DateSelector value={value} />)

    const input = screen.getByTestId<HTMLInputElement>('date_selector_input')
    expect(input.value).toBe(value)
  })

  test('should default to todays date when value prop is invalid', () => {
    const today = new Date()
    const dayOfTheMonth = today.getDate()

    const formatted = [
      today.getFullYear(),
      today.getMonth() + 1,
      dayOfTheMonth > 10 ? dayOfTheMonth : `0${dayOfTheMonth}`
    ].join('-')

    render(<DateSelector value={'123randomstring'} />)

    const input = screen.getByTestId<HTMLInputElement>('date_selector_input')
    expect(input.value).toBe(formatted)
  })
})