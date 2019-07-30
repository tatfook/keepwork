<template>
  <div id="jsFormDescription" class="rich-text-content">
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import E from 'wangeditor'
export default {
  name: 'RichTextContent',
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
    editor.customConfig.colors = this.colors
    editor.create()
    this.originContent = _.get(this.formDetail, 'text', [])
    editor.txt.html(this.originContent)
    this.formEditor = editor
  },
  computed: {
    ...mapGetters({
      getFormDetailById: 'org/getFormDetailById'
    }),
    formId() {
      return _.get(this.$route, 'params.id')
    },
    formDetail() {
      return this.getFormDetailById({ id: this.formId }) || {}
    }
  },
  data() {
    return {
      formEditor: undefined,
      originContent: '',
      colors: [
        '#000000',
        '#303133',
        '#909399',
        '#eeece0',
        '#1144ac',
        '#1c487f',
        '#2397f3',
        '#4d80bf',
        '#c24f4a',
        '#8baa4a',
        '#7b5ba1',
        '#46acc8',
        '#f36823',
        '#f9963b',
        '#ffffff'
      ]
    }
  },
  methods: {
    getHtmlStr() {
      return this.formEditor.txt.html()
    }
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
