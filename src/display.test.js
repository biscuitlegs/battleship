/**
 * @jest-environment jsdom
 */

import Display from './display'

const testDisplay = Display()

test("Should create a 'play again' button", () => {
  const button = testDisplay.createPlayAgainButton()
  expect(button.classList.contains('button')).toBeTruthy()
})

test('Should create an element for displaying notifications', () => {
  const notification = testDisplay.createNotificationDisplay('Hello World!')

  expect(notification.classList.contains('notification')).toBeTruthy()
  expect(notification.textContent).toBe('Hello World!')
})

describe('Should create a results display', () => {
  const mockGameBoard = jest.fn().mockReturnValue({ squares: [] })
  const mockDisplayBoard1 = document.createElement('div')
  const mockDisplayBoard2 = document.createElement('div')
  const player1Name = 'Mark'
  const player2Name = 'Karen'
  const player1Id = 54
  const resultsDisplay = testDisplay.createResultsDisplay(
    mockDisplayBoard1,
    mockDisplayBoard2,
    mockGameBoard(),
    mockGameBoard(),
    player1Name,
    player2Name,
    player1Id,
    player1Id
  )
  const columns = resultsDisplay.childNodes

  test('that has two columns', () => {
    expect(columns).toHaveLength(2)
    columns.forEach((column) =>
      expect(column.classList.contains('results-display-column')).toBeTruthy()
    )
  })

  test('that has a player name in each column', () => {
    expect(columns[0].textContent).toContain(player1Name)
    expect(columns[1].textContent).toContain(player2Name)
  })

  test('that has a display board in each column', () => {
    expect(columns[0].childNodes).toContain(mockDisplayBoard1)
    expect(columns[1].childNodes).toContain(mockDisplayBoard2)
  })

  test('that returns an results display element', () => {
    expect(resultsDisplay.classList.contains('results-display')).toBeTruthy()
  })
})

describe('Should return a display board element', () => {
  const emptyUnhitSquare = jest
    .fn()
    .mockReturnValue({ shipId: null, hasBeenHit: false })
  const emptyHitSquare = jest
    .fn()
    .mockReturnValue({ shipId: null, hasBeenHit: true })
  const shipHitSquare = jest
    .fn()
    .mockReturnValue({ shipId: 1, hasBeenHit: true })
  const shipSunkSquare = jest
    .fn()
    .mockReturnValue({ shipId: 1, hasBeenHit: true, hasBeenSunk: true })

  test('with the correct number of squares', () => {
    const displayBoard = testDisplay.createDisplayBoard([
      emptyUnhitSquare(),
      emptyUnhitSquare(),
      emptyUnhitSquare()
    ])

    expect(displayBoard.children).toHaveLength(3)
  })

  test('with each square having the correct classes', () => {
    const displayBoard = testDisplay.createDisplayBoard([
      emptyUnhitSquare(),
      emptyHitSquare(),
      shipHitSquare(),
      shipSunkSquare()
    ])

    const [
      emptyUnhitSquareElement,
      emptyHitSquareElement,
      shipHitSquareElement,
      shipSunkSquareElement
    ] = Array.from(displayBoard.children)

    expect(
      emptyUnhitSquareElement.classList.contains('empty-square')
    ).toBeTruthy()
    expect(
      emptyHitSquareElement.classList.contains('empty-square-hit')
    ).toBeTruthy()
    expect(
      shipHitSquareElement.classList.contains('ship-square-hit')
    ).toBeTruthy()
    expect(
      shipSunkSquareElement.classList.contains('ship-square-sunk')
    ).toBeTruthy()
  })
})

test('Should return an interface for dragging ships onto a board', () => {
  const mockGameBoard = jest.fn().mockReturnValue({
    squares: Array(100).fill({
      id: 1,
      shipId: null,
      hasBeenHit: false,
      hasBeenSunk: false
    })
  })
  const mockShip = jest.fn().mockReturnValue({
    id: 1,
    playerId: 1,
    isSunk: false,
    isVertical: false,
    positions: [[0, 0]]
  })
  const gameBoard1 = mockGameBoard()
  const gameBoard2 = mockGameBoard()
  const ships1 = [mockShip()]
  const ships2 = [mockShip()]
  const mockGameStarter = () => {}
  const dragInterface = testDisplay.createPlaceShipsDisplay(
    gameBoard1,
    gameBoard2,
    ships1,
    ships2,
    mockGameStarter
  )

  expect(dragInterface.id).toBe('dragContainer')
})
