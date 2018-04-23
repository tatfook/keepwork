'use strict'
module.exports = {
  BUILD_VERSION: `"${new Date().toString().split(' ').splice(0, 5).join('_').replace(/\:/g,'_')}"`,
  NODE_ENV: '"production"',
  KEEPWORK_API_PREFIX: '"http://keepwork.com/api/wiki/models"',
  GITLAB_API_PREFIX: '"http://git.keepwork.com"'
}
