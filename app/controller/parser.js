'use strict'
const { getSearchableContent } = require('../web/lib/mod/parser/mdSearchedParser/index')
const { buildBlockList, buildMarkdown } = require('../web/lib/mod/parser/index')
module.exports = app => {
  return class ParserController extends app.Controller {
    async parser() {
      const { ctx } = this
      const { content } = ctx.request.body
      ctx.body = {
        content: getSearchableContent(content)
      }
    }

    async buildBlocks() {
      const { ctx } = this
      const { content } = ctx.request.body
      ctx.body = {
        blocks: buildBlockList(content)
      }
    }

    async buildContent() {
      const { ctx } = this
      const { blocks } = ctx.request.body
      ctx.body = {
        content: buildMarkdown(blocks)
      }
    }
  }
}
