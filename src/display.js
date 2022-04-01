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
        // Was 'ship-square' before
        squareElement.classList.add('empty-square')
        break
      case shipId && hasBeenHit:
        squareElement.classList.add('ship-square-hit')
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

  return {
    createDisplayBoard
  }
}

export default Display
