/**
 *
 * @param list - list of items to group
 * @param keyFn - function to generate key from element
 * @returns - grouped list
 * @example
 * groupBySerial([1, 1, 1, 2, 2, 1], (it) => it)
 * // returns [[1, 1, 1], [2, 2], [1]]
 * groupBySerial([{k: 1}, {k: 1}, {k: 2}, {k: 1}], (it) => it.k)
 * // returns [[{k: 1}, {k: 1}], [{k: 2}], [{k: 1}]]
 */
export const groupBySerial = <T, K extends keyof any>(
  list: T[],
  keyFn: (it: T) => K,
): T[][] => {
  const result: T[][] = []
  let current: T[] = []
  let currentKey: K | null = null

  for (const it of list) {
    const key = keyFn(it)
    if (currentKey !== key) {
      current = []
      result.push(current)
      currentKey = key
    }
    current.push(it)
  }
  return result
}

/*
[1,1,1,2,2,1]

'1', 0 -> new key.  start: 0 sames: 1 (set curr.key to 1)
'1', 1 -> same key.          sames: 2
'1', 2 -> same key.          sames: 3
'2', 3 -> new key.  start: 3 sames: 1 (set curr.key to 2) (push list.slice(0, 3))
'2', 4 -> same key.          sames: 2
'1', 5 -> new key.  start: 5 sames: 1 (set curr.key to 1) (push list.slice(3, 2))
       -> end of list.                (push list.slice(5, 1))
*/
/*
[1,1,1]

'1', 0 -> new key.  start: 0 sames: 1 (set curr.key to 1)
'1', 1 -> same key.          sames: 2
'1', 2 -> same key.          sames: 3
       -> end of list.                (push list.slice(0, 3))
*/
export const groupBySerial2 = <T, K extends keyof any>(
  list: T[],
  keyFn: (it: T) => K = (it) => it as any,
): T[][] => {
  if (list.length === 0) return []

  const result: T[][] = []
  let currentKey: K | null
  let [start, sames] = [0, 0]

  list.forEach((it, i) => {
    const key = keyFn(it)
    if (key !== currentKey) {
      if (sames >= 1) {
        result.push(list.slice(start, start + sames))
      }
      currentKey = key
      start = i
      sames = 1
    } else {
      sames++
    }
  })
  result.push(list.slice(start, start + sames))
  return result
}
