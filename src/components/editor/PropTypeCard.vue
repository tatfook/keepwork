<template>
  <div class="prop-box" :class="{active: isCardActive}">
    <el-row class="prop-header" type='flex' justify='space-between'>
      <el-col>
        {{cardKey}}
      </el-col>
      <el-col class="card-info">
        <el-switch v-model="isModShow" active-color="#3ba4ff" @change='toggleModVisible'>
        </el-switch>
      </el-col>
    </el-row>
    <el-row class="prop-item" :prop='prop' v-for='(propItem, index) in prop' :key='index'>
      <component :is='proptypes[propItem]' :prop='prop' :editingKey='index' :originValue='cardValue[index]' @onPropertyChange='changeProptyData' @onChangeValue='changeActivePropty'></component>
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
    isCardActive: Boolean
  },
  computed: {
    ...mapGetters({
      activeMod: 'activeMod'
    })
  },
  data() {
    return {
      proptypes,
      isModShow: true
    }
  },
  methods: {
    ...mapActions({
      setActiveProperty: 'setActiveProperty',
      setActivePropertyData: 'setActivePropertyData'
    }),
    changeActivePropty() {
      this.setActiveProperty({
        mod: this.activeMod,
        property: this.cardKey
      })
    },
    changeProptyData(changedData) {
      this.changeActivePropty()
      this.setActivePropertyData({
        data: changedData
      })
    },
    toggleModVisible() {
      this.changeProptyData({
        hidden: !this.isModShow
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
.prop-header {
  margin-bottom: 12px;
}
.card-info {
  width: auto;
}
</style>
