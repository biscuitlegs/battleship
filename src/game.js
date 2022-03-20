import GameBoard from './gameBoard'
import Square from './square'
import Ship from './ship'
import Display from './display'
import Player from './player'
import _ from 'lodash'
import './main.css'

const Game = () => {
  const myShip = Ship(1, 1, [
    [0, 0],
    [0, 1],
    [0, 2]
  ])
  const myPlayer = Player(1, 'Mark')
  const gameBoard = GameBoard(Square)
  gameBoard.addShip(myShip.id, myShip.positions)
  gameBoard.squareAt([2, 5]).hasBeenHit = true
  gameBoard.squareAt([0, 2]).hasBeenHit = true
  const { createDisplayBoard, renderDisplayBoard, createDisplaySquare } =
    Display()
  const displayBoard = createDisplayBoard()
  console.log(_.flattenDeep(gameBoard.squares))
  const displaySquares = _.flattenDeep(gameBoard.squares).map((square) =>
    createDisplaySquare(square)
  )
  renderDisplayBoard(document.body, displayBoard, displaySquares)
}

export default Game
