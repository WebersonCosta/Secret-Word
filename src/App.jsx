// CSS
import "./App.css";

// React
import { useCallback, useEffect, useState } from "react";

// data
import { wordsList } from "./data/words";

// components
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const guessesQty = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  let changeLetter = "";
  const normalizeString = (str) => {
    return (
      str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        //.replace(/ç/g, "c")
        .toLowerCase()
    );
  };

  const pickWordAndCategory = useCallback(() => {
    // pick a random category
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * categories.length)];

    // pick a random word
    const word = 
    words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  }, [words]);

  // start the secret word game
  const startGame = useCallback(() => {
    // clear all letters
    clearLetterStates();
    // pick word and pick category
    const { word, category } = pickWordAndCategory();
    // create an array of letters

    const wordLetters = word.split("").map(normalizeString);

    // fill states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
    console.log(word);
    console.log(category);
    console.log(wordLetters);
  }, [pickWordAndCategory]);

  // process
  const verifyLetter = (letter) => {
    //checkLetter(letters);
    //setGameStage(stages[2].name);
    // check if letter has already been utilized

    const normalizedLetter = normalizeString(letter);
    //const normalizedLetter = letter.toLowerCase();

    // Normalize letters to check against

    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    // push guessed letter or remove a guess
    const normalizedLetters = letters;

    if (normalizedLetters.includes(normalizedLetter)) {
      setGessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const clearLetterStates = () => {
    setGessedLetters([]);
    setWrongLetters([]);
  };

  // Check if guesses ended
  useEffect(() => {
    if (guesses <= 0) {
      // reset all states

      clearLetterStates();
      setGameStage(stages[2].name);
    }
  }, [guesses]);

  // check win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];
    // win condition
    if (
      guessedLetters.length === uniqueLetters.length &&
      gameStage === stages[1].name
    ) {
      setScore((actualScore) => (actualScore += 100));
      startGame();
    }
  }, [guessedLetters, letters, startGame]);

  // restarts the game
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name);
  };

  return (
    <>
      <div className="App">
        {gameStage === "start" && <StartScreen startGame={startGame} />}
        {gameStage === "game" && (
          <Game
            verifyLetter={verifyLetter}
            pickedWord={pickedWord}
            pickedCategory={pickedCategory}
            letters={letters}
            guessedLetters={guessedLetters}
            wrongLetters={wrongLetters}
            guesses={guesses}
            score={score}
            changeLetter={changeLetter}
          />
        )}
        {gameStage === "end" && <GameOver retry={retry} score={score} />}
      </div>
    </>
  );
}

export default App;
