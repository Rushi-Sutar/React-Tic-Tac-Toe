import { useState } from "react"
import confetti from "canvas-confetti"
import { Square } from "./components/Square.jsx"
import { TURNS } from "./constants.js"
import { checkWinner, checkEndGame } from "./logic/board.js"
import { WinnerModal } from "./components/WinnerModal.jsx"
import video from '/bg-tictactoe.mp4'
import Footer from "./components/Footer.jsx"

function App() {
  // State for the game board
  const [board, setBoard] = useState(() => {
    // Get board state from localStorage if available, otherwise initialize it
    const boardFromStorage = window.localStorage.getItem("board")
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
  })

  // State for current turn
  const [turn, setTurn] = useState(() => {
    // Get turn from localStorage if available, otherwise set it to X
    const turnFromStorage = window.localStorage.getItem("turn")
    return turnFromStorage ?? TURNS.X 
  })

  // State for winner
  const [winner, setWinner] = useState(null)

  // Function to reset the game
  const resetGame = () => {
    setBoard(Array(9).fill(null)) // Reset board
    setTurn(TURNS.X) // Reset turn to X
    setWinner(null) // Reset winner

    // Remove board and turn data from localStorage
    window.localStorage.removeItem("board")
    window.localStorage.removeItem("turn")
  }

  // Function to update the board state when a square is clicked
  const updateBoard = (index) => {
    // If square is already occupied or there's already a winner, return
    if (board[index] || winner) return

    // Update board with current player's mark
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    // Toggle turn to the next player
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)

    // Store updated board and turn in localStorage
    window.localStorage.setItem("board", JSON.stringify(newBoard))
    window.localStorage.setItem("turn", newTurn)
    
    // Check for a winner or if the game has ended in a draw
    const newWinner = checkWinner(newBoard)
    if (newWinner) {
      // If there's a winner, trigger confetti effect and set winner state
      confetti()
      setWinner(newWinner)
    } else if (checkEndGame(newBoard)) {
      // If it's a draw, set winner state to false
      setWinner(false)
    }
  }

  return (
    <section className="App__container">
      {/* Video background */}
      <video autoPlay muted loop className="video-bg">
        <source src={video} type="video/mp4" />
      </video>

      <main className="board">
        <h1>Tic Tac Toe</h1>
        {/* Button to reset the game */}
        <button onClick={resetGame}>Reset Game</button>

        <section className="game">
          {/* Render the game board */}
          {board.map((square, index) => {
            return (
              <Square key={index} index={index} updateBoard={updateBoard}>
                {square}
              </Square>
            )
          })}
        </section>

        <section className="turn">
          {/* Display current player's turn */}
          <Square isSelected={turn === TURNS.X}>
            {TURNS.X}
          </Square>

          <Square isSelected={turn === TURNS.O}>
            {TURNS.O}
          </Square>
        </section>

        {/* Render winner modal if there's a winner */}
        <WinnerModal resetGame={resetGame} winner={winner} />

      </main>

      {/* Footer component */}
      <Footer />

    </section>
  )
}

export default App
