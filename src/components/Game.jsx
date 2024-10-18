import { useState, useRef } from "react";
import "./Game.css";

const Game = ({
  verifyLetter,
  pickedWord,
  pickedCategory,
  letters,
  guessedLetters,
  wrongLetters,
  guesses,
  score,
  changeLetter,
}) => {
  const [letter, setLetters] = useState("");
  const letterInputRef = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    verifyLetter(letter);
    setLetters("");
    letterInputRef.current.focus();
  };

  /*if (letter === "ç") {
    setLetters(changeLetter);
  }*/
  return (
    <div className="game">
      <p className="points">
        <span>Pontuação: {score}</span>
      </p>
      <h1>Advinhe a palavra:</h1>
      <h3 className="tip">
        Dica sobre a palavra: <span>{pickedCategory}</span>
      </h3>
      <p>Você ainda tem {guesses} tentativa(s).</p>
      <div className="wordContainer">
        {letters.map((letter, i) =>
          guessedLetters.includes(letter) ? (
            <span key={i} className="letter">
              {letter}
            </span>
          ) : (
            <span key={i} className="blankSquere"></span>
          )
        )}
      </div>
      <div className="letterContainer">
        <p>Tente advinhar um letra da palavra:</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="letter"
            maxLength="1"
            required
            onChange={(e) => setLetters(e.target.value)}
            value={letter}
            ref={letterInputRef}
          />
          <button>JOGAR!</button>
        </form>
      </div>
      <div className="wrongLettersContainer">
        <p>Letras já utilizadas</p>
        {wrongLetters.map((letter, i) => (
          <span key={i}>{letter}, </span>
        ))}
      </div>
    </div>
  );
};

export default Game;
