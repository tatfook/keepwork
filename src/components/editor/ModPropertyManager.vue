<template>
  <div class='property-manager-container' v-if='hasActiveMod'>
    <el-tabs>
      <el-tab-pane label='Property'>
        <div class='properties-container' v-if='hasActiveProperty'>
          {{activeProperty}}
          <pre>{{activePropertyDataCopy}}</pre>
          <v-json-editor ref='editor' :data="activePropertyDataCopy" :editable="editable" @change="updateActiveProperData"></v-json-editor>
        </div>
        <div v-else>
          No selected property
        </div>
      </el-tab-pane>
      <el-tab-pane label='Style'>
        <div class='styles-container'>
          <style-selector :mod='activeMod' />
        </div>
      </el-tab-pane>
      <el-tab-pane label='Theme'>
        <div class='styles-container'>
          <theme-selector />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import { StyleSelector, ThemeSelector } from '@/components/adi/selector'

export default {
  name: 'ModPropertyManager',
  data: () => ({
    editable: true
  }),
  methods: {
    ...mapActions({
      setActivePropertyData: 'setActivePropertyData'
    }),
    updateActiveProperData() {
      // the data of the json_editor is in ini_data of the component
      let data = _.cloneDeep(_.get(this, ['$refs', 'editor', 'ini_data'], {}))
      this.setActivePropertyData({ data })
    }
  },
  computed: {
    activePropertyDataCopy() {
      return _.cloneDeep(this.activePropertyData)
    },
    ...mapGetters({
      activeMod: 'activeMod',
      activeProperty: 'activeProperty',
      activePropertyData: 'activePropertyData',
      hasActiveMod: 'hasActiveMod',
      hasActiveProperty: 'hasActiveProperty'
    })
  },
  components: {
    StyleSelector,
    ThemeSelector
  }
}
</script>
