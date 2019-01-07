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
    <el-tree v-if="treeData.length > 0" :style="fixMaxHeight()" ref='menuTree' :data="formatLevelList(treeData)" :props='defaultProps' :expand-on-click-node="false" :draggable='false'>
      <span :style="fixPadding(node, data)" class="custom-tree-node" slot-scope="{ node, data }">
        <span class="node-label">
          <el-input :placeholder='$t("editor.menuName")' :ref='"name"+node.id' :class="{'is-focus': data.nameInputShow}" size='mini' v-model='data.name' clearable @blur='hideInput(data, "name")' @keyup.enter.native.prevent='finishInput(node.id, "name")'></el-input>
        </span>
        <span class="node-link">
          <el-tooltip class="item" :disabled='warningInput(data)' effect="dark" :content="$t('editor.warningInput')" placement="top">
            <el-input :ref='"link"+node.id' :style="warningInput(data, node)" :placeholder='$t("editor.inputConnection")' @change="changeInputColor(data, node)" :class="{'is-focus': data.linkInputShow}" size='mini' v-model='data.link' @blur='hideInput(data, "link", node)' clearable @keyup.enter.native.prevent='finishInput(node.id, "link")'></el-input>
          </el-tooltip>
        </span>
        <span class="node-prompt">
          <i v-if="!warningInput(data)" class="iconfont icon-prompt"></i>
        </span>
        <span class="node-operate">
          <el-tooltip :content="$t('editor.insertAfter')" placement="top">
            <el-button icon='iconfont icon-add-later1' circle @click='insert(node, data, "after")'></el-button>
          </el-tooltip>
          <el-tooltip :content="$t('editor.insertBefore')" placement="top">
            <el-button icon='iconfont icon-add-before1' circle @click='insert(node, data, "before")'></el-button>
          </el-tooltip>
          <el-tooltip :content="$t('editor.insertChild')" placement="top">
            <el-button icon='iconfont icon-add_subitem1-copy-copy' circle @click='insert(node, data, "child")'></el-button>
          </el-tooltip>
          <el-tooltip :content="$t('editor.delete')" placement="top">
            <el-button icon='iconfont icon-delete' circle @click='remove(node, data)'></el-button>
          </el-tooltip>
        </span>
      </span>
    </el-tree>
    <p class="empty" v-if="treeData.length <= 0" @click="insert()">
      {{$t('editor.noData')}}
      <span class="iconfont icon-add"></span>
    </p>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{$t('el.messagebox.cancel')}}</el-button>
      <el-button type="primary" :disabled='notButton' @click="finishEditingMenu">{{$t('el.messagebox.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import { setTimeout } from 'timers'
import { types } from 'util'

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
      },
      notButton: false
    }
  },
  mounted() {
    this.keyupSubmit()
  },
  computed: {
    ...mapGetters({
      activePageInfo: 'activePageInfo'
    }),
    keyupSubmit() {
      document.onkeydown = e => {
        let _key = window.event.keyCode
        if (_key === 13) {
          this.finishEditingMenu()
        }
      }
    },
    treeData() {
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
      function addLevel(data, subIndex) {
        let index = subIndex || 1

        _.forEach(data, (item, key) => {
          item.level = index
          if (item.child) {
            let nextIndex = index + 1
            addLevel(item.child, nextIndex)
          }
        })
      }
      addLevel(data)
      return data
    },
    fixPadding(node, data) {
      let name = 'name' + node.id
      setTimeout(() => {
        if (this.$refs[name]) {
          let inputStyle = this.$refs[name].$parent.$parent.$el
          if (inputStyle) {
            if (data.level && data.level < 10) {
              inputStyle.style.paddingLeft = data.level * 5 + 'px'
            }
          }
        }
      }, 0)
    },
    warningInput(item, node) {
      if (item && item.link) {
        let currentUrl = item.link
        let url = /(^(http|https):\/\/.+|^\/(\w)+)/
        let self = this
        function inputStyle(data) {
          if (!node) {
            return
          }
          let name = 'link' + node.id
          setTimeout(() => {
            if (self.$refs[name]) {
              let inputStyle = self.$refs[name].$refs['input']
              if (!inputStyle) {
                return
              }
              if (data) {
                inputStyle.style.borderWidth = null
                inputStyle.style.borderStyle = null
                inputStyle.style.borderColor = null
              } else {
                inputStyle.style.borderWidth = '1px'
                inputStyle.style.borderStyle = 'solid'
                inputStyle.style.borderColor = 'red'
              }
            }
          }, 0)
        }
        if (currentUrl.match(url)) {
          inputStyle(true)
          this.notButton = false
          return true
        } else {
          inputStyle(false)
          this.notButton = true
          return false
        }
      }
      return true
    },
    finishEditingMenu() {
      function deleteLevel(data) {
        _.forEach(data, (item, key) => {
          if (item.level) {
            delete item['level']
            deleteLevel(item.child)
          }
        })
      }
      deleteLevel(this.treeData)
      let fixLink = link => {
        if (!/http(s?):\/\//.test(link) && !/^\//.test(link)) {
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
      this.handleClose()
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
    changeInputColor(data, node) {
      let name = 'link' + node.id
      if (data && data.link == '') {
        if (this.$refs[name]) {
          let inputStyle = this.$refs[name].$refs['input']
          if (!inputStyle) {
            return
          }
          inputStyle.style.borderWidth = null
          inputStyle.style.borderStyle = null
          inputStyle.style.borderColor = null
        }
      }
    },
    hideInput(data, type, node) {
      if (data && data.link == '') {
        this.notButton = false
      }
      this.warningInput(data)
      let showKey = type + 'InputShow'
      data[showKey] = false
    },
    finishInput(inputRefId, type) {
      inputRefId = type + inputRefId
      let targetInputElement = this.$refs[inputRefId]
      targetInputElement.blur()
    },
    fixMaxHeight() {
      if (this.treeData.length > 10) {
        return 'max-height: 350px;overflow-y: auto;'
      }
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
    box-sizing: border-box;
    min-width: 0;
    .el-button:hover {
      color: #1989fa;
    }
  }
  .node-prompt {
    flex-basis: 20px;
    flex-shrink: 0;
    flex-grow: 0;
    box-sizing: border-box;
    min-width: 0;
  }
  .el-tree-node__content {
    height: 34px;
    line-height: 32px;
    padding: 0 !important;
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
  .icon-prompt {
    color: red;
  }
}
</style>
