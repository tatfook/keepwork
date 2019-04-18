<template>
  <div class="lesson-wrap-by-glass">
    <div :class="{'forsted-glass-shade': isForbidden }">
      <lesson-wrap v-for="mod in lessonMain" :key="mod.key" :mod="mod" />
    </div>
    <div class="org-list" v-if="isForbidden">
      <div class="org-title">
        <span class="org-title-icon"></span>
        <span>观看完整内容需要向机构购买</span>
      </div>
        <el-button type="primary" @click="toOrgnizationPage">了解更多机构信息</el-button>
    </div>
  </div>
</template>

<script>
import LessonWrap from '@/components/org/common/LessonWrap'
export default {
  name: 'LessonWrapByGlass',
  components: {
    LessonWrap
  },
  props: {
    lessonMain: {
      type: Array,
      default() {
        return []
      }
    },
    authUserPrivilege: {
      type: Number,
      default: 0
    }
  },
  computed: {
    isForbidden() {
      return this.authUserPrivilege === 0
    }
  },
  methods: {
    stopClick(e) {
      return e.stopPropagation()
    },
    toOrgnizationPage() {
      this.$router.push({ name: 'OrganizationCooperation'})
    }
  }
}
</script>

<style lang="scss" scoped>
.lesson-wrap-by-glass {
  position: relative;
  .forsted-glass-shade {
    pointer-events: none;
    cursor: not-allowed;
    user-select: none;
    min-height: 600px;
    opacity: 0.6;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 8;
    filter: blur(10px);
  }
  .org-list {
    position: absolute;
    text-align: center;
    top: 0;
    left: 0;
    right: 0;
    margin: 100px auto 0;
    z-index: 10;
    width: 459px;
    min-height: 200px;
    box-sizing: border-box;
    background-color: #ffffff;
    box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    border: solid 1px #e8e8e8;
    padding: 50px;
    &-item {
      text-align: center;
      font-size: 16px;
      margin-top: 20px;
      &-name {
        color: #333;
        margin-right: 30px;
      }
      &-cellphone {
        color: #999;
      }
    }
    .org-title {
      font-size: 24px;
      color: #303133;
      text-align: center;
      height: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
      line-height: 80px;
      &-icon {
        display: inline-block;
        height: 45px;
        width: 32px;
        margin-right: 10px;
        background: url('../../../assets/lessonImg/lock.png') no-repeat;
      }
    }
  }
}
</style>


