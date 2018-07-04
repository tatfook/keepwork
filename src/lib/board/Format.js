import DiagramFormatPanel from './Format'

export default class extends DiagramFormatPanel {
  addView(div) {
    div.removeChild(div.lastChild)

    return div
  }
}
