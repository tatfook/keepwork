import EditorUi from './EditorUi'

class Board extends EditorUi {
  static VERSION = '0.0.1'

  /**
   * Executes the first step for connecting to Google Drive.
   */
  static RROR_TIMEOUT = 'timeout'

  /**
   * Executes the first step for connecting to Google Drive.
   */
  static ERROR_BUSY = 'busy'

  /**
   * Executes the first step for connecting to Google Drive.
   */
  static ERROR_UNKNOWN = 'unknown'

  /**
   * Sets the delay for autosave in milliseconds. Default is 2000.
   */
  static MODE_GOOGLE = 'google'

  /**
   * Sets the delay for autosave in milliseconds. Default is 2000.
   */
  static MODE_DROPBOX = 'dropbox'

  /**
   * Sets the delay for autosave in milliseconds. Default is 2000.
   */
  static MODE_ONEDRIVE = 'onedrive'

  /**
   * Sets the delay for autosave in milliseconds. Default is 2000.
   */
  static MODE_GITHUB = 'github'

  /**
   * Sets the delay for autosave in milliseconds. Default is 2000.
   */
  static MODE_DEVICE = 'device'

  /**
   * Sets the delay for autosave in milliseconds. Default is 2000.
   */
  static MODE_BROWSER = 'browser'

  /**
   * Trello App Mode
   */
  static MODE_TRELLO = 'trello'

  /**
   * Sets the delay for autosave in milliseconds. Default is 2000.
   */
  static DROPBOX_APPKEY = 'libwls2fa9szdji'

  /**
   * Sets URL to load the Dropbox SDK from
   */
  static DROPBOX_URL = 'https://unpkg.com/dropbox/dist/Dropbox-sdk.min.js'

  /**
   * Sets the delay for autosave in milliseconds. Default is 2000.
   */
  static DROPINS_URL = 'https://www.dropbox.com/static/api/2/dropins.js'

  /**
   * Sets the delay for autosave in milliseconds. Default is 2000.
   */
  static ONEDRIVE_URL = 'https://js.live.net/v7.2/OneDrive.js'

  /**
   * Trello URL
   */
  static TRELLO_URL = 'https://api.trello.com/1/client.js'

  /**
   * Trello JQuery dependency
   */
  static TRELLO_JQUERY_URL = 'https://code.jquery.com/jquery-1.7.1.min.js'

  /**
   * Trello JQuery dependency
   */
  static FOOTER_PLUGIN_URL = 'https://www.jgraph.com/drawio-footer.js'
}

// export default (editor, container, lightbox) => {
//   EditorUi.call(this, editor, container, (lightbox != null) ? lightbox : urlParams['lightbox'] == '1')
// }

export default Board
