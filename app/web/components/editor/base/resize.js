export default {
  data() {
    return {
      bodyWidth: document.body.clientWidth,
      resizeWinParams: {
        mouseStartX: 0,
        isResizing: false,
        leftColWidthParam: '',
        rightColWidthParam: ''
      }
    }
  },
  methods: {
    resizeCol(event, leftColWidthParam, rightColWidthParam, rate) {
      if (!(event && event.clientX)) {
        return
      }

      this.rate = rate || 100
      this.resizeWinParams.isResizing = true
      this.resizeWinParams.mouseStartX = event.clientX

      if (this.showAngle) {
        this.resizeWinParams.leftColWidthParam = rightColWidthParam
        this.resizeWinParams.rightColWidthParam = leftColWidthParam
      } else {
        this.resizeWinParams.leftColWidthParam = leftColWidthParam
        this.resizeWinParams.rightColWidthParam = rightColWidthParam
      }
    },
    dragMouseMove(event) {
      if (!(this.resizeWinParams.isResizing && event && event.clientX)) {
        return
      }

      let mouseNowX = event.clientX
      let diffClientX = mouseNowX - this.resizeWinParams.mouseStartX
      let diffPercent = (diffClientX / this.bodyWidth) * (this.rate || 100)
      this.resizeWinParams.mouseStartX = mouseNowX
      let leftColName = this.resizeWinParams.leftColWidthParam
      let rightColName = this.resizeWinParams.rightColWidthParam

      this[leftColName] = this[leftColName] + diffPercent
      this[rightColName] -= diffPercent
    },
    dragMouseUp() {
      this.resizeWinParams.isResizing = false
      this.resizeWinParams.leftColWidthParam = ''
      this.resizeWinParams.rightColWidthParam = ''
    }
  }
}
