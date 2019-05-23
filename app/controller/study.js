'use strict'

module.exports = app => {
  return class StudyController extends app.Controller {
    async index() {
      const { ctx } = this
      await ctx.renderClient('study/index.js')
    }
  }
}