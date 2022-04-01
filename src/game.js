import _ from 'lodash'
import uniqid from 'uniqid'
import GameBoard from './gameBoard'
import Square from './square'
import Ship from './ship'
import Display from './display'
import Player from './player'

import './main.css'

const Game = () => {
  const { createDisplayBoard, createResultsDisplay } = Display()
  const players = [Player(uniqid(), 'Mark'), Player(uniqid(), 'Emma')]
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
        // eslint-disable-next-line no-use-before-define
        playTurn(foundSquare)
      })
    })
  }

  const disableDisplayBoard = () => {
    const displayBoard = document.querySelector('#displayBoard')
    displayBoard.classList.add('disabled')
  }

  const loadDisplayBoard = () => {
    const displayBoard = createDisplayBoard(
      _.flattenDeep(turnGameBoard.squares)
    )
    displayBoard.setAttribute('id', 'displayBoard')
    document.body.appendChild(displayBoard)
    makeSquaresInteractive(displayBoard)
  }

  const unloadDisplayBoard = () => {
    const displayBoard = document.body.querySelector('#displayBoard')
    document.body.removeChild(displayBoard)
  }

  const reloadDisplayBoard = () => {
    unloadDisplayBoard()
    loadDisplayBoard()
  }

  const loadResultsDisplay = () => {
    const player1DisplayBoard = createDisplayBoard(
      _.flattenDeep(player1GameBoard.squares)
    )
    const player2DisplayBoard = createDisplayBoard(
      _.flattenDeep(player2GameBoard.squares)
    )
    const resultsDisplay = createResultsDisplay(
      player1DisplayBoard,
      player2DisplayBoard,
      player1GameBoard,
      player2GameBoard
    )
    document.body.appendChild(resultsDisplay)
  }

  const playTurn = (square) => {
    const clickedSquare = square
    clickedSquare.hasBeenHit = true
    updateSunkShips()
    reloadDisplayBoard()
    disableDisplayBoard()
    if (isWinner()) {
      console.log('Gameover')
      unloadDisplayBoard()
      loadResultsDisplay()
      return
    }
    changeTurnPlayer()
    changeTurnGameBoard()
    sleep(1500).then(() => {
      reloadDisplayBoard()
    })
  }

  const play = () => {
    loadDisplayBoard()
  }

  return {
    play
  }
}

export default Game
