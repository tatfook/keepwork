import configures from '../configures'
// import mxLog from './util/mxLog'
// import mxObjectIdentity from './util/mxObjectIdentity'
// import mxDictionary from './util/mxDictionary'
import MxResources from './util/MxResources'
// import mxPoint from './util/mxPoint'
// import mxRectangle from './util/mxRectangle'
// import mxEffects from './util/mxEffects'
// import mxUtils from './util/mxUtils'
// import mxConstants from './util/mxConstants'
// import mxEventObject from './util/mxEventObject'
// import mxMouseEvent from './util/mxMouseEvent'
// import mxEventSource from './util/mxEventSource'
import MxEvent from './util/MxEvent'
// import mxXmlRequest from './util/mxXmlRequest'
// import mxClipboard from './util/mxClipboard'
// import mxWindow from './util/mxWindow'
// import mxForm from './util/mxForm'
// import mxImage from './util/mxImage'
// import mxDivResizer from './util/mxDivResizer'
// import mxDragSource from './util/mxDragSource'
// import mxToolbar from './util/mxToolbar'
// import mxUndoableEdit from './util/mxUndoableEdit'
// import mxUndoManager from './util/mxUndoManager'
// import mxUrlConverter from './util/mxUrlConverter'
// import mxPanningManager from './util/mxPanningManager'
// import mxPopupMenu from './util/mxPopupMenu'
// import mxAutoSaveManager from './util/mxAutoSaveManager'
// import mxAnimation from './util/mxAnimation'
// import mxMorphing from './util/mxMorphing'
// import mxImageBundle from './util/mxImageBundle'
// import mxImageExport from './util/mxImageExport'
// import mxAbstractCanvas2D from './util/mxAbstractCanvas2D'
// import mxXmlCanvas2D from './util/mxXmlCanvas2D'
// import mxSvgCanvas2D from './util/mxSvgCanvas2D'
// import mxVmlCanvas2D from './util/mxVmlCanvas2D'
// import mxGuide from './util/mxGuide'
// import mxStencil from './shape/mxStencil'
// import mxShape from './shape/mxShape'
// import mxStencilRegistry from './shape/mxStencilRegistry'
// import mxMarker from './shape/mxMarker'
// import mxActor from './shape/mxActor'
// import mxCloud from './shape/mxCloud'
// import mxRectangleShape from './shape/mxRectangleShape'
// import mxEllipse from './shape/mxEllipse'
// import mxDoubleEllipse from './shape/mxDoubleEllipse'
// import mxRhombus from './shape/mxRhombus'
// import mxPolyline from './shape/mxPolyline'
// import mxArrow from './shape/mxArrow'
// import mxArrowConnector from './shape/mxArrowConnector'
// import mxText from './shape/mxText'
// import mxTriangle from './shape/mxTriangle'
// import mxHexagon from './shape/mxHexagon'
// import mxLine from './shape/mxLine'
// import mxImageShape from './shape/mxImageShape'
// import mxLabel from './shape/mxLabel'
// import mxCylinder from './shape/mxCylinder'
// import mxConnector from './shape/mxConnector'
// import mxSwimlane from './shape/mxSwimlane'
// import mxGraphLayout from './layout/mxGraphLayout'
// import mxStackLayout from './layout/mxStackLayout'
// import mxPartitionLayout from './layout/mxPartitionLayout'
// import mxCompactTreeLayout from './layout/mxCompactTreeLayout'
// import mxRadialTreeLayout from './layout/mxRadialTreeLayout'
// import mxFastOrganicLayout from './layout/mxFastOrganicLayout'
// import mxCircleLayout from './layout/mxCircleLayout'
// import mxParallelEdgeLayout from './layout/mxParallelEdgeLayout'
// import mxCompositeLayout from './layout/mxCompositeLayout'
// import mxEdgeLabelLayout from './layout/mxEdgeLabelLayout'
// import mxGraphAbstractHierarchyCell from './layout/hierarchical/model/mxGraphAbstractHierarchyCell'
// import mxGraphHierarchyNode from './layout/hierarchical/model/mxGraphHierarchyNode'
// import mxGraphHierarchyEdge from './layout/hierarchical/model/mxGraphHierarchyEdge'
// import mxGraphHierarchyModel from './layout/hierarchical/model/mxGraphHierarchyModel'
// import mxSwimlaneModel from './layout/hierarchical/model/mxSwimlaneModel'
// import mxHierarchicalLayoutStage from './layout/hierarchical/stage/mxHierarchicalLayoutStage'
// import mxMedianHybridCrossingReduction from './layout/hierarchical/stage/mxMedianHybridCrossingReduction'
// import mxMinimumCycleRemover from './layout/hierarchical/stage/mxMinimumCycleRemover'
// import mxCoordinateAssignment from './layout/hierarchical/stage/mxCoordinateAssignment'
// import mxSwimlaneOrdering from './layout/hierarchical/stage/mxSwimlaneOrdering'
// import mxHierarchicalLayout from './layout/hierarchical/mxHierarchicalLayout'
// import mxSwimlaneLayout from './layout/hierarchical/mxSwimlaneLayout'
// import mxGraphModel from './model/mxGraphModel'
// import mxCell from './model/mxCell'
// import mxGeometry from './model/mxGeometry'
// import mxCellPath from './model/mxCellPath'
// import mxPerimeter from './view/mxPerimeter'
// import mxPrintPreview from './view/mxPrintPreview'
// import mxStylesheet from './view/mxStylesheet'
// import mxCellState from './view/mxCellState'
// import mxGraphSelectionModel from './view/mxGraphSelectionModel'
// import mxCellEditor from './view/mxCellEditor'
// import mxCellRenderer from './view/mxCellRenderer'
// import mxEdgeStyle from './view/mxEdgeStyle'
// import mxStyleRegistry from './view/mxStyleRegistry'
// import mxGraphView from './view/mxGraphView'
// import mxGraph from './view/mxGraph'
// import mxCellOverlay from './view/mxCellOverlay'
// import mxOutline from './view/mxOutline'
// import mxMultiplicity from './view/mxMultiplicity'
// import mxLayoutManager from './view/mxLayoutManager'
// import mxSwimlaneManager from './view/mxSwimlaneManager'
// import mxTemporaryCellStates from './view/mxTemporaryCellStates'
// import mxCellStatePreview from './view/mxCellStatePreview'
// import mxConnectionConstraint from './view/mxConnectionConstraint'
// import mxGraphHandler from './handler/mxGraphHandler'
// import mxPanningHandler from './handler/mxPanningHandler'
// import mxPopupMenuHandler from './handler/mxPopupMenuHandler'
// import mxCellMarker from './handler/mxCellMarker'
// import mxSelectionCellsHandler from './handler/mxSelectionCellsHandler'
// import mxConnectionHandler from './handler/mxConnectionHandler'
// import mxConstraintHandler from './handler/mxConstraintHandler'
// import mxRubberband from './handler/mxRubberband'
// import mxHandle from './handler/mxHandle'
// import mxVertexHandler from './handler/mxVertexHandler'
// import mxEdgeHandler from './handler/mxEdgeHandler'
// import mxElbowEdgeHandler from './handler/mxElbowEdgeHandler'
// import mxEdgeSegmentHandler from './handler/mxEdgeSegmentHandler'
// import mxKeyHandler from './handler/mxKeyHandler'
// import mxTooltipHandler from './handler/mxTooltipHandler'
// import mxCellTracker from './handler/mxCellTracker'
// import mxCellHighlight from './handler/mxCellHighlight'
// import mxDefaultKeyHandler from './editor/mxDefaultKeyHandler'
// import mxDefaultPopupMenu from './editor/mxDefaultPopupMenu'
// import mxDefaultToolbar from './editor/mxDefaultToolbar'
// import mxEditor from './editor/mxEditor'
// import mxCodecRegistry from './io/mxCodecRegistry'
// import mxCodec from './io/mxCodec'
// import mxObjectCodec from './io/mxObjectCodec'
// import mxCellCodec from './io/mxCellCodec'
// import mxModelCodec from './io/mxModelCodec'
// import mxRootChangeCodec from './io/mxRootChangeCodec'
// import mxChildChangeCodec from './io/mxChildChangeCodec'
// import mxTerminalChangeCodec from './io/mxTerminalChangeCodec'
// import mxGenericChangeCodec from './io/mxGenericChangeCodec'
// import mxGraphCodec from './io/mxGraphCodec'
// import mxGraphViewCodec from './io/mxGraphViewCodec'
// import mxStylesheetCodec from './io/mxStylesheetCodec'
// import mxDefaultKeyHandlerCodec from './io/mxDefaultKeyHandlerCodec'
// import mxDefaultToolbarCodec from './io/mxDefaultToolbarCodec'
// import mxDefaultPopupMenuCodec from './io/mxDefaultPopupMenuCodec'
// import mxEditorCodec from './io/mxEditorCodec'

class MxClient {
  // Class: MxClient

  // Bootstrapping mechanism for the mxGraph thin client. The production version
  // of this file contains all code required to run the mxGraph thin client, as
  // well as global constants to identify the browser and operating system in
  // use. You may have to load chrome://global/content/contentAreaUtils.js in
  // your page to disable certain security restrictions in Mozilla.

  // Variable: VERSION

  // Contains the current version of the mxGraph library. The strings that
  // communicate versions of mxGraph use the following format.

  // versionMajor.versionMinor.buildNumber.revisionNumber

  // Current version is 3.9.3.

  static VERSION = '3.9.3'

  // Variable: IS_IE

  // True if the current browser is Internet Explorer 10 or below. Use <MxClient.IS_IE11>
  // to detect IE 11.

  static IS_IE = navigator.userAgent.indexOf('MSIE') >= 0

  // Variable: IS_IE6

  // True if the current browser is Internet Explorer 6.x.

  static IS_IE6 = navigator.userAgent.indexOf('MSIE 6') >= 0

  // Variable: IS_IE11

  // True if the current browser is Internet Explorer 11.x.

  static IS_IE11 = !!navigator.userAgent.match(/Trident\/7\./)

  // Variable: IS_EDGE

  // True if the current browser is Microsoft Edge.

  static IS_EDGE = !!navigator.userAgent.match(/Edge\//)

  // Variable: IS_QUIRKS

  // True if the current browser is Internet Explorer and it is in quirks mode.

  static IS_QUIRKS =
    navigator.userAgent.indexOf('MSIE') >= 0 &&
    (document.documentMode === null || document.documentMode === 5)

  // Variable: IS_EM

  // True if the browser is IE11 in enterprise mode (IE8 standards mode).

  static IS_EM =
    'spellcheck' in document.createElement('textarea') &&
    document.documentMode === 8

  // Variable: VML_PREFIX

  // Prefix for VML namespace in node names. Default is 'v'.

  static VML_PREFIX = 'v'

  // Variable: OFFICE_PREFIX

  // Prefix for VML office namespace in node names. Default is 'o'.

  static OFFICE_PREFIX = 'o'

  // Variable: IS_NS

  // True if the current browser is Netscape (including Firefox).

  static get IS_NS() {
    return (
      navigator.userAgent.indexOf('Mozilla/') >= 0 &&
      navigator.userAgent.indexOf('MSIE') < 0 &&
      navigator.userAgent.indexOf('Edge/') < 0
    )
  }

  // Variable: IS_OP

  // True if the current browser is Opera.

  static get IS_OP() {
    return (
      navigator.userAgent.indexOf('Opera/') >= 0 ||
      navigator.userAgent.indexOf('OPR/') >= 0
    )
  }

  // Variable: IS_OT

  // True if -o-transform is available as a CSS style, ie for Opera browsers
  // based on a Presto engine with version 2.5 or later.

  static get IS_OT() {
    return (
      navigator.userAgent.indexOf('Presto/') >= 0 &&
      navigator.userAgent.indexOf('Presto/2.4.') < 0 &&
      navigator.userAgent.indexOf('Presto/2.3.') < 0 &&
      navigator.userAgent.indexOf('Presto/2.2.') < 0 &&
      navigator.userAgent.indexOf('Presto/2.1.') < 0 &&
      navigator.userAgent.indexOf('Presto/2.0.') < 0 &&
      navigator.userAgent.indexOf('Presto/1.') < 0
    )
  }

  // Variable: IS_SF

  // True if the current browser is Safari.

  static get IS_SF() {
    return (
      navigator.userAgent.indexOf('AppleWebKit/') >= 0 &&
      navigator.userAgent.indexOf('Chrome/') < 0 &&
      navigator.userAgent.indexOf('Edge/') < 0
    )
  }

  // Variable: IS_IOS

  // Returns true if the user agent is an iPad, iPhone or iPod.

  static IS_IOS = !!navigator.userAgent.match(/(iPad|iPhone|iPod)/g)

  // Variable: IS_GC

  // True if the current browser is Google Chrome.

  static get IS_GC() {
    return (
      navigator.userAgent.indexOf('Chrome/') >= 0 &&
      navigator.userAgent.indexOf('Edge/') < 0
    )
  }

  // Variable: IS_CHROMEAPP

  // True if the this is running inside a Chrome App.

  static get IS_CHROMEAPP() {
    return (
      window.chrome != null &&
      window.chrome.app != null &&
      window.chrome.app.runtime != null
    )
  }

  // Variable: IS_FF

  // True if the current browser is Firefox.

  static IS_FF = navigator.userAgent.indexOf('Firefox/') >= 0

  // Variable: IS_MT

  // True if -moz-transform is available as a CSS style. This is the case
  // for all Firefox-based browsers newer than or equal 3, such as Camino,
  // Iceweasel, Seamonkey and Iceape.

  static get IS_MT() {
    return (
      (navigator.userAgent.indexOf('Firefox/') >= 0 &&
        navigator.userAgent.indexOf('Firefox/1.') < 0 &&
        navigator.userAgent.indexOf('Firefox/2.') < 0) ||
      (navigator.userAgent.indexOf('Iceweasel/') >= 0 &&
        navigator.userAgent.indexOf('Iceweasel/1.') < 0 &&
        navigator.userAgent.indexOf('Iceweasel/2.') < 0) ||
      (navigator.userAgent.indexOf('SeaMonkey/') >= 0 &&
        navigator.userAgent.indexOf('SeaMonkey/1.') < 0) ||
      (navigator.userAgent.indexOf('Iceape/') >= 0 &&
        navigator.userAgent.indexOf('Iceape/1.') < 0)
    )
  }

  // Variable: IS_SVG

  // True if the browser supports SVG.

  static get IS_SVG() {
    return (
      navigator.userAgent.indexOf('Firefox/') >= 0 || // FF and Camino
      navigator.userAgent.indexOf('Iceweasel/') >= 0 || // Firefox on Debian
      navigator.userAgent.indexOf('Seamonkey/') >= 0 || // Firefox-based
      navigator.userAgent.indexOf('Iceape/') >= 0 || // Seamonkey on Debian
      navigator.userAgent.indexOf('Galeon/') >= 0 || // Gnome Browser (old)
      navigator.userAgent.indexOf('Epiphany/') >= 0 || // Gnome Browser (new)
      navigator.userAgent.indexOf('AppleWebKit/') >= 0 || // Safari/Google Chrome
      navigator.userAgent.indexOf('Gecko/') >= 0 || // Netscape/Gecko
      navigator.userAgent.indexOf('Opera/') >= 0 || // Opera
      (document.documentMode != null && document.documentMode >= 9)
    ) // IE9+
  }

  // Variable: NO_FO

  // True if foreignObject support is not available. This is the case for
  // Opera, older SVG-based browsers and all versions of IE.

  static get NO_FO() {
    return (
      !document.createElementNS ||
      document.createElementNS(
        'http://www.w3.org/2000/svg',
        'foreignObject'
      ) !== '[object SVGForeignObjectElement]' ||
      navigator.userAgent.indexOf('Opera/') >= 0
    )
  }

  // Variable: IS_VML

  // True if the browser supports VML.

  static get IS_VML() {
    return navigator.appName.toUpperCase() === 'MICROSOFT INTERNET EXPLORER'
  }

  // Variable: IS_WIN

  // True if the client is a Windows.

  static IS_WIN = navigator.appVersion.indexOf('Win') > 0

  // Variable: IS_MAC

  // True if the client is a Mac.

  static IS_MAC = navigator.appVersion.indexOf('Mac') > 0

  // Variable: IS_TOUCH

  // True if this device supports touchstart/-move/-end events (Apple iOS,
  // Android, Chromebook and Chrome Browser on touch-enabled devices).

  static IS_TOUCH = 'ontouchstart' in document.documentElement

  // Variable: IS_POINTER

  // True if this device supports Microsoft pointer events (always false on Macs).

  static IS_POINTER =
    window.PointerEvent != null && !(navigator.appVersion.indexOf('Mac') > 0)

  // Variable: IS_LOCAL

  // True if the documents location does not start with http:// or https://.

  static get IS_LOCAL() {
    return (
      document.location.href.indexOf('http://') < 0 &&
      document.location.href.indexOf('https://') < 0
    )
  }

  // Variable: defaultBundles

  // Contains the base names of the default bundles if mxLoadResources is false.

  static defaultBundles = []

  // Function: isBrowserSupported

  // Returns true if the current browser is supported, that is, if
  // <MxClient.IS_VML> or <MxClient.IS_SVG> is true.

  // Example:

  // (code)
  // if (!MxClient.isBrowserSupported())
  // {
  //   mxUtils.error('Browser is not supported!', 200, false);
  // }
  // (end)

  static get isBrowserSupported() {
    return MxClient.IS_VML || MxClient.IS_SVG
  }

  // Function: link

  // Adds a link node to the head of the document. Use this
  // to add a stylesheet to the page as follows:

  // (code)
  // MxClient.link('stylesheet', filename);
  // (end)

  // where filename is the (relative) URL of the stylesheet. The charset
  // is hardcoded to ISO-8859-1 and the type is text/css.

  // Parameters:

  // rel - String that represents the rel attribute of the link node.
  // href - String that represents the href attribute of the link node.
  // doc - Optional parent document of the link node.

  static link(rel, href, doc) {
    doc = doc || document

    // Workaround for Operation Aborted in IE6 if base tag is used in head
    if (MxClient.IS_IE6) {
      doc.write(
        '<link rel="' +
          rel +
          '" href="' +
          href +
          '" charset="UTF-8" type="text/css"/>'
      )
    } else {
      let link = doc.createElement('link')

      link.setAttribute('rel', rel)
      link.setAttribute('href', href)
      link.setAttribute('charset', 'UTF-8')
      link.setAttribute('type', 'text/css')

      let head = doc.getElementsByTagName('head')[0]
      head.appendChild(link)
    }
  }

  // Function: loadResources

  // Helper method to load the default bundles if mxLoadResources is false.

  // Parameters:

  // fn - Function to call after all resources have been loaded.
  // lan - Optional string to pass to <MxResources.add>.

  static loadResources(fn, lan) {
    let pending = MxClient.defaultBundles.length

    function callback() {
      if (--pending === 0) {
        fn()
      }
    }

    for (let i = 0; i < MxClient.defaultBundles.length; i++) {
      MxResources.add(MxClient.defaultBundles[i], lan, callback)
    }
  }

  // Function: include

  // Dynamically adds a script node to the document header.

  // In production environments, the includes are resolved in the MxClient.js
  // file to reduce the number of requests required for client startup. This
  // function should only be used in development environments, but not in
  // production systems.

  static include(src) {
    document.write('<script src="' + src + '"></script>')
  }

  // Function: dispose

  // Frees up memory in IE by resolving cyclic dependencies between the DOM
  // and the JavaScript objects.

  static dispose() {
    // Cleans all objects where listeners have been added
    for (let i = 0; i < MxEvent.objects.length; i++) {
      if (MxEvent.objects[i].mxListenerList != null) {
        MxEvent.removeAllListeners(MxEvent.objects[i])
      }
    }
  }
}

// Variable: mxLoadResources

// Optional global config variable to toggle loading of the two resource files
// in <mxGraph> and <mxEditor>. Default is true. NOTE: This is a global variable,
// not a variable of MxClient. If this is false, you can use <MxClient.loadResources>
// with its callback to load the default bundles asynchronously.

// (code)
// <script type="text/javascript">
// let mxLoadResources = false;
// </script>
// <script type="text/javascript" src="/path/to/core/directory/js/MxClient.js"></script>
// (end)

if (typeof configures.mxLoadResources === 'undefined') {
  configures.mxLoadResources = true
}

// Variable: mxForceIncludes

// Optional global config variable to force loading the JavaScript files in
// development mode. Default is undefined. NOTE: This is a global variable,
// not a variable of MxClient.

// (code)
// <script type="text/javascript">
// let mxLoadResources = true;
// </script>
// <script type="text/javascript" src="/path/to/core/directory/js/MxClient.js"></script>
// (end)

if (typeof configures.mxForceIncludes === 'undefined') {
  configures.mxForceIncludes = false
}

// Variable: mxResourceExtension

// Optional global config variable to specify the extension of resource files.
// Default is true. NOTE: This is a global variable, not a variable of MxClient.

// (code)
// <script type="text/javascript">
// let mxResourceExtension = '.txt';
// </script>
// <script type="text/javascript" src="/path/to/core/directory/js/MxClient.js"></script>
// (end)

if (typeof configures.mxResourceExtension === 'undefined') {
  configures.mxResourceExtension = '.txt'
}

// Variable: mxLoadStylesheets

// Optional global config variable to toggle loading of the CSS files when
// the library is initialized. Default is true. NOTE: This is a global variable,
// not a variable of MxClient.

// (code)
// <script type="text/javascript">
// let mxLoadStylesheets = false;
// </script>
// <script type="text/javascript" src="/path/to/core/directory/js/MxClient.js"></script>
// (end)

if (typeof configures.mxLoadStylesheets === 'undefined') {
  configures.mxLoadStylesheets = true
}

// Variable: basePath

// Basepath for all URLs in the core without trailing slash. Default is '.'.
// Set mxBasePath prior to loading the MxClient library as follows to override
// this setting:

// (code)
// <script type="text/javascript">
// mxBasePath = '/path/to/core/directory';
// </script>
// <script type="text/javascript" src="/path/to/core/directory/js/MxClient.js"></script>
// (end)

// When using a relative path, the path is relative to the URL of the page that
// contains the assignment. Trailing slashes are automatically removed.

if (typeof configures.mxBasePath !== 'undefined' && configures.mxBasePath.length > 0) {
  // Adds a trailing slash if required
  if (configures.mxBasePath.substring(configures.mxBasePath.length - 1) === '/') {
    configures.mxBasePath = configures.mxBasePath.substring(0, configures.mxBasePath.length - 1)
  }

  MxClient.basePath = configures.mxBasePath
} else {
  MxClient.basePath = '.'
}

// Variable: imageBasePath

// Basepath for all images URLs in the core without trailing slash. Default is
// <MxClient.basePath> + '/images'. Set mxImageBasePath prior to loading the
// MxClient library as follows to override this setting:

// (code)
// <script type="text/javascript">
// mxImageBasePath = '/path/to/image/directory';
// </script>
// <script type="text/javascript" src="/path/to/core/directory/js/MxClient.js"></script>
// (end)

// When using a relative path, the path is relative to the URL of the page that
// contains the assignment. Trailing slashes are automatically removed.

if (typeof configures.mxImageBasePath !== 'undefined' && configures.mxImageBasePath.length > 0) {
  // Adds a trailing slash if required
  if (configures.mxImageBasePath.substring(configures.mxImageBasePath.length - 1) === '/') {
    configures.mxImageBasePath = configures.mxImageBasePath.substring(0, configures.mxImageBasePath.length - 1)
  }

  MxClient.imageBasePath = configures.mxImageBasePath
} else {
  MxClient.imageBasePath = MxClient.basePath + '/images'
}

// Variable: language

// Defines the language of the client, eg. en for english, de for german etc.
// The special value 'none' will disable all built-in internationalization and
// resource loading. See <MxResources.getSpecialBundle> for handling identifiers
// with and without a dash.

// Set mxLanguage prior to loading the MxClient library as follows to override
// this setting:

// (code)
// <script type="text/javascript">
// mxLanguage = 'en';
// </script>
// <script type="text/javascript" src="js/MxClient.js"></script>
// (end)

// If internationalization is disabled, then the following variables should be
// overridden to reflect the current language of the system. These variables are
// cleared when i18n is disabled.
// <mxEditor.askZoomResource>, <mxEditor.lastSavedResource>,
// <mxEditor.currentFileResource>, <mxEditor.propertiesResource>,
// <mxEditor.tasksResource>, <mxEditor.helpResource>, <mxEditor.outlineResource>,
// <mxElbowEdgeHandler.doubleClickOrientationResource>, <mxUtils.errorResource>,
// <mxUtils.closeResource>, <mxGraphSelectionModel.doneResource>,
// <mxGraphSelectionModel.updatingSelectionResource>, <mxGraphView.doneResource>,
// <mxGraphView.updatingDocumentResource>, <mxCellRenderer.collapseExpandResource>,
// <mxGraph.containsValidationErrorsResource> and
// <mxGraph.alreadyConnectedResource>.

if (typeof configures.mxLanguage !== 'undefined' && configures.mxLanguage != null) {
  MxClient.language = configures.mxLanguage
} else {
  MxClient.language = MxClient.IS_IE
    ? navigator.userLanguage
    : navigator.language
}

// Variable: defaultLanguage

// Defines the default language which is used in the common resource files. Any
// resources for this language will only load the common resource file, but not
// the language-specific resource file. Default is 'en'.

// Set mxDefaultLanguage prior to loading the MxClient library as follows to override
// this setting:

// (code)
// <script type="text/javascript">
// mxDefaultLanguage = 'de';
// </script>
// <script type="text/javascript" src="js/MxClient.js"></script>
// (end)

if (typeof configures.mxDefaultLanguage !== 'undefined' && configures.mxDefaultLanguage != null) {
  MxClient.defaultLanguage = configures.mxDefaultLanguage
} else {
  MxClient.defaultLanguage = 'en'
}

// Adds all required stylesheets and namespaces
if (configures.mxLoadStylesheets) {
  MxClient.link('stylesheet', MxClient.basePath + '/css/common.css')
}

// Variable: languages

// Defines the optional array of all supported language extensions. The default
// language does not have to be part of this list. See
// <MxResources.isLanguageSupported>.

// (code)
// <script type="text/javascript">
// mxLanguages = ['de', 'it', 'fr'];
// </script>
// <script type="text/javascript" src="js/MxClient.js"></script>
// (end)

// This is used to avoid unnecessary requests to language files, ie. if a 404
// will be returned.

if (typeof mxLanguages !== 'undefined' && configures.mxLanguages != null) {
  MxClient.languages = configures.mxLanguages
}

// Adds required namespaces, stylesheets and memory handling for older IE browsers
if (MxClient.IS_VML) {
  if (MxClient.IS_SVG) {
    MxClient.IS_VML = false
  } else {
    // Enables support for IE8 standards mode. Note that this requires all attributes for VML
    // elements to be set using direct notation, ie. node.attr = value. The use of setAttribute
    // is not possible.
    if (document.documentMode === 8) {
      document.namespaces.add(
        MxClient.VML_PREFIX,
        'urn:schemas-microsoft-com:vml',
        '#default#VML'
      )
      document.namespaces.add(
        MxClient.OFFICE_PREFIX,
        'urn:schemas-microsoft-com:office:office',
        '#default#VML'
      )
    } else {
      document.namespaces.add(
        MxClient.VML_PREFIX,
        'urn:schemas-microsoft-com:vml'
      )
      document.namespaces.add(
        MxClient.OFFICE_PREFIX,
        'urn:schemas-microsoft-com:office:office'
      )
    }

    // Workaround for limited number of stylesheets in IE (does not work in standards mode)
    if (MxClient.IS_QUIRKS && document.styleSheets.length >= 30) {
      ;(function() {
        let node = document.createElement('style')
        node.type = 'text/css'
        node.styleSheet.cssText =
          MxClient.VML_PREFIX +
          '\\:*{behavior:url(#default#VML)}' +
          MxClient.OFFICE_PREFIX +
          '\\:*{behavior:url(#default#VML)}'
        document.getElementsByTagName('head')[0].appendChild(node)
      })()
    } else {
      document.createStyleSheet().cssText =
        MxClient.VML_PREFIX +
        '\\:*{behavior:url(#default#VML)}' +
        MxClient.OFFICE_PREFIX +
        '\\:*{behavior:url(#default#VML)}'
    }

    if (configures.mxLoadStylesheets) {
      MxClient.link('stylesheet', MxClient.basePath + '/css/explorer.css')
    }

    // Cleans up resources when the application terminates
    window.attachEvent('onunload', MxClient.dispose)
  }
}

export default MxClient
