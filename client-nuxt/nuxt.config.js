import colors from 'vuetify/es5/util/colors';

export default {
    // Global page headers (https://go.nuxtjs.dev/config-head)
    head: {
        titleTemplate: '%s - client-nuxt',
        title: 'client-nuxt',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' }
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    },

    // Global CSS (https://go.nuxtjs.dev/config-css)
    css: [],

    // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
    plugins: [],

    // Auto import components (https://go.nuxtjs.dev/config-components)
    components: true,

    // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
    buildModules: [
        // https://go.nuxtjs.dev/vuetify
        '@nuxtjs/vuetify'
    ],

    // Modules (https://go.nuxtjs.dev/config-modules)
    modules: [
        // https://go.nuxtjs.dev/axios
        '@nuxtjs/axios',
        '@nuxtjs/auth',
        'nuxt-material-design-icons-iconfont',
        'cookie-universal-nuxt'
    ],

    // Axios module configuration (https://go.nuxtjs.dev/config-axios)
    axios: {},

    // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
    vuetify: {
        customVariables: ['~/assets/variables.scss']
    },

    // Build Configuration (https://go.nuxtjs.dev/config-build)
    build: {},

    router: {
        middleware: ['auth']
    },

    auth: {
        redirect: {
            login: '/',
            logout: '/',
            home: '/user'
        },
        strategies: {
            local: {
                endpoints: {
                    login: { url: '/auth/login', method: 'post' },
                    logout: false,
                    user: false
                }
            }
        },
        localStorage: false
    }
};
