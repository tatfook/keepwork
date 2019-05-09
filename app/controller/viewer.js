'use strict'
const _ = require('lodash')
const {
  getSearchableContentByPath
} = require('../web/lib/mod/parser/mdSearchedParser/searchByUrl')
const SPIDERS = [
  'PostmanRuntime',
  'Baiduspider',
  'Googlebot',
  '360Spider',
  'Sosospider',
  'sogou spider'
]

module.exports = app => {
  return class PageViewerController extends app.Controller {
    async index() {
      const { ctx } = this
      let userAgent = _.get(ctx, ['request', 'header', 'user-agent'], '')
      let spiderIndex = _.findIndex(SPIDERS, spider => {
        return new RegExp('^' + spider, 'i').test(userAgent)
      })
      if (spiderIndex !== -1) {
        let filePath = _.get(ctx, 'request.url')
        ctx.body = {
          content: await getSearchableContentByPath(filePath)
        }
        return
      }
      await ctx.renderClient('viewer/index.js')
    }
  }
}
