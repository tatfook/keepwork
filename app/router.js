
module.exports = app => {
  const { router, controller } = app
  app.middleware.browserCheck()
  router.get('/', controller.home.index)
  router.get('/create', controller.home.index)
  router.get('/explore', controller.home.index)
  router.get('/ranking', controller.home.index)
  router.get('/NPL', controller.home.index)
  router.get('/agreement', controller.home.index)
  router.get('/study', controller.home.index)
  router.get('/ed', controller.editor.index)
  router.get('/bx', controller.combo.index) // for comboBox component iframe router
  router.get(/^\/ed\//, controller.editor.index)
  router.get('/vp', controller.editor.viewport)
  router.get('/l', controller.lesson.index)
  router.get(/^\/l\//, controller.lesson.index)
  router.get('/s', controller.study.index)
  router.get(/^\/s\//, controller.study.index)
  router.get('/pbl', controller.pbl.index)
  router.get(/^\/pbl\//, controller.pbl.index)
  router.get('/org', controller.org.index)
  router.get(/^\/org\//, controller.org.index)
  router.get('/msg', controller.message.index)
  router.get(/^\/msg\//, controller.message.index)
  router.get('/u', controller.profile.index)
  router.get(/^\/u\//, controller.profile.index)
  router.get('/a', controller.account.index) // account
  router.get(/^\/a\//, controller.account.index) // account
  router.get('/vip', controller.vip.index)
  router.get('/wiki/pay', controller.wiki.index)
  router.post('/es/parser', controller.parser.parser)
  router.redirect('/wiki/login', '/u/r/login', 302)
  router.redirect('/wiki/join', '/u/r/register', 302)
  router.redirect('/wiki/user_center', '/u/p/changePassword', 302)
  router.redirect('/wiki/find_pwd', '/u/set', 302)
  router.redirect('/wiki/*', '/', 302) // FIXME, remove this line later
  router.get(/^\/[a-zA-Z0-9]{4,}\/([\w-.]+(\/[\w-.]+)?)/, controller.viewer.index)
  router.redirect('/*', '/', 302)
}
