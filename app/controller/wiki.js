'use strict'

module.exports = app => {
  return class WikiController extends app.Controller {
    async index() {
      const { ctx } = this
      await ctx.renderClient('wiki/index.js')
    }
  }
}
