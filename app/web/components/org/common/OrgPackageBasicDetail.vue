<template>
  <div class="package-basic-detail">
    <div class="package-basic-detail-cover">
      <div class="package-basic-detail-cover-wrap">
        <img class="package-basic-detail-cover-inner" :src="packageCoverUrl" alt="">
      </div>
    </div>
    <div class="package-basic-detail-text-desc">
      <h1>{{packageDetail.packageName}}</h1>
      <div class="package-basic-detail-content">
        <div class="package-basic-detail-content-item">
          <span class="package-basic-detail-label">{{$t('lesson.include')}}:</span>
          <span class="package-basic-detail-lessons-count">{{packageLessonsCount}}</span>
          <span class="package-basic-detail-info">{{$t('lesson.lessonsCount')}}</span>
        </div>
        <div class="package-basic-detail-content-item">
          <span class="package-basic-detail-label">{{$t('lesson.ages')}}:</span>
          <span class="package-basic-detail-info">{{packageSuitableAge}}</span>
        </div>
      </div>
      <div class="package-basic-detail-skills" v-if="packageDetail.intro">
        <div class="package-basic-detail-label">{{$t('lesson.intro')}}:</div>
        <div class="package-basic-detail-skills-detail" :class="{'package-basic-detail-skills-detail-isSubscribe': false }">{{packageDetail.intro}}</div>
      </div>
      <!-- <div v-show="!isPendingReview && isPackageCostAndBackShow" class="package-basic-detail-backcoin" v-html="$t('lesson.backInfo', { backCoinCount: backCoinHtml })">
      </div> -->
      <!-- <div v-show="!isPendingReview && isPackageCostAndBackShow" class="package-basic-detail-costs">
        <div class="package-basic-detail-costs-item">
          <span class="package-basic-detail-costs-label">{{$t('lesson.rmbPrice')}}:</span>
          <span class="package-basic-detail-costs-value">￥ {{packageDetail.rmb}}</span>
          <el-button v-show="!isPreview && !isPendingReview && !isPurchaseButtonHide" class="package-basic-detail-costs-button" type="warning" @click="addPackage('rmb')">{{$t('lesson.add')}}</el-button>
        </div>
        <div class="package-basic-detail-costs-item">
          <span class="package-basic-detail-costs-label">{{$t('lesson.coinsPrice')}}:</span>
          <span class="package-basic-detail-costs-value">{{packageDetail.coin}} {{$t('lesson.coins')}}</span>
          <el-button v-show="!isPreview && !isPendingReview && !isPurchaseButtonHide" class="package-basic-detail-costs-button" type="primary" @click="addPackage('coin')">{{$t('lesson.add')}}</el-button>
        </div>
      </div> -->
      <!-- <div v-show="!isPendingReview && isFreeLabelShow" class="package-basic-detail-free">{{$t('lesson.free')}}</div> -->
      <!-- <div v-if="isPendingReview" class="package-basic-detail-warning">{{$t('lesson.Unapproved')}}</div> -->
      <!-- <el-button v-if="!isPreview" v-show="!isPendingReview && !isPurchaseButtonHide && !isPackageCostAndBackShow" type="primary" class="package-basic-detail-operate-button" @click="addPackage">{{$t('lesson.add')}}</el-button> -->
      <!-- <div @click.stop v-if="isLoginDialogShow">
        <login-dialog :show="isLoginDialogShow" @close="closeLoginDialog"></login-dialog>
      </div> -->
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import LoginDialog from '@/components/common/LoginDialog'
export default {
  name: 'OrgPackageBasicDetail',
  props: {
    packageDetail: Object,
    actorType: String
  },
  computed: {
    nowPath() {
      return this.$route.path
    },
    nowPageName() {
      return this.$route.name
    },
    purchasePath() {
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
    },
    packageSuitableAge() {
      let { minAge, maxAge } = this.packageDetail
      if (minAge == 0 && maxAge == 0) {
        return this.$t('lesson.packageManage.SuitableForAll')
      }
      return `${minAge}-${maxAge}`
    }
  },
  data() {
    return {
      isLoginDialogShow: false
    }
  }
}
</script>
<style lang="scss">
$dangerColor: #e4461f;
.package-basic-detail {
  display: flex;
  &-cover {
    width: 436px;
    &-wrap {
      padding-bottom: 56.25%;
      position: relative;
    }
    &-inner {
      position: absolute;
      top: 0;
      left: 0;
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
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
    white-space: pre-line;
    font-size: 16px;
    line-height: 30px;
    &-isSubscribe {
      height: 146px;
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
      display: inline-flex;
      align-items: center;
      border: 1px solid #f3f3f3;
      background-color: #fff;
      margin-right: 16px;
      margin-top: 4px;
      font-size: 16px;
      color: #111;
      padding: 0 1px 0 10px;
      height: 32px;
      line-height: 32px;
      box-sizing: border-box;
      border-radius: 32px;
      border: solid 2px #eeeeee;
    }
    &-value {
      color: $dangerColor;
    }

    &-button {
      height: 26px;
      box-sizing: border-box;
      border-radius: 26px;
      padding: 6px 13px;
      margin-left: 20px;
    }
  }
  &-free {
    font-size: 24px;
    color: #7ac558;
    margin: 24px 0;
  }
  &-warning {
    border-radius: 4px;
    background: #e6a23c;
    color: white;
    margin: 24px 0;
    width: 160px;
    height: 30px;
    line-height: 30px;
    text-align: center;
  }
  &-operate-item {
    display: inline-block;
  }
  &-price-count {
    font-size: 24px;
    color: #ff4c4c;
  }
}
@media screen and (max-width: 768px) {
  .package-basic-detail {
    display: block;
    &-cover {
      width: 90%;
      margin: 20px;
    }
  }
}
</style>
<style lang="scss">
.package-basic-detail-skills-detail {
  .el-scrollbar__wrap {
    overflow-x: auto;
  }
}
</style>
