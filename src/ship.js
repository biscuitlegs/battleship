const Ship = (id, playerId, isSunk, isVertical, positions = []) => ({
  id,
  playerId,
  isSunk,
  isVertical,
  positions,
  length: positions.length
})

const isOutOfBounds = (isVertical, positions) => {
  let outOfBounds = null
  positions.forEach((position) => {
    const [y, x] = position
    switch (true) {
      case isVertical && y > 9:
        outOfBounds = true
        break
      case !isVertical && x > 9:
        outOfBounds = true
        break
      default:
        outOfBounds = false
        break
    }
  })

  return outOfBounds
}

export { Ship, isOutOfBounds }
