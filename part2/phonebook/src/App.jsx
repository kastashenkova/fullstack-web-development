import personService from './services/persons.js'
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
        personService
            .getAll()
            .then(initialPersons => {
                setPersons(initialPersons)
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
            const confirmation = window.confirm(
                `${newName} is already added to phonebook, replace the old number with a new one?`
            )
            if (confirmation) {
                const personToUpdate = persons.find(person => person.name === newName)
                const changedPerson = { ...personToUpdate, number: newNumber }

                personService
                    .update(personToUpdate.id, changedPerson)
                    .then(returnedPerson => {
                        setPersons(persons.map(person =>
                            person.id !== personToUpdate.id ? person : returnedPerson
                        ))
                        setNewName('')
                        setNewNumber('')
                    })
                    .catch(error => {
                        alert(`the person '${personToUpdate.name}' was already deleted from server`)
                        setPersons(persons.filter(person => person.id !== personToUpdate.id))
                    })
            }

            return
        }

        const object = {
            name: newName,
            number: newNumber,
        }

        personService
            .create(object)
            .then(returnedPerson => {
                setPersons(persons.concat(returnedPerson))
                setNewName('')
                setNewNumber('')
            })
    }

    const deletePerson = (id) => {
        const personToDelete = persons.find((n) => n.id === id)
        if (!personToDelete) {
            return
        }

        const confirmation = window.confirm(`Delete ${personToDelete.name} ?`)
        if (confirmation) {
            personService
                .deletePerson(id)
                .then(() => {
                    setPersons(persons.filter(person => person.id !== id))
                })
        }

        return
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

            <Persons persons={personsToShow} onDelete={deletePerson}/>
        </div>
    )
}

export default App
