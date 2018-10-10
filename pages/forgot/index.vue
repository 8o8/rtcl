<template>
    <div>
        <PageSection>
            <h2 class="title is-2">Forgot</h2>
            <p class="subtitle is-5 has-text-grey">...your password?</p>

            <p>No problem. Just type your email in below and we'll send you a link to reset it.</p>

            <div class="columns">
                <div class="column is-one-third">

                    <div class="field">
                        <div class="control">
                            <input class="input" type="email" placeholder="your email">
                        </div>
                    </div>
                    <div class="field">
                        <div class="control">
                            <button type="submit" class="button is-success">Send</button>
                        </div>
                    </div>

                </div>
            </div>

        </PageSection>
    </div>
</template>

<script>
    export default {
        name: "index"
    }
</script>

<style scoped>

</style>