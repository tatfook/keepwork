<template>
  <div class="purchase-package">
    <div class="purchase-package-warning">
      <div class="purchase-package-container">
        <p class="purchase-package-warning-title">
          <i class="el-icon-warning"></i>购买后不支持退款或转让，请确认后支付。
        </p>
        <p class="purchase-package-warning-content">确认以下信息：</p>
      </div>
    </div>
    <div class="purchase-package-container">
      <PackageBasicDetail :packageDetail='packageDetail'></PackageBasicDetail>
      <CoinPurchase class="purchase-package-coin"></CoinPurchase>
      <div class="purchase-package-info">您需支付：1000知识币</div>
      <el-button class="purchase-package-button" size="medium" type="primary">去支付
        <i class="el-icon-back"></i>
      </el-button>
    </div>
  </div>
</template>
<script>
import PackageBasicDetail from './PackageBasicDetail'
import CoinPurchase from './CoinPurchase'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'PurchasePackage',
  async mounted() {
    await this.getPackageDetail({
      packageId: this.packageId
    })
    this.packageDetail = this.lessonPackageDetail({
      packageId: this.packageId
    })
  },
  computed: {
    ...mapGetters({
      lessonPackageDetail: 'lesson/packageDetail'
    }),
    packageId() {
      return this.$route.params.id
    }
  },
  data() {
    return {
      packageDetail: {}
    }
  },
  methods: {
    ...mapActions({
      getPackageDetail: 'lesson/getPackageDetail'
    })
  },
  components: {
    PackageBasicDetail,
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
