<template>
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item" href="/">
                <span class="icon is-large has-text-success"><i class="fas fa-book is-size-3"></i></span>
                <span class="is-size-3 has-text-weight-bold">rtcl.</span>
            </a>
            <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false"
               v-on:click="toggleMenu" :class="{'is-active': menuActive}">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>
        <div :class="{'navbar-menu': true, 'is-active': menuActive}" @click="menuActive = false">
            <div class="navbar-start">
            </div>
            <div class="navbar-end">
                <a class="navbar-item">
                    <nuxt-link to="/search">Search</nuxt-link>
                </a>
                <a class="navbar-item">
                    <nuxt-link to="/saved">Saved</nuxt-link>
                </a>
                <a class="navbar-item">
                    <nuxt-link to="/log">Log</nuxt-link>
                </a>
                <a class="navbar-item">
                    <nuxt-link to="/report">Report</nuxt-link>
                </a>
                <a class="navbar-item">
                    <nuxt-link to="/setup">Setup</nuxt-link>
                </a>
                <div class="navbar-item">
                    <div class="field is-grouped is-grouped-multiline">
                        <p class="control" v-if="!loggedIn">
                            <nuxt-link class="button is-info" to="/signup">sign up</nuxt-link>
                        </p>
                        <p class="control" v-if="!loggedIn">
                            <nuxt-link class="button is-success" to="/login">login</nuxt-link>
                        </p>
                        <p class="control" v-if="loggedIn">
                            <a class="button is-danger" @click="logout">logout</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
    export default {
        name: "navbar",

        data() {
            return {
                menuActive: false,
            }
        },

        computed: {
            loggedIn() {
                return this.$store.state.session.token.valid
            }
        },

        methods: {
            toggleMenu() {
                this.menuActive = !this.menuActive
            },
            logout() {
                this.$store.dispatch("session/destroy")
                    .then(() => {
                        this.$store.dispatch("user/clearProfile")
                        this.$router.push("/")
                    })
            }
        },
    }
</script>

<style scoped>
    a {
        color: #47494e;
    }

    .icon {
        margin-bottom: -0.4rem;
    }

</style>