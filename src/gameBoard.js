import _ from 'lodash'

const GameBoard = (square) => {
  const squares = []
  for (let i = 0; i < 10; i++) {
    squares.push([
      square(),
      square(),
      square(),
      square(),
      square(),
      square(),
      square(),
      square(),
      square(),
      square()
    ])
  }

  const addShip = (shipId, squareCoordinateSets) => {
    squareCoordinateSets.forEach((set) => {
      const [x, y] = set
      squares[x][y].shipId = shipId
    })
  }

  const squareAt = (coordinate) => {
    const [x, y] = coordinate

    return squares[x][y]
  }

  const isShipSunk = (shipId) => {
    let isSunk = false
    const flatSquares = _.flattenDeep(squares)
    const squaresGroupedByShipId = _.groupBy(flatSquares, 'shipId')
    if (squaresGroupedByShipId[shipId].every((square) => square.hasBeenHit)) {
      isSunk = true
    }

    return isSunk
  }

  return {
    squares,
    addShip,
    squareAt,
    isShipSunk
  }
}

export default GameBoard
