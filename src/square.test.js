import Square from './square'

test('Should return true if it has received a hit', () => {
  const testSquare = Square(null, true)
  expect(testSquare.hasBeenHit).toBeTruthy()
})

test('Should return false if it has not received a hit', () => {
  const testSquare = Square()
  expect(testSquare.hasBeenHit).toBeFalsy()
})

test('Should return null if no ship id is assigned', () => {
  const testSquare = Square()
  expect(testSquare.shipId).toBeNull()
})

test('Should return a ship id if one is assigned', () => {
  const testSquare = Square(0)
  expect(testSquare.shipId).toBe(0)
})
