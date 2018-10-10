<template>
    <div>
        <PageSection>

            <section class="hero">
                <div class="hero-body">
                    <div class="container has-text-centered">
                        <div class="column is-4 is-offset-4">
                            <div class="box">
                                <h3 class="title has-text-grey">Login</h3>
                                <p class="subtitle has-text-danger">{{ error }}&nbsp;</p>
                                <form @submit.prevent="onSubmit">
                                    <div class="field">
                                        <div class="control">
                                            <input class="input is-medium" type="email" placeholder="Your Email"
                                                   autofocus="" v-model="login">
                                        </div>
                                    </div>

                                    <div class="field">
                                        <div class="control">
                                            <input class="input is-medium" type="password" placeholder="Your Password"
                                                   v-model="password">
                                        </div>
                                    </div>
                                    <button type="submit" class="button is-block is-success is-large is-fullwidth">
                                        Login
                                    </button>
                                </form>
                            </div>
                            <p>
                                <a href="/forgot">Forgot Password?</a> &nbsp;·&nbsp;
                                <a href="#">Need Help?</a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

        </PageSection>
    </div>
</template>

<script>

    export default {
        name: "login",
        layout: "login",

        data() {
            return {
                login: "",
                password: "",
                error: "",
            }
        },

        methods: {

            onSubmit() {
                this.$store.dispatch("user/authenticate", {login: this.login, password: this.password})
                    .then((res) => {
                        this.$store.dispatch("user/refreshProfile", res.data.token)
                            .then((r) => {
                                this.$store.commit("session/setToken", res.data.token)
                                this.$store.commit("user/setProfile", r.data)
                                this.redirectAfterLogin()
                            })
                            .catch(err => {
                                console.log("Error fetching profile", err)
                            })

                    })
                    .catch(() => {
                        this.error = "...that didn't work"
                    })
                    .catch((err) => {
                        this.error = "error"
                        console.log(err)
                    })
            },

            redirectAfterLogin() {
                if (this.$store.state.session.locationAfterAuth.length) {
                    this.$router.push(this.$store.state.session.locationAfterAuth)
                } else {
                    this.$router.push("/")
                }
            }
        },

    }
</script>

<style scoped>
</style>
