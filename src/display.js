import _ from 'lodash'

const Display = () => {
  const createDisplayBoard = () => {
    const gameBoard = document.createElement('div')
    gameBoard.classList.add('gameboard')

    return gameBoard
  }

  const renderDisplayBoard = (container, displayBoard, displaySquares) => {
    for (let i = 0; i < displaySquares.length; i++) {
      displayBoard.appendChild(displaySquares[i])
    }
    container.appendChild(displayBoard)
  }

  const createDisplaySquare = (square) => {
    const { shipId, hasBeenHit } = square
    const squareElement = document.createElement('div')
    squareElement.classList.add('square')
    switch (true) {
      case !shipId && !hasBeenHit:
        squareElement.classList.add('empty-square')
        break
      case !shipId && hasBeenHit:
        squareElement.classList.add('empty-square-hit')
        break
      case shipId && !hasBeenHit:
        squareElement.classList.add('ship-square')
        break
      case shipId && hasBeenHit:
        squareElement.classList.add('ship-square-hit')
        break
    }

    return squareElement
  }

  return {
    createDisplayBoard,
    renderDisplayBoard,
    createDisplaySquare
  }
}

export default Display
