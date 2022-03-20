const Ship = (id, playerId, positions = []) => {
  const length = positions.length

  return {
    id,
    length,
    positions,
    playerId
  }
}

export default Ship
