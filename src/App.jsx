import React from "react";
import "./App.css";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import Die from "./components/Die";
import Stopwatch from "./components/Stopwatch";
import Highscore from "./components/Highscore";

export default function App() {
  const [count, setCount] = React.useState(0);
  const [time, setTime] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const [dice, setDice] = React.useState(allNewDice());
  const [isDisabled, setIsDisabled] = React.useState(true);
  const [tenzies, setTenzies] = React.useState(false);
  const [record, setRecord] = React.useState(JSON.parse(localStorage.getItem("record")) || []);
  const minutes = Math.floor((time % 360000) / 6000);
  const seconds = Math.floor((time % 6000) / 100);
  const milliseconds = time % 100;
  let date = new Date();
  let timeStamp = date.toLocaleDateString() + " " + date.toLocaleTimeString();

  const newRecord = {
    times: time,
    roll: count,
    timeStamps: timeStamp,
  };

  React.useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => setTime(time + 1), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allValue = dice.every((die) => die.value === firstValue);

    if (allHeld && allValue) {
      setTenzies(true);
      setIsDisabled(true);
      setIsRunning(!setIsRunning);
      setRecord((prevRecord) => {
        const updatedRecord = [...prevRecord, newRecord];
        localStorage.setItem("record", JSON.stringify(updatedRecord));
        return updatedRecord;
      });
      setTimeout(() => {
        setIsDisabled(false);
      }, 2000);
    }
  }, [dice]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function holdDice(id) {
    setIsRunning(true);
    setIsDisabled(!setIsDisabled);
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  function roll() {
    if (tenzies) {
      setDice(allNewDice());
      setTenzies(!setTenzies);
      setCount(0);
      setTime(0);
      setIsDisabled(true);
    } else {
      setDice((oldDice) => oldDice.map((die) => (die.isHeld ? die : generateNewDie())));
      setCount((prevValue) => prevValue + 1);
    }
  }

  const diceElements = dice.map((die) => <Die key={die.id} id={die.id} value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)} />);

  return (
    <div className="container">
      <main>
        {tenzies && <Confetti width={window.innerWidth} height={window.innerHeight} />}
        <h1 className="title">Tenzies</h1>
        <p className="instructions">
          Roll until all dice are the same.<br></br> Click each die to freeze it at its current value between rolls.
        </p>
        <div className="record">
          <p className="count-record">{count}</p>
          <Stopwatch minutes={minutes} seconds={seconds} milliseconds={milliseconds} />
        </div>
        <div className="dice-container">{diceElements}</div>
        <button className="roll-dice" onClick={roll} disabled={isDisabled}>
          {tenzies ? "New Game" : "Roll"}
        </button>
      </main>
      <aside>
        <Highscore record={record} />
      </aside>
    </div>
  );
}
