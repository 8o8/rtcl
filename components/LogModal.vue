<template>
    <div>
        <!--click wrapper as cannot listen for click on a slot-->
        <span @click="openModal"><slot name="open">open</slot></span>

        <div class="modal" :class="{'is-active': open}">
            <div class="modal-background"></div>
            <div class="modal-content">

                <div class="notification is-info" v-if="!logFormOpen && !articleData.id">
                    <h4 class="title is-4">You opened an article.</h4>
                    <div class="subtitle is-6">Would you like to log some reading time?</div>
                    <div>
                        <button class="button is-success is-large" @click="logFormOpen = true">Yes</button>&nbsp;
                        <button class="button is-danger  is-large" @click="closeModal">No</button>
                    </div>
                </div>
                <div class="notification" v-if="logFormOpen || articleData.id">
                    <button class="delete" @click="closeModal"></button>
                    <h4 class="title is-4 has-text-dark">RTCL. Log</h4>
                    <LogForm :articleData="articleData"/>
                </div>

            </div>
            <button class="modal-close is-large" aria-label="close" @click="closeModal"></button>
        </div>
    </div>
</template>

<script>
    import LogForm from "~/components/LogForm"

    export default {

        name: 'logModal',

        props: {
            // Option to pre-populate form
            articleData: {
                type: Object,
            },
        },

        components: {
            LogForm,
        },

        data() {
            return {

                open: false,
                logFormOpen: false,
                errorAlert: false,
                errorMessage: null,

                // Form data elements
                activity: {
                    id: null,
                    typeId: null,
                    date: null,
                    quantity: 0,
                    comment: "",
                },
            }

        },

        methods: {

            openModal() {
                this.open = true
            },

            closeModal() {
                this.open = false
            },

        },

        mounted() {

            // activityData object can be used to initialise the local activity object
            if (this.activityData) {

                // id of member activity record (editing an existing record)
                if (this.activityData.id) {
                    this.activity.id = this.activityData.id
                }

                // quantity (generally hours)
                if (this.activityData.quantity) {
                    // initialise the computed value, watcher will set activity.quantity
                    this.quantity = this.activityData.quantity
                }

                // id of activity TYPE
                if (this.activityData.typeId) {
                    this.activity.typeId = this.activityData.typeId
                }

                if (this.activityData.comment) {
                    this.activity.comment = this.activityData.comment
                }
            }

            // listen for a 'close' or a 'cancel'
            this.$root.$on('close', () => {
                this.closeModal()
            })
            this.$root.$on('cancel', () => {
                this.closeModal()
            })

        },
    }
</script>

<style scoped>
</style>
