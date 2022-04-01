/**
 * @jest-environment jsdom
 */

import Display from './display'

const testDisplay = Display()

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

    expect(displayBoard.children.length).toBe(3)
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
