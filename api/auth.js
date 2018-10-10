import axios from "axios";

export default {

    authenticateUser({login, password}) {
        return axios.post(process.env.API_BASE_URL+'/auth', `{"email": "${login}", "password": "${password}"}`)
    }
}