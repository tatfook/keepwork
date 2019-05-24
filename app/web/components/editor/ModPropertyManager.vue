<template>
  <div class='property-manager-container' v-if='hasActiveMod'>
    <div class="property-manager-container-back" v-if='hasActiveSubMod' @click='backFromSubMod'>
      <i class="el-icon-arrow-left"></i>{{$t('card.back')}}
    </div>
    <el-tabs :class="{'property-manager-container-tab-no-title': hasActiveSubMod}" v-model='activeTab' @tab-click='tabClickHandle'>
      <el-tab-pane :label='$t("editor.modAttr")' name='attr'>
        <div class="currentModTilte">{{$t("modList."+currentModLabel)}}</div>
        <prop-type-card v-for="(prop, key) in editingProps" :componentName='key' :prop='BaseCompProptypes[prop]' :key='key' :cardKey='key' :cardValue='cardValues(key)' :activePropertyOptions='activePropertyOptions' :isCardActive='key === activeProperty'></prop-type-card>
      </el-tab-pane>
      <el-tab-pane :label='$t("editor.modStyle")' name='style' v-if="styleTabEnabled">
        <div class="currentModTilte">{{$t("modList."+currentModLabel)}}</div>
        <div class='styles-container'>
          <style-selector v-if="activePropertyTabType === 'style'" :mod='activeMod' />
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label='Theme'>
        <div class='styles-container'>
          <theme-selector />
        </div>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import _ from 'lodash'
import scrollIntoView from 'scroll-into-view-if-needed'
import { mapGetters, mapActions } from 'vuex'
import { StyleSelector, ThemeSelector } from '@/components/adi/selector'
import modLoader from '@/components/adi/mod'
import BaseCompProptypes from '@/components/adi/common/comp.proptypes'
import PropTypeCard from '@/components/editor/PropTypeCard'

export default {
  name: 'ModPropertyManager',
  data: () => ({
    editable: true,
    BaseCompProptypes
  }),
  methods: {
    ...mapActions({
      setActivePropertyData: 'setActivePropertyData',
      deleteMod: 'deleteMod',
      setActivePropertyTabType: 'setActivePropertyTabType'
    }),
    updateActiveProperData() {
      // the data of the json_editor is in ini_data of the component
      let data = _.cloneDeep(_.get(this, ['$refs', 'editor', 'ini_data'], {}))
      this.setActivePropertyData({ data })
    },
    tabClickHandle(tabItem) {
      let activeName = tabItem.name
      this.activeName = activeName.name
      this.setActivePropertyTabType(activeName)
    },
    getPropType(prop) {
      return this.BaseCompProptypes[prop] || { data: 'subMod' }
    },
    modData(mod, key) {
      let modType = mod.modType
      let activeModDafaultDatas = modLoader.load(modType).properties
      let activeModDatas = { ...activeModDafaultDatas, ...mod.data }

      if (activeModDatas && typeof activeModDatas[key] == 'object') {
        _.forEach(activeModDatas[key], (itemA, keyA) => {
          if (typeof itemA == 'number') {
            activeModDatas[key][keyA] = String(itemA)
          }
        })

        return activeModDatas[key] || null
      }
    },
    cardValues(key) {
      return this.modData(this.activeSubMod || this.activeMod, key)
    },
    modProps(modType, modStyleID = 0) {
      let mod = modLoader.load(modType)
      let modComponents = mod.components
      let subMods = mod.subMods
      let currentStyle = mod.styles[modStyleID]
      let currentTemplate =
        mod.templates[currentStyle ? currentStyle.templateID || 0 : 0]

      let checkKeys = (item, thisProp) => {
        if (typeof item == 'object') {
          _.forEach(item, (itemA, keyA) => {
            checkKeys(itemA, thisProp)
          })
        } else if (item == thisProp.key) {
          thisProp.hasProp = true
        }
      }

      let filterModComponents = {}

      _.forEach(modComponents, (item, key) => {
        let thisProp = { key: key, hasProp: false }

        checkKeys(currentTemplate, thisProp)

        if (thisProp.hasProp) {
          if (Array.isArray(item)) {
            let componentID = 0

            if (currentStyle && currentStyle.componentID) {
              componentID = currentStyle.componentID
            }

            filterModComponents[key] = item[componentID] || ''
          } else {
            filterModComponents[key] = item
          }
        }
      })

      _.forEach(subMods, (item, key) => {
        filterModComponents[key] = item
      })

      return filterModComponents
    },
    backFromSubMod() {
      this.$store.dispatch('setActiveSubMod', null)
    }
  },
  watch: {
    activeProperty() {
      this.$nextTick(() => {
        let ele = document.querySelector('.prop-box.active')
        ele &&
          scrollIntoView(ele, {
            scrollMode: 'if-needed',
            behavior: 'smooth'
          })
      })
    }
  },
  computed: {
    activePropertyDataCopy() {
      return _.cloneDeep(this.activePropertyData)
    },
    ...mapGetters({
      activeMod: 'activeMod',
      activeSubMod: 'activeSubMod',
      activeProperty: 'activeProperty',
      activePropertyOptions: 'activePropertyOptions',
      activePropertyData: 'activePropertyData',
      hasActiveMod: 'activeMod',
      hasActiveSubMod: 'activeSubMod',
      hasActiveProperty: 'hasActiveProperty',
      activePropertyTabType: 'activePropertyTabType'
    }),
    currentModLabel() {
      return (
        this.activeMod.cmd.substring(0, 2).toLocaleLowerCase() +
        this.activeMod.cmd.substring(2)
      )
    },
    activeModProps() {
      let modType = 'Mod' + this.activeMod.cmd
      let modStyleID = this.activeMod.data.styleID || 0
      return this.modProps(modType, modStyleID)
    },
    activeSubModProps() {
      if (!this.activeSubMod) return
      let modType = this.activeSubMod.modType
      let modStyleID = this.activeSubMod.data.styleID || 0
      return this.modProps(modType, modStyleID)
    },
    editingProps() {
      return this.activeSubModProps || this.activeModProps
    },
    activeTab: {
      get() {
        return this.activePropertyTabType || 'attr'
      },
      set() {}
    },
    styleTabEnabled() {
      return !this.hasActiveSubMod && this.activeMod.cmd !== 'Markdown'
    }
  },
  components: {
    StyleSelector,
    ThemeSelector,
    PropTypeCard
  }
}
</script>
<style lang="scss">
.property-manager-container {
  min-height: 100%;
  background-color: #e9f5ff;
  padding: 0 18px;
  position: relative;
  &-back {
    font-size: 16px;
    color: #333;
    cursor: pointer;
    padding: 28px 0 24px 0;
    .el-icon-arrow-left {
      font-size: 18px;
      vertical-align: bottom;
      margin-right: 4px;
    }
    &:hover {
      color: #3ba4ff;
    }
  }
  &-tab-no-title {
    .el-tabs__header {
      display: none;
    }
  }
  > .el-tabs > .el-tabs__header {
    .el-tabs__nav-wrap.is-scrollable {
      padding: 0;
      .el-tabs__nav-prev,
      .el-tabs__nav-next {
        display: none !important;
      }
    }
    .el-tabs__nav {
      margin: 22px 0;
      .el-tabs__active-bar {
        width: 0;
        height: 0;
      }
      .el-tabs__item {
        height: 30px;
        width: 198px;
        text-align: center;
        line-height: 30px;
        margin: 0 12px 0 0;
        background-color: #fff;
        box-shadow: 3px 3px 5px #ccc;
        border-radius: 4px;
        padding: 0;
      }
      .is-active {
        background-color: #3ba4ff;
        color: #fff;
      }
    }
  }
}
.property-manager-container .delete-mod {
  position: absolute;
  right: 18px;
  top: 10px;
  cursor: pointer;
  z-index: 1;
}
.property-manager-container .el-tabs__item {
  padding: 0 20px;
  font-size: 16px;
}
.currentModTilte {
  height: 30px;
  margin: 8px 18px;
  color: #505b65;
}
.el-tabs__nav-wrap::after {
  display: none;
}
@media (max-width: 1920px) {
  .property-manager-container
    > .el-tabs
    > .el-tabs__header
    .el-tabs__nav
    .el-tabs__item {
    width: 134px;
  }
}
</style>
