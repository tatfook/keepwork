
module.exports = app => {
  app.get('/ed', app.controller.editor.index)
  app.get('/vp', app.controller.editor.viewport)
  app.get('/l', app.controller.lesson.index)
  app.get('/', app.controller.viewer.index)
}
