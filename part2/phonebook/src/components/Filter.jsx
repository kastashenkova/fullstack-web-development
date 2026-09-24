const Filter = (props) => {
    return (
        <div>
            filter shown with: <input value={props.searchName} onChange={handleFilter}/>
        </div>
    )
}

export default Filter
