import _ from 'lodash'
import uniqid from 'uniqid'

const GameBoard = (square, playerId) => {
  const squares = []
  for (let i = 0; i < 10; i += 1) {
    squares.push([
      square(uniqid()),
      square(uniqid()),
      square(uniqid()),
      square(uniqid()),
      square(uniqid()),
      square(uniqid()),
      square(uniqid()),
      square(uniqid()),
      square(uniqid()),
      square(uniqid())
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

  const coordinatesOf = (id) => {
    const squareWithId = _.flattenDeep(squares).find(
      (idSquare) => idSquare.id === id
    )
    const index = _.flattenDeep(squares).indexOf(squareWithId)
    let coordinates = []
    if (index < 10) {
      coordinates = [0, index]
    } else {
      coordinates = Array.from(`${index}`).map((number) => Number(number))
    }

    return coordinates
  }

  const allSquaresHit = (shipId) => {
    let isSunk = false
    const flatSquares = _.flattenDeep(squares)
    const squaresGroupedByShipId = _.groupBy(flatSquares, 'shipId')
    if (
      squaresGroupedByShipId[shipId].every(
        (groupedSquare) => groupedSquare.hasBeenHit
      )
    ) {
      isSunk = true
    }

    return isSunk
  }

  return {
    squares,
    addShip,
    squareAt,
    allSquaresHit,
    coordinatesOf,
    playerId
  }
}

export default GameBoard
