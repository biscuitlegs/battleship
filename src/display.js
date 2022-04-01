import _ from 'lodash'

const Display = () => {
  const createGrid = () => {
    const grid = document.createElement('div')
    grid.classList.add('grid')

    return grid
  }

  const createDisplaySquare = (square) => {
    const { id, shipId, hasBeenHit } = square
    const squareElement = document.createElement('div')
    squareElement.setAttribute('data-id', id)
    squareElement.classList.add('square')
    switch (true) {
      case !shipId && !hasBeenHit:
        squareElement.classList.add('empty-square')
        break
      case !shipId && hasBeenHit:
        squareElement.classList.add('empty-square-hit')
        break
      case shipId && !hasBeenHit:
        squareElement.classList.add('empty-square')
        break
      case shipId && hasBeenHit:
        squareElement.classList.add('ship-square-hit')
        break
      default:
        break
    }

    return squareElement
  }

  const createDisplayBoard = (squares) => {
    const grid = createGrid()
    squares.forEach((square) => {
      const displaySquare = createDisplaySquare(square)
      grid.appendChild(displaySquare)
    })

    return grid
  }

  const revealUnhitSquares = (displayBoard, gameBoard) => {
    displayBoard.childNodes.forEach((displaySquare) => {
      const foundSquare = _.flattenDeep(gameBoard.squares).find(
        (square) => square.id === displaySquare.dataset.id
      )
      if (!foundSquare.hasBeenHit && foundSquare.shipId) {
        displaySquare.classList.add('revealed')
      }
    })
  }

  const createResultsDisplay = (
    displayBoard1,
    displayBoard2,
    gameBoard1,
    gameBoard2
  ) => {
    const resultsDisplay = document.createElement('div')
    displayBoard1.classList.add('small-grid')
    displayBoard2.classList.add('small-grid')
    revealUnhitSquares(displayBoard1, gameBoard1)
    revealUnhitSquares(displayBoard2, gameBoard2)
    resultsDisplay.classList.add('results-display')
    resultsDisplay.appendChild(displayBoard1)
    resultsDisplay.appendChild(displayBoard2)

    return resultsDisplay
  }

  return {
    createDisplayBoard,
    createResultsDisplay
  }
}

export default Display
