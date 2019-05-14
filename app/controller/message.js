'use strict'

module.exports = app => {
  return class MessageController extends app.Controller {
    async index() {
      const { ctx } = this
      await ctx.renderClient('message/index.js')
    }
  }
}