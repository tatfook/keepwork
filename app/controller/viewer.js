'use strict'

module.exports = app => {
  return class PageViewerController extends app.Controller {
    async index() {
      const { ctx } = this
      await ctx.renderClient('viewer/index.js')
    }
  }
}
