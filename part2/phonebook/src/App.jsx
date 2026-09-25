import axios from 'axios'
import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [searchName, setSearchName] = useState('')

    useEffect(() => {
        axios
            .get('http://localhost:3001/persons').then(response => {
            setPersons(response.data)
        })
    }, [])

    const personsToShow = persons.filter(person =>
        person.name.toLowerCase().includes(searchName.toLowerCase())
    )

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    const addPerson = (event) => {
        event.preventDefault()

        if (newName === '' || newNumber === '') {
            window.alert('Please, fill all the form fields!')
            return
        }

        if (persons.some(person => person.name === newName)) {
            window.alert(`${newName} is already added to phonebook`)
            return
        }

        const object = {
            id: persons.length + 1,
            name: newName,
            number: newNumber,
        }

        setPersons(persons.concat(object))
        setNewName('')
        setNewNumber('')
    }

    const handleFilter = (event) => {
        setSearchName(event.target.value)
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter value={searchName} onChange={handleFilter} />

            <h3>Add a new</h3>

            <PersonForm onSubmit={addPerson}
                        nameValue={newName}
                        numberValue={newNumber}
                        onNameChange={handleNameChange}
                        onNumberChange={handleNumberChange} />

            <h3>Numbers</h3>

            <Persons persons={personsToShow}/>
        </div>
    )
}

export default App
