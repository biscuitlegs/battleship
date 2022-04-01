/**
 * @jest-environment jsdom
 */

import Display from './display'

const testDisplay = Display()

test('It creates an element that shows the state of both boards', () => {
  // const boardsResult = document.createElement('div')
  const mockDisplayBoard1 = document.createElement('div')
  const mockDisplayBoard2 = document.createElement('div')
  const resultsDisplay = testDisplay.createResultsDisplay(
    mockDisplayBoard1,
    mockDisplayBoard2
  )

  expect(mockDisplayBoard1.classList.contains('small-grid')).toBeTruthy()
  expect(mockDisplayBoard2.classList.contains('small-grid')).toBeTruthy()
  expect(resultsDisplay.classList.contains('results-display')).toBeTruthy()
  expect(resultsDisplay.childNodes[0]).toBe(mockDisplayBoard1)
  expect(resultsDisplay.childNodes[1]).toBe(mockDisplayBoard2)
})

/*
test('It reveals unhit squares that have a ship', () => {
  const displayBoard = document.createElement('div')
  const displaySquareA = document.createElement('div')
  const displaySquareB = document.createElement('div')
  displaySquareA.dataset.id = 'abc123'
  displaySquareB.dataset.id = 'xyz456'
  displayBoard.appendChild(displaySquareA)
  displayBoard.appendChild(displaySquareB)

  const mockSquareA = jest
    .fn()
    .mockReturnValue({ id: 'abc123', shipId: null, hasBeenHit: false })()
  const mockSquareB = jest
    .fn()
    .mockReturnValue({ id: 'xyz456', shipId: 5, hasBeenHit: false })()
  const mockGameBoard = jest
    .fn()
    .mockReturnValue({ squares: [mockSquareA, mockSquareB] })()

  testDisplay.revealUnhitSquares(displayBoard, mockGameBoard)

  expect(displaySquareB.classList.contains('revealed')).toBeTruthy()
})
*/

describe('Should return a display board element', () => {
  const emptyUnhitSquare = jest
    .fn()
    .mockReturnValue({ shipId: null, hasBeenHit: false })
  const emptyHitSquare = jest
    .fn()
    .mockReturnValue({ shipId: null, hasBeenHit: true })
  const shipUnhitSquare = jest
    .fn()
    .mockReturnValue({ shipId: 1, hasBeenHit: false })
  const shipHitSquare = jest
    .fn()
    .mockReturnValue({ shipId: 1, hasBeenHit: true })

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
      shipUnhitSquare(),
      shipHitSquare()
    ])

    const [
      emptyUnhitSquareElement,
      emptyHitSquareElement,
      shipUnhitSquareElement,
      shipHitSquareElement
    ] = Array.from(displayBoard.children)

    expect(
      emptyUnhitSquareElement.classList.contains('square', 'empty-square')
    ).toBeTruthy()
    expect(
      emptyHitSquareElement.classList.contains('square', 'empty-square-hit')
    ).toBeTruthy()
    expect(
      shipUnhitSquareElement.classList.contains('square', 'ship-square')
    ).toBeTruthy()
    expect(
      shipHitSquareElement.classList.contains('square', 'ship-square-hit')
    ).toBeTruthy()
  })
})
