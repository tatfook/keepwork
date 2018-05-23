<template>
  <div class="prop-box" :class="{'active': isCardActive, 'card-only-title': !isModShow}">
    <el-row class="prop-header" type='flex' justify='space-between'>
      <el-col>
        {{$t("card." + cardKey)}}
      </el-col>
      <el-col class="card-info">
        <el-switch :width='32' v-model="isModShow" active-color="#3ba4ff" inactive-color='#bfbfbf' @change='toggleModVisible'>
        </el-switch>
      </el-col>
    </el-row>
    <el-row class="prop-item" v-if="isModShow" :prop='prop' v-for='(propItem, index) in prop' :key='index'>
      <component :is='proptypes[propItem]' :prop='prop' :editingKey='index' :originValue='cardValue[index]' :activePropertyOptions='activePropertyOptions' @onPropertyChange='changeProptyData' @onChangeValue='changeActivePropty'></component>
    </el-row>
  </div>
</template>
<script>
import proptypes from '@/components/proptypes'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'PropTypeCard',
  props: {
    cardKey: String,
    cardValue: Object,
    prop: Object,
    activePropertyOptions: Object,
    isCardActive: Boolean,
  },
  data() {
    return {
      proptypes
    }
  },
  computed: {
    ...mapGetters({
      activeMod: 'activeMod'
    }),
    isModShow: {
      get() {
        return this.cardValue && !this.cardValue.hidden
      },
      set() {}
    }
  },
  methods: {
    ...mapActions({
      setActiveProperty: 'setActiveProperty',
      setActivePropertyData: 'setActivePropertyData'
    }),
    changeActivePropty() {
      this.setActiveProperty({
        key: this.activeMod.key,
        property: this.cardKey
      })
    },
    changeProptyData(changedData) {
      this.changeActivePropty()
      this.setActivePropertyData({
        data: changedData
      })
    },
    toggleModVisible(value) {
      this.changeProptyData({
        hidden: !value
      })
    }
  }
}
</script>
<style scoped>
.prop-box {
  background-color: #fff;
  padding: 25px 18px;
  margin-bottom: 12px;
  border: 2px solid transparent;
}
.prop-box.active {
  border: 2px solid #3da4fd;
}
.card-only-title {
  padding: 16px 18px;
}
.card-only-title .prop-header {
  margin-bottom: 0;
}
.prop-header {
  margin-bottom: 12px;
  font-size: 16px;
  color: #3ba4ff;
}
.card-info {
  width: auto;
}
</style>
