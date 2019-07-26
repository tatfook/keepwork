<template>
  <div id="jsFormDescription" class="rich-text-content">
  </div>
</template>

<script>
import E from 'wangeditor'
export default {
  name: 'RichTextContent',
  props: {
    originContent: String
  },
  mounted() {
    let editor = new E('#jsFormDescription')
    editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      'undo', // 撤销
      'redo' // 重复
    ]
    editor.create()
    editor.txt.html(this.originContent)
    this.formEditor = editor
  },
  data() {
    return { formEditor: undefined }
  }
}
</script>
<style lang="scss" scoped>
.rich-text-content {
  /deep/ .w-e-text-container {
    height: 290px !important;
    border-color: #e0e4ee !important;
  }
  /deep/ .w-e-toolbar {
    border-color: #e0e4ee !important;
    background-color: #efefef !important;
  }
}
</style>
