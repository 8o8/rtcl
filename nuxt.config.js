const pkg = require('./package')

module.exports = {

    mode: 'spa',

    /*
    ** Headers of the page
    */
    head: {
        title: pkg.name,
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: pkg.description}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
        ],
    },

    /*
    ** Customize the progress-bar color
    */
    loading: {color: '#3B8070'},

    /*
    ** Global CSS
    */
    css: [],

    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
        '~plugins/global-components',
        '~plugins/instantsearch',
        '~plugins/vee-validate',
        '~plugins/message',
        '~plugins/date-filter',
    ],

    /*
    ** Nuxt.js modules
    */
    modules: [

       // '@nuxtjs/axios',
    ],

    router: {
        linkActiveClass: "is-active",
        linkExactActiveClass: "is-active",
        middleware: 'session'
    },

    env: {
        apiBaseUrl: process.env.API_BASE_URL || "http://localhost:5000",
        algoliaAppId: process.env.ALGOLIA_APP_ID || "MZQPVRPXFY",
        algoliaApiKey: process.env.ALGOLIA_API_KEY || "b2870abe304ad95866629a6713fd6e91",
        algoliaResourceIndex: process.env.ALGOLIA_RESOURCES_INDEX || "articles",
        recaptchaSitekey: "6LcthhEUAAAAACe26BFQeZHP1SuC4WHQPSzDek3z",
    },

    /*
    ** Build configuration
    // */
    build: {
        postcss: {
            plugins: {
                'postcss-cssnext': {
                    features: {
                        customProperties: false
                    }
                }
            }
        }
    },

    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {

    },
}

