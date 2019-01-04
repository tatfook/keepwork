'use strict'
const { buildBlockList } = require('../web/lib/mod/parser/index.js')
module.exports = app => {
  return class ParserController extends app.Controller {
    async parser() {
      const { ctx } = this
      const { name } = ctx.request.body
      ctx.body = {
        code: 0,
        masg: buildBlockList(name)
      }
    }
  }
}
