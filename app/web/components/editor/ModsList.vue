<template>
  <el-row
    type='flex'
    class="full-height"
    @mousemove.native="dragMouseMove"
    @mouseup.native="dragMouseUp"
  >
    <el-col
      class="mods-treeview"
      unselectable="on"
      :style="getTreeViewWidth"
    >
      <el-tree
        ref='tree'
        node-key='id'
        :data='mods'
        :props='defaultProps'
        :default-expanded-keys='defaultExpandedKeys'
        highlight-current
        accordion
        :indent=0
        @node-click='nodeMenuClick'
        @node-collapse='nodeCollapseHandle'
      ></el-tree>
    </el-col>
    <div
      class="editor-resizer"
      @mousedown="resizeCol($event, 'treeViewWidth', 'previewBoxViewWidth', 570)"
    ></div>
    <el-col
      class="preview-box"
      unselectable="on"
      :style="getPreviewBoxWidth"
    >
      <div
        v-for='mod in activeModsList'
        :key='mod.name'
        class="box-items"
      >
        <div
          v-if='!style.useImage'
          v-for='(style, index) in mod.styles'
          :key='style.name'
          class="style-cover render box-items-item"
          @click='newMod(mod.name, index)'
        >
          <div class="render-mod-container--click-prevent"></div>
          <div
            class="render-mod-container"
            :style="getSettingStyle(style)"
          >
            <component
              class="render-mod"
              :is='mod.mod'
              :renderMode='true'
              :mod='modFactory(mod)'
              :conf='modConf(mod, index)'
              :theme='theme'
            ></component>
            <div class="style-mask">
              <span>{{$t('tips.clickToAdd')}}</span>
            </div>
          </div>
        </div>
        <div
          class="style-cover box-items-item"
          v-if='style.useImage'
          v-for='(style, index) in mod.styles'
          :key='style.name'
        >
          <img
            class="style-cover-image"
            :src="style.cover"
            alt=""
            @click='newMod(mod.name, index)'
          >
          <div class="style-mask">
            <span>{{$t('tips.clickToAdd')}}</span>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import mods from '@/components/adi/mod/modslist.config'
import modFactory from '@/lib/mod/factory'
import themeFactory from '@/lib/theme/theme.factory'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import resize from './base/resize'
import { setTimeout } from 'timers'
export default {
  name: 'ModsList',
  mixins: [resize],
  mounted() {
    this.updateModListTitle()
    let self = this
    function i18n(data) {
      _.forEach(data, (item, key) => {
        item.label = self.$t(item.label)
        if (item.children) {
          i18n(item.children)
        }
      })
    }
    i18n(mods)
    if (mods[0].children) {
      let modsChildren = mods[0].children[0]
      this.$refs.tree.setCurrentNode(modsChildren)
      this.activeModsList = modsChildren.mods
    } else {
      this.$refs.tree.setCurrentNode(mods[0])
      this.activeModsList = mods[0].mods
    }

    if (window.innerWidth <= 1920) {
      ;(this.treeViewWidth = 48.5), (this.previewBoxViewWidth = 51.5)
    } else {
      ;(this.treeViewWidth = 30), (this.previewBoxViewWidth = 70)
    }
  },
  updated() {
    if (!this.resizeWinParams.isResizing) {
      this.autoResizePreview()
    }
  },
  data() {
    return {
      mods,
      activeModsList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      defaultExpandedKeys: ['1-1'],
      selectedModKey: null,
      treeViewWidth: 48.5,
      previewBoxViewWidth: 51.5
    }
  },
  computed: {
    ...mapGetters({
      activeMod: 'activeMod',
      themeConf: 'themeConf',
      preModKey: 'preModKey'
    }),
    theme() {
      let globalTheme = themeFactory.generate(this.themeConf)
      globalTheme.sheet.attach()
      return globalTheme
    },
    getTreeViewWidth() {
      const style = {}

      if (this.treeViewWidth < 11) {
        this.treeViewWidth = 11
      }

      style.width = this.treeViewWidth + '%'

      return style
    },
    getPreviewBoxWidth() {
      const style = {}

      if (this.previewBoxViewWidth > 89) {
        this.previewBoxViewWidth = 89
      }

      style.width = this.previewBoxViewWidth + '%'
      return style
    }
  },
  methods: {
    updateModListTitle() {
      setTimeout(() => {
        let data = this.$refs.tree.$el.children
        _.forEach(data, (item, key) => {
          _.forEach(item.children, (item2, key2) => {
            if (key2 == 0) {
              item2.title = mods[key].label
            }
            _.forEach(item2.children, (item3, key3) => {
              if (mods[key].children[key3]) {
                item3.title = mods[key].children[key3].label
              }
            })
          })
        })
      }, 0)
    },
    getSettingStyle(style) {
      if (!style || !style.renderMinHeight) {
        return ''
      }
      return `min-height: ${style.renderMinHeight}`
    },
    generateStyleString(style) {
      let string = ''
      if (style) {
        _.forEach(style, (value, key) => {
          string = string + key + ':' + value + ';'
        })
      }
      return string
    },
    nodeMenuClick(data) {
      this.updateModListTitle()
      if (data.children && data.children.length > 0) {
        return
      }
      this.activeModsList = data.mods
    },
    nodeCollapseHandle(data, node, comp) {},
    newMod(name, index) {
      this.$store.dispatch('addMod', {
        modName: name,
        preModKey: this.preModKey || (this.activeMod && this.activeMod.key),
        styleID: index
      })
    },
    modFactory(mod) {
      if (mod.name && mod.name != 'ModMarkdown') {
        return modFactory.generateProperties(mod.name)
      }
    },
    modConf(mod, index) {
      let currentMod = _.merge({}, mod)
      currentMod.properties.styleID = index
      return currentMod
    },
    autoResizePreview() {
      if (this.updatedHeight) {
        return false
      }
      this.updatedHeight = true
      let all = this.$el.querySelectorAll('[class="render-mod-container"]')
      let refactor = 0
      if (window.innerWidth <= 1920) {
        refactor = 0.1245
      } else {
        refactor = 0.254
      }
      _.forEach(all, (dom, key) => {
        dom.style.height = dom.offsetHeight * refactor + 'px'
      })
      setTimeout(() => {
        this.updatedHeight = null
      }, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.full-height {
  height: 100%;
  .editor-resizer {
    width: 3px;
    background-color: #c0c4cc;
    cursor: col-resize;
  }
}
.box-items {
  img {
    display: block;
  }
}
.style-cover {
  position: relative;
  width: 275px;
  cursor: pointer;
  display: block;
  margin: auto;
  margin-bottom: 12px;
  border: 2px solid transparent;
  padding: 10px;
  background-color: white;
  &-image {
    width: 100%;
  }
}
.style-mask {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 14px;
  width: 275px;
  padding: 6px 10px;
  color: #ffffff;
  text-align: center;
  font-size: 12px;
  background: rgba(144, 167, 191, 0.5);
  opacity: 0;
}
.box-items-item:hover {
  .style-mask {
    opacity: 1;
  }
}
.style-cover:hover {
  border: 2px solid #bcbcbc;
}
.mods-treeview {
  // border-right: 2px solid #c0c4cc;
  // flex-basis: 135px;
  // max-width: 135px;
  flex-shrink: 0;
  flex-grow: 0;
  user-seletct: none;
}
.preview-box {
  padding: 0 5px;
  background-color: #e4e7ed;
  max-height: 100%;
  overflow: auto;
}
.render {
  background-color: white;
  overflow: hidden;
  margin-bottom: 12px;
  position: relative;
  .render-mod-container--click-prevent {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .render-mod-container {
    width: 272px;
    overflow: hidden;
    .render-mod {
      width: 1080px;
      transform: scale(0.254);
      transform-origin: top left;
      position: unset;
    }
  }
}
@media screen and (max-width: 1920px) {
  .style-cover {
    width: 135px;
    padding: 8px;
  }
  .render {
    .render-mod-container {
      width: 135px;
      .render-mod {
        transform: scale(0.1245);
      }
    }
  }
  .style-mask {
    width: 135px;
  }
}
</style>

<style>
.mods-treeview .el-tree-node__content > .el-tree-node__expand-icon {
  padding-left: 15px;
}
.mods-treeview .el-tree-node__content > .el-tree-node__expand-icon.expanded {
  padding: 15px;
  margin-right: -9px;
}
.mod.mods-treeview
  .el-tree-node__content
  > .el-tree-node__expand-icon.expanded {
  padding: 6px;
  padding-top: 15px;
}
.mods-treeview
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #e6f7ff;
  position: relative;
}
.mods-treeview .el-tree-node__content {
  height: 40px;
  line-height: 40px;
}
.mods-treeview .el-tree-node > .el-tree-node__content {
  font-weight: 900;
  color: #000;
}
.mods-treeview
  .el-tree-node
  .el-tree-node__children
  .el-tree-node
  > .el-tree-node__content {
  color: #a9a9a9;
  font-weight: 400;
}
.mods-treeview
  .el-tree-node
  .el-tree-node__children
  .el-tree-node
  > .el-tree-node__content:hover {
  color: #000;
}
.mods-treeview .el-tree-node__label {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
