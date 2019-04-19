'use strict'
const _ = require('lodash')
const {
  getSearchableContentByPath
} = require('../web/lib/mod/parser/mdSearchedParser/searchByUrl')
// const { getSearchableContent } = require('../web/lib/mod/parser/mdSearchedParser/index')
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
      console.log('----------')
      console.log('USER-AGENT: ', userAgent, ctx.request.url)
      if (spiderIndex !== -1) {
        console.log('SPIDER: ', SPIDERS[spiderIndex])
        let filePath = _.get(ctx, 'request.url')
        // ctx.body = getSearchableContent(filePath)
        ctx.body = getSearchableContentByPath(filePath)
        return
      }
      console.log('----------')
      await ctx.renderClient('viewer/index.js')
    }
  }
}
