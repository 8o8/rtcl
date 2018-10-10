import apiUser from '~/api/user'

export const state = () => {
    return {
        profile: {},
        logs: [],
        search: "",
    }
}

export const mutations = {

    setProfile(state, profile) {
        state.profile = profile
        localStorage.setItem("rtcl-user", JSON.stringify(profile))
    },

    delProfile(state) {
        state.profile = {}
        localStorage.removeItem("rtcl-user")
    },

    setSearch(state, query) {
        state.search = query
        localStorage.setItem("rtcl-search", query)
    },

    delSearch(state) {
        state.search = ""
        localStorage.removeItem("rtcl-search")
    },

    setLogs(state, logs) {
        state.logs = logs
    }
}

export const actions = {

    authenticate({commit, dispatch, state}, body) {
        return apiUser.authenticateUser(body)
    },

    refreshProfile({commit}, token) {
        return apiUser.fetchUserProfile(token)
    },

    saveProfile({commit}, {token, data}) {
      return apiUser.updateUserProfile(token, data)
    },

    // Ensure profile makes sure we have a profile loaded into the store
    ensureProfile({state, commit, rootGetters, dispatch}) {
        if (!state.profile.id) {
            let profile = localStorage.getItem("rtcl-user")
            if (profile) {
                commit("setProfile", JSON.parse(profile))
                return
            }
            const token = rootGetters["session/token"].jwt
            dispatch("refreshProfile", token)
        }
    },

    clearProfile({commit}) {
        commit("delProfile")
    },

    saveSearch({commit}, {token, query}) {
        return apiUser.saveUserSearch(token, query)
    },

    // delete a search query from the users saved searches
    deleteSearch({commit}, {token, query}) {
        apiUser.deleteUserSearch(token, query)
            .then(r => {
                commit("setProfile", r.data)
            })
            .catch(e => {
                console.log(e)
            })
    },

    saveLog({commit}, {token, data}) {
        return apiUser.saveUserLog(token, data)
    },

    deleteLog({commit}, {token, id}) {
        return apiUser.deleteUserLog(token, id)
    },

    fetchLogs({commit}, token) {
        return apiUser.fetchUserLogs(token)
    },

    updateLogs({state, commit}, token) {
        return new Promise((resolve, reject) => {
            apiUser.fetchUserLogs(token)
                .then(r => {
                    commit("setLogs", r.data)
                    resolve("User logs fetched and updated in store")
                })
                .catch(e => {
                    reject('Could not fetch / update user logs: ' + e.response.status + ' ' + e.response.statusText)
                })
        })
    },
}

export const getters = {

    searchCategories(state) {
        if (state.profile.categories) {
            return state.profile.categories
        }
        return []
    }

}