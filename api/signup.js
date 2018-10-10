import axios from 'axios'

const BASE_URL = process.env.apiBaseUrl

export default {
    addUser(user) {
        return axios.post(BASE_URL+'/users', user)
    },
    welcomeUser(userID) {
        return axios.post(BASE_URL+`/users/${userID}/notifications/welcome`, '')
    }
}