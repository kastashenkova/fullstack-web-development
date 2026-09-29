const mongoose = require('mongoose')
const dns = require('dns')

dns.setServers(['8.8.8.8', '8.8.4.4'])

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
} else if ((process.argv.length > 3 && process.argv.length < 5) || (process.argv.length > 5)) {
  console.log('provide all the arguments: node mongo.js [db-password] [person-name] [person-number]')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.pch7kih.mongodb.net/?appName=Cluster0`

mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

mongoose.connect(url, { family: 4 })

if (process.argv.length === 3) {
  Person
    .find({})
    .then(persons => {
      console.log('phonebook:')
      persons.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
  const personName = process.argv[3]
  const personNumber = process.argv[4]

  const person = new Person({
    name: personName,
    number: personNumber,
  })

  person
    .save()
    .then(result => {
      console.log(
        'added ' + result.name + ' number ' + result.number + ' to phonebook'
      )
      mongoose.connection.close()
    })
}