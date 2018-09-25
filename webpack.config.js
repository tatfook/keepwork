'use strict'

const path = require('path')
const Dotenv = require('dotenv-webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const dotenv = new Dotenv()
const copyWebpack = new CopyWebpackPlugin([
  {
    from: path.resolve(__dirname, 'app/static'),
    to: path.resolve(__dirname, 'public')
  }
])

module.exports = {
  egg: true,
  framework: 'vue',
  entry: {
    include: ['app/web/pages'],
    loader: {
      client: 'app/web/framework/vue/entry/client-loader.js',
      server: 'app/web/framework/vue/entry/server-loader.js',
    }
  },
  alias: {
    '@': 'app/web',
    server: 'app/web/framework/vue/entry/server.js',
    client: 'app/web/framework/vue/entry/client.js',
    app: 'app/web/framework/vue/app.js',
    asset: 'app/web/assets',
    component: 'app/web/components',
    framework: 'app/web/framework'
  },
  dll: ['vue', 'axios', 'vue-router', 'vuex', 'vuex-router-sync'],
  devtool: 'cheap-module-eval-source-map',
  loaders: {
    scss: true,
    md: {
      test: /\.md$/,
      loader: 'raw-loader'
    },
  },
  plugins: {
    imagemini: false,
    serviceworker: true,
    dotenv,
    copyWebpack: {
      name: copyWebpack
    }
  },
  node: {
    console: true
  },
  optimization: {},
  done() {
    console.log('如果启动成功后, Chrome控制台浏览器脚本报错, 可以尝试执行 npm run clean 清除缓存解决')
  }
}
