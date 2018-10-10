<template>
    <div>
        <PageSection>
            <h2 class="title is-2">Article Index</h2>
            <p class="subtitle is-5 has-text-grey">...regularly updated</p>
            <ais-index
                    :search-store="searchStore"
                    :index-name="algoliaResourceIndex"
                    :query-parameters="{
                            query: currentQuery,
                            page: page,
                            attributesToSnippet: ['summary:40'],
                            snippetEllipsisText: '…',
                            facetFilters: [facetFilters],
                        }"
            >
                <div class="columns">
                    <div class="column is-half">
                        <div class="field">
                            <p class="control has-icons-left">
                                <ais-input class="input is-large is-success"
                                           type="text"
                                           placeholder="search for..."
                                />
                                <span class="icon is-small is-left"><i class="fas fa-search"></i></span>
                            </p>
                        </div>
                    </div>
                    <div class="column is-narrow">
                        <button class="button is-large is-success" @click="saveSearch">Save</button>
                    </div>
                    <div class="column is-narrow">
                        <button class="button is-large" @click="clearSearch">Clear</button>
                    </div>
                </div>
                <div>
                    <div class="field">
                        <ais-stats/>
                        <p>
                            Categories: {{ displayUserSearchCategories() }}
                        </p>
                        <ais-no-results/>
                    </div>
                    <ais-results :stack="true">
                        <template slot-scope="{ result }">
                            <div class="box search-result">
                                <h5 class="title is-5 is-marginless">
                                    <ais-highlight :result="result" attribute-name="title"/>
                                </h5>

                                <LogModal
                                        :articleData="articleData(result)"
                                >
                                    <template slot="open">
                                        <p class="subtitle is-6 is-italic has-text-grey-light is-marginless">
                                            <a @click="openResource(articleLink(result))">{{ resourceLinkText(result)
                                                }}</a>
                                        </p>
                                    </template>
                                </LogModal>

                                <p>
                                    <ais-snippet :result="result" attribute-name="summary"/>
                                </p>
                            </div>
                        </template>
                    </ais-results>

                    <div id="loadmore"></div>
                </div>
            </ais-index>

        </PageSection>
    </div>
</template>
<script>

    import {createFromAlgoliaCredentials} from 'vue-instantsearch'
    import ScrollMonitor from 'scrollmonitor'
    import LogModal from '~/components/LogModal'

    export default {

        middleware: "sessionAuth",

        components: {
            LogModal,
        },

        data() {
            return {
                searchStore: null,
                apiBaseUrl: process.env.apiBaseUrl,
                algoliaAppId: process.env.algoliaAppId,
                algoliaApiKey: process.env.algoliaApiKey,
                algoliaResourceIndex: process.env.algoliaResourceIndex,
                page: 1,

                textQuery: "",

            }
        },

        computed: {
            currentQuery() {
                return this.$store.state.user.search
            },
            userSearchCategories() {
                return this.$store.getters["user/searchCategories"]
            },
            facetFilters() {
                let f = []
                this.userSearchCategories.forEach((cat) => {
                    f.push(`category:${cat}`)
                })
                return f
            }
        },

        methods: {

            articleLink(result) {
                return this.apiBaseUrl + "/r/" + result.objectID
            },

            resourceLinkText(result) {
                let t = (result.pubNameAbbr ? result.pubNameAbbr + ' ' : '') +
                    (result.pubDate ? result.pubDate : '') +
                    (result.pubVolume ? '; ' + result.pubVolume : '') +
                    (result.pubIssue ? '(' + result.pubIssue + ')' : '') +
                    (result.pubPageRef ? ': ' + result.pubPageRef : '')

                return t ? t : result.url
            },

            // prepare article data to pass through to the form
            articleData(article) {
                return {
                    pmid: article.objectID,
                    title: article.title,
                    source: this.resourceLinkText(article),
                    url: article.url,
                }
            },

            openResource(url) {
                window.open(url)
            },

            loadMore: function () {
                this.page++;
            },

            message(type, msg, ttl) {
                this.$root.$emit('message', {
                    class: type,
                    body: msg,
                    ttl: ttl,
                })
            },

            saveSearch() {
                console.log("saving: " + this.searchStore.query)
                this.$store.dispatch('user/saveSearch',
                    {
                        token: this.$store.state.session.token.jwt,
                        query: this.searchStore.query
                    })
                    .then(r => {
                        this.message('success', "Search saved!", 1500)
                        // Successful save returns fresh copy of the user profile...
                        this.$store.commit("user/setProfile", r.data)
                    })
                    .catch(e => {
                        this.message('error', e.response.data.error)
                    })
            },

            clearSearch() {
                this.searchStore.query = ""
            },

            // comma-sep list of category filters
            displayUserSearchCategories() {

                if (this.userSearchCategories.length === 0) {
                    return "Any"
                }

                const catCount = this.userSearchCategories.length
                let catList = ""
                for (let i = 0; i < catCount; i++) {
                    catList += this.userSearchCategories[i] + ((i < (catCount - 1) ? ", " : ""))
                }
                return catList
            }
        },

        beforeMount() {
            this.searchStore = createFromAlgoliaCredentials(this.algoliaAppId, this.algoliaApiKey)
        },

        mounted() {

            // nextTick ensures everything has been mounted before this code runs
            this.$nextTick(() => {
                // When we load, set the query from the store...
                this.searchStore.query = this.$store.state.user.search

                // this seems to help when sometimes the results don't show
                this.searchStore.stop()
                this.searchStore.start()
                this.searchStore.refresh()

                let e = document.getElementById('loadmore')
                let w = ScrollMonitor.create(e)
                w.enterViewport(() => {
                    this.loadMore()
                })
            })
        },

        beforeDestroy() {
            // Before leaving, make sure to store the current query
            this.$store.commit('user/setSearch', this.searchStore.query)
        }
    }
</script>
