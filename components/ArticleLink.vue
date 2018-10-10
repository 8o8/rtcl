<template>
    <a :href="link" target="_blank"><slot>{{ pmid }}</slot></a>
</template>

<script>
    export default {
        name: "ArticleLink",

        props: {
            pmid: { // pubmed id
                type: String,
                required: true
            }
        },

        computed: {
            link() {
                return process.env.apiBaseUrl + "/r/" + this.pmid
            }
        }
    }
</script>

<style scoped>

</style>