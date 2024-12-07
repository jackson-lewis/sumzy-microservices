import { formatDate } from '@/lib/money'

export default function Date({
  date
} : {
  date: string
}) {
  const formattedDate = formatDate(date)

  return <time dateTime={formattedDate}>{formattedDate}</time>
}