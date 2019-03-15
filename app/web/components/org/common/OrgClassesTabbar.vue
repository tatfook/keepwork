<template>
  <div class="classes-tabbar">
    <el-button v-for="item in classes" :key="item.id" @click="handleClick(item.id)" :class="['classes-tabbar-button', { 'tab-button-selected': item.id === value }]" icon="iconfont icon-member">{{item.name}}</el-button>
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
</style>
