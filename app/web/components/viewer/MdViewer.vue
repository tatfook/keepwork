<template>
  <mod-list-viewer :modList="blockList" :theme="theme"></mod-list-viewer>
</template>

<script>
import ModListViewer from './ModListViewer'
import Parser from '@/lib/mod/parser'
import themeFactory from '@/lib/theme/theme.factory'
export default {
  name: 'MdViewer',
  props: {
    content: String
  },
  mounted() {
    this.theme = themeFactory.generate({})
    console.log(this.theme)
    this.changeMdToModList()
  },
  data() {
    return {
      blockList: [],
      theme: {}
    }
  },
  methods: {
    changeMdToModList() {
      console.log(1111111, Parser.buildBlockList(this.content))
      this.blockList = Parser.buildBlockList(this.content)
      console.log(this.blockList)
    }
  },
  components: {
    ModListViewer
  },
  watch: {
    content() {
      this.changeMdToModList()
    }
  }
}
</script>
