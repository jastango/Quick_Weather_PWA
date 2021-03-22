import axios from 'axios'
import searchByCity from "./searchByCity"
import searchByZipcode from './searchByZipcode'
import searchByLonLat from './searchByLonLat'


export default async function getWeather(query) {
    const pattern = /^[0-9]/

    // Check if query is a zipcode or city name

    if (pattern.test(query)) {
        try {
            const current = await searchByZipcode(query)

            const lon = current.data.coord.lon
            const lat = current.data.coord.lat

            // Search by Lon Lat to get Daily Weather (which contains Chance of Percip)
            const daily = await searchByLonLat(lon, lat)
            const weather = {
                current: current,
                daily: daily,
            }

            return weather

        } catch (error) {
            console.log(error.message)
        }
    } else {

        try {
            const current = await searchByCity(query)

            const lon = current.data.coord.lon
            const lat = current.data.coord.lat

            // Search by Lon Lat to get Daily Weather (which contains Chance of Percip)
            const daily = await searchByLonLat(lon, lat)
            const weather = {
                current: current,
                daily: daily
            }
            return weather
        } catch (error) {
            console.log(error.message)
        }
    }
}

