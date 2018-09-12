<template>
  <div class='comp-list'>
    <el-row :gutter='options.gutter'>
      <el-col :span="colWidth" v-for='(item, index) in properties.collection' :key='index'>
        <mod-comp-loader :mod='modWithExtraConf(item)' :theme='theme' :modType='options.modType' />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
import ModCompLoader from '@/components/adi/utils/ModCompLoader'

export default {
  name: 'AdiList',
  mixins: [compBaseMixin],
  components: {
    ModCompLoader
  },
  methods: {
    modWithExtraConf(mod) {
      return _.merge({}, mod, this.options.modSettings)
    }
  },
  computed: {
    colWidth() {
      if (this.options.colSize) {
        return 24 / this.options.colSize
      }
      return 24
    }
  }
}
</script>

<style>

</style>
