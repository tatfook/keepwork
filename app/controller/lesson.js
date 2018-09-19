'use strict'

module.exports = app => {
  return class LessonController extends app.Controller {
    async index() {
      const { ctx } = this
      await ctx.renderClient('lesson/index.js')
    }
  }
}
