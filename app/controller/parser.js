'use strict'
const { getSearchableContent } = require('../web/lib/mod/parser/mdSearchedParser/index')
module.exports = app => {
  return class ParserController extends app.Controller {
    async parser() {
      const { ctx } = this
      const { content } = ctx.request.body
      ctx.body = {
        content: getSearchableContent(content)
      }
    }
  }
}
