'use strict'

const path = require('path')
const Dotenv = require('dotenv-webpack')
const dotenv = new Dotenv()

module.exports = {
  egg: true,
  framework: 'vue',
  alias: {
    '@': 'app/web',
    asset: 'app/web/assets',
    component: 'app/web/components',
    framework: 'app/web/framework'
  },
  compile: {
    thread: false,
    cache: true,
  },
  dll: [
    {
      name: 'base', // easywebpack will automatically create a common chunk for all pages, and will crush if we create common lib here.
      lib: [
        'vue', 'axios', 'vue-router', 'vuex', 'vuex-router-sync',
        'vue-i18n', 'lodash', 'js-cookie', 'babel-polyfill',
        'moment', 'dayjs', 'qiniu-js', 'blueimp-md5', 'filesize', 'html2canvas', 'js-base64'
      ]
    },
    {
      name: 'charts',
      lib: ['echarts', 'v-charts']
    },
    {
      name: 'elementUI',
      lib: ['element-ui']
    },
    {
      name: 'markdown',
      lib: ['vue-markdown']
    }
  ],
  devtool: 'cheap-module-eval-source-map',
  loaders: {
    scss: true,
    md: {
      test: /\.md$/,
      loader: 'raw-loader'
    },
    babel: {
      exclude: [/node_modules/]
    }
  },
  plugins: {
    imagemini: false,
    // serviceworker: true,
    // analyzer: true,
    dotenv,
    uglifyJs: {
      parallel: false,
    },
    copy: [{
      from: path.resolve(__dirname, 'app/static'),
      to: path.resolve(__dirname, 'public')
    }]
  },
  node: {
    console: true
  },
  optimization: {}
}
