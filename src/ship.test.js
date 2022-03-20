import Ship from './ship'

const testShip = Ship([
  [3, 3],
  [3, 4],
  [3, 5]
])

test("Should return it's length", () => {
  expect(testShip.length).toBe(3)
})

test('Should return each of the positions it is occupying', () => {
  expect(testShip.positions).toEqual([
    [3, 3],
    [3, 4],
    [3, 5]
  ])
})
