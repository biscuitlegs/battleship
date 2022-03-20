import Player from './player'

test('Should have an id', () => {
  const testPlayer = Player(0)

  expect(testPlayer.id).toBe(0)
})

test('Should have a name if given', () => {
  const testPlayer = Player(0, 'Mark')

  expect(testPlayer.name).toBe('Mark')
})

test('Should use a default name if none given', () => {
  const testPlayer = Player(1)

  expect(testPlayer.name).toBe('Player 1')
})
