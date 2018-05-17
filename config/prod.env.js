'use strict'
module.exports = {
  BUILD_VERSION: `"${new Date().toString().split(' ').splice(0, 6).join('_').replace(/:|\+/g,'_')}"`,
  NODE_ENV: '"production"',
  KEEPWORK_API_PREFIX: '"https://keepwork.com/api/wiki/models"',
  GITLAB_API_PREFIX: '"https://git.keepwork.com"',
  ES_GATEWAY_BASE_URL: '"https://api.keepwork.com/es"'
}
