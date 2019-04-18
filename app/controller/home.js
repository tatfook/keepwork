'use strict'

module.exports = app => {
  return class HomeController extends app.Controller {
    async index() {
      await this.ctx.renderClient('index/index.js')
    }
  }
}
