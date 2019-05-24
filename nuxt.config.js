module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    title: 'momo-romo',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'Nuxt.js project'
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }],
  },
  generate: {
    routes: [
      '/kanso',
      '/kintsugi',
    ]
  },
  // mode: 'spa',
  css: [{
    src: '~/assets/scss/main.scss',
    lang: 'scss'
  }],
  // router: {
  //   middleware: 'isMobile'
  // },
  modules: [
    'nuxt-device-detect'
  ],
  module: {
    rules: [{
      test: /\.scss$/,
      use: [
        "style-loader", // creates style nodes from JS strings
        "css-loader", // translates CSS into CommonJS
        "sass-loader" // compiles Sass to CSS, using Node Sass by default
      ]
    }]
  },
  plugins: [],
  /*
   ** Customize the progress bar color
   */
  loading: {
    color: '#3B8070'
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** Run ESLint on save
     */
    // extend(config, {
    //   isDev,
    //   isClient
    // }) {
    //   if (isDev && isClient) {
    //     config.module.rules.push({
    //       enforce: 'pre',
    //       test: /\.(js|vue)$/,
    //       loader: 'eslint-loader',
    //       exclude: /(node_modules)/
    //     })
    //   }
    // }
    // build: {
    vendor: ['three-orbit-controls', 'dat.gui', 'firebase']
    // }
  }
}