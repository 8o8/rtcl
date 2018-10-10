import axios from "axios";

const BASE_URL = process.env.apiBaseUrl

export default {

    authenticateUser({login, password}) {
        return axios.post(BASE_URL + '/auth', `{"email": "${login}", "password": "${password}"}`)
    },

    // fetchUser fetches the user record, which includes the saved searches
    fetchUserProfile(token) {
        const cfg = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }
        return axios.get(BASE_URL + `/user`, cfg)
    },

    updateUserProfile(token, data) {
        const cfg = {
            method: 'put',
            baseURL: BASE_URL,
            url: '/user',
            headers: {'Authorization': 'Bearer ' + token},
            data: data,
        }
        return axios(cfg)
    },

    // saves a user search to their list
    saveUserSearch(token, query) {
        let cfg = {
            method: 'post',
            baseURL: BASE_URL,
            url: '/user/search',
            headers: {'Authorization': 'Bearer ' + token},
            data: {
                query: query
            }
        }
        return axios(cfg)
    },

    // removes a user search from their list
    deleteUserSearch(token, query) {
        const cfg = {
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: {
                query: query
            }
        }
        return axios.delete(BASE_URL + `/user/search`, cfg)
    },

    // saves a user log entry
    saveUserLog(token, data) {
        let cfg = {
            method: 'post',
            baseURL: BASE_URL,
            url: '/user/log',
            headers: {'Authorization': 'Bearer ' + token},
            data: data,
        }
        return axios(cfg)
    },

    deleteUserLog(token, id) {
        const cfg = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }
        return axios.delete(BASE_URL + `/user/log/${id}`, cfg)
    },

    fetchUserLogs(token) {
        const cfg = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }
        return axios.get(BASE_URL + `/user/logs`, cfg)
    },
}