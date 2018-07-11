import MxClient from './mxGraph/MxClient'
import MxEvent from './mxGraph/util/MxEvent'
import MxUtils from './mxGraph/util/MxUtils'
import MxResources from './mxGraph/util/MxResources'

export class ErrorDialog {
  constructor(editorUi, title, message, buttonText, fn, retry, buttonText2, fn2, hide) {
    hide = (hide !== null) ? hide : true

    let div = document.createElement('div')
    div.style.textAlign = 'center'

    if (title !== null) {
      let hd = document.createElement('div')
      hd.style.padding = '0px'
      hd.style.margin = '0px'
      hd.style.fontSize = '18px'
      hd.style.paddingBottom = '16px'
      hd.style.marginBottom = '16px'
      hd.style.borderBottom = '1px solid #c0c0c0'
      hd.style.color = 'gray'
      MxUtils.write(hd, title)
      div.appendChild(hd)
    }

    let p2 = document.createElement('div')
    p2.style.padding = '6px'
    p2.innerHTML = message
    div.appendChild(p2)

    let btns = document.createElement('div')
    btns.style.marginTop = '16px'
    btns.style.textAlign = 'right'

    if (retry !== null) {
      let retryBtn = MxUtils.button(MxResources.get('tryAgain'), function() {
        editorUi.hideDialog()
        retry()
      })
      retryBtn.className = 'geBtn'
      btns.appendChild(retryBtn)

      btns.style.textAlign = 'center'
    }

    let btn = MxUtils.button(buttonText, function() {
      if (hide) {
        editorUi.hideDialog()
      }

      if (fn !== null) {
        fn()
      }
    })
    btn.className = 'geBtn'

    btns.appendChild(btn)

    if (buttonText2 !== null) {
      let mainBtn = MxUtils.button(buttonText2, function() {
        if (hide) {
          editorUi.hideDialog()
        }

        if (fn2 !== null) {
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
    let div = document.createElement('div')
    div.style.textAlign = 'center'

    let p2 = document.createElement('div')
    p2.style.padding = '6px'
    p2.style.overflow = 'auto'
    p2.style.maxHeight = '40px'

    if (MxClient.IS_QUIRKS) {
      p2.style.height = '60px'
    }

    MxUtils.write(p2, message)
    div.appendChild(p2)

    let btns = document.createElement('div')
    btns.style.textAlign = 'center'
    btns.style.whiteSpace = 'nowrap'

    let cb = document.createElement('input')
    cb.setAttribute('type', 'checkbox')

    let cancelBtn = MxUtils.button(cancelLabel || MxResources.get('cancel'), function() {
      editorUi.hideDialog()

      if (cancelFn !== null) {
        cancelFn(cb.checked)
      }
    })
    cancelBtn.className = 'geBtn'

    if (cancelImg !== null) {
      cancelBtn.innerHTML = cancelImg + '<br>' + cancelBtn.innerHTML
      cancelBtn.style.paddingBottom = '8px'
      cancelBtn.style.paddingTop = '8px'
      cancelBtn.style.height = 'auto'
      cancelBtn.style.width = '40%'
    }

    if (editorUi.editor.cancelFirst) {
      btns.appendChild(cancelBtn)
    }

    let okBtn = MxUtils.button(okLabel || MxResources.get('ok'), function() {
      editorUi.hideDialog()

      if (okFn !== null) {
        okFn(cb.checked)
      }
    })

    btns.appendChild(okBtn)

    if (okImg !== null) {
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

      let p2 = document.createElement('p')
      p2.style.marginTop = '20px'
      p2.appendChild(cb)

      let span = document.createElement('span')
      MxUtils.write(span, ' ' + MxResources.get('rememberThisSetting'))
      p2.appendChild(span)
      div.appendChild(p2)

      MxEvent.addListener(span, 'click', function(evt) {
        cb.checked = !cb.checked
        MxEvent.consume(evt)
      })
    } else {
      btns.style.marginTop = '16px'
    }

    this.container = div
  }
}
