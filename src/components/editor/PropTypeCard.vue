<template>
  <div class="prop-box">
    <el-row class="prop-header" type='flex' justify='space-between'>
      <el-col>
        {{cardKey}}
      </el-col>
      <el-col class="card-info">
        <el-switch v-model="isModShow" active-color="#3ba4ff">
        </el-switch>
      </el-col>
    </el-row>
    <el-row class="prop-item" :prop='prop' v-for='(propItem, index) in prop' :key='index'>
      <component :is='proptypes[propItem]' :editingKey='index'></component>
    </el-row>
  </div>
</template>
<script>
import proptypes from '@/components/proptypes'
export default {
  name: 'PropTypeCard',
  props: {
    cardKey: String,
    prop: Object
  },
  data() {
    return {
      proptypes,
      isModShow: true
    }
  }
}
</script>
<style scoped>
.prop-header{
  margin-bottom: 12px;
}
.card-info {
  width: auto;
}
</style>
