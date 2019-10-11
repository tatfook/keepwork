<template>
  <div class="org-first-view">
    <div class="org-first-view-header">
      <span class="line-1-px"></span>
      <span class="org-first-view-header-text">欢迎您使用《keepwork课程系统》</span>
      <span class="line-1-px"></span>
    </div>
    <div class="org-first-view-main">
      <div class="step-item">
        <div class="step-item-title">
          1. 如何使用《keepwork课程系统》？
        </div>
        <div class="step-item-content">
          <video-player :showRates="false" width="100%" src='https://api.keepwork.com/storage/v0/siteFiles/3777/raw#如何使用《keepwork课程系统》.mp4' />
        </div>
        <div class="step-item-footer">
          点击了解更多 <a class="step-link" target="_blank" href="https://keepwork.com/official/docs/teach/index">使用帮助</a>
        </div>
      </div>
      <div class="step-item">
        <div class="step-item-title">
          2. 去创建班级，开展教学活动吧！
        </div>
        <div class="step-item-content step2-img">
        </div>
        <div class="step-item-footer step2" @click="onToClassPage">
          去创建班级 <span class="step-arrow"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import videoPlayer from '@/components/common/VideoPlayer'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'OrgFirstView',
  components: {
    videoPlayer
  },
  async created() {
    this.checkCurrentOrgExpire()
  },
  methods: {
    ...mapActions({
      checkFirstView: 'org/checkFirstView',
      checkCurrentOrgExpire: 'org/checkCurrentOrgExpire'
    }),
    onToClassPage() {
      this.removeHistory()
      this.$router.push({ name: 'OrgClassList' })
    },
    removeHistory() {
      let { pathname = '' } = window.location
      pathname = pathname.replace(/firstView/, 'packages')
      window.history.replaceState({}, '', pathname)
    }
  }
}
</script>

<style lang="scss">
.org-first-view {
  background: #fff;
  border-radius: 8px;
  height: 576px;
  padding: 54px 24px;
  box-sizing: border-box;
  &-header {
    font-size: 22px;
    display: flex;
    align-items: center;
    &-text {
      font-size: 22px;
      margin: 0 6px 0 16px;
      text-align: center;
    }
    .line-1-px {
      display: inline-block;
      height: 1px;
      background: #e8e8e8;
      flex: 1;
    }
  }
  &-main {
    display: flex;
    justify-content: space-around;
    margin-top: 86px;
    .step-item {
      position: relative;
      height: 289px;
      width: 362px;
      box-sizing: border-box;
      border: solid 1px rgba($color: #2397f3, $alpha: 0.3);
      border-radius: 4px;
      text-align: center;
      &-title {
        width: 291px;
        height: 38px;
        background: #2397f3;
        color: #fff;
        line-height: 38px;
        text-align: center;
        border-radius: 19px;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        margin: 0 auto;
        margin-top: -19px;
      }
      &-content {
        height: 166px;
        width: 284px;
        margin: 51px auto 0;
        border-radius: 4px;
        &.step2-img {
          background: url('../../../assets/org/create-class.png') no-repeat;
        }
      }
      &-footer {
        margin-top: 26px;
        &.step2 {
          color: #2397f3;
          cursor: pointer;
        }
        .step-link {
          color: #2397f3;
        }
        .step-arrow {
          display: inline-block;
          height: 12px;
          width: 14px;
          background: url('../../../assets/org/arrow.png') no-repeat;
        }
      }
    }
  }
}
</style>
