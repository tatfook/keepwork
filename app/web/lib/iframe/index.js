const handleMessage = function(e) {
  const FAIL = { cmd: 'fail' }
  const SUCCESS = { cmd: 'success' }
  const frameViewport = window.frames['frameViewport']
  const win = frameViewport ? frameViewport.contentWindow : window
  const data = e.data

  if (!data || !data.cmd) {
    return
  }

  function postMessage(data, origin) {
    origin = origin || '*'
    data = data || SUCCESS
    e.source.postMessage(data, origin)
  }

  if (data.cmd === 'element_style') {
    const selector = data.selector
    const style = data.style || {}
    const el = win.document.getElementById(selector)

    if (!el) {
      return postMessage(FAIL)
    }

    el.style.height = style.height
    el.style.width = style.width
  } else {
    console.log('cmd not found', e)
    return
  }

  postMessage(SUCCESS)
}

export default handleMessage
