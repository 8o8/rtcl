<template>
    <div>
        <div :class="{'modal' : true, 'is-active': deleteModal}">
            <div class="modal-background"></div>
            <div class="modal-content">
                <div class="notification">
                    <button class="delete" @click="deleteModal = false"></button>
                    <b>Are you sure?</b><br>
                    <br>
                    <a class="button is-success" @click="deleteQuery(currentEditQuery)">
                        Yes, delete it
                    </a>
                    <a class="button is-text" @click="deleteModal = false">
                        Cancel
                    </a>
                </div>
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close"
                @click="deleteModal = false"></button>

        <PageSection>
            <h2 class="title is-2">Saved Searches</h2>
            <p class="subtitle is-5 has-text-grey">...weekly updates for each.</p>

            <p class="subtitle is-6 has-text-grey">
                <span v-if="numSavedSearches">
                    Below are the search queries you have saved. Click the row for
                    available actions.</span>
                <span v-else>
                    To create a notification you need to have a saved <nuxt-link to="/search">search phrase</nuxt-link>.<br>
                    At this stage, you don't have any!
                </span>
            </p>

            <template v-for="search, i in searches">

                <div v-if="currentEdit != i"
                     class="notification action-row"
                     @click="setCurrentEdit(i)"
                     :key="i"
                >
                    {{ search.query }}
                </div>

                <div v-if="currentEdit == i"
                     class="notification is-info"
                     :key="i"
                >
                    <button class="delete is-large" @click="clearCurrentEdit"></button>
                    <div class="field">
                        <span class="is-size-4">{{ search.query }}</span>
                    </div>
                    <div class="field is-grouped">
                        <p class="control">
                            <button class="button is-success" @click="doSearch(search.query)">
                                Run this search
                            </button>
                        </p>
                        <p class="control">
                            <button class="button is-danger" @click="deleteModal = true">
                                Delete query
                            </button>
                        </p>
                    </div>
                </div>

            </template>

        </PageSection>
    </div>
</template>

<script>
    export default {
        name: "index",
        middleware: "sessionAuth",

        data() {
            return {
                currentEditIndex: null,
                deleteModal: false,
            }
        },

        computed: {
            searches() {
                return this.$store.state.user.profile.searches
            },
            numSavedSearches() {
                if (this.$store.state.user.profile.searches) {
                    return this.$store.state.user.profile.searches.length
                }
            },
            currentEdit() {
                return this.currentEditIndex
            },
            currentEditQuery() {
                if (this.currentEdit != null) {
                    return this.searches[this.currentEdit].query
                }
            }
        },

        methods: {
            setCurrentEdit(index) {
                this.currentEditIndex = index
            },
            clearCurrentEdit() {
                this.currentEditIndex = null
            },
            doSearch(query) {
                this.$store.commit('user/setSearch', query)
                this.$router.push("/search")
            },
            deleteQuery(query) {
                this.$store.dispatch('user/deleteSearch', {token: this.$store.state.session.token.jwt, query: query})
                    .then(() => {
                        this.clearCurrentEdit()
                        this.deleteModal = false
                    })
                    .catch(e => {
                        this.$root.$emit('message', {
                            class: 'error',
                            body: e.reponse.data.error,
                        })
                    })
            }
        }
    }
</script>

<style scoped>
    .action-row:hover {
        cursor: pointer;
        opacity: 0.9;
    }
</style>