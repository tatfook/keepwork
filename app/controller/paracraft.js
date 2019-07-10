'use strict'

module.exports = app => {
  return class ParacraftController extends app.Controller {
    async index() {
      const { ctx } = this
      await ctx.renderClient('paracraft/index.js')
    }
  }
}
