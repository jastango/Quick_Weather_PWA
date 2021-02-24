import axios from 'axios'

export default async function (query) {
    try {
        const data = await axios.get(process.env.VUE_APP_URL_CURRENT, {
            params: {
                q: query,
                units: 'imperial',
                APPID: process.env.VUE_APP_API_KEY
            }
        })

        return data

    } catch (error) {
        console.log(error.message)
    }
}

