<template>
  <el-row type='flex' class="full-height">
    <el-col class="mods-treeview">
      <!-- <el-tree :data='modsMenu' :props='defaultProps' highlight-current accordion :indent=0 @node-click='modeMenuClick'></el-tree> -->
      <el-tree ref='tree' node-key='id' :data='mods' :props='defaultProps' highlight-current accordion :indent=0 @node-click='nodeMenuClick' @node-collapse='nodeCollapseHandle'></el-tree>
    </el-col>
    <el-col class="preview-box">
      <div v-for='mod in activeModsList' :key='mod.name'>
        <img v-for='(style, index) in mod.styles' :key='style.name' class="style-cover" :src="style.cover" alt="" @click='newMode(mod.name, index)'>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import mods from '@/components/adi/mod/modslist.config'
import { mapGetters } from 'vuex'
export default {
  name: 'ModsList',
  mounted() {
    this.$refs.tree.setCurrentNode(mods[0])
    this.activeModsList = mods[0].mods
  },
  data() {
    return {
      mods,
      activeModsList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectedModKey: null
    }
  },
  computed: {
    ...mapGetters({
      activeMod: 'activeMod'
    })
  },
  methods: {
    nodeMenuClick(data) {
      if (data.children && data.children.length > 0) {
        return
      }
      this.activeModsList = data.mods
    },
    nodeCollapseHandle(data, node, comp) {},
    newMode(name, index) {
      this.$store.dispatch('addMod', {
        modName: name,
        preModKey: this.activeMod && this.activeMod.key,
        styleID: index
      })
    }
  }
}
</script>
<style scoped>
.full-height {
  height: 100%;
}
.style-cover {
  width: 100%;
  cursor: pointer;
}
.mods-treeview {
  border-right: 2px solid #c0c4cc;
  width: auto;
  max-width: 40%;
}
.preview-box {
  padding: 0 5px;
  background-color: #e4e7ed;
  max-height: 100%;
  overflow: auto;
}
</style>
<style>
.mods-treeview .el-tree-node__content {
  padding-right: 15px;
}
.mods-treeview
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #e6f7ff;
  color: #1890ff;
  position: relative;
}
.mods-treeview .el-tree-node__content {
  height: 40px;
  line-height: 40px;
}
.mods-treeview .el-tree-node__label {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>