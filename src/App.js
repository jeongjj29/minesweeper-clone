import React, { useState } from "react";
import Board from "./components/Board";

const difficulties = {
  beginner: { rows: 8, cols: 8, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 30, cols: 16, mines: 99 },
};

function App() {
  const [difficulty, setDifficulty] = useState("beginner");
  const [gameKey, setGameKey] = useState(0); // Used to reset the game when difficulty changes

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
    setGameKey((prevKey) => prevKey + 1); // Trigger a new game by changing the key
  };

  return (
    <div className="App">
      <h1>Minesweeper</h1>
      <div className="difficulty-selector">
        <label>
          <input
            type="radio"
            value="beginner"
            checked={difficulty === "beginner"}
            onChange={handleDifficultyChange}
          />
          Beginner
        </label>
        <label>
          <input
            type="radio"
            value="intermediate"
            checked={difficulty === "intermediate"}
            onChange={handleDifficultyChange}
          />
          Intermediate
        </label>
        <label>
          <input
            type="radio"
            value="expert"
            checked={difficulty === "expert"}
            onChange={handleDifficultyChange}
          />
          Expert
        </label>
      </div>

      <Board
        key={gameKey} // This resets the Board when difficulty changes
        rows={difficulties[difficulty].rows}
        cols={difficulties[difficulty].cols}
        mines={difficulties[difficulty].mines}
      />
    </div>
  );
}

export default App;
