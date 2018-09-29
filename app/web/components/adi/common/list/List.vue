<template>
  <div class='comp-list'>
    <el-row :gutter='options.gutter'>
      <el-col :span="colWidth" v-for='(item, index) in properties.collection' :key='index'>
        <mod-comp-loader :mod='modWithExtraConf(item)' :theme='theme' :modType='options.modType' :editMode='editMode'/>
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
    modWithExtraConf(source) {
      return {
        data:  _.merge({}, source, this.options.modSettings)
      }
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
