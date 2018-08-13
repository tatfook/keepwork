<template>
  <div class="package-detail">
    <img class="package-detail-cover" :src="packageCoverUrl" alt="">
    <div class="package-detail-text-desc">
      <h1>{{packageDetail.packageName}}</h1>
      <div class="package-detail-content">
        <div class="package-detail-content-item">
          <span class="package-detail-label">{{$t('lesson.include')}}:</span>
          <span class="package-detail-lessons-count">{{packageLessonsCount}}</span>
          <span class="package-detail-info">{{$t('lesson.lessonsCount')}}</span>
        </div>
        <div class="package-detail-content-item">
          <span class="package-detail-label">{{$t('lesson.ages')}}:</span>
          <span class="package-detail-info">{{packageDetail.minAge}}-{{packageDetail.maxAge}}</span>
        </div>
      </div>
      <div class="package-detail-skills">
        <div class="package-detail-label">{{$t('lesson.packageIntro')}}:</div>
        <el-scrollbar class="package-detail-skills-detail" :class="{'package-detail-skills-detail-isSubscribe': packageDetail.isSubscribe}">{{packageDetail.intro}}</el-scrollbar>
      </div>
      <div v-show="!packageDetail.isSubscribe" class="package-detail-backcoin" v-html="$t('lesson.backInfo', { backCoinCount: backCoinHtml })">
      </div>
      <div v-show="!packageDetail.isSubscribe" class="package-detail-costs">
        <div class="package-detail-costs-item">
          <span class="package-detail-costs-label">{{$t('lesson.rmbPrice')}}:</span>
          <span class="package-detail-costs-value">￥ {{packageDetail.rmb}}</span>
        </div>
        <div class="package-detail-costs-item">
          <span class="package-detail-costs-label">{{$t('lesson.coinsPrice')}}:</span>
          <span class="package-detail-costs-value">{{packageDetail.coin}} {{$t('lesson.coins')}}</span>
        </div>
      </div>
      <el-button v-show="!packageDetail.isSubscribe" type="primary" class="package-detail-operate-button" @click="addPackage">{{$t('lesson.add')}}</el-button>
      <div @click.stop v-if="isLoginDialogShow">
        <LoginDialog :show="isLoginDialogShow" @close="closeLoginDialog" />
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import LoginDialog from '@/components/common/LoginDialog'
export default {
  name: 'PackageBasicDetail',
  props: {
    packageDetail: Object
  },
  mounted() {
    if (!this.userIsLogined) {
      this.userGetProfile({ forceLogin: false })
        .then(() => {
          this.isLogin = true
        })
        .catch(() => {
          this.isLogin = false
        })
    }
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/profile',
      userIsLogined: 'user/isLogined'
    }),
    isLogin: {
      get() {
        return this.userIsLogined
      },
      set() {}
    },
    nowPath(){
      return this.$route.path
    },
    purchasePath(){
      return this.nowPath + '/purchase'
    },
    packageLessonsCount() {
      return _.get(this.packageDetail, 'lessons', []).length
    },
    packageCoverUrl() {
      return _.get(this.packageDetail, 'extra.coverUrl', '')
    },
    packageId() {
      return _.get(this.packageDetail, 'id')
    },
    backCoinHtml() {
      return `<span>${this.packageDetail.rmb}</span>`
    }
  },
  data() {
    return {
      isLoginDialogShow: false
    }
  },
  methods: {
    ...mapActions({
      userGetProfile: 'user/getProfile'
    }),
    addPackage() {
      if (this.isLogin) {
        this.$router.push({
          path: this.purchasePath
        })
      } else {
        this.isLoginDialogShow = true
      }
    },
    closeLoginDialog() {
      this.isLoginDialogShow = false
    }
  },
  components: {
    LoginDialog
  }
}
</script>
<style lang="scss">
$dangerColor: #e4461f;
.package-detail {
  display: flex;
  &-cover {
    width: 435px;
    height: 288px;
    object-fit: cover;
  }
  &-text-desc {
    flex: 1;
    margin-left: 25px;
    color: #4c4c4c;
    min-width: 0;
  }
  &-content {
    margin: 12px 0;
    &-item {
      display: inline-block;
      margin-right: 30px;
      font-size: 18px;
    }
  }
  h1 {
    margin: 0;
    font-size: 20px;
    color: #111;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  &-label {
    font-size: 18px;
    margin-right: 3px;
  }
  &-info {
    color: #818181;
  }
  &-lessons-count {
    color: $dangerColor;
  }
  &-skills-detail {
    margin: 0;
    height: 70px;
    white-space: pre-line;
    font-size: 16px;
    line-height: 30px;
    &-isSubscribe {
      height: 190px;
    }
  }
  &-backcoin {
    color: #3491f0;
    font-size: 16px;
    margin-top: 6px;
    span {
      color: $dangerColor;
    }
  }
  &-costs {
    margin: 7px 0;
    &-item {
      display: inline-block;
      border: 1px solid #f3f3f3;
      background-color: #fff;
      margin-right: 16px;
      font-size: 16px;
      color: #111;
      padding: 8px 20px 8px 15px;
      border-radius: 50px;
    }
    &-value {
      color: $dangerColor;
    }
  }
  &-operate-item {
    display: inline-block;
  }
  &-price-count {
    font-size: 24px;
    color: #ff4c4c;
  }
  .el-button--primary {
    font-size: 14px;
    margin-left: 0;
    width: 266px;
  }
}
</style>
<style lang="scss">
.el-scrollbar__wrap {
  overflow-x: auto;
}
</style>
