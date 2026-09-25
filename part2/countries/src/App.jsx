import countryService from './services/countries.js'
import { useState, useEffect } from 'react'
import Search from './components/Search'
import Countries from './components/Countries'
import CountryInfo from './components/CountryInfo'

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchName, setSearchName] = useState('')
  const [shownId, setShownId] = useState(null)
  const [capitalWeather, setCapitalWeather] = useState(null)

  useEffect(() => {
    countryService
        .getAll()
        .then(allCountries => setCountries(allCountries))
  }, [])

  const handleFilter = (event) => {
    setSearchName(event.target.value)
    setShownId(null)
  }

  const foundCountries = countries.filter(country =>
      country.name.toLowerCase().includes(searchName.toLowerCase())
  )

  const singleCountry =
      foundCountries.length === 1
          ? foundCountries[0]
          : foundCountries.find(c => c.id === shownId)

  useEffect(() => {
    if (!singleCountry) {
      setCapitalWeather(null)
      return
    }

    setCapitalWeather(null)
    countryService
        .getCapitalWeatherByName(singleCountry.capital)
        .then(weather => setCapitalWeather(weather))
  }, [singleCountry])

  return (
      <div>
        <h2>Countries</h2>

        <Search value={searchName} onChange={handleFilter} />

        {searchName !== '' && foundCountries.length > 10 && (
            <p>Too many matches, specify another filter</p>
        )}

        {foundCountries.length > 1 && foundCountries.length <= 10 && !singleCountry && (
            <Countries countries={foundCountries} onShow={setShownId} />
        )}

        {singleCountry && <CountryInfo country={singleCountry} capitalWeather={capitalWeather} />}
      </div>
  )
}

export default App
