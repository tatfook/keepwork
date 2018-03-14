<template>
  <el-row :gutter="20" class="full-height" type='flex'>
    <el-col :span="6" class="manager-win">
      <el-button @click="changeView('Search')">搜索</el-button>
      <el-button @click="changeView('ModPropertyManager')">ADI属性</el-button>
      <el-button @click="changeView('ModsList')">Mod list</el-button>
      <el-button @click="changeView('FileManager')">文件管理</el-button>
      <component :is='activeComponent'></component>
      <!-- <mod-property-manager> </mod-property-manager> -->
    </el-col>
    <el-col :span="9" class="preview-win">
      <editor-viewport> </editor-viewport>
    </el-col>
    <el-col :span="9" class="code-win">
      <editor-markdown/>
    </el-col>
  </el-row>
</template>

<script>
import EditorMarkdown from './EditorMarkdown'
import EditorViewport from './EditorViewport'
import ModPropertyManager from './ModPropertyManager'
import FileManager from './FileManager'
import ModsList from './ModsList'
import Search from './Search'
import { mapGetters } from 'vuex'

export default {
  name: 'Editor',
  data() {
    return {}
  },
  created() {
    this.changeView('Search')
  },
  components: {
    EditorMarkdown,
    EditorViewport,
    ModPropertyManager,
    Search,
    ModsList,
    FileManager
  },
  computed: {
    ...mapGetters({
      activeComponent: 'activeComponentType'
    })
  },
  methods: {
    changeView(type) {
      this.$store.dispatch('setActiveWinType', type)
    }
  }
}
</script>

<style lang="scss">
.mod-active {
  border: 2px solid rgb(240, 15, 15);
}
.comp-active {
  border: 3px dashed rgb(43, 11, 221);
}
.manager-win{
  // background-color: red;
}
.preview-win{
  // background-color: blue;
}
.code-win{
  // background-color: yellow;
}
.full-height{
  height: 100%;
}
</style>
