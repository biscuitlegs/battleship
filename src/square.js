const Square = (
  id,
  shipId = null,
  hasBeenHit = false,
  hasBeenSunk = false
) => ({
  id,
  shipId,
  hasBeenHit,
  hasBeenSunk
})

export default Square
