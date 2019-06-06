<template>
  <div class='comp-list'>
    <el-row class="comp-list-row" :gutter='options.gutter' type="flex">
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
      return _.filter(this.collectionWithIndex, collectionItem => {
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

<style lang="scss" scoped>
.comp-list {
  &-row {
    flex-wrap: wrap;
  }
}
</style>

