const Header = (props) => <h2>{props.course}</h2>

const Content = (props) => (
    <div>
        {props.parts.map(part =>
            <Part key={part.id} part={part} />
        )}
    </div>
)

const Part = (props) => (
    <p>
        {props.part.name} {props.part.exercises}
    </p>
)

const Total = (props) => {
    const total = props.parts.reduce((s, p) => s + p.exercises, 0);

    return (
        <div>
            <p><b>total of {total} exercises</b></p>
        </div>
    )
}

const Course = ({ course }) => {
    return (
        <div>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    )
}

export default Course
