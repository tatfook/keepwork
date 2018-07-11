import EditorUi from './drawio/js/EditorUi'
import MxUtils from './mxGraph/util/MxUtils'

let Board = function(editor, container, lightbox) {
  EditorUi.call(
    this,
    editor,
    container,
    lightbox !== null ? lightbox : window.urlParams['lightbox'] === '1'
  )
}

Board.VERSION = '0.0.1'

/**
 * Executes the first step for connecting to Google Drive.
 */
Board.ERROR_TIMEOUT = 'timeout'

/**
 * Executes the first step for connecting to Google Drive.
 */
Board.ERROR_BUSY = 'busy'

/**
 * Executes the first step for connecting to Google Drive.
 */
Board.ERROR_UNKNOWN = 'unknown'

/**
 * Sets the delay for autosave in milliseconds. Default is 2000.
 */
Board.MODE_GOOGLE = 'google'

/**
 * Sets the delay for autosave in milliseconds. Default is 2000.
 */
Board.MODE_DROPBOX = 'dropbox'

/**
 * Sets the delay for autosave in milliseconds. Default is 2000.
 */
Board.MODE_ONEDRIVE = 'onedrive'

/**
 * Sets the delay for autosave in milliseconds. Default is 2000.
 */
Board.MODE_GITHUB = 'github'

/**
 * Sets the delay for autosave in milliseconds. Default is 2000.
 */
Board.MODE_DEVICE = 'device'

/**
 * Sets the delay for autosave in milliseconds. Default is 2000.
 */
Board.MODE_BROWSER = 'browser'

/**
 * Trello App Mode
 */
Board.MODE_TRELLO = 'trello'

/**
 * Sets the delay for autosave in milliseconds. Default is 2000.
 */
Board.DROPBOX_APPKEY = 'libwls2fa9szdji'

/**
 * Sets URL to load the Dropbox SDK from
 */
Board.DROPBOX_URL = 'https://unpkg.com/dropbox/dist/Dropbox-sdk.min.js'

/**
 * Sets the delay for autosave in milliseconds. Default is 2000.
 */
Board.DROPINS_URL = 'https://www.dropbox.com/static/api/2/dropins.js'

/**
 * Sets the delay for autosave in milliseconds. Default is 2000.
 */
Board.ONEDRIVE_URL = 'https://js.live.net/v7.2/OneDrive.js'

/**
 * Trello URL
 */
Board.TRELLO_URL = 'https://api.trello.com/1/client.js'

/**
 * Trello JQuery dependency
 */
Board.TRELLO_JQUERY_URL = 'https://code.jquery.com/jquery-1.7.1.min.js'

/**
 * Trello JQuery dependency
 */
Board.FOOTER_PLUGIN_URL = 'https://www.jgraph.com/drawio-footer.js'

Board.CAMERA_SOUND =
  new Audio().canPlayType('audio/ogg; codecs=vorbis') === ''
    ? window.mxBasePath + '/audio/snapshot.wav'
    : window.mxBasePath + '/audio/snapshot.ogg'

// Extends EditorUi
MxUtils.extend(Board, EditorUi)
