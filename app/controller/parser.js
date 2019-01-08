'use strict'
const { getSearchableContent } = require('../web/lib/mod/parser/mdSearchedParser/index')
module.exports = app => {
  return class ParserController extends app.Controller {
    async parser() {
      const { ctx } = this
      const { name } = ctx.request.body
      ctx.body = {
        code: 0,
        masg: getSearchableContent(name)
      }
    }
  }
}
