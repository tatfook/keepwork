import mxClient from './mxGraph/mxClient'
import mxEvent from './mxGraph/'
import mxUtils from './mxGraph/util/mxUtils'
import mxResources from './mxGraph/util/mxResources'

export class ErrorDialog {
  constructor(editorUi, title, message, buttonText, fn, retry, buttonText2, fn2, hide) {
    hide = (hide != null) ? hide : true

    var div = document.createElement('div')
    div.style.textAlign = 'center'

    if (title != null) {
      var hd = document.createElement('div')
      hd.style.padding = '0px'
      hd.style.margin = '0px'
      hd.style.fontSize = '18px'
      hd.style.paddingBottom = '16px'
      hd.style.marginBottom = '16px'
      hd.style.borderBottom = '1px solid #c0c0c0'
      hd.style.color = 'gray'
      mxUtils.write(hd, title)
      div.appendChild(hd)
    }

    var p2 = document.createElement('div')
    p2.style.padding = '6px'
    p2.innerHTML = message
    div.appendChild(p2)

    var btns = document.createElement('div')
    btns.style.marginTop = '16px'
    btns.style.textAlign = 'right'

    if (retry != null) {
      var retryBtn = mxUtils.button(mxResources.get('tryAgain'), function() {
        editorUi.hideDialog()
        retry()
      })
      retryBtn.className = 'geBtn'
      btns.appendChild(retryBtn)

      btns.style.textAlign = 'center'
    }

    var btn = mxUtils.button(buttonText, function() {
      if (hide) {
        editorUi.hideDialog()
      }

      if (fn != null) {
        fn()
      }
    })
    btn.className = 'geBtn'

    btns.appendChild(btn)

    if (buttonText2 != null) {
      var mainBtn = mxUtils.button(buttonText2, function() {
        if (hide) {
          editorUi.hideDialog()
        }

        if (fn2 != null) {
          fn2()
        }
      })
      mainBtn.className = 'geBtn gePrimaryBtn'
      btns.appendChild(mainBtn)
    }

    this.init = function() {
      btn.focus()
    }

    div.appendChild(btns)

    this.container = div
  }
}

export class ConfirmDialog {
  constructor(editorUi, message, okFn, cancelFn, okLabel, cancelLabel, okImg, cancelImg, showRememberOption) {
    var div = document.createElement('div')
    div.style.textAlign = 'center'

    var p2 = document.createElement('div')
    p2.style.padding = '6px'
    p2.style.overflow = 'auto'
    p2.style.maxHeight = '40px'

    if (mxClient.IS_QUIRKS) {
      p2.style.height = '60px'
    }

    mxUtils.write(p2, message)
    div.appendChild(p2)

    var btns = document.createElement('div')
    btns.style.textAlign = 'center'
    btns.style.whiteSpace = 'nowrap'

    var cb = document.createElement('input')
    cb.setAttribute('type', 'checkbox')

    var cancelBtn = mxUtils.button(cancelLabel || mxResources.get('cancel'), function() {
      editorUi.hideDialog()

      if (cancelFn != null) {
        cancelFn(cb.checked)
      }
    })
    cancelBtn.className = 'geBtn'

    if (cancelImg != null) {
      cancelBtn.innerHTML = cancelImg + '<br>' + cancelBtn.innerHTML
      cancelBtn.style.paddingBottom = '8px'
      cancelBtn.style.paddingTop = '8px'
      cancelBtn.style.height = 'auto'
      cancelBtn.style.width = '40%'
    }

    if (editorUi.editor.cancelFirst) {
      btns.appendChild(cancelBtn)
    }

    var okBtn = mxUtils.button(okLabel || mxResources.get('ok'), function() {
      editorUi.hideDialog()

      if (okFn != null) {
        okFn(cb.checked)
      }
    })

    btns.appendChild(okBtn)

    if (okImg != null) {
      okBtn.innerHTML = okImg + '<br>' + okBtn.innerHTML + '<br>'
      okBtn.style.paddingBottom = '8px'
      okBtn.style.paddingTop = '8px'
      okBtn.style.height = 'auto'
      okBtn.className = 'geBtn'
      okBtn.style.width = '40%'
    } else {
      okBtn.className = 'geBtn gePrimaryBtn'
    }

    if (!editorUi.editor.cancelFirst) {
      btns.appendChild(cancelBtn)
    }

    div.appendChild(btns)

    if (showRememberOption) {
      btns.style.marginTop = '10px'

      var p2 = document.createElement('p')
      p2.style.marginTop = '20px'
      p2.appendChild(cb)

      var span = document.createElement('span')
      mxUtils.write(span, ' ' + mxResources.get('rememberThisSetting'))
      p2.appendChild(span)
      div.appendChild(p2)

      mxEvent.addListener(span, 'click', function(evt) {
        cb.checked = !cb.checked
        mxEvent.consume(evt)
      })
    } else {
      btns.style.marginTop = '16px'
    }

    this.container = div
  }
}
