<template>
  <el-dialog class="tree-data-dialog" title="Add animations" :visible.sync="isDialogShow" width="900px" :before-close="handleClose">
    <div v-if="treeData.length > 0" class="tree-head">
      <span class="node-cover">
        CoverImageURL
      </span>
      <span class="node-title">
        Title
      </span>
      <span class="node-animation">
        AnimationURL
      </span>
      <span class="node-operate">
        Setting
      </span>
    </div>
    <el-tree v-if="treeData.length > 0" ref='menuTree' :data="treeData" :props='defaultProps' :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span class="node-cover">
          <span class="text" @click.stop='showInput(node.id, data, "cover")'>{{data.cover}}</span>
          <el-input :ref='"cover"+node.id' :class="{'is-focus': data.coverInputShow}" size='mini' v-model='data.cover' @blur='hideInput(data, "cover")' @keyup.enter.native.prevent='finishInput(node.id, "cover")'></el-input>
        </span>
        <span class="node-title">
          <span class="text" @click.stop='showInput(node.id, data, "title")'>{{data.title}}</span>
          <el-input :ref='"title"+node.id' :class="{'is-focus': data.titleInputShow}" size='mini' v-model='data.title' @blur='hideInput(data, "title")' @keyup.enter.native.prevent='finishInput(node.id, "title")'></el-input>
        </span>
        <span class="node-animation">
          <span class="text" @click.stop='showInput(node.id, data, "animation")'>{{data.animation}}</span>
          <el-input :ref='"animation"+node.id' :class="{'is-focus': data.animationInputShow}" size='mini' v-model='data.animation' @blur='hideInput(data, "animation")' @keyup.enter.native.prevent='finishInput(node.id, "animation")'></el-input>
        </span>
        <span class="node-operate">
          <el-button icon='iconfont icon-houmiantianjia' circle title='后面添加' @click='insert(node, data, "after")'></el-button>
          <el-button icon='iconfont icon-qianmiantianjia' circle title='前面添加' @click='insert(node, data, "before")'></el-button>
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
        cover: 'plz input cover url',
        title: 'plz input title',
        animation: 'plz input animation url'
      }
      if (!node) {
        this.treeData.push(newChild)
        this.$nextTick(() => {
          let firstNode = this.treeData[0]
          let firstNodeId = firstNode.$treeNodeId
          this.showInput(firstNodeId, firstNode, 'cover')
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
          that.showInput(newNodeId, newNode, 'cover')
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
      this.$confirm('确定删除这个素材', '删除提醒', {
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
  .node-cover {
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
  .node-title {
    flex: 1;
    margin-right: 10px;
    min-width: 0;
    flex-grow: 1;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    cursor: text;
  }
  .node-animation {
    flex: 1;
    margin-right: 10px;
    min-width: 0;
    flex-grow: 1;
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
