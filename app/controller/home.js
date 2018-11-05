'use strict'

module.exports = app => {
  return class HomeController extends app.Controller {
    async index() {
      const { ctx } = this
      await ctx.renderClient('index/index.js')
    }
  }
}
