<template>
    <div>
        <div :class="{'modal' : true, 'is-active': deleteModal}">
            <div class="modal-background"></div>
            <div class="modal-content">
                <div class="notification">
                    <button class="delete" @click="deleteModal = false"></button>
                    <b>Are you sure you want to delete this log entry?</b><br>
                    <br>
                    <a class="button is-success" @click="deleteLog(currentEditID)">
                        Yes, delete it
                    </a>
                    <a class="button is-text" @click="deleteModal = false">
                        Cancel
                    </a>
                </div>
            </div>
        </div>
        <PageSection>
            <h2 class="title is-2">Log</h2>
            <p class="subtitle is-5 has-text-grey">...of articles read</p>
            <p class="subtitle is-6 has-text-grey">
                <span v-if="logs">
                    You have logged <b>{{ totalReadingHours() }} hours</b> total reading time.
                    Click row to edit / delete.
                </span>
                <span v-else>
                    At this stage, you don't have any reading time recorded.
                </span>
            </p>

            <template v-for="log, i in logs">

                <div v-if="currentEdit != i"
                     class="notification action-row"
                     @click="setCurrentEdit(i, log.id)"
                     :key="i"
                >
                    {{ log.date | displayDate }} ({{ log.minutes }} min)<br>
                    <b>{{ log.title }}</b><br>
                    <ArticleLink :pmid="log.pmid">{{ log.source }}</ArticleLink>
                    <br>
                    <span v-if="log.comment"><i>{{ log.comment }}</i></span>
                </div>

                <div v-if="currentEdit == i"
                     class="notification is-info"
                     :key="i"
                >
                    <button class="delete is-large" @click="clearCurrentEdit"></button>
                    <div class="field">
                        {{ log.date | displayDate }} ({{ log.minutes }} min)<br>
                        <b>{{ log.title }}</b><br>
                        <ArticleLink :pmid="log.pmid">{{ log.source }}</ArticleLink>
                        <br>
                        <span v-if="log.comment"><i>{{ log.comment }}</i></span>
                    </div>
                    <div class="field is-grouped">

                        <LogModal :articleData="log">
                            <template slot="open">
                                <p class="control">
                                    <button class="button is-warning">Edit</button>
                                </p>
                            </template>
                        </LogModal>

                        <p class="control">
                            <button class="button is-danger left-margin" @click="deleteModal = true">
                                Delete
                            </button>
                        </p>

                    </div>
                </div>

            </template>

        </PageSection>
    </div>
</template>

<script>

    import LogModal from '~/components/LogModal'
    import ArticleLink from '~/components/ArticleLink'

    export default {

        middleware: "sessionAuth",

        components: {
            LogModal,
            ArticleLink,
        },

        data() {
            return {
                currentEditIndex: null,
                currentEditID: null,
                deleteModal: false,
            }
        },

        computed: {
            currentEdit() {
                return this.currentEditIndex
            },
            logs() {
                return this.$store.state.user.logs
            }
        },

        methods: {
            setCurrentEdit(index, id) {
                this.currentEditIndex = index
                this.currentEditID = id
            },
            clearCurrentEdit() {
                this.currentEditIndex = null
            },
            totalReadingHours() {
                let mins = 0
                for (let i = 0; i < this.logs.length; i++) {
                    mins += this.logs[i].minutes
                }
                return (mins / 60).toFixed(2)
            },

            fetchLogs() {
                this.$store.dispatch('user/updateLogs', this.$store.state.session.token.jwt)
                    .then((r) => {
                        // nada
                    })
                    .catch(e => {
                        this.$root.$emit('message', {
                            class: "error",
                            body: e
                        })
                    })
            },

            deleteLog(id) {
                this.$store.dispatch("user/deleteLog", {token: this.$store.state.session.token.jwt, id: id})
                    .then(() => {
                        this.clearCurrentEdit()
                        this.deleteModal = false
                        this.fetchLogs()
                        this.$root.$emit('message', {class: "success", body: "log deleted", ttl: 1000})
                    })
                    .catch(e => {
                        this.$root.$emit('message', {class: "error", body: e.response})
                        this.deleteModal = false
                    })
            }
        },

        beforeMount() {
            this.fetchLogs()
        },

        mounted() {
            this.$root.$on('logsUpdated', this.fetchLogs)
        }
    }
</script>

<style scoped>
    .action-row:hover {
        cursor: pointer;
        opacity: 0.8;
    }

    a:hover {
        text-decoration: none;
    }

    .left-margin {
        margin-left: 0.8rem;
    }
</style>