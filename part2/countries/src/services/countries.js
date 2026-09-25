import axios from 'axios'

const countryBaseUrl = 'https://api.restcountries.com/countries/v5'
const weatherBaseUrl = 'https://api.openweathermap.org/data/2.5/weather'

const countries_api_key = import.meta.env.VITE_COUNTRIES_KEY
const weather_api_key = import.meta.env.VITE_WEATHER_KEY

const countriesAuthHeader = { headers: { Authorization: `Bearer ${countries_api_key}` } }

const mapCountry = (c) => ({
    id: c.codes.alpha_3,
    name: c.names.common,
    capital: c.capitals?.[0]?.name,
    area: c.area?.kilometers,
    population: c.population,
    flag: c.flag?.url_png,
    languages: c.languages?.map(l => l.name) ?? []
})

const fetchPage = (offset) =>
    axios
        .get(countryBaseUrl, { ...countriesAuthHeader, params: { limit: 100, offset } })
        .then(response => response.data.data)

const getAll = async () => {
    const first = await fetchPage(0)
    const second = await fetchPage(100)
    const third = await fetchPage(200)

    return [...first.objects, ...second.objects, ...third.objects].map(mapCountry)
}

const mapWeather = (w) => ({
    temperature: w.main.temp,
    wind: w.wind.speed,
    icon: w.weather?.[0]?.icon,
    description: w.weather?.[0]?.description
})

const getCapitalWeatherByName = (capitalName) => {
    const request = axios.get(weatherBaseUrl, {
        params: {
            q: capitalName,
            appid: weather_api_key,
            units: 'metric'
        }
    })
    return request.then(response => mapWeather(response.data))
}

export default { getAll, getCapitalWeatherByName }
