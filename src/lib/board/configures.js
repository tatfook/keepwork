const configures = {}

configures.MAX_REQUEST_SIZE = 10485760
configures.MAX_AREA = 15000 * 15000
configures.isLocalStorage = typeof localStorage !== 'undefined' || false // isLocalStorage controls access to local storage

configures.EXPORT_URL = '/export'
configures.SAVE_URL = './assets/save.html'
configures.OPEN_URL = './assets/open.html'
configures.RESOURCES_PATH = './assets/resources'
configures.RESOURCE_BASE = configures.RESOURCES_PATH + '/graph'
configures.STENCIL_PATH = './assets/stencils'
configures.IMAGE_PATH = './assets/images'
configures.STYLE_PATH = './assets/styles'
configures.CSS_PATH = './assets/styles'
configures.OPEN_FORM = './assets/open.html'

configures.mxBasePath = './assets'
configures.mxLanguage = 'zh'
configures.mxLanguages = ['zh', 'de']

export {configures}
