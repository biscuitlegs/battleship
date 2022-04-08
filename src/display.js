import _ from 'lodash'

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

  return {
    createDisplayBoard,
    createResultsDisplay,
    createNotificationDisplay,
    createPlayAgainButton
  }
}

export default Display
