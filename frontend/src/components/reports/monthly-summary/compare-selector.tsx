import { ComparePeriod } from '@/types'
import { Dispatch, SetStateAction } from 'react'
import styles from './style.module.scss'

export default function CompareSelector<CP extends ComparePeriod>({
  comparePeriod,
  setComparePeriod
}: {
  comparePeriod: CP
  setComparePeriod: Dispatch<SetStateAction<CP>>
}) {
  return (
    <div className={styles['compare-selector']}>
      <div>
        <input
          type="radio"
          name="compare"
          id="compare_prevMonth"
          value="prevMonth"
          checked={comparePeriod === 'prevMonth'}
          onChange={(event) => {
            setComparePeriod(event.target.value as CP)
          }}
        />
        <label htmlFor="compare_prevMonth">Last month</label>
      </div>
      <div>
        <input
          type="radio"
          name="compare"
          id="compare_yearOverYear"
          value="yearOverYear"
          checked={comparePeriod === 'yearOverYear'}
          onChange={(event) => {
            setComparePeriod(event.target.value as CP)
          }}
        />
        <label htmlFor="compare_yearOverYear">YoY</label>
      </div>
    </div>
  )
}