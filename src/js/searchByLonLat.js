import axios from 'axios'

export default async function (lon, lat) {
    try {
        const data = await axios.get(process.env.VUE_APP_URL_ONE_CALL +
            "lat=" +
            lat +
            "&lon=" +
            lon +
            "&exclude=current,minutely&units=imperial&appid=" +
            process.env.VUE_APP_API_KEY
        );

        return data

    } catch (error) {
        console.log(error.message)
    }
}
