import GameBoard from './gameBoard'
import _ from 'lodash'

const mockSquare = jest.fn().mockReturnValue({ shipId: null })
const hitMockSquare = jest.fn().mockReturnValue({
  shipId: 350,
  hasBeenHit: true
})
const unhitMockSquare = jest.fn().mockReturnValue({
  shipId: 350,
  hasBeenHit: false
})
const testGameBoard = GameBoard(mockSquare, 56)

test("Should return it's player id", () => {
  expect(testGameBoard.playerId).toBe(56)
})

test('Should return a grid of 10x10 squares', () => {
  const comparisonBoard = []
  for (let i = 0; i < 10; i++) {
    comparisonBoard.push([
      { shipId: null },
      { shipId: null },
      { shipId: null },
      { shipId: null },
      { shipId: null },
      { shipId: null },
      { shipId: null },
      { shipId: null },
      { shipId: null },
      { shipId: null }
    ])
  }
  expect(_.flattenDeep(testGameBoard.squares)).toEqual(
    _.flattenDeep(comparisonBoard)
  )
})

test('Should add a ship to the board at the given squares', () => {
  testGameBoard.addShip(256, [
    [0, 0],
    [0, 1],
    [0, 2]
  ])
  for (let i = 0; i < 3; i++) {
    expect(testGameBoard.squares[0][i].shipId).toBe(256)
  }
})

test("Should return a square when given it's coordinates", () => {
  const mockSquare = jest.fn().mockReturnValue({ shipId: 43562 })
  const targetMockSquare = mockSquare()
  testGameBoard.squares[0][0] = targetMockSquare
  expect(testGameBoard.squareAt([0, 0])).toBe(targetMockSquare)
})

test("Should return true if all of a ship's squares have been hit", () => {
  testGameBoard.squares[0][0] = hitMockSquare()
  testGameBoard.squares[0][1] = hitMockSquare()
  testGameBoard.squares[0][2] = hitMockSquare()
  testGameBoard.squares[0][3] = hitMockSquare()

  expect(testGameBoard.allSquaresHit(350)).toBeTruthy()
})

test("Should return false if all of a ship's squares have not been hit", () => {
  testGameBoard.squares[0][0] = hitMockSquare()
  testGameBoard.squares[0][1] = hitMockSquare()
  testGameBoard.squares[0][2] = unhitMockSquare()
  testGameBoard.squares[0][3] = hitMockSquare()

  expect(testGameBoard.allSquaresHit(350)).toBeFalsy()
})
