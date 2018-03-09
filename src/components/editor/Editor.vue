<template>
  <el-row :gutter="20">
    <el-col :span="10">
      <editor-markdown/>
    </el-col>
    <el-col :span="10">
      <editor-viewport/>
    </el-col>
    <el-col :span="4">
      <mod-property-manager/>
    </el-col>
  </el-row>
</template>

<script>
import EditorMarkdown from './EditorMarkdown'
import EditorViewport from './EditorViewport'
import ModPropertyManager from './ModPropertyManager'

export default {
  name: 'Editor',
  data() {
    return {}
  },
  components: {
    EditorMarkdown,
    EditorViewport,
    ModPropertyManager
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
</style>
