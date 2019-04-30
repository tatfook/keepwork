<template>
  <div :class="['classes-tabbar', { 'reset-width': singleButton && name }]">
    <template v-if="singleButton && name">
       <el-button class="classes-tabbar-button tab-button-selected" icon="iconfont icon-team">{{name}}</el-button>
    </template>
    <template v-if="!singleButton">
      <el-button v-for="item in classes" :key="item.id" @click="handleClick(item.id)" :class="['classes-tabbar-button', { 'tab-button-selected': item.id === value }]" icon="iconfont icon-team">{{item.name}}</el-button>
    </template>
  </div>
</template>

<script>
export default {
  name: 'OrgClassesTabbar',
  props: {
    classes: {
      type: Array,
      default() {
        return []
      }
    },
    singleButton: {
      type: Boolean,
      default: false
    },
    name: '',
    value: ''
  },
  methods: {
    handleClick(id) {
      this.$emit('tab-click', id)
    }
  }
}
</script>


<style lang="scss" scoped>
.reset-width{
  margin: 0 -40px;
  border-bottom: solid 1px #e5e5e5;
}
.classes-tabbar {
  background: #ffff;
  padding: 0 13px 13px;
  &-button {
    height: 40px;
    border-radius: 20px;
    font-size: 16px;
    margin: 13px 13px 0 0;
    color: #030313;
    &.tab-button-selected {
      color: #fff;
      background: #409efe;
    }
    /deep/ span {
      margin-left: 7px;
    }
  }
}
@media print {
  .classes-tabbar {
    display: none;
  }
}
</style>
