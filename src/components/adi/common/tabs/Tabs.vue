<template>
  <div>
    <el-tabs class="tabs" @tab-click="callback">
      <el-tab-pane v-for="(item, index) in properties.data" :key="index" :label="loadLable(item)">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'AdiTabs',
  mixins: [compBaseMixin],
  methods: {
    loadLable(item) {
      return item.name
    },
    callback(tab) {
      this.options.callback(tab)
    }
  },
  comouted: {}
}
</script>

