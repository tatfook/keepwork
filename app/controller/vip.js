'use strict'

module.exports = app => {
  return class VipController extends app.Controller {
    async index() {
      const { ctx } = this
      await ctx.renderClient('vip/index.js')
    }
  }
}
