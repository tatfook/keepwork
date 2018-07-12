import MxClient from './mxGraph/MxClient'
import MxUtils from './mxGraph/util/MxUtils'
import Editor from './drawio/js/Editor'
import { Base64 } from 'js-base64'
import MxResources from './mxGraph/util/MxResources'

export default class extends Editor {
  /**
   * Blank 1x1 pixel transparent PNG image.
   */
  static get hiResImage() {
    return (MxClient.IS_SVG) ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAA+CAMAAACLMWy1AAAAh1BMVEUAAABMTExERERBQUFBQUFFRUVAQEBCQkJAQEA6OjpDQ0NKSkpBQUFBQUFERERERERBQUFCQkJCQkJCQkJJSUlBQUFCQkJDQ0NDQ0NCQkJDQ0NBQUFBQUFCQkJBQUFCQkJCQkJDQ0NCQkJHR0dBQUFCQkJCQkJAQEBCQkJDQ0NAQEBERERCQkIk1hS2AAAAKnRSTlMAAjj96BL7PgQFRwfu3TYazKuVjRXl1V1DPCn1uLGjnWNVIgy9hU40eGqPkM38AAACG0lEQVRYw+2X63KbMBCFzwZblgGDceN74muatpLe//m6MHV3gHGFAv2RjM94MAbxzdnVsQbBDKwH8AH8MDAyafzjqYeyOG04XE7RS8nIRDXg6BlT+rA0nmtAPh+NQRDxIASIMG44rAMrGunBgHwy3uUldxggIStGKp2f+DQc2O4h4eQsX3O2IFB/oEbsjOKbStnjAEA+zJ0ylZTbgvoDn8xNyn6Dbj5Kd4GsNpABa6duQPfSdEj88TgMAhKuCWjAkgmFXPLnsD0pWd3OFGdrMugQII/eOMPEiGOzqPMIeWrcSoMCg71W1pXBPvCP+gS/OdXqQ3uW23+93XGWLl/OaBb805bNcBPoEIcVJsnHzcxpZH86u5KZ9gDby5dQCcnKqdbke4ItI4Tzd7IW9hZQt4EO6GG9b9sYuuK9Wwn8TIr2xKbF2+3Nhr+qxChJ/AI6pIfCu4z4Zowp4ZUNihz79vewzctnHDwTvQO/hCdFBzrUGDOPn2Y/F8YKT4oOATLvlhOznzmBSdFBJWtc58y7r+UVFOCQczy3wpN6pegDqHtsCPTGvH9JuTO0Dyg8icldYPk+RB6g8Aofj4m2EKBvtTmUPD9xDd1pPcSReV2U5iD/ik2yrngtvvqBfPzOvKiDTKTsCdoHZJ7pLLffgTwlJ5vJdtJV2/jiAYaLvLGhMAEDO5QcDg2M/jOw/8Zn+K3ZwJvHT7ZffgC/NvA3zcybTeIfE4EAAAAASUVORK5CYII=' : IMAGE_PATH + '/img-hi-res.png'
  }

  /**
   * Blank 1x1 pixel transparent PNG image.
   */
  static get loResImage() {
    return (MxClient.IS_SVG) ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAA+CAMAAACLMWy1AAAAS1BMVEVAQEAAAAA1NTVBQUFDQ0NDQ0NFRUVERERBQUFBQUFBQUFAQEBBQUFBQUFCQkJCQkJCQkJBQUFCQkJDQ0NDQ0NCQkJCQkJCQkJGRkb5/XqTAAAAGXRSTlP+AAWODlASCsesX+Lc2LyWe3pwa1tCPjohjSJfoAAAAI1JREFUWMPt1MkKhTAMRuG0anvneXr/J71nUypKcdqI/N8yhLMKMZE1CahnClDQzMPB44ED3EgeCubgDWnWQMHpwTtKwTe+UHD4sJ94wbUEHHFGhILlYDeSnsQeabeCgsPBgB0MOZZ9oGA5GJFiJSfUULAfjLjARrhCwX7wh2YCDwVbwZkUBKqFFJRN+wOcwSgR2sREcgAAAABJRU5ErkJggg===' : IMAGE_PATH + '/img-lo-res.png'
  }

  /**
   * Helper function to extract the graph model XML node.
   */
  extractGraphModel(node, allowMxFile) {
    if (node !== null && typeof (pako) !== 'undefined') {
      let tmp = node.ownerDocument.getElementsByTagName('div')
      let divs = []

      if (tmp !== null && tmp.length > 0) {
        for (let i = 0; i < tmp.length; i++) {
          if (tmp[i].getAttribute('class') === 'mxgraph') {
            divs.push(tmp[i])
            break
          }
        }
      }

      if (divs.length > 0) {
        let data = divs[0].getAttribute('data-mxgraph')

        if (data !== null) {
          let config = JSON.parse(data)

          if (config !== null && config.xml !== null) {
            let doc2 = MxUtils.parseXml(config.xml)
            node = doc2.documentElement
          }
        } else {
          let divs2 = divs[0].getElementsByTagName('div')

          if (divs2.length > 0) {
            let data = MxUtils.getTextContent(divs2[0])
            data = this.graph.decompress(data)

            if (data.length > 0) {
              let doc2 = MxUtils.parseXml(data)
              node = doc2.documentElement
            }
          }
        }
      }
    }

    if (node !== null && node.nodeName === 'svg') {
      let tmp = node.getAttribute('content')

      if (tmp !== null && tmp.charAt(0) !== '<' && tmp.charAt(0) !== '%') {
        tmp = unescape((window.atob) ? atob(tmp) : Base64.decode(cont, tmp))
      }

      if (tmp !== null && tmp.charAt(0) === '%') {
        tmp = decodeURIComponent(tmp)
      }

      if (tmp !== null && tmp.length > 0) {
        node = MxUtils.parseXml(tmp).documentElement
      } else {
        throw {message: MxResources.get('notADiagramFile')}
      }
    }

    if (node !== null && !allowMxFile) {
      let diagramNode = null

      if (node.nodeName === 'diagram') {
        diagramNode = node
      } else if (node.nodeName === 'mxfile') {
        let diagrams = node.getElementsByTagName('diagram')

        if (diagrams.length > 0) {
          diagramNode = diagrams[Math.max(0, Math.min(diagrams.length - 1, window.urlParams['page'] || 0))]
        }
      }

      if (diagramNode !== null) {
        let tmp = this.graph.decompress(MxUtils.getTextContent(diagramNode))

        if (tmp !== null && tmp.length > 0) {
          node = MxUtils.parseXml(tmp).documentElement
        }
      }
    }

    if (node !== null && node.nodeName !== 'mxGraphModel' && (!allowMxFile || node.nodeName !== 'mxfile')) {
      node = null
    }

    return node
  }
}
