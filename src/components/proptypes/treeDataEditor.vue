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
    <el-tree :data="treeData" :props='defaultProps' :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span class="node-label">
          <span class="text" @click.stop='showInput(node.id, data, "name")'>{{data.name}}</span>
          <el-input :ref='"name"+node.id' :class="{'is-focus': data.nameInputShow}" size='mini' v-model='data.name' @blur='hideInput(data, "name")' @keyup.enter.native.prevent='finishInput(node.id, "name")'></el-input>
        </span>
        <span class="node-link">
          <span class="text" @click.stop='showInput(node.id, data, "link")'>{{data.link}}</span>
          <el-input :ref='"link"+node.id' :class="{'is-focus': data.linkInputShow}" size='mini' v-model='data.link' @blur='hideInput(data, "link")' @keyup.enter.native.prevent='finishInput(node.id, "link")'></el-input>
        </span>
        <span class="node-operate">
          <el-button icon='iconfont icon-houmiantianjia' circle title='后面添加'></el-button>
          <el-button icon='iconfont icon-qianmiantianjia' circle title='前面添加'></el-button>
          <el-button icon='iconfont icon-tianjiazixiang' circle title='添加子项' @click='() => this.append(data)'></el-button>
          <el-button icon='iconfont icon-shanchu' circle title='删除' @click='() => this.remove(node, data)'></el-button>
        </span>
      </span>
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
    showInput(inputRefId, data, type) {
      inputRefId = type + inputRefId
      let showKey = type + 'InputShow'
      if (data[showKey] === undefined) {
        this.$set(data, showKey, false)
      }
      data[showKey] = true
      let targetInputElement = this.$refs[inputRefId];
      targetInputElement.focus()
    },
    hideInput(data, type) {
      let showKey = type + 'InputShow'
      data[showKey] = false
    },
    finishInput(inputRefId, type){
      inputRefId = type + inputRefId
      let targetInputElement = this.$refs[inputRefId];
      targetInputElement.blur()
    }
  }
}
</script>
<style lang='scss'>
.tree-data-dialog {
  .custom-tree-node {
    display: flex;
    width: 100%;
    overflow: hidden;
  }
  .tree-head {
    display: flex;
  }
  .node-label {
    flex: 1;
    margin-right: 10px;
    min-width: 0;
    flex-grow: 1;
    position: relative;
    cursor: text;
  }
  .node-link {
    flex-basis: 450px;
    flex-shrink: 0;
    flex-grow: 0;
    margin: 0 10px;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    cursor: text;
  }
  .node-operate {
    flex-basis: 140px;
    flex-shrink: 0;
    flex-grow: 0;
    margin-left: 10px;
    box-sizing: border-box;
    min-width: 0;
  }
  .el-tree-node__content {
    height: 32px;
    line-height: 32px;
  }
  .el-button.is-circle {
    padding: 1px;
    border-radius: 0;
    vertical-align: middle;
  }
  .el-button .iconfont {
    font-size: 20px;
  }
  .el-input {
    position: absolute;
    left: 0;
    z-index: -1;
  }
  .el-input.is-focus{
    z-index: 1;
  }
  .el-input__inner {
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tree-head{
    font-weight: bold;
  }
  .text{
    display: inline-block;
    width: 100%;
  }
}
</style>
