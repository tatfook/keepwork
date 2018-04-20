<template>
  <el-dialog class="tree-data-dialog" title="菜单编辑器" :visible.sync="isDialogShow" width="900px" :before-close="handleClose">
    <div v-if="treeData.length > 0" class="tree-head">
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
    <el-tree v-if="treeData.length > 0" ref='menuTree' :data="treeData" :props='defaultProps' :expand-on-click-node="false">
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
          <el-button icon='iconfont icon-houmiantianjia' circle title='后面添加' @click='insert(node, data, "after")'></el-button>
          <el-button icon='iconfont icon-qianmiantianjia' circle title='前面添加' @click='insert(node, data, "before")'></el-button>
          <el-button icon='iconfont icon-tianjiazixiang' circle title='添加子项' @click='insert(node, data, "child")'></el-button>
          <el-button icon='iconfont icon-shanchu' circle title='删除' @click='remove(node, data)'></el-button>
        </span>
      </span>
    </el-tree>
    <p class="empty" v-if="treeData.length <= 0" @click="insert()">
      暂无数据，请添加
      <span class="iconfont icon-tianjia"></span>
    </p>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="finishEditingMenu">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
let newMenuId = 1
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
      let targetInputElement = this.$refs[inputRefId]
      targetInputElement.focus()
    },
    hideInput(data, type) {
      let showKey = type + 'InputShow'
      data[showKey] = false
    },
    finishInput(inputRefId, type) {
      inputRefId = type + inputRefId
      let targetInputElement = this.$refs[inputRefId]
      targetInputElement.blur()
    },
    insert(node, data, position) {
      const newChild = {
        name: '菜单项' + newMenuId,
        link: ''
      }
      if (!node) {
        this.treeData.push(newChild)
        this.$nextTick(() => {
          let firstNode = this.treeData[0]
          let firstNodeId = firstNode.$treeNodeId
          this.showInput(firstNodeId, firstNode, 'name')
        })
        return
      }
      let menuTree = this.$refs.menuTree
      let parent = node.parent
      let children = parent.data.child || parent.data
      let targetIndex = _.findIndex(children, function(value) {
        return value === data
      })
      let newNode
      let newNodeId
      let that = this
      let inputFocus = function() {
        that.$nextTick(() => {
          let newNodeId = newNode.$treeNodeId
          that.showInput(newNodeId, newNode, 'name')
        })
      }
      switch (position) {
        case 'before':
          menuTree.insertBefore(newChild, node)
          newNode = children[targetIndex]
          inputFocus()
          break
        case 'after':
          menuTree.insertAfter(newChild, node)
          newNode = children[targetIndex + 1]
          inputFocus()
          break
        default:
          node.expanded = true
          this.$nextTick(() => {
            menuTree.append(newChild, node)
            let childrenNodes = node.childNodes
            let childrenLen = childrenNodes.length - 1
            newNode = childrenNodes[childrenLen].data
            inputFocus()
          })
      }
      newMenuId++
    },
    remove(node, data) {
      this.$confirm('确定删除这个节点？子节点也会直接被删除', '删除提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$refs.menuTree.remove(node)
      })
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
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
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
    flex-basis: 200px;
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
  .el-input.is-focus {
    z-index: 1;
  }
  .el-input__inner {
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tree-head {
    font-weight: bold;
  }
  .text {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
  .el-tree {
    max-height: 350px;
    overflow-y: auto;
  }
  .empty {
    text-align: center;
    margin: 0;
    line-height: 32px;
    font-size: 16px;
    cursor: pointer;
  }
  .empty .iconfont {
    font-size: 28px;
    vertical-align: middle;
    color: #3ba4ff;
  }
}
</style>
