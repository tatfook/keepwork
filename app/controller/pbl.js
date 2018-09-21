'use strict'

module.exports = app => {
  return class PblController extends app.Controller {
    async index() {
      const { ctx } = this
      await ctx.renderClient('pbl/index.js')
    }
  }
}
