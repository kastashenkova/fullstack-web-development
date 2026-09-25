const Persons = (props) => (
    <div>
        {props.persons.map(person =>
            <div key={person.id}>
                {person.name} {person.number}
            </div>
        )}
    </div>
)

export default Persons
