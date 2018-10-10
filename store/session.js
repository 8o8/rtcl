import jwtDecode from 'jwt-decode'

const tokenStorageKey = "rtcl-token"

export const state = () => {
    return {
        token: {
            jwt: "",
            ttl: 0,
            decoded: {},
            valid: false,
            message: "",
        },
        locationAfterAuth: "/",
    }
}

export const mutations = {

    setToken(state, jwt) {
        localStorage.setItem(tokenStorageKey, jwt)
        state.token.jwt = jwt
    },

    clearToken(state) {
        localStorage.removeItem(tokenStorageKey)
        state.token.jwt = ""
        state.token.ttl = 0
        state.token.decoded = {}
        state.token.valid = false
        state.token.message = "Session has been cleared"
    },

    validate(state) {

        // set tokens, give preference to store token
        if (state.token.jwt.length) {
            localStorage.setItem(tokenStorageKey, state.token.jwt)
        } else if (localStorage.getItem(tokenStorageKey)) {
            state.token.jwt = localStorage.getItem(tokenStorageKey)
        } else {
            console.log("No token in store or localStorage - session invalid")
            state.token.valid = false
            return false
        }

        // Validate token, and set store token values
        try {
            state.token.decoded = jwtDecode(state.token.jwt)
            state.token.ttl = ttlMinutes(state.token.decoded.exp)
            if (state.token.ttl > 0) {
                state.token.jwt = localStorage.getItem(tokenStorageKey)
                state.token.valid = true
                state.token.message = "Token is valid and expires in the future"
                return true
            } else {
                localStorage.removeItem(tokenStorageKey)
                state.token.valid = false
                state.token.message = "Token has expired"
            }
        }
        catch (e) {
            state.token.valid = false
            state.token.message = "Token could not be decoded"
            return false
        }

        return false
    },

    setLocationAfterAuth(state, path) {
        state.locationAfterAuth = path
    }
}

export const actions = {

    destroy({commit}) {
        commit("clearToken")
    }

}

export const getters = {

    token(state) {
        return state.token
    },

    valid(state) {
        return state.token.valid
    }
}

// calculate the time to live in minutes
function ttlMinutes(epochSeconds) {
    return (epochSeconds * 1000 - Date.now()) / 60000  // milliseconds back to minutes
}
