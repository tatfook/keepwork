<template>
  <div class='comp-list'>
    <el-row :gutter='options.gutter'>
      <el-col :span="colWidth" v-for='(item, index) in filteredCollection' :key='index'>
        <mod-comp-loader :rootMod='rootMod' :mod='modWithExtraConf(item, index)' :theme='theme' :modType='options.modType' :editMode='editMode' />
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
    filteredCollection() {
      return _.filter(this.properties.collection, collectionItem => {
        let isCollectShow = true
        if (collectionItem.hidden) {
          isCollectShow = false
        } else {
          let isCollectHaveCompShow = false
          let isCollectHaveComp = false
          _.forIn(collectionItem, val => {
            if (val && typeof val === 'object') {
              isCollectHaveComp = true
              if (typeof val.hidden === 'undefined' || val.hidden === false) {
                isCollectHaveCompShow = true
                return false
              }
            }
          })
          if (!isCollectHaveCompShow && isCollectHaveComp) {
            isCollectShow = false
          }
        }
        return isCollectShow
      })
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
