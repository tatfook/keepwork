<template>
  <el-dialog class="tree-data-dialog" title="菜单编辑器" :visible.sync="isDialogShow" width="900px" :before-close="handleClose">
    <div class="tree-head">
      <span class="node-label">
        名称
      </span>
      <span class="node-link">
        链接
      </span>
      <span class="node-operate">
        设置
      </span>
    </div>
    <el-tree :data="treeData" :props='defaultProps' :expand-on-click-node="false" :render-content="renderContent">
    </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="finishEditingMenu">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'treeDataEditor',
  props: {
    originalTreeData: Array,
    isEditorShow: Boolean
  },
  data() {
    return {
      treeData: this.originalTreeData,
      defaultProps: {
        children: 'child',
        label: 'name'
      }
    }
  },
  computed: {
    isDialogShow() {
      return this.isEditorShow
    }
  },
  methods: {
    handleClose() {
      this.$emit('cancel', null)
    },
    finishEditingMenu() {
      this.handleClose()
      this.$emit('finishEditing', this.treeData)
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span class="node-label">{node.label}</span>
          <span class="node-link">{data.link}</span>
          <span class="node-operate">
            <el-button icon='iconfont icon-houmiantianjia' circle title='后面添加'></el-button>
            <el-button icon='iconfont icon-qianmiantianjia' circle title='前面添加'></el-button>
            <el-button icon='iconfont icon-tianjiazixiang' circle title='添加子项' on-click={() => this.append(data)}></el-button>
            <el-button icon='iconfont icon-shanchu' circle title='删除' on-click={() => this.remove(node, data)}></el-button>
          </span>
        </span>
      )
    }
  }
}
</script>
<style lang='scss'>
.tree-data-dialog {
  .custom-tree-node {
    display: flex;
    width: 100%;
  }
  .tree-head{
    display: flex;
  }
  .node-label {
    display: block;
    flex: 1;
    padding-right: 10px;
  }
  .node-link {
    display: block;
    flex-basis: 400px;
    flex-shrink: 0;
    flex-grow: 0;
    padding: 0 10px;
    box-sizing: border-box;
  }
  .node-operate {
    display: block;
    flex-basis: 280px;
    flex-shrink: 0;
    flex-grow: 0;
    padding-left: 10px;
    box-sizing: border-box;
  }
  .el-tree-node__content {
    height: 32px;
    line-height: 32px;
  }
  .el-button.is-circle{
    padding: 5px;
  }
}
</style>
