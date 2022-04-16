import { Ship, isOutOfBounds } from './ship'

const testShip = Ship(5, 1, false, false, [
  [3, 3],
  [3, 4],
  [3, 5]
])

test('Should return true if it is vertical', () => {
  const verticalShip = Ship(5, 1, false, true, [
    [3, 3],
    [3, 4],
    [3, 5]
  ])

  expect(verticalShip.isVertical).toBeTruthy()
})

test('Should return false if it is not vertical', () => {
  expect(testShip.isVertical).toBeFalsy()
})

test("Should return it's length", () => {
  expect(testShip).toHaveLength(3)
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

test('Should return true if out of bounds', () => {
  expect(
    isOutOfBounds(false, [
      [0, 8],
      [0, 9],
      [0, 10]
    ])
  ).toBeTruthy()
  expect(
    isOutOfBounds(true, [
      [9, 0],
      [10, 0],
      [11, 0]
    ])
  ).toBeTruthy()
})

test('Should return false if not out of bounds', () => {
  expect(
    isOutOfBounds(false, [
      [0, 0],
      [0, 1],
      [0, 2]
    ])
  ).toBeFalsy()
  expect(
    isOutOfBounds(true, [
      [5, 5],
      [6, 5],
      [7, 5]
    ])
  ).toBeFalsy()
})
