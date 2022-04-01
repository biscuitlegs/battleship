const Square = (id, shipId = null, hasBeenHit = false) => {
  return {
    id,
    shipId,
    hasBeenHit
  }
}

export default Square
