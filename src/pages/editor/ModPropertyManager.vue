<template>
  <div class='property-manager-container' v-if='hasActiveMod'>
    <el-tabs>
      <el-tab-pane label='属性'>
        <div class='properties-container' v-if='hasActiveProperty'>
          {{activeProperty}}
        </div>
        <div v-else>
          No selected property
        </div>
      </el-tab-pane>
      <el-tab-pane label='样式'>
        <div class='styles-container'>
          <style-selector :mod='activeMod' />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import StyleSelector from '@/components/adi/selector/StyleSelector'

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
    StyleSelector
  }
}
</script>
