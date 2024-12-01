
export function formatDate(raw: string) {
  const match = raw.match(/(?:-|\/)/)

  if (match) {
    const segments = raw.split(match[0])

    if (segments.length === 3) {
      const [Y, M, D] = segments.map(Number)
      return new Date(Y, (M - 1), D)
    }
  }

  if (/^[0-9]{13}$/.test(raw)) {
    return new Date(Number(raw))
  }

  return false
}