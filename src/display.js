import _ from 'lodash'
import { isOutOfBounds } from './ship'

const Display = () => {
  const createGrid = () => {
    const grid = document.createElement('div')
    grid.classList.add('grid')

    return grid
  }

  const createDisplaySquare = (square) => {
    const { id, shipId, hasBeenHit, hasBeenSunk } = square
    const squareElement = document.createElement('div')
    squareElement.setAttribute('data-id', id)
    squareElement.classList.add('square')
    switch (true) {
      case !shipId && !hasBeenHit:
        squareElement.classList.add('empty-square')
        break
      case !shipId && hasBeenHit:
        squareElement.classList.add('empty-square-hit')
        break
      case shipId && !hasBeenHit:
        squareElement.classList.add('empty-square')
        break
      case shipId && hasBeenHit && hasBeenSunk:
        squareElement.classList.add('ship-square-sunk')
        break
      case shipId && hasBeenHit:
        squareElement.classList.add('ship-square-hit')
        break
      default:
        break
    }

    return squareElement
  }

  const createDisplayBoard = (squares) => {
    const grid = createGrid()
    squares.forEach((square) => {
      const displaySquare = createDisplaySquare(square)
      grid.appendChild(displaySquare)
    })

    return grid
  }

  const revealUnhitSquares = (displayBoard, gameBoard) => {
    displayBoard.childNodes.forEach((displaySquare) => {
      const foundSquare = _.flattenDeep(gameBoard.squares).find(
        (square) => square.id === displaySquare.dataset.id
      )
      if (!foundSquare.hasBeenHit && foundSquare.shipId) {
        displaySquare.classList.add('revealed')
      }
    })
  }

  const createResultsDisplay = (
    displayBoard1,
    displayBoard2,
    gameBoard1,
    gameBoard2,
    player1Name,
    player2Name,
    player1Id,
    winningPlayerId
  ) => {
    const resultsDisplay = document.createElement('div')
    const player1NameDisplay = document.createElement('h3')
    const player2NameDisplay = document.createElement('h3')
    player1NameDisplay.classList.add('is-size-3')
    player2NameDisplay.classList.add('is-size-3')
    if (winningPlayerId === player1Id) {
      player1NameDisplay.textContent = `${player1Name} wins!`
      player2NameDisplay.textContent = player2Name
    } else {
      player2NameDisplay.textContent = `${player2Name} wins!`
      player1NameDisplay.textContent = player1Name
    }
    const column1 = document.createElement('div')
    const column2 = document.createElement('div')
    column1.classList.add('results-display-column')
    column2.classList.add('results-display-column')
    if (winningPlayerId === player1Id) {
      column1.classList.add('winner-column')
    } else {
      column2.classList.add('winner-column')
    }
    displayBoard1.classList.add('small-grid')
    displayBoard2.classList.add('small-grid')
    revealUnhitSquares(displayBoard1, gameBoard1)
    revealUnhitSquares(displayBoard2, gameBoard2)
    resultsDisplay.classList.add('results-display')

    column1.appendChild(player1NameDisplay)
    column1.appendChild(displayBoard1)
    column2.appendChild(player2NameDisplay)
    column2.appendChild(displayBoard2)
    resultsDisplay.appendChild(column1)
    resultsDisplay.appendChild(column2)

    return resultsDisplay
  }

  const createNotificationDisplay = (text) => {
    const notification = document.createElement('div')
    notification.classList.add('notification', 'is-info', 'turn-notification')
    notification.textContent = text

    return notification
  }

  const createPlayAgainButton = () => {
    const button = document.createElement('button')
    button.textContent = 'Play again'
    button.classList.add('button', 'is-fullwidth', 'is-medium', 'is-primary')

    return button
  }

  const dragStartHandler = (e) => {
    e.dataTransfer.setData('text/plain', e.target.dataset.id)
    e.dataTransfer.dropEffect = 'move'
  }

  const dragoverHandler = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const extendCoordinates = (coordinates, isVertical, times) => {
    const extendedCoordinates = [coordinates]
    const currentCoordinate = [...coordinates]
    for (let i = 0; i < times; i += 1) {
      if (isVertical) {
        currentCoordinate[0] += 1
      } else {
        currentCoordinate[1] += 1
      }
      extendedCoordinates.push([...currentCoordinate])
    }

    return extendedCoordinates
  }

  const shipHasCollided = (ship, ships) => {
    let isCollision = false
    const alliedShipPositions = _.flatten(
      ships.map((alliedShip) => alliedShip.positions)
    )
    ship.positions.forEach((position) => {
      alliedShipPositions.forEach((alliedPosition) => {
        if (_.isEqual(position, alliedPosition)) {
          isCollision = true
        }
      })
    })
    return isCollision
  }

  const dropHandler = (e, ships, board) => {
    e.preventDefault()
    const squareId = e.target.dataset.id
    const shipId = e.dataTransfer.getData('text/plain')
    // Exit if not dropped on a square(on another ship or out of bounds)
    if (!e.target.classList.contains('square')) {
      return
    }
    const squareCoordinates = board.coordinatesOf(squareId)
    const ship = ships.find((idShip) => idShip.id === shipId)
    const shipNewCoordinates = extendCoordinates(
      squareCoordinates,
      ship.isVertical,
      ship.length - 1
    )
    // Exit if ship is dropped in the same place
    if (_.isEqual(ship.positions, shipNewCoordinates)) {
      return
    }
    // Exit if part of ship is out of bounds when dropped
    if (isOutOfBounds(ship.isVertical, shipNewCoordinates)) {
      return
    }
    // Exit if part of ship collides with another ship
    if (
      shipHasCollided(
        { positions: shipNewCoordinates },
        ships.filter((alliedShip) => alliedShip !== ship)
      )
    ) {
      return
    }
    ship.positions = shipNewCoordinates
    const displayShip = document.querySelector(`[data-id=${shipId}]`)
    e.target.appendChild(displayShip)
  }

  const addClassesToDraggableShip = (ship, isVertical, length) => {
    ship.classList.add('draggable-ship')
    switch (true) {
      case isVertical && length === 2:
        ship.classList.add('vertical-2')
        break
      case isVertical && length === 3:
        ship.classList.add('vertical-3')
        break
      case isVertical && length === 4:
        ship.classList.add('vertical-4')
        break
      case !isVertical && length === 2:
        ship.classList.add('horizontal-2')
        break
      case !isVertical && length === 3:
        ship.classList.add('horizontal-3')
        break
      case !isVertical && length === 4:
        ship.classList.add('horizontal-4')
        break
      default:
        break
    }
  }

  const createShipRotateButton = (ship, playerShips) => {
    let { isVertical } = ship
    const { length } = ship
    const rotateButton = document.createElement('button')
    rotateButton.classList.add('button', 'is-link', 'rotate-button')
    const icon = document.createElement('i')
    icon.classList.add('bi', 'bi-arrow-clockwise')
    rotateButton.appendChild(icon)
    rotateButton.addEventListener('click', (e) => {
      const draggableShip = e.currentTarget.parentElement
      const originCoordinates = ship.positions[0]
      const newCoordinates = extendCoordinates(
        originCoordinates,
        !isVertical,
        length - 1
      )
      // Exit if part of ship would be out of bounds after rotating
      if (isOutOfBounds(!isVertical, newCoordinates)) {
        return
      }
      if (shipHasCollided({ positions: newCoordinates }, playerShips)) {
        return
      }
      isVertical = !isVertical
      const rotatedShip = ship
      rotatedShip.isVertical = isVertical
      rotatedShip.positions = newCoordinates
      draggableShip.classList.remove(...draggableShip.classList)
      addClassesToDraggableShip(draggableShip, isVertical, length)
    })

    return rotateButton
  }

  const createDragShipsDisplay = (ships, gameBoard, playerName) => {
    const { squares } = gameBoard
    const container = document.createElement('div')
    const bench = document.createElement('div')
    const message = document.createElement('p')
    message.classList.add('notification', 'is-info')
    message.innerHTML = `${playerName}, please place <span class="bold">all</span> of your ships on the board (in secret)!`
    bench.classList.add('bench')
    const board = createDisplayBoard(_.flattenDeep(squares))
    board.childNodes.forEach((square) => {
      square.addEventListener('dragover', dragoverHandler)
      square.addEventListener('drop', (e) => {
        dropHandler(e, ships, gameBoard)
      })
    })

    ships.forEach((ship) => {
      const { length, isVertical } = ship
      const draggableShip = document.createElement('div')
      draggableShip.setAttribute('draggable', true)
      draggableShip.dataset.id = ship.id
      addClassesToDraggableShip(draggableShip, isVertical, length)
      draggableShip.addEventListener('dragstart', (e) => {
        dragStartHandler(e)
      })
      const rotateButton = createShipRotateButton(
        ship,
        ships.filter((otherShip) => ship !== otherShip)
      )
      draggableShip.appendChild(rotateButton)
      bench.appendChild(draggableShip)
    })

    container.appendChild(message)
    container.appendChild(board)
    container.appendChild(bench)

    return container
  }

  // TODO test for this
  const createPlaceShipsDisplay = (
    gameboard1,
    gameboard2,
    ships1,
    ships2,
    gameStarter
  ) => {
    const player1Interface = createDragShipsDisplay(
      ships1,
      gameboard2,
      'Player 1'
    )
    const player2Interface = createDragShipsDisplay(
      ships2,
      gameboard1,
      'Player 2'
    )
    const container = document.createElement('div')
    container.setAttribute('id', 'dragContainer')
    const startGameButton = document.createElement('button')
    startGameButton.textContent = 'Start Game'
    startGameButton.classList.add('button', 'is-primary', 'drag-button')
    startGameButton.addEventListener('click', () => {
      const bench = document.querySelector('.bench')
      // Exit early if not all ships are placed on the board
      if (bench.childNodes.length > 0) {
        return
      }
      gameStarter()
    })
    const nextBoardButton = document.createElement('button')
    nextBoardButton.textContent = 'Done'
    nextBoardButton.classList.add('button', 'is-primary', 'drag-button')
    nextBoardButton.addEventListener('click', () => {
      const bench = document.querySelector('.bench')
      // Exit early if not all ships are placed on the board
      if (bench.childNodes.length > 0) {
        return
      }
      container.removeChild(player1Interface)
      container.removeChild(nextBoardButton)
      container.appendChild(player2Interface)
      container.appendChild(startGameButton)
    })

    container.appendChild(player1Interface)
    container.appendChild(nextBoardButton)

    return container
  }

  return {
    createDisplayBoard,
    createResultsDisplay,
    createNotificationDisplay,
    createPlayAgainButton,
    createPlaceShipsDisplay
  }
}

export default Display
