'use strict'

module.exports = app => {
  return class ComboController extends app.Controller {
    async index() {
      const { ctx } = this
      await ctx.renderClient('combo/index.js')
    }
  }
}