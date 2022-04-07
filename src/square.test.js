import Square from './square'

test("Should return it's id", () => {
  const testSquare = Square(1, null, true)
  expect(testSquare.id).toBe(1)
})

test('Should return true if it has received a hit', () => {
  const testSquare = Square(1, null, true)
  expect(testSquare.hasBeenHit).toBeTruthy()
})

test('Should return false if it has not received a hit', () => {
  const testSquare = Square(1)
  expect(testSquare.hasBeenHit).toBeFalsy()
})

test('Should return null if no ship id is assigned', () => {
  const testSquare = Square(1)
  expect(testSquare.shipId).toBeNull()
})

test('Should return a ship id if one is assigned', () => {
  const testSquare = Square(1, 5)
  expect(testSquare.shipId).toBe(5)
})

test("Should return true if it's ship has been sunk", () => {
  const testSquare = Square(1, 5, true, true)
  expect(testSquare.hasBeenSunk).toBe(true)
})

test("Should return false if it's ship has not been sunk", () => {
  const testSquare = Square(1, 5, true, false)
  expect(testSquare.hasBeenSunk).toBe(false)
})
