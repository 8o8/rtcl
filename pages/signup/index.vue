<template>
    <div>
        <PageSection>
            <h2 class="title is-2">Sign up</h2>
            <p class="subtitle is-5 has-text-grey">...for easy goodness.</p>

            <div :class="{'modal': true, 'is-active': loginModal}">
                <div class="modal-background"></div>
                <div class="modal-content">
                    <div class="notification is-light">
                        <p>A user with this email address is already registered!</p>
                        <p>You can log in or register with a new email address.</p>
                        <p class="buttons">
                            <nuxt-link to="/login" class="button is-success">Log in</nuxt-link>
                            <button class="button" @click="toggleLoginModal">Return to form</button>
                        </p>
                    </div>
                </div>
                <button class="modal-close is-large" aria-label="close" @click="toggleLoginModal"></button>
            </div>

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
                                       v-validate="'required|email'">
                                <span class="icon is-small is-left"><i class="fas fa-envelope"></i></span>
                            </div>
                            <div class="help">
                                <span v-if="errors.has('email')" class="has-text-danger">
                                    {{ errors.first('email') }}
                                </span>&nbsp;
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Password</label>
                            <div class="control has-icons-left has-icons-right">
                                <input class="input" type="password" name="password" placeholder="secret password"
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
                            <label class="label">Password (confirm)</label>
                            <div class="control has-icons-left has-icons-right">
                                <input class="input" type="password" name="password2" placeholder="confirm password"
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

                        <!--<div class="field">-->
                        <!--<div class="control">-->
                        <!--<label class="checkbox">-->
                        <!--<input type="checkbox">-->
                        <!--I agree to the <a href="#">terms and conditions</a>-->
                        <!--</label>-->
                        <!--</div>-->
                        <!--</div>-->

                        <div class="field">
                            <VueRecaptcha
                                    :sitekey="sitekey"
                                    @verify="verifyRecaptcha"
                            ></VueRecaptcha>
                        </div>

                        <div class="field">
                            <div class="control">
                                <button class="button is-link"
                                        v-on:click="validateBeforeSubmit"
                                        :disabled="!submit"
                                >Submit</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </PageSection>
    </div>
</template>

<script>

    import apiJoin from '~/api/signup'
    import VueRecaptcha from 'vue-recaptcha'

    export default {

        components: {
          VueRecaptcha,
        },

        data() {
            return {
                user: {
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                },
                password2: "",
                message: {},
                loginModal: false,
                success: false,
                submit: false,
            }
        },

        computed: {
            passwordsMatch() {
                if (!this.errors.has('password')) {
                    return this.user.password == this.password2
                }
                return true
            },
            sitekey() {
              return process.env.recaptchaSitekey
            },
        },

        methods: {

            validateBeforeSubmit() {
                if (!this.passwordsMatch) {
                    return
                }
                this.$validator.validateAll().then((result) => {
                    if (result) {
                        this.addUser()
                    }
                })
            },

            verifyRecaptcha: function (response) {
                this.submit = true
                console.log('Verify: ' + response)
            },

            toggleLoginModal() {
                this.loginModal = !this.loginModal
            },

            addUser() {
                apiJoin.addUser(this.user)
                    .then(r => {
                        const id = r.data["id"]
                        if (id) {
                            this.$router.push(`/welcome/${id}`)
                        }
                    })
                    .catch(err => {
                        console.log(err.response)
                        if (err.response && err.response.status == 409) {
                            this.message = "A user with that email already exists. "
                            this.loginModal = true
                        } else {
                            this.message = "Error: " + err.response
                        }
                    })
            }
        }
    }
</script>

<style scoped>

</style>