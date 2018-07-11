// eslint-disable-line no-unused-vars
import MxResources from './mxGraph/util/MxResources'
import MxUtils from './mxGraph/util/MxUtils'
import Graph from './drawio/js/Graph'
import Board from './Board'
import Editor from './Editor'
import MxClient from './mxGraph/MxClient'
import MxGraphModel from './mxGraph/model/MxGraphModel'
import MxCodec from './mxGraph/io/MxCodec'

let ui
let getData; // eslint-disable-line no-unused-vars
// Extends EditorUi to update I/O action states based on availability of backend
(function() {
  // Adds required resources (disables loading of fallback properties, this can only
  // be used if we know that all keys are defined in the language specific file)
  MxResources.loadDefaultBundle = false

  let bundle = MxResources.getDefaultBundle(RESOURCE_BASE, mxLanguage) || MxResources.getSpecialBundle(RESOURCE_BASE, mxLanguage)

  // Fixes possible asynchronous requests
  MxUtils.getAll([bundle, STYLE_PATH + '/default.xml'], function(xhr) {
    // Adds bundle text to resources
    MxResources.parse(xhr[0].getText())

    // Configures the default graph theme
    let themes = {}
    themes[Graph.prototype.defaultThemeName] = xhr[1].getDocumentElement()

    let data = `<MxGraphModel dx="1430" dy="817" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" background="#ffffff"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="2" value="Text" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;" vertex="1" parent="1"><mxGeometry x="90" y="120" width="40" height="20" as="geometry"/></mxCell><mxCell id="3" value="&lt;h1&gt;Heading&lt;/h1&gt;&lt;p&gt;Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.&lt;/p&gt;" style="text;html=1;strokeColor=none;fillColor=none;spacing=5;spacingTop=-20;whiteSpace=wrap;overflow=hidden;" vertex="1" parent="1"><mxGeometry x="210" y="70" width="190" height="120" as="geometry"/></mxCell><mxCell id="4" value="" style="ellipse;shape=doubleEllipse;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="110" y="170" width="120" height="80" as="geometry"/></mxCell><mxCell id="5" value="" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="310" y="200" width="120" height="60" as="geometry"/></mxCell><mxCell id="6" value="" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="150" y="320" width="120" height="60" as="geometry"/></mxCell><mxCell id="7" value="" style="shape=ext;double=1;whiteSpace=wrap;html=1;aspect=fixed;" vertex="1" parent="1"><mxGeometry x="450" y="120" width="80" height="80" as="geometry"/></mxCell><mxCell id="8" value="" style="shape=cube;whiteSpace=wrap;html=1;boundedLbl=1;" vertex="1" parent="1"><mxGeometry x="80" y="370" width="120" height="80" as="geometry"/></mxCell><mxCell id="9" value="" style="shape=internalStorage;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="360" y="290" width="80" height="80" as="geometry"/></mxCell></root></MxGraphModel>`

    let doc = MxUtils.parseXml(data)
    let model = new MxGraphModel()
    let codec = new MxCodec(doc)

    codec.decode(doc.documentElement, model)

    let children = model.getChildren(model.getChildAt(model.getRoot(), 0))

    if (urlParams['preview'] === '1') {
      let graph = new Graph(document.body, null, null, null, themes)

      graph.setEnabled(false)
      graph.importCells(children)
    } else {
      ui = new Board(new Editor(urlParams['chrome'] === '0', themes))

      ui.actions.get('help').funct = function() {
        let ext = ''
        console.log(ext)
        if (MxResources.isLanguageSupported(MxClient.language)) {
          ext = '_' + MxClient.language
        }

        window.open('https://support.draw.io/display/DO/Draw.io+Online+User+Manual')
      }

      let doc = MxUtils.parseXml(data)
      ui.editor.setGraphXml(doc.documentElement)

      let compressData = ui.getCurrentCompressData()
      console.log(compressData)
      // console.log(ui.editor.graph.getDecompressData(compressData));
    }
  }, function() {
    document.body.innerHTML = '<center style="margin-top:10%;">Error loading resource files. Please check browser console.</center>'
  })
})()
