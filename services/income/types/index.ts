export type EventType = 'created' | 'updated' | 'deleted'

export interface Income {
  _id: string
  userId: string
  date: Date
  amount: number
}