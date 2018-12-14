
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)
  router.get('/creativity', controller.home.index)
  router.get('/exploration', controller.home.index)
  router.get('/agreement', controller.home.index)
  router.get('/study', controller.home.index)
  router.get('/ed', controller.editor.index)
  router.get('/bx', controller.combo.index) // for comboBox component iframe router
  router.get(/\/ed\//, controller.editor.index)
  router.get('/vp', controller.editor.viewport)
  router.get('/l', controller.lesson.index)
  router.get(/\/l\//, controller.lesson.index)
  router.get('/pbl', controller.pbl.index)
  router.get(/\/pbl\//, controller.pbl.index)
  router.get('/u', controller.profile.index)
  router.get(/\/u\//, controller.profile.index)
  router.get('/vip', controller.vip.index)
  router.redirect('/wiki/login', '/u/p/changePassword', 302)
  router.redirect('/wiki/find_pwd', '/u/set', 302)
  router.redirect('/wiki/*', '/', 302) // FIXME, remove this line later
  router.get(/^\/[a-zA-Z0-9]{4,}\/([\w-.]+(\/[\w-.]+)?)/, controller.viewer.index)
  router.redirect('/*', '/', 302)
}
