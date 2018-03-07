<template>
  <div class='property-manager-container' v-if='hasActiveMod'>
    <el-tabs>
      <el-tab-pane label='Property'>
        <div class='properties-container' v-if='hasActiveProperty'>
          {{activeProperty}}
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
import { mapGetters } from 'vuex'
import { StyleSelector, ThemeSelector } from '@/components/adi/selector'

export default {
  name: 'ModPropertyManager',
  computed: {
    ...mapGetters({
      activeMod: 'activeMod',
      activeProperty: 'activeProperty',
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
