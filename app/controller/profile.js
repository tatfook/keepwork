'use strict'

module.exports = app => {
  return class ProfileController extends app.Controller {
    async index() {
      const { ctx } = this
      await ctx.renderClient('profile/index.js')
    }
  }
}
