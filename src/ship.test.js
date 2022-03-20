import Ship from './ship'

const testShip = Ship(5, 1, [
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

test("Should return it's player id", () => {
  expect(testShip.playerId).toBe(1)
})

test("Should return it's id", () => {
  expect(testShip.id).toBe(5)
})
