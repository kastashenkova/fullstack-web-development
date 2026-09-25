const Countries = ({ countries, onShow }) => (
    <div>
        {countries.map(c =>
            <div key={c.id}>
                {c.name}{' '}
                <button onClick={() => onShow(c.id)}>
                    show
                </button>
            </div>
        )}
    </div>
)

export default Countries
