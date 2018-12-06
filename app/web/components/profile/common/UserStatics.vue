<template>
  <div class="user-statics">
    <div class="user-statics-item">
      <i class="iconfont icon-folder-open"></i>
      <span class="user-statics-label">{{$t("profile.projects")}}</span>
      <div class="user-statics-msg" v-if="nowUserDetail.rank.project > 0">
        <span class="user-statics-msg-item">
          <span class="user-statics-count">{{nowUserDetail.rank.project}}</span>{{$t("profile.projectsCount")}}
        </span>
        <i class="iconfont icon-comma"></i>
        <span class="user-statics-msg-item">
          <span class="user-statics-count">{{nowUserDetail.rank.world}}</span>{{$t("profile.3DWorldCount")}}
        </span>
        <i class="iconfont icon-comma"></i>
        <span class="user-statics-msg-item">
          <span class="user-statics-count">{{nowUserDetail.rank.site}}</span>{{$t("profile.siteCount")}}
        </span>
      </div>
      <div class="user-statics-intro" v-else>
        {{$t('profile.whatAndHowCreat')}}<span class="user-statics-intro-link" @click="showLearnGuide">{{$t("profile.knowMore")}}</span>
      </div>
      <!-- <router-link class="user-statics-link" :to='{name:"ProfileProjectPage"}'><span class="hidden-sm-and-down">{{$t("profile.projectViewMore")}}</span><i class="el-icon-arrow-right"></i></router-link> -->
      <create-project-guide :showGuideDialog="showGuideDialog" @close="closeLearnGuide"></create-project-guide>
    </div>
  </div>
</template>
<script>
import CreateProjectGuide from '@/components/common/CreateProjectGuide'
export default {
  name: 'UserStatics',
  props: {
    nowUserDetail: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showGuideDialog: false
    }
  },
  methods: {
    showLearnGuide() {
      this.showGuideDialog = true
    },
    closeLearnGuide() {
      this.showGuideDialog = false
    }
  },
  components: {
    CreateProjectGuide
  }
}
</script>
<style lang="scss">
.user-statics {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #fff;
  padding: 2px 16px;
  &-item {
    height: 70px;
    display: flex;
    align-items: center;
    .iconfont:not(.icon-comma) {
      display: inline-block;
      width: 42px;
      height: 42px;
      text-align: center;
      line-height: 42px;
      background-color: #e9f4fe;
      color: #2397f3;
      font-size: 24px;
      border-radius: 4px;
    }
    .icon-comma {
      color: #ddd;
      font-size: 12px;
      vertical-align: text-bottom;
      bottom: -5px;
      position: relative;
      transform: scale(0.8);
      display: inline-block;
    }
  }
  &-label {
    font-size: 18px;
    color: #303133;
    font-weight: bold;
    margin: 0 48px 0 16px;
  }
  &-msg {
    flex: 1;
    &-item {
      font-size: 14px;
      color: #a0a4aa;
    }
  }
  &-intro {
    flex: 1;
    font-size: 14px;
    color: #c0c4cc;
    &-link {
      font-size: 12px;
      cursor: pointer;
      color: #3ea4fa;
      margin-left: 8px;
    }
  }
  &-count {
    font-weight: bold;
    color: #303133;
    font-size: 24px;
    margin-right: 8px;
  }
  &-link {
    font-size: 12px;
    color: #909399;
    text-decoration: none;
    .el-icon-arrow-right {
      margin-left: 4px;
    }
  }
}
</style>
<style lang="scss">
@media only screen and (max-width: 991px) {
  .user-statics {
    border-width: 1px 0;
    border-radius: 0;
    &-item {
      display: block;
      position: relative;
      height: 62px;
      padding: 8px 16px 8px 58px;
      box-sizing: border-box;
      .iconfont:not(.icon-comma) {
        position: absolute;
        left: 0;
        top: 10px;
      }
    }
    &-label {
      margin-left: 0;
    }
    &-msg {
      &-item {
        font-size: 12px;
      }
    }
    &-count {
      font-size: 15px;
    }
    &-link {
      position: absolute;
      right: 0;
      top: 23px;
    }
  }
}
</style>
