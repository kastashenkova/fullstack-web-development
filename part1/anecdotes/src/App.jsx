import { useState } from 'react'

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const handleRandomInteger = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomIndex)
    console.log(randomIndex)
  }

  const handleVote = (position) => {
    const copy = [...votes]
    copy[position] += 1
    setVotes(copy)
  }

  const mostVotesIndex = votes.indexOf(Math.max(...votes))
  
  console.log(mostVotesIndex)
  console.log(votes)

  return (
      <div>
        <h1>Anecdote of the day</h1>
        {anecdotes[selected]}
        <div>
          <Button text="vote" onClick={() => handleVote(selected)}/>
          <Button text="next anecdote" onClick={handleRandomInteger}></Button>
        </div>
        <h1>Anecdote with most votes</h1>
        <div>{anecdotes[mostVotesIndex]}</div>
      </div>
  )
}

export default App
