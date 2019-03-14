<template>
  <div class="org-teacher-teach">
    <div class="teach-class-tab">
      <el-button v-for="item in classList" :key="item" @click="handleSwitchClass(item)" :class="['teach-class-tab-button', { 'tab-button-selected': item === selectedClassId }]" icon="iconfont icon-member">班级名称1</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrgTeacherTeach',
  data() {
    return {
      classList: [1, 2, 3, 4, 5, 6, 7, 8],
      selectedClassId: 1
    }
  },
  created() {
    console.log('OrgTeacherTeach')
  },
  methods: {
    handleSwitchClass(id) {
      this.selectedClassId = id
    }
  }
}
</script>

<style lang="scss">
.org-teacher-teach {
  .teach-class-tab {
    background: #ffff;
    padding: 13px 16px;
    &-button {
      height: 40px;
      border-radius: 20px;
      font-size: 16px;
      margin: 13px 16px 0 0;
      color: #030313;
      &.tab-button-selected {
        color: #fff;
        background: #409efe;
      }
      span {
        margin-left: 8px;
      }
    }
  }
}
</style>

