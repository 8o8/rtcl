<template>
    <div>
        <div v-if="showForm">
            <div :class="['message', editClass]">
                <div class="message-header">
                    {{ saveMode }} activity {{ form.id ? form.id : '' }}
                </div>
                <div class="message-body">
                    <div class="field">
                        <p>
                            <b>{{ articleData.title }}</b><br>
                            <i>{{ articleData.source }}</i><br>
                        </p>
                    </div>

                    <div class="field">
                        <label class="label">Date</label>
                        <div class="control has-icons-left">
                            <DatePicker name="date" placeholder="select date of activity" readonly
                                        :config="{defaultDate: dateToday}"
                                        v-model="form.date"
                            >
                            </DatePicker>
                            <span class="icon is-small is-left">
                                <i class="fa fa-calendar"></i>
                            </span>
                            <div class="help">
                                <span>&nbsp;</span>
                            </div>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Time (minutes)</label>
                        <div :class="{ 'control': true }">
                            <input name="minutes" type="text" placeholder="total minutes reading"
                                   v-model.number="form.minutes"
                                   v-validate="'required|min_value:1|max_value:600'"
                                   :class="{'input': true, 'is-danger': errors.has('minutes') }"
                            >
                            <div class="help">
                                <span v-if="errors.has('minutes')" class="has-text-danger">
                                    {{ errors.first('minutes') }}
                                </span>&nbsp;
                            </div>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Comment</label>
                        <div class="control">
                            <textarea name="comment" placeholder="Optional note for your reference"
                                      v-model="form.comment"
                                      :class="{'textarea': true, 'is-danger': errors.has('comment')}"></textarea>
                        </div>
                    </div>

                    <div class="field is-grouped">

                        <template v-if="!valid">
                            <div class="control is-expanded">
                                <button class="button fixed-width" @click="validateForm">Save</button>
                            </div>
                            <div class="control">
                                <button class="button" @click="closeModal">Cancel</button>
                            </div>
                        </template>

                        <template v-if="valid && saveMode === 'add'">
                            <div class="control is-expanded">
                                <button :class="{'button': true, 'is-success': true, 'fixed-width': true, 'is-loading': loading}"
                                        @click="saveActivity">Save
                                </button>
                            </div>
                            <div class="control">
                                <button class="button" @click="closeModal">Cancel</button>
                            </div>
                        </template>

                        <template v-if="valid && saveMode === 'edit'">

                            <div class="control">
                                <button :class="{'button': true, 'is-success': true, 'is-loading': loading}"
                                        @click="saveActivity">Save
                                </button>
                            </div>
                            <div class="control">
                                <button class="button" @click="closeModal">Done</button>
                            </div>

                        </template>

                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import DatePicker from 'vue-bulma-datepicker'

    export default {
        props: {

            // Option to pass in an activity object to pre-populate
            articleData: {
                type: Object,
            },
        },

        components: {
            DatePicker,
        },

        data() {
            return {
                showForm: true,
                loading: false,
                form: {
                    id: null,
                    date: null,
                    pmid: this.articleData.pmid,
                    minutes: null,
                    title: this.articleData.title,
                    source: this.articleData.source,
                    url: this.articleData.url,
                    comment: null,
                },
            }
        },

        computed: {

            dateToday() {
                return new Date()
            },

            // add or edit flag
            saveMode() {
                if (this.form.id) {
                    return "edit"
                }
                return "add"
            },

            editClass() {
                if (this.saveMode === "edit") {
                    return "is-warning"
                }
                return "is-success"
            },

            valid: {
                set() {
                    return false
                },
                get() {
                    // first check for non-falsey values...
                    if (this.form.date && this.form.minutes) {
                        if (!this.errors.items.length) {
                            return true
                        }
                    }
                    return false
                }
            },
        },

        methods: {

            validateForm() {
                let v = false
                this.$validator.validateAll()
                    .then(res => {
                        if (res) {
                            v = true
                        }
                    })
                return false
            },

            syncFormToProps() {

                // articleData object can be used to initialise the local activity object
                if (this.articleData) {

                    // id of member activity record (when editing)
                    if (this.articleData.id) {
                        this.form.id = this.articleData.id
                    }

                    if (this.articleData.date) {
                        this.form.date = this.articleData.date
                    }

                    if (this.articleData.minutes) {
                        this.form.minutes = this.articleData.minutes
                    }

                    if (this.articleData.pmid) {
                        this.form.pmid = this.articleData.pmid
                    }

                    if (this.articleData.title) {
                        this.form.title = this.articleData.title
                    }

                    if (this.articleData.source) {
                        this.form.source = this.articleData.source
                    }

                    if (this.articleData.url) {
                        this.form.url = this.articleData.url
                    }

                    if (this.articleData.comment) {
                        this.form.comment = this.articleData.comment
                    }
                }
            },

            saveActivity() {

                this.loading = true // makes button loading state
                this.$store.dispatch("user/saveLog", {token: this.$store.state.session.token.jwt, data: this.form})
                    .then(r => {
                        this.loading = false
                        this.$root.$emit('message', {
                            class: "success",
                            title: "record saved",
                            body: "",
                            ttl: 2000
                        })
                        this.notifyUpdated()
                        this.closeModal()
                    })
                    .catch(err => {
                        console.log(err)
                        this.loading = false
                        this.$root.$emit('message', {
                            class: "error",
                            body: "There was a problem saving your data - " + err
                        })
                    })
            },

            closeModal() {
                this.$root.$emit('cancel') // closes the modal
            },

            notifyUpdated() {
                this.$root.$emit('logsUpdated') // triggers refresh of logs
            }
        },

        beforeMount() {
            this.syncFormToProps()
        },
    }
</script>

<style scoped>
    .fixed-width {
        width: 3.7rem;
    }
</style>
