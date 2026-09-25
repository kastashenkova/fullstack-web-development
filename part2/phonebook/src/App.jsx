import personService from './services/persons.js'
import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [searchName, setSearchName] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)

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

                        setErrorMessage(null)
                        setSuccessMessage(
                            `Phone number of ${personToUpdate.name} is changed`
                        )
                        setTimeout(() => {
                            setSuccessMessage(null)
                        }, 5000)
                    })
                    .catch(() => {
                        setSuccessMessage(null)

                        setErrorMessage(
                            `Information of ${personToUpdate.name} has already been removed from server`
                        )

                        setTimeout(() => {
                            setErrorMessage(null)
                        }, 5000)

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

                setSuccessMessage(
                    `Added ${object.name}`
                )
                setTimeout(() => {
                    setSuccessMessage(null)
                }, 5000)
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

                    setSuccessMessage(
                        `Deleted ${personToDelete.name}`
                    )
                    setTimeout(() => {
                        setSuccessMessage(null)
                    }, 5000)
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
            <Notification message={successMessage ? successMessage : errorMessage}
                          className={successMessage ? 'success' : 'error'} />

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
