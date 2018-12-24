'use strict'

module.exports = app => {
  return class AccountController extends app.Controller {
    async index() {
      const { ctx } = this
      await ctx.renderClient('account/index.js')
    }
  }
}
