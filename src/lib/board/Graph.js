import Graph from './drawio/js/Graph'

import mxClient from './mxGraph'
import mxUtils from './mxGraph/util/mxUtils'
import mxEvent from './mxGraph/util/mxEvent'
import MxStackLayout from './mxGraph/layout/MxStackLayout'
import pako from 'pako'
import Base64 from 'js-base64'

export default class extends Graph {
  init() {
    // graphInit.apply(this, arguments)

    // Override insert location for current mouse point
    let mouseEvent = null

    function setMouseEvent(evt) {
      mouseEvent = evt

      // Workaround for member not found in IE8-
      if (mxClient.IS_QUIRKS || document.documentMode === 7 || document.documentMode === 8) {
        mouseEvent = mxUtils.clone(evt)
      }
    };

    mxEvent.addListener(this.container, 'mouseenter', setMouseEvent)
    mxEvent.addListener(this.container, 'mousemove', setMouseEvent)

    mxEvent.addListener(this.container, 'mouseleave', function(evt) {
      mouseEvent = null
    })

    // Extends getInsertPoint to use the current mouse location
    this.isMouseInsertPoint = function() {
      return mouseEvent != null
    }

    let getInsertPoint = this.getInsertPoint

    this.getInsertPoint = function() {
      if (mouseEvent != null) {
        return this.getPointForEvent(mouseEvent)
      }

      return getInsertPoint.apply(this, arguments)
    }

    let layoutManagerGetLayout = this.layoutManager.getLayout

    this.layoutManager.getLayout = function(cell) {
      let state = this.graph.view.getState(cell)
      let style = (state != null) ? state.style : this.graph.getCellStyle(cell)

      // mxRackContainer may be undefined as it is dynamically loaded at render time
      if (typeof (mxRackContainer) !== 'undefined' && style['childLayout'] === 'rack') {
        let rackLayout = new MxStackLayout(this.graph, false)

        rackLayout.setChildGeometry = function(child, geo) {
          let unitSize = 20

          geo.height = Math.max(geo.height, unitSize)

          if (geo.height / unitSize > 1) {
            let mod = geo.height % unitSize
            geo.height += mod > unitSize / 2 ? (unitSize - mod) : -mod
          }

          this.graph.getModel().setGeometry(child, geo)
        }

        rackLayout.fill = true
        rackLayout.unitSize = mxRackContainer.unitSize | 20
        rackLayout.marginLeft = style['marginLeft'] || 0
        rackLayout.marginRight = style['marginRight'] || 0
        rackLayout.marginTop = style['marginTop'] || 0
        rackLayout.marginBottom = style['marginBottom'] || 0
        rackLayout.resizeParent = false

        return rackLayout
      }

      return layoutManagerGetLayout.apply(this, arguments)
    }
  }

  getDecompressData(compressData) {
    let graphData = mxUtils.parseXml(compressData)

    if (typeof (graphData) === 'object') {
      let diagram = graphData.querySelector('diagram')
      let version = diagram.getAttribute('version')
      let content = diagram.innerHTML

      if (version === '0.0.1') {
        let mxGraphModelText = this.decompress(content)

        if (mxGraphModelText) {
          return mxUtils.parseXml(mxGraphModelText)
        }
      }
    }
  }

  /**
   * Returns a base64 encoded version of the compressed string.
   */
  compress(data) {
    if (data === null || data.length === 0) {
      return data
    } else {
      let tmp = this.bytesToString(pako.deflateRaw(encodeURIComponent(data)))

      return (window.btoa) ? btoa(tmp) : Base64.encode(tmp, true)
    }
  };

  /**
   * Returns a decompressed version of the base64 encoded string.
   */
  decompress(data) {
    if (data === null || data.length === 0) {
      return data
    } else {
      let tmp = (window.atob) ? atob(data) : Base64.decode(data, true)

      return this.zapGremlins(decodeURIComponent(this.bytesToString(pako.inflateRaw(tmp))))
    }
  };
}
