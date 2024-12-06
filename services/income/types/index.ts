export type EventType = 'created' | 'updated' | 'deleted'

export interface Income {
  id: number
  userId: number
  date: Date
  type: 'one_time' | 'recurring'
  amount: number
}