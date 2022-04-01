import Ship from './ship'

const testShip = Ship(5, 1, false, [
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

test('Should return false if it is not sunk', () => {
  const unSunkShip = Ship(5, 1, false, [[0, 0]])

  expect(unSunkShip.isSunk).toBeFalsy()
})

test('Should return true if it is sunk', () => {
  const sunkShip = Ship(5, 1, true, [[0, 0]])

  expect(sunkShip.isSunk).toBeTruthy()
})
