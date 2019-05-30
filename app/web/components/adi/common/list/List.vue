<template>
  <div class='comp-list'>
    <el-row :gutter='options.gutter'>
      <el-col :span="colWidth" v-for='(item, index) in filteredCollection' :key='index'>
        <mod-comp-loader :rootMod='rootMod' :mod='modWithExtraConf(item, item.index)' :theme='theme' :modType='options.modType' :editMode='editMode' />
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
    modWithExtraConf(source, index) {
      return {
        data: _.merge({}, this.options.modSettings, source),
        isSub: true,
        property: this.property,
        index
      }
    }
  },
  computed: {
    collectionWithIndex() {
      return _.map(this.properties.collection, (value, index) => {
        return {
          ...value,
          index
        }
      })
    },
    filteredCollection() {
      return _.filter(
        this.collectionWithIndex,
        collectionItem => collectionItem.hidden == false
      )
    },
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
