import { useState } from 'react'

const Statistics = (props) => {
    if (props.total === 0) {
        return (
            <div>No feedback given</div>
        )
    }
    return (
        <div>
            <div>good {props.good}</div>
            <div>neutral {props.neutral}</div>
            <div>bad {props.bad}</div>
            <div>all {props.total}</div>
            <div>average {props.average}</div>
            <div>positive {props.positivePercentage} %</div>
        </div>
    )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

    const total = good + neutral + bad
    const average = total === 0 ? 0 : (good - bad) / total
    const positivePercentage = total === 0 ? 0 : (good / total) * 100

    const handleGoodClick = () => {
        setGood(good + 1)
    }

    const handleNeutralClick = () => {
        setNeutral(neutral + 1)
    }

    const handleBadClick = () => {
        setBad(bad + 1)
    }

  return (
      <div>
        <h1>give feedback</h1>
        <button onClick={handleGoodClick}>good</button>
        <button onClick={handleNeutralClick}>neutral</button>
        <button onClick={handleBadClick}>bad</button>
        <h1>statistics</h1>
        <Statistics good={good}
                    neutral={neutral}
                    bad={bad}
                    total={total}
                    average={average}
                    positivePercentage={positivePercentage}/>
      </div>
  )
}

export default App
