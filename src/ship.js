const Ship = (id, playerId, isSunk, positions = []) => ({
  id,
  playerId,
  isSunk,
  positions,
  length: positions.length
})

export default Ship
