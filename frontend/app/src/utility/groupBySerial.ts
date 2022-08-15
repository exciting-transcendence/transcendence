export const groupBySerial = <T, K extends keyof any>(
  list: T[],
  key: (it: T) => K,
): T[][] => {
  const result: T[][] = []
  let current: T[] = []
  let currentKey: K | undefined

  for (const it of list) {
    const keyOfIt = key(it)
    if (currentKey !== keyOfIt) {
      current = []
      result.push(current)
      currentKey = keyOfIt
    }
    current.push(it)
  }
  return result
}
