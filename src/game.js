import _ from 'lodash'
import uniqid from 'uniqid'
import GameBoard from './gameBoard'
import Square from './square'
import Ship from './ship'
import Display from './display'
import Player from './player'

import './main.css'

const Game = () => {
  const players = [Player(uniqid(), 'Mark'), Player(uniqid(), 'Emma')]
  let turnNumber = 1
  let turnPlayer = players[0]
  const player1Ships = [
    Ship(uniqid(), players[0].id, false, [
      [0, 0],
      [0, 1]
    ]),
    Ship(uniqid(), players[0].id, false, [
      [1, 4],
      [1, 5]
    ])
  ]
  const player2Ships = [
    Ship(uniqid(), players[1].id, false, [
      [3, 0],
      [3, 1]
    ]),
    Ship(uniqid(), players[1].id, false, [
      [5, 3],
      [5, 4]
    ])
  ]
  const player1GameBoard = GameBoard(Square, players[0].id)
  const player2GameBoard = GameBoard(Square, players[1].id)
  let turnGameBoard = player1GameBoard
  // Player 1's board only has player 2's ships and vice versa because
  // each player should only fight their opponent's ships
  player1Ships.forEach((ship) => {
    player2GameBoard.addShip(ship.id, ship.positions)
  })
  player2Ships.forEach((ship) => {
    player1GameBoard.addShip(ship.id, ship.positions)
  })

  const sleep = (microseconds) =>
    new Promise((resolve) => {
      setTimeout(resolve, microseconds)
    })

  const updateSunkShips = () => {
    player1Ships.forEach((ship) => {
      if (player2GameBoard.allSquaresHit(ship.id)) {
        const sunkShip = ship
        sunkShip.isSunk = true
      }
    })
    player2Ships.forEach((ship) => {
      if (player1GameBoard.allSquaresHit(ship.id)) {
        const sunkShip = ship
        sunkShip.isSunk = true
      }
    })
  }

  const isWinner = () => {
    switch (true) {
      case player1Ships.every((ship) => ship.isSunk):
        return true
      case player2Ships.every((ship) => ship.isSunk):
        return true
      default:
        return false
    }
  }

  const reloadDisplayBoard = () => {
    const currentDisplayBoard = document.body.querySelector('#displayBoard')
    document.body.removeChild(currentDisplayBoard)
    const newDisplayBoard = Display().createDisplayBoard(
      _.flattenDeep(turnGameBoard.squares)
    )
    newDisplayBoard.setAttribute('id', 'displayBoard')
    document.body.appendChild(newDisplayBoard)
  }

  const changeTurnPlayer = () => {
    turnPlayer = turnPlayer === players[0] ? players[1] : players[0]
  }

  const changeTurnGameBoard = () => {
    if (turnGameBoard === player1GameBoard) {
      turnGameBoard = player2GameBoard
    } else {
      turnGameBoard = player1GameBoard
    }
  }

  const makeSquaresInteractive = (displayBoard) => {
    displayBoard.childNodes.forEach((displaySquare) => {
      const foundSquare = _.flattenDeep(turnGameBoard.squares).find(
        (square) => square.id === displaySquare.dataset.id
      )

      displaySquare.addEventListener('click', () => {
        foundSquare.hasBeenHit = true
        reloadDisplayBoard()
        sleep(1500).then(() => {
          changeTurnPlayer()
          changeTurnGameBoard()
          reloadDisplayBoard()
          updateSunkShips()
          if (isWinner()) {
            console.log('Gameover')
            return
          }
          turnNumber += 1
          playTurn()
        })
      })
    })
  }

  const playTurn = () => {
    console.log(`It's ${turnPlayer.name}'s turn.`)
    if (turnNumber === 1) {
      const displayBoard = Display().createDisplayBoard(
        _.flattenDeep(turnGameBoard.squares)
      )
      displayBoard.setAttribute('id', 'displayBoard')
      document.body.appendChild(displayBoard)
      makeSquaresInteractive(displayBoard)
    } else {
      const displayBoard = document.body.querySelector('#displayBoard')
      makeSquaresInteractive(displayBoard)
    }
  }

  playTurn()
}

export default Game
