'use strict'

module.exports = app => {
  return class EditorController extends app.Controller {
    async index() {
      const { ctx } = this
      await ctx.renderClient('editor/index.js')
    }

    async viewport() {
      const { ctx } = this
      await ctx.renderClient('viewport/index.js')
    }

  }
}