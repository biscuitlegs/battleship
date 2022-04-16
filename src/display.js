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
    notification.classList.add('notification')
    notification.textContent = text

    return notification
  }

  const createPlayAgainButton = () => {
    const button = document.createElement('button')
    button.textContent = 'Play again'
    button.classList.add('button')

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

  const dropHandler = (e, ships, board) => {
    e.preventDefault()
    const squareId = e.target.dataset.id
    const shipId = e.dataTransfer.getData('text/plain')
    // Exit if not dropped on a square
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
    ship.positions = shipNewCoordinates
    const displayShip = document.querySelector(`[data-id=${shipId}]`)
    e.target.appendChild(displayShip)
  }

  const createShipRotateButton = (ship) => {
    let { isVertical } = ship
    const { length } = ship
    const rotateButton = document.createElement('button')
    rotateButton.textContent = 'Rotate'
    rotateButton.addEventListener('click', (e) => {
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
      if (isVertical && length === 3) {
        e.target.parentElement.classList.remove('vertical-3')
        e.target.parentElement.classList.add('horizontal-3')
      } else {
        e.target.parentElement.classList.remove('horizontal-3')
        e.target.parentElement.classList.add('vertical-3')
      }
      isVertical = !isVertical
      const rotatedShip = ship
      rotatedShip.isVertical = isVertical
      rotatedShip.positions = newCoordinates
    })

    return rotateButton
  }

  // TODO test for this
  const createDragShipsDisplay = (ships, gameBoard) => {
    const { squares } = gameBoard
    const board = createDisplayBoard(_.flattenDeep(squares))
    board.childNodes.forEach((square) => {
      square.addEventListener('dragover', dragoverHandler)
      square.addEventListener('drop', (e) => {
        dropHandler(e, ships, gameBoard)
      })
    })
    ships.forEach((ship) => {
      const { length, isVertical } = ship
      const display = document.createElement('div')
      display.setAttribute('draggable', true)
      display.dataset.id = ship.id
      display.classList.add('draggable-ship')
      if (isVertical && length === 3) {
        display.classList.add('vertical-3')
      }
      if (!isVertical && length === 3) {
        display.classList.add('horizontal-3')
      }
      display.addEventListener('dragstart', (e) => {
        dragStartHandler(e)
      })
      const rotateButton = createShipRotateButton(ship)
      display.appendChild(rotateButton)
      board.appendChild(display)
    })

    return board
  }

  return {
    createDisplayBoard,
    createResultsDisplay,
    createNotificationDisplay,
    createPlayAgainButton,
    createDragShipsDisplay
  }
}

export default Display
