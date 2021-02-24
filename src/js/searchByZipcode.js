import axios from 'axios'

export default async function (query) {
    try {
        const data = await axios.get(process.env.VUE_APP_URL_CURRENT_ZIP + query + ',us&units=imperial&appid=' + process.env.VUE_APP_API_KEY)

        return data

    } catch (error) {
        console.log(error.message)
    }
}