<template>
  <div class="purchase-package" v-loading='isLoading'>
    <div class="purchase-package-warning" v-show="!isResultShow">
      <div class="purchase-package-container">
        <p class="purchase-package-warning-title">
          <i class="el-icon-warning"></i>{{$t('lesson.payAfterConfirmation')}}
        </p>
        <p class="purchase-package-warning-content">{{$t('lesson.confirmFollowInformation')}}</p>
      </div>
    </div>
    <div class="purchase-package-container" v-show="!isResultShow">
      <PackageBasicDetail :packageDetail='packageDetail'></PackageBasicDetail>
      <CoinPurchase ref="coinPurchaseComp" :packageDetail='packageDetail' class="purchase-package-coin"></CoinPurchase>
      <div class="purchase-package-info">{{$t('lesson.youNeedToPay')}}{{payCount}}</div>
      <el-button @click="subscribePackage" class="purchase-package-button" size="medium" type="primary">{{$t('lesson.goToPay')}}
        <i class="el-icon-back"></i>
      </el-button>
    </div>
    <PurchasePackageResult v-show="isResultShow"></PurchasePackageResult>
    <div @click.stop v-if="isLoginDialogShow">
      <LoginDialog :show="isLoginDialogShow" @close="closeLoginDialog" />
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import PackageBasicDetail from './PackageBasicDetail'
import PurchasePackageResult from './PurchasePackageResult'
import CoinPurchase from './CoinPurchase'
import LoginDialog from '@/components/common/LoginDialog'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'PurchasePackage',
  async mounted() {
    if (!this.userIsLogined) {
      await this.userGetProfile({ forceLogin: false })
        .then(() => {
          this.isLogin = true
        })
        .catch(() => {
          this.isLogin = false
        })
    }
    if (!this.isLogin) {
      this.isLoginDialogShow = true
      return
    }
    await this.getPackageDetail({
      packageId: this.packageId
    })
    this.packageDetail = this.lessonPackageDetail({
      packageId: this.packageId
    })
    if (this.packageDetail.isSubscribe) {
      this.handleAlreadyPurchased()
    }
    this.isMounted = true
    this.isLoading = false
  },
  computed: {
    ...mapGetters({
      userIsLogined: 'user/isLogined',
      lessonPackageDetail: 'lesson/packageDetail'
    }),
    isLogin: {
      get() {
        return this.userIsLogined
      },
      set() {}
    },
    packageId() {
      return this.$route.params.id
    },
    isPayByCoin() {
      if (this.isMounted) {
        return this.$refs['coinPurchaseComp'].isPayByCoin
      }
    },
    payCount() {
      return this.isPayByCoin
        ? `${this.packageDetail.coin} ${this.$t('lesson.coins')}`
        : `￥ ${this.packageDetail.rmb}`
    },
    nowPath() {
      return this.$route.path
    },
    packageDetailPath() {
      return _.replace(this.nowPath, '/purchase', '')
    }
  },
  data() {
    return {
      packageDetail: {},
      isLoginDialogShow: false,
      isLoading: true,
      isResultShow: false,
      isMounted: false
    }
  },
  methods: {
    ...mapActions({
      userGetProfile: 'user/getProfile',
      getPackageDetail: 'lesson/getPackageDetail',
      lessonSubscribePackage: 'lesson/subscribePackage'
    }),
    async subscribePackage() {
      this.isLoading = true
      if (this.isPayByCoin) {
        await this.lessonSubscribePackage({ packageId: this.packageId })
        this.isResultShow = true
      } else {
        let origin = window.location.origin
        window.location.href = `${origin}/wiki/pay`
      }
      this.isLoading = false
    },
    handleAlreadyPurchased() {
      this.$alert(
        this.$t('lesson.havePurchased'),
        this.$t('lesson.infoTitle'),
        {
          confirmButtonText: this.$t('lesson.viewPackage'),
          callback: action => {
            this.backToPackageDetailPage()
          }
        }
      )
    },
    backToPackageDetailPage() {
      this.$router.push({
        path: this.packageDetailPath
      })
    },
    closeLoginDialog() {
      this.$message({
        message: this.$t('lesson.loginBeforePurchase'),
        type: 'warning'
      })
    }
  },
  components: {
    LoginDialog,
    PackageBasicDetail,
    PurchasePackageResult,
    CoinPurchase
  }
}
</script>
<style lang="scss">
.purchase-package {
  padding-bottom: 100px;
  background-color: #fff;
  &-container {
    max-width: 1150px;
    margin: 0 auto;
  }
  &-warning {
    color: #333;
    padding: 16px 0;
    background-color: #fbfbfb;
    &-title {
      font-size: 18px;
      margin: 0 0 57px;
      .el-icon-warning {
        color: #d81e06;
        font-size: 28px;
        margin-right: 17px;
      }
    }
    &-content {
      font-size: 16px;
    }
  }
  &-coin {
    margin: 100px 0;
  }
  &-button {
    width: 266px;
    margin-top: 18px;
    .el-icon-back {
      margin-left: 12px;
      transform: rotate(180deg);
    }
  }
}
</style>
