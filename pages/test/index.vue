<template>
    <div>
        <h1>Test</h1>

        <form @submit.prevent="onSubmit">
            <VueRecaptcha
                    ref="recaptcha"
                    :sitekey="sitekey"
                    @verify="verifyRecaptcha"
            ></VueRecaptcha>
            <button class="button" :class="{'is-success': submit}" @click="onSubmit" :disabled="!submit">submit</button>
            <button @click="resetRecaptcha">reset</button>
        </form>


    </div>
</template>

<script>
    import VueRecaptcha from 'vue-recaptcha'

    export default {
        name: "index",

        components: {
            VueRecaptcha,
        },

        data() {
            return {
                sitekey: "6LcthhEUAAAAACe26BFQeZHP1SuC4WHQPSzDek3z",
                submit: false,
            }
        },

        methods: {
            onSubmit: function () {
                console.log(this.$refs)
                this.$refs.recaptcha.execute()
            },
            verifyRecaptcha: function (response) {
                this.submit = true
                console.log('Verify: ' + response)
            },
            onExpired: function () {
                console.log('Expired')
            },
            resetRecaptcha() {
                this.$refs.recaptcha.reset() // Direct call reset method
            }
        }

    }
</script>

<style scoped>

</style>