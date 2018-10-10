
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)
  router.get('/creativity', controller.home.index)
  router.get('/exploration', controller.home.index)
  router.get('/study', controller.home.index)
  router.get('/ed', controller.editor.index)
  router.get(/\/ed\//, controller.editor.index)
  router.get('/vp', controller.editor.viewport)
  router.get('/l', controller.lesson.index)
  router.get(/\/l\//, controller.lesson.index)
  router.get('/pbl', controller.pbl.index)
  router.get(/\/pbl\//, controller.pbl.index)
  router.get('/vip', controller.vip.index)
  router.get(/^\/[a-zA-Z0-9]{4,}\/([\w-.]+\/[\w-.]+)/, controller.viewer.index)
}
