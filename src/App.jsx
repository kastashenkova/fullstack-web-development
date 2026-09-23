import { useState } from 'react'

const Button = (props) => (
    <button onClick={props.onClick}>
      {props.text}
    </button>
)

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
  }

  const handleBadClick = () => {
    const updatedBad = bad + 1
     setBad(updatedBad)
  }

  const handleNeutralClick = () => {
    const updatedNeutral = neutral + 1
     setNeutral(updatedNeutral)
  }

  return (
      <div>
        <h1>give feedback</h1>
        <button onClick={handleGoodClick}>good</button>
        <button onClick={handleNeutralClick}>neutral</button>
        <button onClick={handleBadClick}>bad</button>
        <h1>statistics</h1>
        <div>good {good}</div>
        <div>neutral {neutral}</div>
        <div>bad {bad}</div>
      </div>
  )
}

export default App
