'use strict'

module.exports = app => {
  return class ContestsController extends app.Controller {
    async index() {
      const { ctx } = this
      await ctx.renderClient('contests/index.js')
    }
  }
}