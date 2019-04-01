'use strict'

module.exports = app => {
  return class OrgController extends app.Controller {
    async index() {
      const { ctx } = this
      await ctx.renderClient('org/index.js')
    }
  }
}
