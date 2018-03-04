<template>
  <el-row :gutter="20">
    <el-col :span="16">
      <editor-viewport> </editor-viewport>
    </el-col>
    <el-col :span="8">
      <mod-property-manager> </mod-property-manager>
    </el-col>
  </el-row>
</template>

<script>
import EditorViewport from './EditorViewport'
import ModPropertyManager from './ModPropertyManager'

export default {
  name: 'Editor',
  data() {
    return {}
  },
  components: {
    EditorViewport,
    ModPropertyManager
  }
}
</script>
