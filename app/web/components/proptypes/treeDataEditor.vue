<template>
  <el-dialog class="tree-data-dialog" :title="$t('editor.menuEditor')" :visible.sync="isDialogShow" width="900px" :before-close="handleClose">
    <div v-if="treeData.length > 0" class="tree-head">
      <span class="node-label">
        {{$t('editor.name')}}
      </span>
      <span class="node-link">
        {{$t('editor.link')}}
      </span>
      <span class="node-operate">
        {{$t('editor.setting')}}
      </span>
    </div>
    <el-tree v-if="treeData.length > 0" ref='menuTree' :data="formatLevelList(treeData)" :props='defaultProps' :expand-on-click-node="false" :draggable='false'>
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span class="node-label">
          <el-input :style="fixPadding(node, data)" :ref='"name"+node.id' :class="{'is-focus': data.nameInputShow}" size='mini' v-model='data.name' clearable @blur='hideInput(data, "name")' @keyup.enter.native.prevent='finishInput(node.id, "name")'></el-input>
        </span>
        <span class="node-link">
          <el-input :ref='"link"+node.id' :class="{'is-focus': data.linkInputShow}" size='mini' v-model='data.link' @blur='hideInput(data, "link")' clearable @keyup.enter.native.prevent='finishInput(node.id, "link")'></el-input>
        </span>
        <span class="node-operate">
          <el-button v-tooltip='$t("editor.insertAfter")' icon='iconfont icon-add-later1' circle @click='insert(node, data, "after")'></el-button>
          <el-button v-tooltip='$t("editor.insertBefore")' icon='iconfont icon-add-before1' circle @click='insert(node, data, "before")'></el-button>
          <el-button v-tooltip='$t("editor.insertChild")' icon='iconfont icon-add_subitem1-copy-copy' circle @click='insert(node, data, "child")'></el-button>
          <el-button v-tooltip='$t("editor.delete")' icon='iconfont icon-delete' circle @click='remove(node, data)'></el-button>
        </span>
      </span>
    </el-tree>
    <p class="empty" v-if="treeData.length <= 0" @click="insert()">
      {{$t('editor.noData')}}
      <span class="iconfont icon-add"></span>
    </p>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{$t('el.messagebox.cancel')}}</el-button>
      <el-button type="primary" @click="finishEditingMenu">{{$t('el.messagebox.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import { setTimeout } from 'timers'

let newMenuId = 1

export default {
  name: 'treeDataEditor',
  props: {
    originalTreeData: Array,
    isEditorShow: Boolean
  },
  data() {
    return {
      defaultProps: {
        children: 'child',
        label: 'name'
      }
    }
  },
  computed: {
    ...mapGetters({
      activePageInfo: 'activePageInfo'
    }),
    treeData() {
      console.log(this.originalTreeData)
      return this.originalTreeData
    },
    isDialogShow() {
      return this.isEditorShow
    }
  },
  methods: {
    handleClose() {
      this.$emit('cancel', null)
    },
    formatLevelList(data) {
      function addLevel(data, subIndex){
        let index = subIndex || 1

         _.forEach(data, (item, key) => {
           item.level = index
           if(item.child) {
             let nextIndex = index + 1
             addLevel(item.child,nextIndex)
           }
        })
      }
      addLevel(data)
      return data
    },
    fixPadding(node,data){
      let name = "name" + node.id
      setTimeout(() => {
        if(this.$refs[name]){
          let inputStyle = this.$refs[name].$refs["input"]
          if(inputStyle){
            if(data.level){
              inputStyle.style.paddingLeft = data.level * 20 + "px"
            }
          }
        }
        }, 0)
    },
    finishEditingMenu() {
      this.handleClose()
      console.log(this.treeData)
      function deleteLevel(data){
         _.forEach(data, (item, key) => {
           if(item.level) {
             delete(item["level"])
             deleteLevel(item.child)
           }
        })
      }
      deleteLevel(this.treeData)
      let fixLink = link => {
        if ( !/http(s?):\/\//.test(link) && !/^\//.test(link) ) {
          return ''
        }
        return link
      }
      let fixLinkItem = linkItem => {
        let result = {
          ...linkItem,
          link: fixLink(linkItem.link)
        }
        if (linkItem.child && linkItem.child.length) {
          result.child = linkItem.child.map(fixLinkItem)
        }
        return result
      }
      let treeDataResult = this.treeData.map(fixLinkItem)
      this.$emit('finishEditing', treeDataResult)
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
      let self = this

      const newChild = {
        name: self.$t('editor.menuItem') + newMenuId,
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
        that.formatLevelList(that.treeData)
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
      let self = this

      this.$confirm(self.$t('editor.menuDelMsg'), self.$t('editor.delNotice'), {
        confirmButtonText: self.$t('el.messagebox.confirm'),
        cancelButtonText: self.$t('el.messagebox.cancel'),
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
  }
  .tree-head {
    display: flex;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: #f0efed 1px solid;
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
    flex-basis: 395px;
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
    flex-basis: 135px;
    flex-shrink: 0;
    flex-grow: 0;
    margin-left: 10px;
    box-sizing: border-box;
    min-width: 0;
    .el-button:hover {
      color: #1989fa
    }
  }
  .el-tree-node {
    min-height: 40px;
  }
  .el-tree-node__content {
    height: 34px;
    line-height: 32px;
    padding: 0!important;
  }
  .el-button.is-circle {
    border: none;
    vertical-align: middle;
    padding: 0;
  }
  .el-button .iconfont {
    font-size: 20px;
  }
  .el-input {
    position: absolute;
    left: 0;
    z-index: 2;
  }
  .el-input.is-focus {
    z-index: 2;
  }
  .el-input__inner {
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 20px;
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
  .el-tree-node__content > .el-tree-node__expand-icon {
    padding: 6px;
    position: absolute;
    z-index: 999;
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
