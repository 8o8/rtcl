export default function ({store, route, redirect}) {
    store.commit("session/setLocationAfterAuth", route.path)
    if (!store.getters["session/valid"]) {
        return redirect("/login")
    }

    // make sure the profile is loaded into the store from local storage
    store.dispatch("user/ensureProfile")
}