const Header = (props) => {
    return (
        <h1>{props.course}</h1>
    )
}

const Content = (props) => {
    return (
        <div>
            <Part part_name={props.part1} exercises={props.exercises1} />
            <Part part_name={props.part2} exercises={props.exercises2} />
            <Part part_name={props.part3} exercises={props.exercises3} />
        </div>
    )
}

const Part = (props) => {
    return (
        <p>
            {props.part_name} {props.exercises}
        </p>
    )
}

const Total = (props) => {
    return (
        <p>
            Number of exercises {props.exercises1 + props.exercises2 + props.exercises3}
        </p>
    )
}

const App = () => {
    const course = 'Half Stack application development'
    const part1 = {
        name: 'Fundamentals of React',
        exercises: 10
    }
    const part2 = {
        name: 'Using props to pass data',
        exercises: 7
    }
    const part3 = {
        name: 'State of a component',
        exercises: 14
    }

    return (
        <div>
            <Header course={course} />

            <Content
                part1={part1.name} exercises1={part1.exercises1}
                part2={part2.name} exercises2={part1.exercises2}
                part3={part3.name} exercises3={part1.exercises3}
            />

            <Total
                exercises1={part1.exercises1} exercises2={part1.exercises2} exercises3={part1.exercises3}
            />
        </div>
    )
}

export default App

