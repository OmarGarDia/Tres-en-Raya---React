import { useState, useEffect } from "react"
import confetti from "canvas-confetti"
import { Square } from "./components/Square"
import { TURNS } from "./constants"
import { checkWinner } from "./logic/board"
import { WinnerModal } from "./components/WinnerModal"

function App() {
  const [board, setBoard] = useState(() => {
   const boardFromStorage = window.localStorage.getItem('board');
   return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
  })
  const [turn, setTurn] = useState(()=>{
    const turnFromStorage = window.localStorage.getItem('turn');
    return turnFromStorage ?? TURNS.X
  });
  const [winner, setWinner] = useState(null)


  const checkEndGame = (newBoard) =>{
    return newBoard.every((square) => square !== null);
  }
 
  const updateBoard = (index) =>{
    if(board[index] || winner) return;
    
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);

    // Guardar partida
    window.localStorage.setItem('board', JSON.stringify(newBoard));
    window.localStorage.setItem('turn', newTurn);

    const newWinner = checkWinner(newBoard);
    if(newWinner){
      confetti();
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)){
      setWinner(false)
    }
  }

  const resetGame = () =>{
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);
    window.localStorage.removeItem('board');
    window.localStorage.removeItem('turn');
  }

  return (
    <>
     <main className='board'>
      <h1>Tic Tac Toe Game</h1> 
      <button onClick={resetGame}>Reset del juego</button>
      <section className="game">
        {
          board.map((square, index) => {
            return(
             <Square key={index} index={index} updateBoard={updateBoard}> 
                {square}
             </Square>
            )
          })
        }
      </section>
      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      <section>
        <WinnerModal resetGame={resetGame} winner={winner}/>
      </section>
     </main>
    </>
  )
}

export default App
