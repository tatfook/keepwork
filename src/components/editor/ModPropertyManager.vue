<template>
  <div class='property-manager-container' v-if='hasActiveMod'>
    <div class="delete-mod" @click.stop.prevent='toDeleteMod'>
      <i class="iconfont icon-delete"></i>
      {{$t('editor.modDel')}}
    </div>
    <el-tabs v-model='activeTab' @tab-click='tabClickHandle'>
      <el-tab-pane :label='$t("editor.modAttr")' name='attr'>
        <PropTypeCard v-for="(prop, key) in editingProps" :prop='BaseCompProptypes[prop]' :key='key' :cardKey='key' :cardValue='cardValues(key)' :activePropertyOptions='activePropertyOptions' :isCardActive='key === activeProperty'></PropTypeCard>
      </el-tab-pane>
      <el-tab-pane :label='$t("editor.modStyle")' name='style' v-if="activeMod.cmd !== 'Markdown'">
        <div class='styles-container'>
          <style-selector :mod='activeMod' />
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
    toDeleteMod() {
      let self = this

      this.$confirm(this.$t('editor.modDelMsg'), this.$t('editor.modDelMsgTitle'), {
        confirmButtonText: self.$t('el.messagebox.confirm'),
        cancelButtonText: self.$t('el.messagebox.cancel'),
        type: 'error'
      })
      .then(() => {
        this.deleteMod(this.activeMod.key)
      })
      .catch(() => {})
    },
    tabClickHandle(tabItem) {
      let activeName = tabItem.name
      this.setActivePropertyTabType(activeName)
    },
    cardValues(key) {
      let modType = 'Mod' + this.activeMod.cmd
      let activeModDafaultDatas = modLoader.load(modType).properties
      let activeModDatas = { ...activeModDafaultDatas, ...this.activeMod.data }

      if(activeModDatas && typeof(activeModDatas[key]) == 'object') {
        _.forEach(activeModDatas[key], (itemA, keyA) => {
          if(typeof(itemA) == 'number') {
            activeModDatas[key][keyA] = String(itemA)
          }
        })

        return activeModDatas[key] || null
      }
    },
  },
  computed: {
    activePropertyDataCopy() {
      return _.cloneDeep(this.activePropertyData)
    },
    ...mapGetters({
      activeMod: 'activeMod',
      activeProperty: 'activeProperty',
      activePropertyOptions: 'activePropertyOptions',
      activePropertyData: 'activePropertyData',
      hasActiveMod: 'hasActiveMod',
      hasActiveProperty: 'hasActiveProperty',
      activePropertyTabType: 'activePropertyTabType'
    }),
    editingProps() {
      let modType = 'Mod' + this.activeMod.cmd
      let modStyleID = this.activeMod.data.styleID || 0
      let mod = modLoader.load(modType)
      let modComponents = mod.components
      let currentStyle = mod.styles[modStyleID]
      let currentTemplate = mod.templates[currentStyle ? currentStyle.templateID || 0 : 0]

      let checkKeys = (item, thisProp) => {
        if(typeof(item) == 'object') {
            _.forEach(item, (itemA, keyA) => {
              checkKeys(itemA, thisProp)
            })
        } else if (item == thisProp.key) {
          thisProp.hasProp = true
        }
      }

      let filterModComponents = {}

      _.forEach(modComponents, (item, key) => {
        let thisProp = {key: key, hasProp: false}

        checkKeys(currentTemplate, thisProp)

        if(thisProp.hasProp) {
          filterModComponents[key] = item
        }
      })

      return filterModComponents
    },
    activeTab: {
      get() {
        return this.activePropertyTabType || 'attr'
      },
      set() {}
    }
  },
  components: {
    StyleSelector,
    ThemeSelector,
    PropTypeCard
  }
}
</script>
<style>
.property-manager-container {
  min-height: 100%;
  background-color: #ebeef5;
  padding: 0 18px;
  position: relative;
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
</style>
