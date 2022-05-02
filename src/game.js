import _ from 'lodash'
import uniqid from 'uniqid'
import GameBoard from './gameBoard'
import Square from './square'
import { Ship } from './ship'
import Display from './display'
import Player from './player'

import './main.css'

const Game = () => {
  const {
    createDisplayBoard,
    createResultsDisplay,
    createNotificationDisplay,
    createPlayAgainButton,
    createPlaceShipsDisplay
  } = Display()

  const createDefaultShips = (playerId) => {
    const defaultShips = [
      Ship(uniqid(), playerId, false, false, [
        [0, 0],
        [0, 1]
      ]),
      Ship(uniqid(), playerId, false, false, [
        [5, 0],
        [6, 0],
        [7, 0]
      ]),
      Ship(uniqid(), playerId, false, false, [
        [3, 0],
        [3, 1],
        [3, 2],
        [3, 3]
      ])
    ]

    return defaultShips
  }

  const players = [Player(uniqid(), 'Mark'), Player(uniqid(), 'Emma')]
  let turnPlayer = players[0]
  let player1Ships = createDefaultShips(players[0].id)
  let player2Ships = createDefaultShips(players[1].id)
  let player1GameBoard = GameBoard(Square, players[0].id)
  let player2GameBoard = GameBoard(Square, players[1].id)
  let turnGameBoard = player1GameBoard

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

  const updateSunkSquares = () => {
    const squares = _.flattenDeep(turnGameBoard.squares)
    const ships = [...player1Ships, ...player2Ships]
    ships.forEach((ship) => {
      if (ship.isSunk) {
        squares.forEach((square) => {
          if (square.shipId === ship.id) {
            const sunkSquare = square
            sunkSquare.hasBeenSunk = true
          }
        })
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
        // Exit early if square has already been clicked
        if (foundSquare.hasBeenHit) {
          return
        }
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
    const displaySquares = _.flattenDeep(turnGameBoard.squares)
    const displayBoard = createDisplayBoard(displaySquares)
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
      player2GameBoard,
      players[0].name,
      players[1].name,
      players[0].id,
      turnPlayer.id
    )
    document.body.appendChild(resultsDisplay)
  }

  const loadTurnNotification = () => {
    const turnNotification = createNotificationDisplay(
      `It's ${turnPlayer.name}'s turn.`
    )
    turnNotification.setAttribute('id', 'turnNotification')
    document.body.appendChild(turnNotification)
  }

  const unloadTurnNotification = () => {
    const turnNotification = document.querySelector('#turnNotification')
    document.body.removeChild(turnNotification)
  }

  const playTurn = (square) => {
    const clickedSquare = square
    clickedSquare.hasBeenHit = true
    updateSunkShips()
    updateSunkSquares()
    reloadDisplayBoard()
    disableDisplayBoard()
    if (isWinner()) {
      unloadTurnNotification()
      unloadDisplayBoard()
      loadResultsDisplay()
      // eslint-disable-next-line no-use-before-define
      loadPlayAgainButton()
      return
    }
    changeTurnPlayer()
    changeTurnGameBoard()
    sleep(1500).then(() => {
      unloadTurnNotification()
      loadTurnNotification()
      reloadDisplayBoard()
    })
  }

  const play = () => {
    const boardSetup = createPlaceShipsDisplay(
      player1GameBoard,
      player2GameBoard,
      player1Ships,
      player2Ships,
      () => {
        // Player 1's board only has player 2's ships and vice versa because
        // each player should only fight their opponent's ships
        player1Ships.forEach((ship) => {
          player2GameBoard.addShip(ship.id, ship.positions)
        })
        player2Ships.forEach((ship) => {
          player1GameBoard.addShip(ship.id, ship.positions)
        })
        loadTurnNotification()
        loadDisplayBoard()
      }
    )
    document.body.appendChild(boardSetup)
  }

  const loadPlayAgainButton = () => {
    const button = createPlayAgainButton()
    button.addEventListener('click', () => {
      document.body.innerHTML = ''
      // eslint-disable-next-line prefer-destructuring
      turnPlayer = players[0]
      player1Ships = createDefaultShips(players[0].id)
      player2Ships = createDefaultShips(players[1].id)
      player1GameBoard = GameBoard(Square, players[0].id)
      player2GameBoard = GameBoard(Square, players[1].id)
      turnGameBoard = player1GameBoard
      play()
    })
    document.body.appendChild(button)
  }

  return {
    play
  }
}

export default Game
