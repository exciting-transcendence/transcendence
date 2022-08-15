import { groupBySerial, groupBySerial2 } from './groupBySerial'

describe('groupBySerial', () => {
  type testObj = { id: number; name: string }

  test('empty array', () => expect(groupBySerial([], (it) => it)).toEqual([]))
  test('maybe empty array', () =>
    expect(groupBySerial([] as testObj[], (it) => it.id)).toEqual([]))

  test('simple array', () => {
    const expected = [[1, 1, 1], [2, 2], [1]]
    const value = expected.flat()
    expect(groupBySerial(value, (it) => it)).toEqual(expected)
  })
  test('new function', () => {
    const expected = [[1, 1, 1], [2, 2], [1]]
    const value = expected.flat()
    expect(groupBySerial2(value, (it) => it)).toEqual(expected)
  })
  test('objects array', () => {
    const expected: testObj[][] = [
      [
        { id: 1, name: 'a' },
        { id: 1, name: 'a' },
        { id: 1, name: 'a' },
      ],
      [
        { id: 2, name: 'b' },
        { id: 2, name: 'b' },
      ],
      [{ id: 3, name: 'c' }],
      [
        { id: 1, name: 'a' },
        { id: 1, name: 'a' },
      ],
    ]
    const value = expected.flat()
    expect(groupBySerial(value, (it) => it.id)).toEqual(expected)
  })
  test('big dataset', () => {
    const expected = [
      Array(10000).fill(1),
      Array(10000).fill(2),
      Array(10000).fill(1),
    ]
    const value = expected.flat()

    expect(groupBySerial(value, (it) => it)).toEqual(expected)
  })
  test('new func is faster than older one', () => {
    const expected = [
      Array(1512).fill(1),
      Array(24363).fill(2),
      Array(1244).fill(3),
      Array(5213).fill(1),
    ]
    const value = expected.flat()
    const first = Date.now()
    groupBySerial(value, (it) => it)
    const middle = Date.now()
    groupBySerial2(value, (it) => it)
    const end = Date.now()
    const [oldTime, newTime] = [middle - first, end - middle]
    expect(oldTime).toBeLessThan(newTime)
  })
})
