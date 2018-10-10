<template>
    <div>
        <PageSection>
            <h2 class="title is-2">Setup</h2>
            <p class="subtitle is-5 has-text-grey">...stuff</p>

            <div class="box">
                <div class="columns">
                    <div class="column is-one-third">

                        <div class="field">
                            <label class="label">First name</label>
                            <div class="control">
                                <input class="input" type="text" name="firstname" placeholder="First name"
                                       v-model="user.firstName"
                                       v-validate="'required'">
                            </div>
                            <div class="help">
                                <span v-if="errors.has('firstname')" class="has-text-danger">
                                    {{ errors.first('firstname') }}
                                </span>&nbsp;
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Last name</label>
                            <div class="control">
                                <input class="input" type="text" name="lastname" placeholder="Last name"
                                       v-model="user.lastName"
                                       v-validate="'required'">
                            </div>
                            <div class="help">
                                <span v-if="errors.has('lastname')" class="has-text-danger">
                                    {{ errors.first('lastname') }}
                                </span>&nbsp;
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Email</label>
                            <div class="control has-icons-left has-icons-right">
                                <input class="input" type="email" name="email" placeholder="you@somewhere.com"
                                       v-model="user.email"
                                       v-validate="'required|email'"
                                       @change="email2 = ''"
                                >
                                <span class="icon is-small is-left"><i class="fas fa-envelope"></i></span>
                            </div>
                            <div class="help">
                                <span v-if="errors.has('email')" class="has-text-danger">
                                    {{ errors.first('email') }}
                                </span>&nbsp;
                            </div>
                        </div>

                        <div class="field" v-if="emailVerify">
                            <label class="label">
                                Confirm Email
                                <span class="icon is-small has-text-success" v-if="emailsMatch">
                                    <i class="fas fa-check"></i>
                                </span>
                            </label>

                            <div class="control has-icons-left has-icons-right">
                                <input type="email" name="email" placeholder="...new email, again"
                                       class="input" :class="{'is-danger': !emailsMatch, 'is-success': emailsMatch}"
                                       v-model="email2"
                                >
                                <span class="icon is-small is-left"><i class="fas fa-envelope"></i></span>
                            </div>
                            <div class="help">
                                <span v-if="!emailsMatch" class="has-text-danger">
                                    Emails do not match
                                </span>&nbsp;
                            </div>
                        </div>

                        <div class="field">
                            <button class="button is-text" @click="togglePasswordChange">
                                <span v-if="!changePassword">Change password</span>
                                <span v-if="changePassword">Cancel change password</span>
                            </button>
                        </div>

                        <div v-if="changePassword">
                            <div class="field">
                                <label class="label">New Password</label>
                                <div class="control has-icons-left has-icons-right">
                                    <input class="input" type="password" name="password" placeholder="new password"
                                           autocomplete="user-password"
                                           v-model="user.password"
                                           v-validate="'required|min:8|verify_password'">
                                    <span class="icon is-small is-left"><i class="fas fa-lock"></i></span>
                                </div>
                                <div class="help">
                        <span v-if="errors.has('password')" class="has-text-danger">
                        {{ errors.first('password') }}
                        </span>&nbsp;
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Confirm New Password</label>
                                <div class="control has-icons-left has-icons-right">
                                    <input class="input" type="password" name="password2" placeholder="new password, again"
                                           v-model="password2"
                                           v-validate="'required'">
                                    <span class="icon is-small is-left"><i class="fas fa-lock"></i></span>
                                </div>
                                <div class="help">
                        <span v-if="!passwordsMatch" class="has-text-danger">
                        Passwords do not match
                        </span>&nbsp;
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <hr>

                <div class="columns">

                    <div class="column is-one-third">

                        <div class="field">
                            <h4 class="title is-4">Search Categories</h4>
                            <p class="subtitle is-6">Restrict results to these categories (optional)</p>
                            <label class="checkbox">
                                <input type="checkbox"
                                       :checked="allCategories"
                                       @click="clearCategories"
                                > INCLUDE ALL
                            </label>
                            <div v-for="cat, i in categoryOptions" :key="i">
                                <label class="checkbox">
                                    <input type="checkbox"
                                           :value="cat"
                                           :checked="inCategories(cat)"
                                           @click=""
                                           v-model="user.categories"
                                    > {{ cat }}
                                </label>
                            </div>
                        </div>

                        <hr>

                        <div class="field">
                            <div class="control">
                                <button class="button is-success"
                                        v-on:click="validateBeforeSubmit"
                                        :disabled="!dataValid"
                                >Save
                                </button>&nbsp;
                            </div>
                            <div class="help">
                                <span v-if="!dataValid" class="has-text-danger">
                                    Check fields
                                </span>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

        </PageSection>
    </div>
</template>

<script>
    export default {
        name: "index",
        middleware: 'sessionAuth',

        data() {
            return {
                user: {
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    categories: [],
                },

                email2: "",
                password2: "",

                changePassword: false,

                categoryOptions: [
                    "cardiology",
                    "dentistry",
                    "dermatology",
                    "oncology",
                    "physiotherapy",
                ],

                valid: true,
            }
        },

        computed: {
            profile() {
                return this.$store.state.user.profile
            },

            emailsMatch() {
                if (!this.errors.has('email')) {
                    return this.user.email === this.email2
                }
                return false
            },

            passwordsMatch() {
                if (!this.errors.has('password')) {
                    return this.user.password === this.password2
                }
                return true
            },

            allCategories() {
                if (!this.user.categories) {
                    return false
                }
                return this.user.categories.length === 0
            },

            emailVerify() {
                return this.user.email != this.profile.email
            },

            dataValid() {
                this.$validator.validateAll()
                    .then((v) => {
                        this.valid = v
                    })
                return this.valid
            }
        },

        methods: {
            togglePasswordChange() {
                this.changePassword = !this.changePassword
            },
            validateBeforeSubmit() {
                // if (!this.passwordsMatch) {
                //     return
                // }
                this.$validator.validateAll().then((result) => {
                    if (result) {
                        this.saveProfile()
                    }
                })
            },

            inCategories(category) {
                if (!this.user.categories) {
                    return false
                }
                return this.user.categories.indexOf(category) != -1
            },

            clearCategories() {
                this.user.categories = []
            },

            saveProfile() {
                const token = this.$store.state.session.token.jwt
                const data = this.user

                // remove password if not being reset
                if (!this.changePassword) {
                    data.password = ''
                }

                console.log(data)

                this.$store.dispatch("user/saveProfile", {token, data})
                    .then((r) => {
                        this.$store.commit("user/setProfile", r.data)
                        this.$root.$emit('message', {
                            class: 'success',
                            title: 'Profile saved',
                            ttl: 2000,
                        })
                    })
                    .catch(e => {

                        let title = ''
                        let body = ''

                        if (e.response) {
                            if (e.response.status) {
                                title += e.response.status
                            }
                            if (e.response.statusText) {
                                title += ' ' + e.response.statusText
                            }
                            if (e.response.data.error) {
                                body = e.response.data.error
                            }
                        }

                        this.$root.$emit('message', {
                            class: 'error',
                            title: title ? title : null,
                            body: body ? body : e,
                        })
                    })
            }
        },

        mounted() {
            this.user.firstName = this.profile.firstName
            this.user.lastName = this.profile.lastName
            this.user.email = this.profile.email
            this.user.categories = this.profile.categories

            // ensure fresh copy of profile
            this.$store.dispatch("user/refreshProfile", this.$store.state.session.token.jwt)
                .catch(e => {
                    this.$root.$emit('message', {class: "error", body: 'could not refresh profile - ' + e.response})
                })
        }
    }
</script>

<style scoped>

</style>