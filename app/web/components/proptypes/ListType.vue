<template>
  <div class="list-type">
    <div class="list-type-add" @click='addItem'>
      <i class="list-type-add-icon el-icon-plus"></i>
      添加更多图文
    </div>
    <div class="list-type-item" v-for="(item, index) in originVals" :key="index">
      <div class="list-type-item-main">
        <i class="iconfont icon-tuwen1"></i>
        图文{{index + 1}}
        <div class="list-type-item-main-operates">
          <el-tooltip effect="dark" :content="$t('card.edit')" placement="top">
            <i class="iconfont icon-brush" @click="editItem(index)"></i>
          </el-tooltip>
          <el-tooltip effect="dark" :content="$t('card.delete')" placement="top">
            <i class="iconfont icon-delete" @click="deleteItem(index)"></i>
          </el-tooltip>
        </div>
      </div>
      <el-switch :width='32' v-model="item.isSubmodShow" active-color="#3ba4ff" inactive-color='#bfbfbf' @change='toggleSubModVisible(index, item)'></el-switch>
    </div>
  </div>

</template>
<script>
import protypesBaseMixin from './protypes.base.mixin'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ListType',
  mixins: [protypesBaseMixin],
  mounted() {
    this.originVals = _.map(this.cardValue.collection, item => {
      return {
        ...item,
        isSubmodShow: !item.hidden
      }
    })
  },
  data() {
    return {
      originVals: []
    }
  },
  computed: {
    ...mapGetters({
      activeMod: 'activeMod'
    })
  },
  methods: {
    ...mapActions({
      setActiveProperty: 'setActiveProperty',
      setActivePropertyData: 'setActivePropertyData'
    }),
    addItem() {
      this.$store.dispatch('updateActiveModAttributeList', {
        key: this.editingKey,
        action: 'ADD'
      })
    },
    deleteItem(index) {
      this.$store.dispatch('updateActiveModAttributeList', {
        key: this.editingKey,
        action: 'DELETE',
        index
      })
    },
    editItem(index) {
      this.$store.dispatch('updateActiveModAttributeList', {
        key: this.editingKey,
        action: 'EDIT',
        index
      })
    },
    changeActiveProperty() {
      this.setActiveProperty({
        key: this.activeMod.key,
        property: this.cardKey
      })
    },
    changeListVisibility(changedData) {
      this.changeActiveProperty()
      this.setActivePropertyData({
        data: changedData
      })
    },
    toggleSubModVisible(index, item) {
      let changedCollection = this.cardValue.collection
      changedCollection[index] = {
        ...item,
        hidden: !item.isSubmodShow
      }
      let changedData = _.merge(this.cardValue, {
        collection: this.changedCollection
      })
      this.changeListVisibility(changedData)
    }
  },
  watch: {
    cardValue: {
      handler(val) {
        this.originVals = _.map(val.collection, item => {
          return {
            ...item,
            isSubmodShow: !item.hidden
          }
        })
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
.list-type {
  color: #333;
  &-add {
    cursor: pointer;
    margin-bottom: 18px;
    &-icon {
      background-color: #e9f5ff;
      color: #c6d3da;
    }
    &:hover {
      color: #3ba4ff;
      .list-type-add-icon {
        color: #fff;
        background-color: #1b81f3;
      }
    }
  }
  &-item {
    display: flex;
    align-items: center;
    height: 30px;
    line-height: 30px;
    margin-left: -12px;
    &-main {
      flex: 1;
      position: relative;
      border-radius: 30px;
      margin-right: 12px;
      padding: 0 12px;
      &-operates {
        display: none;
        position: absolute;
        right: 20px;
        top: 0;
        .icon-brush {
          font-size: 18px;
        }
      }
      &:hover {
        background-color: #e2f1ff;
        color: #3ba4ff;
        padding-right: 62px;
        .list-type-item-main-operates {
          display: inline-block;
          cursor: pointer;
        }
      }
    }
    .icon-tuwen1 {
      font-size: 13px;
      color: #108ee9;
      margin-right: 4px;
    }
  }
}
</style>
