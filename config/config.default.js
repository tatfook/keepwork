const path = require('path')
const fs = require('fs')
module.exports = app => {
  const exports = {}

  exports.siteFile = {
    '/favicon.ico': fs.readFileSync(path.join(app.baseDir, 'app/web/assets/img/favicon.ico'))
  }

  exports.view = {
    cache: false
  }

  exports.vuessr = {
    layout: path.join(app.baseDir, 'app/web/view/layout.html'),
    renderOptions: {
      // 告诉 vue-server-renderer 去 app/view 查找异步 chunk 文件
      basedir: path.join(app.baseDir, 'app/view')
    }
  }

  exports.logger = {
    consoleLevel: 'DEBUG',
    dir: path.join(app.baseDir, 'logs')
  }

  exports.static = {
    prefix: '/public/',
    dir: path.join(app.baseDir, 'public')
  }

  exports.keys = '9e093085-6cd8-4075-97e2-6cadb06df683'

  exports.middleware = [
    'access'
  ]

  exports.security = {
    csrf: {
      enable: false,
    }
  }

  exports.bodyParser = {
    jsonLimit: '10mb',
    formLimit: '10mb',
  }

  return exports
}
