<template>
    <div>
        <PageSection>
            <h2 class="title is-2">Report</h2>
            <p class="subtitle is-5 has-text-grey">...your reading time</p>
            <p>
                Generate on-screen or a nice pdf report of the articles read and time spent.
            </p>
            <p>
                Upload this to your CPD system.
            </p>
        </PageSection>
    </div>
</template>

<script>
    export default {

        middleware: "sessionAuth",

    }
</script>

<style scoped>

</style>