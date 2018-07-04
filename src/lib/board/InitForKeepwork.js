// urlParams is null when used for embedding
;(function(global) {
  // global.mxClient = mxClient
  // global.mxResources = mxResources
  // global.mxUtils = mxUtils
  // global.mxLoadResources = mxLoadResources
  // global.mxResourceExtension = mxResourceExtension
  // global.mxLoadStylesheets = mxLoadStylesheets
  // global.mxBasePath = mxBasePath
  // global.mxImageBasePath = mxImageBasePath
  // global.mxLanguage = mxLanguage
  // global.mxDefaultLanguage = mxDefaultLanguage
  // global.mxLog = mxLog
  // global.mxObjectIdentity = mxObjectIdentity
  // global.mxDictionary = mxDictionary
  // global.mxResources = mxResources
  // global.mxPoint = mxPoint
  // global.mxRectangle = mxRectangle
  // global.mxEffects = mxEffects
  // global.mxUtils = mxUtils
  // global.mxConstants = mxConstants
  // global.mxEventObject = mxEventObject
  // global.mxMouseEvent = mxMouseEvent
  // global.mxEventSource = mxEventSource

  // global.Board = Board
  // global.Action = Action
  // global.Dialog = Dialog
  // global.Editor = Editor
  // global.EditorUi = EditorUi
  // global.Extra = Extra
  // global.Format = Format
  // global.Graph = Graph
  // global.Init = Init
  // global.Menus = Menus
  // global.Settings = Settings

  var root = './static/adi'

  global.urlParams = global.urlParams || {}

  // Public global variables
  global.MAX_REQUEST_SIZE = global.MAX_REQUEST_SIZE || 10485760
  global.MAX_AREA = global.MAX_AREA || 15000 * 15000
  global.isLocalStorage = typeof localStorage != 'undefined' || false // isLocalStorage controls access to local storage

  // URLs for save and export
  // window.EXPORT_URL     = window.EXPORT_URL     || '/export';
  global.SAVE_URL = global.SAVE_URL || root + '/board/assets/save.html'
  global.OPEN_URL = global.OPEN_URL || root + '/board/assets/open.html'
  global.RESOURCES_PATH =
    global.RESOURCES_PATH || root + '/board/assets/resources'
  global.RESOURCE_BASE =
    global.RESOURCE_BASE || root + global.RESOURCES_PATH + '/graph'
  global.STENCIL_PATH = global.STENCIL_PATH || root + '/board/assets/stencils'
  global.IMAGE_PATH = global.IMAGE_PATH || root + '/board/assets/images'
  global.STYLE_PATH = global.STYLE_PATH || root + '/board/assets/styles'
  global.CSS_PATH = global.CSS_PATH || root + '/board/assets/styles'
  global.OPEN_FORM = global.OPEN_FORM || root + '/board/assets/open.html'

  // Sets the base path, the UI language via URL param and configures the
  // supported languages to avoid 404s. The loading of all core language
  // resources is disabled as all required resources are in grapheditor.
  // properties. Note that in this example the loading of two resource
  // files (the special bundle and the default bundle) is disabled to
  // save a GET request. This requires that all resources be present in
  // each properties file since only one file is loaded.

  global.mxBasePath = global.mxBasePath || root + '/board/assets'
  global.mxLanguage = global.mxLanguage || global.urlParams['lang']
  global.mxLanguage = 'zh'
  global.mxLanguages = global.mxLanguages || ['zh', 'de']
})(window)
