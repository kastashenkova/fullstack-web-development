const CountryInfo = ({ country, capitalWeather }) => (
    <div>
            <h2>{country.name}</h2>
            <div>Capital {country.capital}</div>
            <div>Area {country.area}</div>
            <h3>Languages</h3>
            <ul>
                    {country.languages.map(language => (
                        <li key={language}>{language}</li>
                    ))}
            </ul>
            {country.flag && <img src={country.flag} alt={`flag of ${country.name}`} width="150" />}
            <h3>Weather in {country.capital}</h3>
            {capitalWeather ? (
                <div>
                        <div>Temperature {capitalWeather.temperature} Celsius</div>
                        {capitalWeather.icon && (
                            <img
                                src={`https://openweathermap.org/img/wn/${capitalWeather.icon}@2x.png`}
                                alt={capitalWeather.description}
                                width="50"
                            />
                        )}
                        <div>Wind {capitalWeather.wind} m/s</div>
                </div>
            ) : (
                <div>loading weather...</div>
            )}
    </div>
)

export default CountryInfo
