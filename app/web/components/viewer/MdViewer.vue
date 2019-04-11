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
      this.blockList = Parser.buildBlockList(this.content)
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
