<template>
    <div>
        <PageSection>
            <h2 class="title is-2">Welcome!</h2>
            <p class="subtitle is-5 has-text-grey">...</p>
            <p>
                In a short while you should receive an email with an activation link.
            </p>
            <p>
                You'll need to click that link to activate your account.
            </p>
            <p>
                If the email doesn't turn up, check your spam folder before clicking the button below.
            </p>
            <div class="level">
                <div class="level-left">
                    <div class="level-item">
                        <a :class="{'button': true, 'is-success': true, 'is-loading': sending}"
                           @click="welcomeUser">
                            resend confirmation
                        </a>
                    </div>
                    <div class="level-item">
                        <p class="subtitle is-5">
                            {{ sentMessage }}
                        </p>
                    </div>
                </div>
            </div>

        </PageSection>
    </div>
</template>

<script>
    import apiJoin from '~/api/signup'

    export default {

        validate({params}) {
            // ensure looks like a UUID (24 bit) else 404
            return /\b[A-Fa-f0-9]{24}\b/.test(params.id)
        },

        data() {
            return {
                sending: false,
                sentMessage: "",
            }
        },

        methods: {
            welcomeUser() {
                this.sending = true
                apiJoin.welcomeUser(this.$route.params.id)
                    .then(res => {
                        console.log(res)
                        this.delayedSuccessMessage()
                    })
                    .catch(err => {
                        console.log(err.response)
                        this.delayedFailureMessage()
                    })

            },

            delayedSuccessMessage() {
                setTimeout(() => {
                    this.sentMessage = "Email sent!"
                    this.sending = false
                    setTimeout(() => {
                        this.sentMessage = ""
                    }, 3000)
                }, 3000)
            },

            delayedFailureMessage() {
                setTimeout(() => {
                    this.sentMessage = "Email could not be sent"
                    this.sending = false
                    setTimeout(() => {
                        this.sentMessage = ""
                    }, 2000)
                }, 2000)
            },

        },

        beforeMount() {
            this.welcomeUser()
        },
    }
</script>

<style scoped>

</style>