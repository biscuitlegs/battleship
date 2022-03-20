/**
 * @jest-environment jsdom
 */

import Display from './display'

const testDisplay = Display()

test('Should create a display board DOM element', () => {
  const gameBoard = testDisplay.createDisplayBoard()

  expect(gameBoard.classList.contains('gameboard')).toBeTruthy()
})

test('Should render a display board DOM element in a container', () => {
  const container = document.createElement('div')
  const gameBoard = testDisplay.createDisplayBoard()
  const squares = []
  for (let i = 0; i < 3; i++) {
    const square = document.createElement('div')
    square.innerHTML = `Square ${i}`
    squares.push(square)
  }

  testDisplay.renderDisplayBoard(container, gameBoard, squares)

  expect(container.innerHTML).toBe(
    `<div class="gameboard"><div>Square 0</div><div>Square 1</div><div>Square 2</div></div>`
  )
})

describe('Should create a square DOM element with the correct background', () => {
  const mockPlayer = jest.fn().mockReturnValue({ id: 1 })

  test('when the square has no ship and is not hit', () => {
    const mockSquare = jest
      .fn()
      .mockReturnValue({ shipId: null, hasBeenHit: false })
    const square = testDisplay.createDisplaySquare(
      new mockSquare(),
      new mockPlayer()
    )
    expect(square.classList.contains('empty-square')).toBeTruthy()
  })
  test('when the square has no ship and is hit', () => {
    const mockSquare = jest
      .fn()
      .mockReturnValue({ shipId: null, hasBeenHit: true })
    const square = testDisplay.createDisplaySquare(
      new mockSquare(),
      new mockPlayer()
    )
    expect(square.classList.contains('empty-square-hit')).toBeTruthy()
  })
  test('when the square has a ship and is not hit', () => {
    const mockSquare = jest
      .fn()
      .mockReturnValue({ shipId: 1, hasBeenHit: false })
    const square = testDisplay.createDisplaySquare(
      new mockSquare(),
      new mockPlayer()
    )
    expect(square.classList.contains('ship-square')).toBeTruthy()
  })
  test('when the square has a ship and is hit', () => {
    const mockSquare = jest
      .fn()
      .mockReturnValue({ shipId: 1, hasBeenHit: true })
    const square = testDisplay.createDisplaySquare(
      new mockSquare(),
      new mockPlayer()
    )
    expect(square.classList.contains('ship-square-hit')).toBeTruthy()
  })
})
