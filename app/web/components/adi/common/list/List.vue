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
import AsyncModLoader from '@/components/adi/mod/index.async'

export default {
  name: 'AdiList',
  mixins: [compBaseMixin],
  components: {
    ModCompLoader,
  },
  async created() {
    let data = await AsyncModLoader.load(this.options.modType)
    this.modConf = data.default
  },
  data() {
    return {
      modConf: {},
    }
  },
  methods: {
    modWithExtraConf(source, index) {
      return {
        data: _.merge({}, this.options.modSettings, source),
        isSub: true,
        property: this.property,
        index,
      }
    },
  },
  computed: {
    collectionWithIndex() {
      return _.map(this.properties.collection, (value, index) => {
        return {
          ...value,
          index,
        }
      })
    },
    modProperties() {
      return this.modConf.properties
    },
    filteredCollection() {
      return _.filter(this.collectionWithIndex, collectionItem => {
        let isCollectShow = true
        if (collectionItem.hidden) {
          isCollectShow = false
        } else {
          const hiddenCompCount = _.filter(collectionItem, (value, key) => {
            return value && value.hidden === true
          }).length
          const modTotalpropertiesCount = _.filter(this.modProperties, (val, key) => key != 'styleID').length
          let isCollectHaveComp = modTotalpropertiesCount > 0
          let isCollectHaveCompShow = hiddenCompCount < modTotalpropertiesCount
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
    },
  },
}
</script>

<style lang="scss" scoped>
.comp-list {
  &-row {
    flex-wrap: wrap;
  }
}
</style>

