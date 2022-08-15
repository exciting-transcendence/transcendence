import { groupBySerial } from './groupBySerial'

type testObj = { id: number; name: string }

test('groups work', () => {
  const value: testObj[] = [
    { id: 1, name: 'a' },
    { id: 1, name: 'a' },
    { id: 1, name: 'a' },
    { id: 2, name: 'b' },
    { id: 2, name: 'b' },
    { id: 3, name: 'c' },
    { id: 1, name: 'a' },
    { id: 1, name: 'a' },
  ]
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
  expect(groupBySerial(value, (it) => it.id)).toEqual(expected)
})
